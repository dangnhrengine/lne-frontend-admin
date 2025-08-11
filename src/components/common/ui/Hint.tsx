import { cn } from '@/utils/helpers';

interface IProps {
  children: React.ReactNode;
  className?: string;
}

export const Hint = ({ children, className }: IProps) => {
  return <p className={cn('text-xs text-gray-500', className)}>{children}</p>;
};
