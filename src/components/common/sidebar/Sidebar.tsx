'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/constants/routes';
import { Users, UserPlus, FileText } from 'lucide-react';

interface ISidebarItem {
  key: string;
  href: string;
  translationKey: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const t = useTranslations('navigation');
  const pathname = usePathname();

  const sidebarItems: ISidebarItem[] = [
    {
      key: 'memberManagement',
      href: ROUTES.MEMBERS,
      translationKey: 'memberManagement',
      icon: <Users className="h-5 w-5 fill-current" />,
    },
    {
      key: 'memberRegistration',
      href: ROUTES.MEMBER_REGISTRATION,
      translationKey: 'memberRegistration',
      icon: <UserPlus className="h-5 w-5 fill-current" />,
    },
    {
      key: 'purchaseHistory',
      href: ROUTES.PURCHASE_HISTORY,
      translationKey: 'purchaseHistory',
      icon: <FileText className="h-5 w-5" />,
    },
  ];

  const isActiveRoute = (href: string): boolean => {
    if (href === ROUTES.MEMBERS && pathname === ROUTES.MEMBERS) {
      return true;
    }
    if (
      href === ROUTES.MEMBER_REGISTRATION &&
      pathname === ROUTES.MEMBER_REGISTRATION
    ) {
      return true;
    }
    if (
      href === ROUTES.PURCHASE_HISTORY &&
      pathname === ROUTES.PURCHASE_HISTORY
    ) {
      return true;
    }
    return false;
  };

  return (
    <aside className="w-64 bg-white shadow-lg">
      <nav className="space-y-1 py-4 px-2">
        {sidebarItems.map((item) => {
          const isActive = isActiveRoute(item.href);

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-4 py-4 text-sm font-bold transition-colors ${
                isActive
                  ? 'bg-gray-200 text-primary-800'
                  : 'text-primary-800 hover:bg-gray-100'
              } `}
            >
              <span className={isActive ? 'text-primary-800' : 'text-primary-800'}>
                {item.icon}
              </span>
              <span>{t(item.translationKey)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
