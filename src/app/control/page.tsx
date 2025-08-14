'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ProtectedRoute } from '@/components/auth';
import { Button } from '@/components/common/ui';
import { ArrowDownToLine } from 'lucide-react';
import FilterMembersForm from './_components/filter-members-form';
import { TableDemo } from './_components/MemberList';

export default function MembersPage() {
  const t = useTranslations('pages.members');

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="p-6">
        <div className="mb-6 flex w-full items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <Button size="lg" className="gap-x-2 font-semibold">
            <div className="flex items-center gap-x-1">
              {t.rich('export-csv-button', {
                small: (chunks) => (
                  <span className="text-sm max-md:hidden">{chunks}</span>
                ),
              })}
            </div>
            <ArrowDownToLine />
          </Button>
        </div>

        <FilterMembersForm />
      </div>
      <TableDemo />
    </ProtectedRoute>
  );
}
