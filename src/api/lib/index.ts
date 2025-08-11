// Export axios client
export { axiosClient, createServerAxios } from './axiosClient';

// Export error handling utilities
export {
  ApiError,
  handleApiError,
  withApiErrorHandling,
  isApiError,
  getErrorMessage,
} from './errorHandler';