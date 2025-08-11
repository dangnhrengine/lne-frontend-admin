'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ProtectedRoute } from '@/components/auth';

export default function MembersPage() {
  const t = useTranslations('pages.members');

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('description')}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('placeholder')}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}