'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export const Header: React.FC = () => {
  const t = useTranslations();
  const { logout } = useAuth();

  return (
    <header className="bg-black px-6 py-4 text-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">{t('header.title')}</div>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-white transition-colors hover:text-gray-300"
          >
            <LogOut className="h-5 w-5" />
            <span>{t('header.logout')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
