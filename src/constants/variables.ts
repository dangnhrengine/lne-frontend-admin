// Environment variables with fallbacks
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:5001/api/admin';

export const NODE_ENV = process.env.NODE_ENV ?? 'development';

export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';
