'use client';

import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { FullScreenSpinner } from '@/components/common/ui';
import { useRouter } from 'next/navigation';

interface IProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (isLoading || hasRedirectedRef.current) {
      return;
    }

    if (requireAuth && !isAuthenticated) {
      hasRedirectedRef.current = true;
      router.replace(ROUTES.LOGIN);
    } else if (!requireAuth && isAuthenticated) {
      hasRedirectedRef.current = true;
      router.replace(ROUTES.MEMBERS);
    }
  }, [isAuthenticated, isLoading, requireAuth, router]);

  // Show loading while checking authentication or during redirect
  if (isLoading || hasRedirectedRef.current) {
    return <FullScreenSpinner />;
  }

  // Show children if authentication state matches requirements
  if ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
    return <>{children}</>;
  }

  // This should not be reached due to redirects above
  return null;
}; 