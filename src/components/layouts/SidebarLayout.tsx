'use client';

import React from 'react';
import { Header } from '@/components/common/header/Header';
import { Sidebar } from '@/components/common/sidebar/Sidebar';

interface ISidebarLayoutProps {
  children: React.ReactNode;
}

export const SidebarLayout: React.FC<ISidebarLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
