import { useFormField } from '@/hooks/useFormField';
import { cn } from '@/utils';
import React from 'react';

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error?.message ? String(error.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('typo-para-small text-accent-red-500 mt-0.5', className)}
      {...props}
    >
      {body}
    </p>
  );
});
