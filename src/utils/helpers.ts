import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const getAllKeysFromObject = (
  obj: Record<string, unknown>,
  prefix: string = ''
): string[] => {
  const keys: string[] = [];

  Object.keys(obj).forEach((key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      keys.push(
        ...getAllKeysFromObject(obj[key] as Record<string, unknown>, fullKey)
      );
    } else if (typeof obj[key] === 'string') {
      keys.push(fullKey);
    }
  });

  return keys;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateInJapanese = (dateString?: string) => {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
  });
};

export const formatDateOnlyInJapanese = (dateString?: string) => {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Tokyo',
  });
};

export const formatTimeInJapanese = (dateString?: string) => {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
  });
};

export const formatTimeFromSeconds = (seconds: number | undefined): string => {
  if (!seconds) {
    return '00:00:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formatNumber = (num: number): string => num.toString().padStart(2, '0');

  return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(remainingSeconds)}`;
};

export const isNotEmpty = (
  data: number | string | undefined | null | boolean | string[] | Date
) =>
  (data !== undefined && data !== '' && data !== null && data !== 0) ||
  (Array.isArray(data) && data.length > 0);

export const convertDateToISOString = (date?: Date) => {
  return date instanceof Date ? date.toISOString() : undefined;
};

export const isEmptyObject = (data: object) => Object.keys(data).length === 0;
