import { cn } from '@/utils';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  onSubmit: () => Promise<void>;
  className?: string;
}

export const Form = ({
  children,
  onSubmit,
  className,
  autoComplete = 'on',
}: FormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(className)}
      autoComplete={autoComplete}
    >
      {children}
    </form>
  );
};
