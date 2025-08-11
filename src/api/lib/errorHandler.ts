import type { BaseResponseDto } from '@/api/common/types';

/**
 * Common API Error class with structured information
 */
export class ApiError extends Error {
  public readonly code?: string | number;
  public readonly status?: number;
  public readonly data?: unknown;

  constructor(
    message: string,
    code?: string | number,
    status?: number,
    data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

/**
 * Common error handler for API requests
 * Extracts structured error information from axios interceptor responses
 * and throws normalized ApiError instances
 */
export function handleApiError(error: unknown): never {
  // Check if it's a structured error from our axios interceptor
  const structuredError = error as Error & {
    code?: string | number;
    status?: number;
    data?: BaseResponseDto<unknown>;
  };

  // If we have structured error data, use it
  if (structuredError.data && typeof structuredError.data === 'object') {
    const errorData = structuredError.data as BaseResponseDto<unknown>;
    if (errorData.message || errorData.code) {
      throw new ApiError(
        errorData.message || 'API Error',
        errorData.code,
        structuredError.status,
        errorData
      );
    }
  }

  // If it's already an Error instance, preserve the message
  if (structuredError instanceof Error) {
    throw new ApiError(
      structuredError.message,
      structuredError.code,
      structuredError.status,
      structuredError.data
    );
  }

  // Fallback for unknown error types
  throw new ApiError('Unknown API error occurred');
}

/**
 * Wrapper function for API requests that automatically handles errors
 * @param apiCall - The async API call function
 * @returns Promise with the result or throws ApiError
 */
export async function withApiErrorHandling<T>(
  apiCall: () => Promise<T>
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Extract user-friendly message from any error
 */
export function getErrorMessage(error: unknown, fallback = 'An error occurred'): string {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return fallback;
}