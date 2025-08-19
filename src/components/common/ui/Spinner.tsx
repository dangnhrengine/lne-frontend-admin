import React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils';

interface ISpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Spinner: React.FC<ISpinnerProps> = ({
  size = 'md',
  text,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const spinnerClasses = `animate-spin rounded-full border-b-2 border-gray-900 mx-auto ${sizeClasses[size]}`;
  const containerClasses = `text-center ${className}`.trim();

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses}></div>
      {text && <p className="mt-2 text-gray-600">{text}</p>}
    </div>
  );
};

// Convenience component for full-screen loading
export const FullScreenSpinner: React.FC<Omit<ISpinnerProps, 'className'>> = (
  props
) => {
  const t = useTranslations('common');

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner {...props} text={props.text || t('loading')} />
    </div>
  );
};

export const LoadingSpinner = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'mx-auto size-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900',
      className
    )}
  />
);

export default Spinner;
