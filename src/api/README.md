# API Layer - Common Patterns

This directory contains the common API utilities and patterns used throughout the application.

## Error Handling

We provide a common error handling system that automatically handles API errors consistently.

### Basic Usage

```typescript
import { axiosClient, withApiErrorHandling } from '@/api/lib';
import type { BaseResponseDto } from '@/api/common/types';

// Simple GET request
export const fetchUser = async (id: string) => {
  return withApiErrorHandling(async () => {
    const { data } = await axiosClient.get<BaseResponseDto<User>>(`/users/${id}`);
    return data.data;
  });
};

// POST request with payload
export const createUser = async (payload: CreateUserRequest) => {
  return withApiErrorHandling(async () => {
    const { data } = await axiosClient.post<BaseResponseDto<User>>('/users', payload);
    return data.data;
  });
};
```

### Error Handling in Components

```typescript
import { getErrorMessage, isApiError } from '@/api/lib';

// In your component
try {
  const result = await someApiCall();
  // Handle success
} catch (error) {
  // Extract user-friendly error message
  const errorMessage = getErrorMessage(error, 'Something went wrong');
  
  // Check if it's an API error with specific information
  if (isApiError(error)) {
    console.log('API Error Code:', error.code);
    console.log('HTTP Status:', error.status);
  }
  
  setError(errorMessage);
}
```

### Manual Error Handling

If you need more control, you can use `handleApiError` directly:

```typescript
import { axiosClient, handleApiError } from '@/api/lib';

export const customFetcher = async () => {
  try {
    const response = await axiosClient.get('/some-endpoint');
    // Custom logic here
    return response.data;
  } catch (error) {
    // This will throw an ApiError with structured information
    handleApiError(error);
  }
};
```

## File Structure

```
src/api/
├── lib/                     # Common utilities
│   ├── axiosClient.ts      # Configured axios instance
│   ├── errorHandler.ts     # Error handling utilities
│   └── index.ts           # Re-exports
├── auth/                   # Authentication API
│   ├── fetchers.ts
│   ├── mutates.ts
│   └── types.ts
├── users/                  # User management API
│   └── types.ts
└── common/                 # Shared types and constants
    ├── api-endpoint.ts
    ├── types.ts
    └── index.ts
```

## Benefits

1. **Consistent Error Handling**: All API errors are handled the same way
2. **Type Safety**: Errors include proper TypeScript types
3. **Reusable**: Easy to apply to any API call
4. **Flexible**: Can use wrapper function or manual handling
5. **Informative**: Preserves error codes, status, and data from API responses