import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input } from './Input';
import { Label } from './Label';
import { FieldError } from './FieldError';
import { cn } from '@/utils/helpers';
import { Hint } from './Hint';

interface RightLinkProps {
  text: string;
  href: string;
  className?: string;
}

interface IProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  required?: boolean;
  error?: string;
  hint?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  className?: string;
  inputClassName?: string;
  requiredText?: string;
  requiredErrorMessage?: string;
  showValidation?: boolean;
  rightLink?: RightLinkProps;
  onValidationChange?: (fieldName: string, error: string | null) => void;
}

export const InputValidator: React.FC<IProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  error,
  hint,
  minLength,
  maxLength,
  pattern,
  className = 'w-full space-y-2',
  inputClassName = 'h-10',
  requiredText = '*',
  requiredErrorMessage,
  showValidation = false,
  rightLink,
  onValidationChange,
}) => {
  const [internalError, setInternalError] = useState<string | undefined>(
    undefined,
  );

  // Validate required field
  useEffect(() => {
    if (required && !value.trim() && requiredErrorMessage && showValidation) {
      const errorMsg = requiredErrorMessage;
      setInternalError(errorMsg);
      onValidationChange?.(name, errorMsg);
    } else {
      setInternalError(undefined);
      if (!showValidation) {
        onValidationChange?.(name, null);
      }
    }
  }, [
    value,
    required,
    requiredErrorMessage,
    name,
    onValidationChange,
    showValidation,
  ]);

  // Use external error first, then internal required validation error (only if showValidation is true)
  const displayError = error || (showValidation ? internalError : undefined);

  return (
    <div className={className}>
      <div className='flex items-center justify-between'>
        <Label htmlFor={id}>
          {label}
          {required && <span className='text-red-500'> {requiredText}</span>}
        </Label>
        {rightLink && (
          <Link
            href={rightLink.href}
            className={
              rightLink.className ||
              'text-sm text-blue-600 hover:text-blue-800 hover:underline'
            }
          >
            {rightLink.text}
          </Link>
        )}
      </div>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        className={
          displayError ? cn(inputClassName, 'border-red-500 focus:ring-red-500 focus:border-red-500') : inputClassName
        }
      />
      {hint && <Hint>{hint}</Hint>}
      <FieldError error={displayError} />
    </div>
  );
};
