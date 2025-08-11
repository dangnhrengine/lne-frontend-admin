'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">
          {t('notFound')}
        </h2>
        <p className="mt-2 text-gray-600">
          {t('pageNotFound')}
        </p>
                 <Link
           href={ROUTES.MEMBERS}
           className="mt-6 inline-block rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 transition-colors"
         >
           {t('backToMembers')}
         </Link>
      </div>
    </div>
  );
} 