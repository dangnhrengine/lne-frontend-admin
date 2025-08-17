'use client';

import { Toaster } from '@/components/common/ui';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { BlankLayout } from './BlankLayout';
import { HeaderLayout } from './HeaderLayout';
import { SidebarLayout } from './SidebarLayout';

interface ILayoutProviderProps {
  children: React.ReactNode;
  forceLayout?: 'blank' | 'header' | 'sidebar';
}

export const LayoutProvider: React.FC<ILayoutProviderProps> = ({
  children,
  forceLayout,
}) => {
  const { isAuthenticated } = useAuth();

  const childrenWithToaster = (
    <>
      <Toaster />
      {children}
    </>
  );

  // If forceLayout is specified, use that layout
  if (forceLayout === 'blank') {
    return <BlankLayout>{childrenWithToaster}</BlankLayout>;
  }

  if (forceLayout === 'header') {
    return <HeaderLayout>{childrenWithToaster}</HeaderLayout>;
  }

  if (forceLayout === 'sidebar') {
    return <SidebarLayout>{childrenWithToaster}</SidebarLayout>;
  }

  // Otherwise, determine layout based on authentication status
  if (isAuthenticated) {
    return <SidebarLayout>{childrenWithToaster}</SidebarLayout>;
  }

  return <BlankLayout>{childrenWithToaster}</BlankLayout>;
};
