/**
 * Logging Utility
 * Provides automatic environment-aware logging functions
 * No need to manually check environment flags - the logger handles it automatically
 */
import { IS_DEVELOPMENT, IS_PRODUCTION, NODE_ENV } from '@/constants/variables';
import { getEnvVar } from '@/utils/env';

const APP_NAME = getEnvVar('NEXT_PUBLIC_APP_NAME', false, 'lne-frontend-admin');
const APP_VERSION = getEnvVar('NEXT_PUBLIC_APP_VERSION', false, '');
const APP_ENV = getEnvVar('NEXT_PUBLIC_APP_ENV', false, NODE_ENV);

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LoggerOptions {
  emoji?: string;
  level?: LogLevel;
  force?: boolean; // Force logging even in production
}

class Logger {
  private static instance: Logger | null = null;
  private _isDev: boolean = IS_DEVELOPMENT;

  private constructor() {}

  /**
   * Get Logger instance (Singleton)
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Get isDev value
   */
  private get isDev(): boolean {
    return this._isDev;
  }

  /**
   * Generic log function that respects environment
   */
  private logMessage(
    level: LogLevel,
    message: string,
    data?: unknown,
    options: LoggerOptions = {},
  ): void {
    // Skip logging in production unless forced
    if (!this.isDev && !options.force) {
      return;
    }

    const emoji = options.emoji || this.getDefaultEmoji(level);
    const logMethod = console[level] || console.log;

    if (data !== undefined) {
      logMethod(`${emoji} ${message}`, data);
    } else {
      logMethod(`${emoji} ${message}`);
    }
  }

  /**
   * Get default emoji for log level
   */
  private getDefaultEmoji(level: LogLevel): string {
    const emojiMap: Record<LogLevel, string> = {
      log: '📝',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      debug: '🐛',
    };
    return emojiMap[level] || '📝';
  }

  /**
   * Standard log (development only)
   */
  log(message: string, data?: unknown, emoji?: string): void {
    this.logMessage('log', message, data, { emoji });
  }

  /**
   * Info log (development only)
   */
  logInfo(message: string, data?: unknown, emoji?: string): void {
    this.logMessage('info', message, data, { emoji });
  }

  /**
   * Warning log (development only)
   */
  logWarn(message: string, data?: unknown, emoji?: string): void {
    this.logMessage('warn', message, data, { emoji });
  }

  /**
   * Error log (always shown, even in production)
   */
  logError(message: string, data?: unknown, emoji?: string): void {
    this.logMessage('error', message, data, { emoji, force: true });
  }

  /**
   * Debug log (development only)
   */
  logDebug(message: string, data?: unknown, emoji?: string): void {
    this.logMessage('debug', message, data, { emoji });
  }

  /**
   * Success log (development only)
   */
  logSuccess(message: string, data?: unknown): void {
    this.logMessage('log', message, data, { emoji: '✅' });
  }

  /**
   * API request log (development only)
   */
  logRequest(message: string, data?: unknown): void {
    this.logMessage('log', message, data, { emoji: '🚀' });
  }

  /**
   * API response log (development only)
   */
  logResponse(message: string, data?: unknown): void {
    this.logMessage('log', message, data, { emoji: '📨' });
  }

  /**
   * Authentication log (development only)
   */
  logAuth(message: string, data?: unknown): void {
    this.logMessage('log', message, data, { emoji: '🔐' });
  }

  /**
   * Navigation log (development only)
   */
  logNavigation(message: string, data?: unknown): void {
    this.logMessage('log', message, data, { emoji: '🧭' });
  }

  /**
   * Performance log (development only)
   */
  logPerformance(message: string, data?: unknown): void {
    this.logMessage('log', message, data, { emoji: '⚡' });
  }

  /**
   * Force log (always shown, even in production)
   */
  logForce(
    message: string,
    data?: unknown,
    level: LogLevel = 'log',
    emoji?: string,
  ): void {
    this.logMessage(level, message, data, { emoji, force: true });
  }

