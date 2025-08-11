import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // For single locale setup with localePrefix: 'never'
  // Always use Japanese as the locale
  return {
    locale: 'ja',
    messages: (await import(`../messages/ja.json`)).default,
  };
});
