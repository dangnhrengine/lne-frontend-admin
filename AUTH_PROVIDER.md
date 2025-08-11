# Authentication Provider

This document explains how to use the authentication provider in the LNE Frontend Admin project.

## Overview

The authentication provider uses React Context to manage authentication state across the application. It stores the access token and user information in localStorage and provides a clean API for authentication operations.

## Features

- ✅ **Context-based state management** - Global authentication state
- ✅ **localStorage persistence** - Tokens and user data persist across sessions
- ✅ **TypeScript support** - Full type safety for all auth operations
- ✅ **SSR compatible** - Safe for server-side rendering
- ✅ **Dummy data support** - Ready for development without API calls

## Usage

### Basic Usage

```typescript
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (isAuthenticated) {
    return <div>Welcome, {user?.name}!</div>;
  }

  return <button onClick={() => login(token, userData)}>Login</button>;
};
```

### Available Properties

| Property          | Type             | Description                         |
| ----------------- | ---------------- | ----------------------------------- |
| `user`            | `User \| null`   | Current user object                 |
| `isAuthenticated` | `boolean`        | Whether user is logged in           |
| `isLoading`       | `boolean`        | Loading state during initialization |
| `accessToken`     | `string \| null` | Current access token                |

### Available Methods

| Method       | Parameters                    | Description                     |
| ------------ | ----------------------------- | ------------------------------- |
| `login`      | `(token: string, user: User)` | Log in with token and user data |
| `logout`     | `()`                          | Log out and clear stored data   |
| `updateUser` | `(user: User)`                | Update user information         |

### User Interface

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}
```

## Example Implementation

### Login with Dummy Data

```typescript
const handleLogin = () => {
  const dummyUser = {
    id: '1',
    email: 'admin@example.com',
    name: '管理者',
    role: 'admin' as const,
  };

  const dummyToken = 'dummy_access_token_12345';

  login(dummyToken, dummyUser);
};
```

### Conditional Rendering

```typescript
const { isAuthenticated, user, logout } = useAuth();

return (
  <div>
    {isAuthenticated ? (
      <div>
        <span>Welcome, {user?.name}!</span>
        <button onClick={logout}>Logout</button>
      </div>
    ) : (
      <div>Please log in</div>
    )}
  </div>
);
```

### Protected Routes

```typescript
const ProtectedComponent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Access denied. Please log in.</div>;
  }

  return <div>Protected content here</div>;
};
```

## Storage

The auth provider stores data in localStorage with the following keys:

- `access_token` - The authentication token
- `user` - Serialized user object

## Integration with API

When you're ready to integrate with a real API:

1. **Replace dummy login** with actual API call
2. **Add token refresh logic** if needed
3. **Implement proper error handling**
4. **Add token validation** on app startup

### Example API Integration

```typescript
const handleLogin = async (credentials: LoginCredentials) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data: AuthResponse = await response.json();
    login(data.accessToken, data.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

## Security Considerations

- **Token storage**: Tokens are stored in localStorage (consider httpOnly cookies for production)
- **Token validation**: Implement token validation on app startup
- **Token refresh**: Add automatic token refresh logic
- **Logout cleanup**: Ensure all stored data is cleared on logout

## Provider Setup

The AuthProvider is already configured in `src/app/layout.tsx`:

```typescript
<AuthProvider>
  <QueryClientProvider>
    {/* Your app components */}
  </QueryClientProvider>
</AuthProvider>
```

## TypeScript Support

All authentication types are defined in `src/types/auth.ts`:

- `User` - User interface
- `AuthState` - Authentication state
- `AuthContextType` - Context interface
- `LoginCredentials` - Login form data
- `AuthResponse` - API response structure
