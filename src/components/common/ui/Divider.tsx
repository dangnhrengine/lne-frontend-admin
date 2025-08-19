import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

type DividerProps = {
  width?: number;
  vertical?: boolean;
  dashed?: boolean;
  darker?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const Divider = ({
  className,
  vertical,
  dashed,
  darker,
  width,
}: DividerProps) => {
  return (
    <div
      role="separator"
      className={clsx(
        vertical ? 'h-full w-px border-l' : 'border-t',
        darker ? 'border-gray-600' : 'border-gray-200',
        className,
        dashed && 'border-dashed'
      )}
      style={{ width }}
    />
  );
};

Divider.displayName = 'Divider';
