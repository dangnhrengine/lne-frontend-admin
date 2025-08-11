'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BlankLayout } from './BlankLayout';
import { HeaderLayout } from './HeaderLayout';
import { SidebarLayout } from './SidebarLayout';

interface ILayoutProviderProps {
  children: React.ReactNode;
  forceLayout?: 'blank' | 'header' | 'sidebar';
}

export const LayoutProvider: React.FC<ILayoutProviderProps> = ({ 
  children, 
  forceLayout 
}) => {
  const { isAuthenticated } = useAuth();

  // If forceLayout is specified, use that layout
  if (forceLayout === 'blank') {
    return <BlankLayout>{children}</BlankLayout>;
  }
  
  if (forceLayout === 'header') {
    return <HeaderLayout>{children}</HeaderLayout>;
  }

  if (forceLayout === 'sidebar') {
    return <SidebarLayout>{children}</SidebarLayout>;
  }

  // Otherwise, determine layout based on authentication status
  if (isAuthenticated) {
    return <SidebarLayout>{children}</SidebarLayout>;
  }

  return <BlankLayout>{children}</BlankLayout>;
}; 