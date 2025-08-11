# LocalStorage Utility

This document explains how to use the localStorage utility in the LNE Frontend Admin project.

## Overview

The localStorage utility provides a type-safe, error-handled interface for managing browser storage. It includes comprehensive error handling, SSR compatibility, and utility functions for storage management.

## Features

- ✅ **Type Safety** - Full TypeScript support with generic types
- ✅ **Error Handling** - Comprehensive error handling with fallbacks
- ✅ **SSR Compatible** - Safe for server-side rendering
- ✅ **Storage Validation** - Checks localStorage availability
- ✅ **Utility Functions** - Size monitoring, space calculation, and more
- ✅ **Centralized Keys** - Predefined storage keys for consistency

## Usage

### Basic Storage Operations

```typescript
import { storage, getStorageItem, setStorageItem } from '@/utils/storage';

// Using the storage object (recommended)
const token = storage.getAccessToken();
storage.setAccessToken('new-token');

// Using generic functions
const user = getStorageItem<User>('user');
setStorageItem('user', userData);
```

### Available Storage Keys

```typescript
import { STORAGE_KEYS } from '@/utils/storage';

// Predefined keys
STORAGE_KEYS.ACCESS_TOKEN; // 'access_token'
STORAGE_KEYS.USER; // 'user'
STORAGE_KEYS.THEME; // 'theme'
STORAGE_KEYS.LANGUAGE; // 'language'
STORAGE_KEYS.PREFERENCES; // 'preferences'
```

## API Reference

### Storage Object Methods

#### Access Token

```typescript
storage.getAccessToken(): string | null
storage.setAccessToken(token: string): boolean
storage.removeAccessToken(): boolean
```

#### User Data

```typescript
storage.getUser<T>(): T | null
storage.setUser<T>(user: T): boolean
storage.removeUser(): boolean
```

#### Theme

```typescript
storage.getTheme(): string | null
storage.setTheme(theme: string): boolean
storage.removeTheme(): boolean
```

#### Language

```typescript
storage.getLanguage(): string | null
storage.setLanguage(language: string): boolean
storage.removeLanguage(): boolean
```

#### Preferences

```typescript
storage.getPreferences<T>(): T | null
storage.setPreferences<T>(preferences: T): boolean
storage.removePreferences(): boolean
```

### Utility Functions

#### Generic Functions

```typescript
getStorageItem<T>(key: string, defaultValue?: T | null): T | null
setStorageItem<T>(key: string, value: T): boolean
removeStorageItem(key: string): boolean
```

#### Storage Management

```typescript
storage.clear(): boolean                    // Clear all storage
storage.getKeys(): string[]                 // Get all keys
storage.hasItem(key: string): boolean       // Check if key exists
storage.getSize(): number                   // Get storage size in bytes
storage.getRemainingSpace(): number         // Get remaining space in bytes
```

## Examples

### Storing User Data

```typescript
import { storage } from '@/utils/storage';

interface User {
  id: string;
  name: string;
  email: string;
}

// Store user data
const user: User = {
  id: '1',
  name: '管理者',
  email: 'admin@example.com',
};

const success = storage.setUser(user);
if (success) {
  console.log('User data stored successfully');
}

// Retrieve user data
const storedUser = storage.getUser<User>();
if (storedUser) {
  console.log('Welcome back,', storedUser.name);
}
```

### Theme Management

```typescript
import { storage } from '@/utils/storage';

// Set theme
storage.setTheme('dark');

// Get current theme
const currentTheme = storage.getTheme() || 'light';

// Apply theme
document.documentElement.setAttribute('data-theme', currentTheme);
```

### Error Handling

```typescript
import { storage } from '@/utils/storage';

// All functions return boolean for success/failure
const success = storage.setAccessToken('new-token');
if (!success) {
  console.error('Failed to store access token');
  // Handle error (e.g., storage full, private browsing)
}

// Get with fallback
const theme = storage.getTheme() || 'light';
```

### Storage Monitoring

```typescript
import { storage } from '@/utils/storage';

// Check storage usage
const currentSize = storage.getSize();
const remainingSpace = storage.getRemainingSpace();

console.log(`Storage used: ${currentSize} bytes`);
console.log(`Remaining space: ${remainingSpace} bytes`);

// Check if storage is getting full
if (remainingSpace < 1024 * 1024) {
  // Less than 1MB
  console.warn('Storage space is running low');
}
```

### Custom Storage Operations

```typescript
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage';

// Custom storage key
const CUSTOM_KEY = 'my-custom-data';

// Store custom data
setStorageItem(CUSTOM_KEY, { custom: 'data' });

// Retrieve custom data
const customData = getStorageItem(CUSTOM_KEY);
```

## Integration with Auth Provider

The AuthProvider has been refactored to use the storage utility:

```typescript
// Before (old implementation)
const token = localStorage.getItem('access_token');
localStorage.setItem('access_token', newToken);

// After (using storage utility)
const token = storage.getAccessToken();
storage.setAccessToken(newToken);
```

## Best Practices

### 1. Use Type-Safe Methods

```typescript
// ✅ Good - Type safe
const user = storage.getUser<User>();

// ❌ Avoid - No type safety
const user = getStorageItem('user');
```

### 2. Handle Errors Gracefully

```typescript
// ✅ Good - Check for success
const success = storage.setUser(user);
if (!success) {
  // Handle storage error
}

// ❌ Avoid - Assume success
storage.setUser(user);
```

### 3. Provide Fallbacks

```typescript
// ✅ Good - Provide fallback
const theme = storage.getTheme() || 'light';

// ❌ Avoid - No fallback
const theme = storage.getTheme();
```

### 4. Use Predefined Keys

```typescript
// ✅ Good - Use predefined keys
storage.setAccessToken(token);

// ❌ Avoid - Hardcoded keys
setStorageItem('access_token', token);
```

## Error Scenarios

The utility handles various error scenarios:

1. **Private Browsing Mode** - localStorage may not be available
2. **Storage Quota Exceeded** - Browser storage limits
3. **Corrupted Data** - Invalid JSON in storage
4. **SSR Environment** - Server-side rendering without window object

All functions include proper error handling and return appropriate fallback values.

## Performance Considerations

- **Storage Size Monitoring** - Use `storage.getSize()` to monitor usage
- **Space Calculation** - Use `storage.getRemainingSpace()` to check available space
- **Key Management** - Use `storage.getKeys()` to audit stored data
- **Cleanup** - Use `storage.clear()` to reset storage when needed

## Migration Guide

If you have existing localStorage code:

```typescript
// Old code
localStorage.setItem('user', JSON.stringify(user));
const user = JSON.parse(localStorage.getItem('user') || 'null');

// New code
storage.setUser(user);
const user = storage.getUser<User>();
```

The storage utility provides a cleaner, safer, and more maintainable approach to localStorage management.
