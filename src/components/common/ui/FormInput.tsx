import { cn } from '@/utils';
import React, { useCallback, useMemo } from 'react';

interface IFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isLoading?: boolean;
}

export const FormInput: React.FC<IFormInputProps> = ({
  label,
  isLoading,
  id,
  className = '',
  ...props
}) => {
  // Base classes that work with the current Tailwind setup
  const baseClasses = useMemo(
    () =>
      'w-full h-11 px-3 py-2 text-sm rounded-md border outline-none transition-all duration-200',
    []
  );

  // Normal state classes
  const normalClasses = useMemo(
    () =>
      'bg-gray-100 border-gray-200 text-gray-900 focus:bg-gray-100 focus:border-gray-300',
    []
  );

  // Loading state classes
  const loadingClasses = useMemo(
    () => (isLoading ? 'opacity-50 cursor-not-allowed' : ''),
    [isLoading]
  );

  // Combine all classes
  const inputClasses = useMemo(
    () =>
      cn(
        `${baseClasses} ${normalClasses} ${loadingClasses} ${className}`
      ).trim(),
    [baseClasses, normalClasses, loadingClasses, className]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLInputElement>) => {
      if (props.type === 'number' && !props?.onWheel) {
        return e.preventDefault();
      }
      props?.onWheel?.(e);
    },
    [props]
  );

  return (
    <div className="space-y-2">
      {label !== '' && (
        <label
          htmlFor={id}
          className="block h-5 text-sm font-medium text-gray-900"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        onWheel={handleWheel}
        value={props.value || ''}
        disabled={isLoading}
        className={inputClasses}
      />
    </div>
  );
};

FormInput.displayName = 'FormInput';
