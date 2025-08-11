'use client';

import { useLoginMutation } from '@/api/auth';
import { ErrorMessage, FormButton, FormInput } from '@/components/common/ui';
import { useAuth } from '@/hooks/useAuth';
import { logError } from '@/utils';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

interface IFormData {
  loginId: string;
  password: string;
}

interface IFormErrors {
  general?: string;
}

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const t = useTranslations();

  const [formData, setFormData] = useState<IFormData>({
    loginId: '',
    password: '',
  });

  const [errors, setErrors] = useState<IFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: loginAsync } = useLoginMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear general error when user starts typing
    if (errors.general) {
      setErrors({});
    }
  };

  const validateForm = (): boolean => {
    // Basic validation - if either field is empty, show generic error
    if (!formData.loginId.trim() || !formData.password.trim()) {
      setErrors({
        general: t('auth.loginError'),
      });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await loginAsync({
        loginId: formData.loginId,
        password: formData.password,
      });

      if (!res.user?.id) {
        throw new Error('Invalid login response');
      }

      login(res.accessToken, res.user);
      // Redirect will be handled by AuthProvider
    } catch (error) {
      logError('Login failed:', error as unknown);
      setErrors({
        general: t('auth.loginError'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-6 rounded-md bg-white px-8 py-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">{t('app.name')}</h1>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Admin ID Field */}
          <FormInput
            id="loginId"
            name="loginId"
            type="text"
            label={t('auth.adminId')}
            value={formData.loginId}
            onChange={handleInputChange}
            autoComplete="username"
            isLoading={isLoading}
          />

          {/* Password Field */}
          <FormInput
            id="password"
            name="password"
            type="password"
            label={t('auth.password')}
            value={formData.password}
            onChange={handleInputChange}
            autoComplete="current-password"
            isLoading={isLoading}
          />

          {/* Error Message */}
          <ErrorMessage message={errors.general} className="font-bold mt-[-8px]" />

          {/* Submit Button */}
          <div>
            <FormButton
              type="submit"
              isLoading={isLoading}
              loadingText={t('auth.loggingIn')}
              variant="primary"
            >
              {t('auth.loginButton')}
            </FormButton>
          </div>
        </form>
      </div>
    </div>
  );
};
