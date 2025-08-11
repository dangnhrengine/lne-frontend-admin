'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ProtectedRoute } from '@/components/auth';

export default function MemberRegistrationPage() {
  const t = useTranslations('pages.memberRegistration');

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
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