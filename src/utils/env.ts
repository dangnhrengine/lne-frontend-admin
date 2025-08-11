import { IS_DEVELOPMENT } from '@/constants/variables';
import { logError } from '@/utils';

/**
 * Get environment variable with validation
 * @param key - Environment variable key
 * @param required - Whether the variable is required
 * @param defaultValue - Default value if not required
 * @returns Environment variable value
 */
export function getEnvVar(
  key: string,
  required: boolean = false,
  defaultValue?: string
): string {
  const value = process.env[key];

  if (required && !value) {
    const error = `Missing required environment variable: ${key}`;
    if (IS_DEVELOPMENT) {
      logError(error);
    }
    throw new Error(error);
  }

  return value ?? defaultValue ?? '';
}

/**
 * Get boolean environment variable
 * @param key - Environment variable key
 * @param defaultValue - Default value
 * @returns Boolean value
 */
export function getBooleanEnvVar(
  key: string,
  defaultValue: boolean = false
): boolean {
  const value = process.env[key];

  if (!value) {
    return defaultValue;
  }

  return value.toLowerCase() === 'true';
}

/**
 * Validate all required environment variables
 */
export function validateEnvVars(): void {
  const requiredVars = ['NEXT_PUBLIC_BASE_URL'];

  for (const varName of requiredVars) {
    getEnvVar(varName, true);
  }
}
