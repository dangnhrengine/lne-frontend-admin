import { ComponentPropsWithoutRef, ReactNode } from 'react';

export type FormFieldProps = ComponentPropsWithoutRef<'div'> & {
  control: unknown;
  name: string;
  render: (props: { field: unknown }) => ReactNode;
};

export type FormItemProps = ComponentPropsWithoutRef<'div'>;

export type FormLabelProps = ComponentPropsWithoutRef<'label'>;

export type FormControlProps = ComponentPropsWithoutRef<'div'>;

export type FormMessageProps = ComponentPropsWithoutRef<'p'>;

export type SelectProps = {
  onValueChange: (value: string) => void;
  defaultValue?: string;
  value?: string;
};

export type SelectTriggerProps = ComponentPropsWithoutRef<'button'>;

export type SelectContentProps = ComponentPropsWithoutRef<'div'> & {
  position?: 'popper' | 'item-aligned';
};

export type SelectItemProps = ComponentPropsWithoutRef<'div'> & {
  value: string;
};

export type SelectValueProps = ComponentPropsWithoutRef<'span'> & {
  placeholder?: string;
};
