import React from 'react';
import { Header } from '@/components/common/header/Header';

interface IHeaderLayoutProps {
  children: React.ReactNode;
}

export const HeaderLayout: React.FC<IHeaderLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}; 