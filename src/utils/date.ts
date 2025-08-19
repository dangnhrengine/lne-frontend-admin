import { logError } from '@/utils';

export const formatDate = (date: string) => new Date(date).toISOString();

export const formatDatePretty = ({
  value,
  overrideOptions = {},
}: {
  value: string;
  overrideOptions?: Intl.DateTimeFormatOptions;
}) => {
  try {
    if (!value) {
      return '';
    }
    const date = new Date(value);

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      year: 'numeric',
      month: '2-digit',
      ...overrideOptions,
    };
    return new Intl.DateTimeFormat('ja-JP', options).format(date);
  } catch (error) {
    logError('Error formatting date', error);
    return value;
  }
};
