import React from 'react';

interface IErrorMessageProps {
  message?: string;
  className?: string;
  centered?: boolean;
}

export const ErrorMessage: React.FC<IErrorMessageProps> = ({
  message,
  className = '',
  centered = false,
}) => {
  const baseClasses = 'text-xs text-red-600';
  const centerClass = centered ? 'text-center' : '';
  const visibilityClass = message ? '' : 'invisible';
  const errorClasses = `${baseClasses} ${centerClass} ${visibilityClass} ${className}`.trim();
  const hasMessage = Boolean(message);

  return (
    <div
      className={errorClasses}
      role={hasMessage ? 'alert' : undefined}
      aria-live={hasMessage ? 'polite' : undefined}
      aria-hidden={hasMessage ? undefined : true}
    >
      {hasMessage ? message : '\u00A0'}
    </div>
  );
};