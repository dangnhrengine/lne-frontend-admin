import React from 'react';
import { cn } from '@/utils/helpers';

type TFormButtonTone = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'neutral';
type TFormButtonAppearance = 'filled' | 'outlined' | 'ghost' | 'link';
type TFormButtonSize = 'sm' | 'md' | 'lg';

interface IFormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  /**
   * Deprecated: use `appearance` + `tone` instead.
   * Kept for backward compatibility (maps to tone with filled appearance).
   */
  variant?: 'primary' | 'secondary';
  /** Visual style, e.g. filled or outlined */
  appearance?: TFormButtonAppearance;
  /** Color system/tone independent of appearance */
  tone?: TFormButtonTone;
  /** Control height/padding */
  size?: TFormButtonSize;
}

export const FormButton: React.FC<IFormButtonProps> = ({
  children,
  isLoading,
  loadingText = 'Loading...',
  variant,
  appearance,
  tone,
  size = 'md',
  className = '',
  ...buttonProps
}) => {
  // Determine effective tone and appearance (backward compatibility for `variant`)
  const effectiveTone: TFormButtonTone = tone || variant || 'primary';
  const effectiveAppearance: TFormButtonAppearance = appearance || 'filled';

  // Base classes that work with the current Tailwind setup
  const baseClasses = 'w-full font-medium text-sm rounded-md flex items-center justify-center gap-2 transition-all duration-200 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const sizeClasses: Record<TFormButtonSize, string> = {
    sm: 'h-9 px-3',
    md: 'h-11 px-4',
    lg: 'h-12 px-6 text-base',
  };

  // Enumerate Tailwind classes to avoid dynamic class issues with the JIT compiler
  const filledClasses: Record<TFormButtonTone, string> = {
    primary: 'bg-black hover:bg-gray-800 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    neutral: 'bg-slate-600 hover:bg-slate-700 text-white',
  };

  const outlinedClasses: Record<TFormButtonTone, string> = {
    primary: 'border border-gray-900 text-gray-900 hover:bg-gray-50',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'border border-red-300 text-red-700 hover:bg-red-50',
    success: 'border border-green-300 text-green-700 hover:bg-green-50',
    warning: 'border border-amber-300 text-amber-700 hover:bg-amber-50',
    neutral: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
  };

  const ghostClasses: Record<TFormButtonTone, string> = {
    primary: 'text-gray-900 hover:bg-gray-100',
    secondary: 'text-gray-700 hover:bg-gray-100',
    danger: 'text-red-700 hover:bg-red-50',
    success: 'text-green-700 hover:bg-green-50',
    warning: 'text-amber-700 hover:bg-amber-50',
    neutral: 'text-slate-700 hover:bg-slate-100',
  };

  const linkClasses: Record<TFormButtonTone, string> = {
    primary: 'text-gray-900 hover:underline underline-offset-4 bg-transparent',
    secondary: 'text-gray-700 hover:underline underline-offset-4 bg-transparent',
    danger: 'text-red-600 hover:underline underline-offset-4 bg-transparent',
    success: 'text-green-600 hover:underline underline-offset-4 bg-transparent',
    warning: 'text-amber-600 hover:underline underline-offset-4 bg-transparent',
    neutral: 'text-slate-600 hover:underline underline-offset-4 bg-transparent',
  };

  const appearanceMap: Record<TFormButtonAppearance, Record<TFormButtonTone, string>> = {
    filled: filledClasses,
    outlined: outlinedClasses,
    ghost: ghostClasses,
    link: linkClasses,
  };

  // Disabled/loading classes
  const disabledClasses = (isLoading || buttonProps.disabled)
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  const buttonClasses = cn(
    baseClasses,
    sizeClasses[size],
    appearanceMap[effectiveAppearance][effectiveTone],
    disabledClasses,
    className,
  );

  return (
    <button
      {...buttonProps}
      disabled={isLoading || buttonProps.disabled}
      className={buttonClasses}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};