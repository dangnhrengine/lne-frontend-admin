import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Ensure environment variables are properly loaded
  experimental: {
    // Enable if you need to use experimental features
  },
};

export default withNextIntl(nextConfig);
