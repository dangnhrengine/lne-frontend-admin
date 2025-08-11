import axios, { AxiosError } from 'axios';
import { BASE_URL } from '@/constants';
import { storage } from '@/utils/storage';
import { logRequest, logResponse, logError } from '@/utils';
import type { BaseResponseDto } from '@/api/common/types';

/**
 * Centralized Axios client for both client and server runtime.
 * - Base URL comes from `NEXT_PUBLIC_BASE_URL`.
 * - Adds JSON defaults.
 * - Attaches access token from localStorage (client only) when present.
 * - Handles errors in one place and rethrows with normalized message.
 */

// Debug: Log the base URL being used
logRequest('Axios Client initialized with base URL:', BASE_URL);

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // It's okay to keep withCredentials configurable later if needed
});

// Request interceptor: attach Authorization header when token exists and log requests
axiosClient.interceptors.request.use(
  (config) => {
    // Only available on client; storage guards internally for SSR safety
    const token = storage.getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      // Use Bearer schema; adjust if backend differs
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the outgoing request with full URL for debugging
    const fullUrl = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
    logRequest(`${config.method?.toUpperCase()} ${fullUrl}`, {
      baseURL: config.baseURL,
      url: config.url,
      data: config.data,
      headers: { ...config.headers, Authorization: token ? '[REDACTED]' : undefined },
    });
    
    return config;
  },
  (error) => {
    logError('Request interceptor error:', error as unknown);
    return Promise.reject(error);
  }
);

// Response interceptor: log responses and handle errors properly
axiosClient.interceptors.response.use(
  (response) => {
    // Log successful responses
    logResponse(`${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      data: response.data,
      status: response.status,
    });
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data as unknown;
    
    // Log the error response
    logError(`HTTP ${status} Error:`, {
      status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data,
      message: error.message,
    });

    // Handle 401 globally (optional)
    if (status === 401) {
      // You may want to trigger a logout, refresh token, or redirect here.
      // Keep it minimal and non-invasive by default.
    }

    // If the response contains structured error data (JSON), preserve it
    if (data && typeof data === 'object' && data !== null) {
      const errorData = data as BaseResponseDto<unknown>;
      
      // If it's a proper API error response with code/message, create a structured error
      if ('code' in errorData || 'message' in errorData) {
        const structuredError = new Error(errorData.message || 'API Error') as Error & {
          code?: string | number;
          status?: number;
          data?: unknown;
        };
        structuredError.code = errorData.code;
        structuredError.status = status;
        structuredError.data = errorData;
        return Promise.reject(structuredError);
      }
    }

    // For other cases, extract message if available or use default
    const serverMessage =
      (typeof data === 'object' && data !== null && 'message' in data
        ? (data as { message?: string }).message
        : undefined) ||
      (typeof data === 'string' ? data : undefined);

    const normalizedMessage = serverMessage || error.message || 'Request failed';
    const normalizedError = new Error(
      status ? `${status}: ${normalizedMessage}` : normalizedMessage
    ) as Error & { status?: number };
    
    normalizedError.status = status;
    return Promise.reject(normalizedError);
  }
);

/**
 * Helper for server-side requests with cookies (e.g., token on SSR):
 * Pass headers explicitly when calling (example in usage section).
 */
export const createServerAxios = (headers?: Record<string, string>) => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(headers || {}),
    },
  });

  instance.interceptors.response.use(
    (response) => response,
  (error: AxiosError) => {
      const status = error.response?.status;
      const data = error.response?.data as unknown;
      const serverMessage =
        (typeof data === 'object' && data !== null && 'message' in data
          ? (data as { message?: string }).message
          : undefined) ||
        (typeof data === 'string' ? data : undefined);
      const normalizedMessage = serverMessage || error.message || 'Request failed';
      return Promise.reject(
        new Error(status ? `${status}: ${normalizedMessage}` : normalizedMessage)
      );
    }
  );

  return instance;
};

/**
 * Usage examples:
 *
 * // Client-side example (inside a component or hook):
 * import { axiosClient } from '@/api/lib/axiosClient';
 * const { data } = await axiosClient.get('/news');
 *
 * // Server-side example (getServerSideProps / Route Handler):
 * import { createServerAxios } from '@/api/lib/axiosClient';
 * export const getServerSideProps = async ({ req }) => {
 *   const token = req.cookies?.access_token; // or other cookie name
 *   const serverAxios = createServerAxios(
 *     token ? { Authorization: `Bearer ${token}` } : undefined
 *   );
 *   const { data } = await serverAxios.get('/news');
 *   return { props: { news: data } };
 * };
 */

