/**
 * LocalStorage utility functions with type safety and error handling
 */
import { logWarn } from '@/utils';

// Storage keys for the application
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'preferences',
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;

/**
 * Check if localStorage is available (client-side only)
 */
const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Generic function to get item from localStorage
 */
export const getStorageItem = <T>(
  key: string,
  defaultValue: T | null = null
): T | null => {
  if (!isLocalStorageAvailable()) {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    logWarn(`Failed to get item from localStorage with key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Generic function to set item in localStorage
 */
export const setStorageItem = <T>(key: string, value: T): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    logWarn(`Failed to set item in localStorage with key "${key}":`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 */
export const removeStorageItem = (key: string): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    logWarn(
      `Failed to remove item from localStorage with key "${key}":`,
      error
    );
    return false;
  }
};

/**
 * Clear all localStorage items
 */
export const clearStorage = (): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    logWarn('Failed to clear localStorage:', error);
    return false;
  }
};

/**
 * Get all localStorage keys
 */
export const getStorageKeys = (): string[] => {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    return Object.keys(localStorage);
  } catch (error) {
    logWarn('Failed to get localStorage keys:', error);
    return [];
  }
};

/**
 * Check if a key exists in localStorage
 */
export const hasStorageItem = (key: string): boolean => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    logWarn(
      `Failed to check if item exists in localStorage with key "${key}":`,
      error
    );
    return false;
  }
};

/**
 * Get storage size in bytes
 */
export const getStorageSize = (): number => {
  if (!isLocalStorageAvailable()) {
    return 0;
  }

  try {
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        size += key.length + localStorage.getItem(key)!.length;
      }
    }
    return size;
  } catch (error) {
    logWarn('Failed to get localStorage size:', error);
    return 0;
  }
};

/**
 * Get remaining storage space (approximate)
 */
export const getRemainingStorageSpace = (): number => {
  if (!isLocalStorageAvailable()) {
    return 0;
  }

  try {
    const testKey = '__storage_test__';
    const testValue = 'x'.repeat(1024); // 1KB test
    let testSize = 0;

    // Find how much we can store
    while (true) {
      try {
        localStorage.setItem(testKey + testSize, testValue);
        testSize++;
      } catch {
        break;
      }
    }

    // Clean up test data
    for (let i = 0; i < testSize; i++) {
      localStorage.removeItem(testKey + i);
    }

    return testSize * 1024; // Return in bytes
  } catch (error) {
    logWarn('Failed to get remaining localStorage space:', error);
    return 0;
  }
};

// Type-safe storage functions for specific keys
export const storage = {
  // Access token
  getAccessToken: (): string | null =>
    getStorageItem<string>(STORAGE_KEYS.ACCESS_TOKEN),
  setAccessToken: (token: string): boolean =>
    setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, token),
  removeAccessToken: (): boolean =>
    removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN),

  // User data
  getUser: <T>(): T | null => getStorageItem<T>(STORAGE_KEYS.USER),
  setUser: <T>(user: T): boolean => setStorageItem(STORAGE_KEYS.USER, user),
  removeUser: (): boolean => removeStorageItem(STORAGE_KEYS.USER),

  // Theme
  getTheme: (): string | null => getStorageItem<string>(STORAGE_KEYS.THEME),
  setTheme: (theme: string): boolean =>
    setStorageItem(STORAGE_KEYS.THEME, theme),
  removeTheme: (): boolean => removeStorageItem(STORAGE_KEYS.THEME),

  // Language
  getLanguage: (): string | null =>
    getStorageItem<string>(STORAGE_KEYS.LANGUAGE),
  setLanguage: (language: string): boolean =>
    setStorageItem(STORAGE_KEYS.LANGUAGE, language),
  removeLanguage: (): boolean => removeStorageItem(STORAGE_KEYS.LANGUAGE),

  // Preferences
  getPreferences: <T>(): T | null =>
    getStorageItem<T>(STORAGE_KEYS.PREFERENCES),
  setPreferences: <T>(preferences: T): boolean =>
    setStorageItem(STORAGE_KEYS.PREFERENCES, preferences),
  removePreferences: (): boolean => removeStorageItem(STORAGE_KEYS.PREFERENCES),

  // Utility functions
  clear: clearStorage,
  getKeys: getStorageKeys,
  hasItem: hasStorageItem,
  getSize: getStorageSize,
  getRemainingSpace: getRemainingStorageSpace,
};
