import { FormItemContext } from '@/hooks/useFormField';
import { cn } from '@/utils';
import React from 'react';

export const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('py-3', className)} {...props} />
    </FormItemContext.Provider>
  );
});
