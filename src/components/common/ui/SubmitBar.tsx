import { Button } from '@/components/common/ui';
import { cn } from '@/utils';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';

interface SubmitBarProps {
  isResetDisabled?: boolean;
  isSubmitDisabled?: boolean;
  isLoading: boolean;
  className?: string;
  onReset: () => void;
}

export const SubmitBar = forwardRef<HTMLDivElement, SubmitBarProps>(
  (
    { isResetDisabled, isSubmitDisabled, isLoading, className, onReset },
    ref
  ) => {
    const t = useTranslations('ui.buttons');
    return (
      <div ref={ref} className={cn('flex w-full gap-x-5', className)}>
        <Button
          type="button"
          variant="outline"
          disabled={isResetDisabled}
          className="h-11 text-sm"
          onClick={onReset}
        >
          {t('form-reset')}
        </Button>
        <Button
          type="submit"
          className="h-11 px-12 text-sm"
          disabled={isSubmitDisabled}
          loading={isLoading}
        >
          {t('form-submit')}
        </Button>
      </div>
    );
  }
);

SubmitBar.displayName = 'SubmitBar';
