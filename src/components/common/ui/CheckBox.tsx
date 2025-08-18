import { forwardRef, Ref } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '@/utils';
import { CheckIcon } from 'lucide-react';

type CheckboxProps = CheckboxPrimitive.CheckboxProps & {
  inputId?: string;
  label?: string;
  isExpand?: boolean;
  isReverse?: boolean;
};

export const Checkbox = forwardRef(
  (
    {
      checked,
      isExpand,
      isReverse,
      inputId,
      label,
      onCheckedChange,
      ...props
    }: CheckboxProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <div
        className={cn('flex w-fit items-start gap-x-2', {
          'w-full justify-between': isExpand,
          'flex-row-reverse': isReverse,
        })}
      >
        <div className="flex-center mt-0.5 size-5">
          <CheckboxPrimitive.Root
            className={cn(
              'flex-center size-5 rounded border bg-gray-100 transition-colors duration-200',
              {
                'border-gray-200 bg-gray-100': checked,
              }
            )}
            checked={checked}
            ref={ref}
            onCheckedChange={onCheckedChange}
            {...props}
            id={inputId}
          >
            <CheckboxPrimitive.Indicator
              className={cn('flex-center size-full opacity-0', {
                'opacity-100': checked,
              })}
              forceMount={true}
            >
              <CheckIcon className="size-4 text-primary-800" />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
        </div>
        {label && (
          <label className="text-sm text-primary-800" htmlFor={inputId}>
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
