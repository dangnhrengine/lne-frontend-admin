import { LayoutProvider } from '@/components/layouts';
import { AuthProvider } from '@/providers/auth/AuthProvider';
import { QueryClientProvider } from '@/providers/query-client/QueryClientProvider';
import '@/styles/globals.css';
import classNames from 'classnames';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Noto_Sans_JP } from 'next/font/google';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lne',
  description: 'Lne管理システム',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="ja">
      <body
        className={classNames(
          notoSansJP.className,
          'flex min-h-screen flex-col'
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <QueryClientProvider>
              <LayoutProvider>{children}</LayoutProvider>
            </QueryClientProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
