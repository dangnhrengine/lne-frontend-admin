import React from 'react';

interface FieldErrorProps {
  error?: string;
  className?: string;
}

export const FieldError: React.FC<FieldErrorProps> = ({
  error,
  className = 'text-xs text-red-600',
}) => {
  if (!error) {
    return null;
  }

  return <p className={className}>{error}</p>;
};
