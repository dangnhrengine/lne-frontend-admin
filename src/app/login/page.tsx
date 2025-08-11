'use client';

import { LoginForm, ProtectedRoute } from '@/components/auth';

export default function LoginPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <LoginForm />
    </ProtectedRoute>
  );
}