  /**
   * Conditional log - only logs if condition is true
   */
  logConditional(
    condition: boolean,
    message: string,
    data?: unknown,
    emoji?: string,
  ): void {
    if (condition) {
      this.log(message, data, emoji);
    }
  }

  /**
   * Group logs for better organization
   */
  logGroup(title: string, fn: () => void, collapsed = false): void {
    if (!this.isDev) {
      return;
    }

    if (collapsed) {
      console.groupCollapsed(`📂 ${title}`);
    } else {
      console.group(`📂 ${title}`);
    }

    try {
      fn();
    } finally {
      console.groupEnd();
    }
  }

  /**
   * Time a function execution (development only)
   */
  logTime<T>(label: string, fn: () => T): T {
    if (!this.isDev) {
      return fn();
    }

    console.time(`⏱️ ${label}`);
    try {
      return fn();
    } finally {
      console.timeEnd(`⏱️ ${label}`);
    }
  }

  /**
   * Time an async function execution (development only)
   */
  async logTimeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    if (!this.isDev) {
      return fn();
    }

    console.time(`⏱️ ${label}`);
    try {
      return await fn();
    } finally {
      console.timeEnd(`⏱️ ${label}`);
    }
  }

  /**
   * Get current environment info
   */
  getEnvironmentInfo(): Record<string, unknown> {
    return {
      isDev: IS_DEVELOPMENT,
      isProd: IS_PRODUCTION,
      environment: APP_ENV,
      appName: APP_NAME,
      appVersion: APP_VERSION,
    };
  }

  /**
   * Log environment info (development only)
   */
  logEnvironment(): void {
    this.logInfo('Environment Information:', this.getEnvironmentInfo(), '🌍');
  }
}

// Create singleton instance
const logger = Logger.getInstance();

// Export the logger instance
export { logger };

// Export individual methods for direct import using new naming convention
export const log = (message: string, data?: unknown, emoji?: string): void =>
  logger.log(message, data, emoji);

export const logInfo = (
  message: string,
  data?: unknown,
  emoji?: string,
): void => logger.logInfo(message, data, emoji);

export const logWarn = (
  message: string,
  data?: unknown,
  emoji?: string,
): void => logger.logWarn(message, data, emoji);

export const logError = (
  message: string,
  data?: unknown,
  emoji?: string,
): void => logger.logError(message, data, emoji);

export const logDebug = (
  message: string,
  data?: unknown,
  emoji?: string,
): void => logger.logDebug(message, data, emoji);

export const logSuccess = (message: string, data?: unknown): void =>
  logger.logSuccess(message, data);

export const logRequest = (message: string, data?: unknown): void =>
  logger.logRequest(message, data);

export const logResponse = (message: string, data?: unknown): void =>
  logger.logResponse(message, data);

export const logAuth = (message: string, data?: unknown): void =>
  logger.logAuth(message, data);

export const logNavigation = (message: string, data?: unknown): void =>
  logger.logNavigation(message, data);

export const logPerformance = (message: string, data?: unknown): void =>
  logger.logPerformance(message, data);

export const logForce = (
  message: string,
  data?: unknown,
  level: LogLevel = 'log',
  emoji?: string,
): void => logger.logForce(message, data, level, emoji);

export const logConditional = (
  condition: boolean,
  message: string,
  data?: unknown,
  emoji?: string,
): void => logger.logConditional(condition, message, data, emoji);

export const logGroup = (
  title: string,
  fn: () => void,
  collapsed = false,
): void => logger.logGroup(title, fn, collapsed);

export const logTime = <T>(label: string, fn: () => T): T =>
  logger.logTime(label, fn);

export const logTimeAsync = <T>(
  label: string,
  fn: () => Promise<T>,
): Promise<T> => logger.logTimeAsync(label, fn);

// Export default as logger instance
export default logger;
