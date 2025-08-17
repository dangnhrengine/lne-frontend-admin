// src/components/common/ui/Alert.tsx
import { cn } from '@/utils/helpers';
import React, { useEffect, useMemo } from 'react';

type AlertVariant = 'info' | 'warning' | 'error';

export type AlertProps = {
  open: boolean;
  variant?: AlertVariant;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  dismissible?: boolean;
  onClose?: () => void;
  autoCloseMs?: number;
  icon?: React.ReactNode;
  role?: 'alert' | 'status';
};

const VariantIcon: React.FC<{ variant: AlertVariant }> = ({ variant }) => {
  if (variant === 'error') {
    return (
      <svg
        className="h-5 w-5 text-red-600"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16Zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7Zm-1 8a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  if (variant === 'warning') {
    return (
      <svg
        className="h-5 w-5 text-yellow-600"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.593c.75 1.334-.213 2.983-1.742 2.983H3.48c-1.53 0-2.492-1.649-1.743-2.983L8.257 3.1z" />
        <path
          d="M11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-2a1 1 0 01-1-1V8a1 1 0 112 0v3a1 1 0 01-1 1z"
          className="text-yellow-100"
        />
      </svg>
    );
  }
  return (
    <svg
      className="h-5 w-5 text-blue-600"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M18 10A8 8 0 11.001 10 8 8 0 0118 10zM9 7a1 1 0 102 0 1 1 0 00-2 0zm2 2.5a1 1 0 10-2 0v3a1 1 0 102 0v-3z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const Alert: React.FC<AlertProps> = ({
  open,
  variant = 'info',
  title,
  children,
  className,
  dismissible = true,
  onClose,
  autoCloseMs = 10000,
  icon,
  role = 'alert',
}) => {
  const styles = useMemo(() => {
    switch (variant) {
      case 'error':
        return {
          container: 'bg-red-50 text-red-800 border-red-200',
          close: 'text-red-600 hover:text-red-700 focus-visible:ring-red-600',
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          close:
            'text-yellow-700 hover:text-yellow-800 focus-visible:ring-yellow-700',
        };
      default:
        return {
          container: 'bg-blue-50 text-blue-800 border-blue-200',
          close:
            'text-blue-700 hover:text-blue-800 focus-visible:ring-blue-700',
        };
    }
  }, [variant]);

  useEffect(() => {
    if (!autoCloseMs) {
      return;
    }
    const id = setTimeout(() => {
      onClose?.();
    }, autoCloseMs);
    return () => clearTimeout(id);
  }, [autoCloseMs, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex w-full items-start gap-3 rounded-md border px-4 py-3',
        styles.container,
        className
      )}
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
    >
      <div className="pt-0.5">{icon ?? <VariantIcon variant={variant} />}</div>
      <div className="flex-1 text-sm">
        {title && <div className="font-medium">{title}</div>}
        {children}
      </div>
      {dismissible && (
        <button
          type="button"
          aria-label="Close"
          className={cn(
            'ml-auto inline-flex h-5 w-5 items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            styles.close
          )}
          onClick={() => {
            onClose?.();
          }}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
};
