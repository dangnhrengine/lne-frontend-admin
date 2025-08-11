import React from 'react';
import { LayoutProvider } from '@/components/layouts';

interface ILoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: ILoginLayoutProps) {
  return (
    <LayoutProvider forceLayout="blank">
      {children}
    </LayoutProvider>
  );
} 