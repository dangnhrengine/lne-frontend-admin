import { ModalProps } from '@/components/common/ui/Dialog';
import { Button, DialogModal } from '@/components/common/ui';
import React from 'react';
import { useTranslations } from 'next-intl';

export interface ConfirmationModalProps extends ModalProps {
  description?: string;
  isLoading?: boolean;
  submitText?: string;
  cancelText?: string;
  onSubmit?: () => void;
}

export const ConfirmationModal = (props: ConfirmationModalProps) => {
  const t = useTranslations('ui.modal');
  const {
    isLoading,
    children,
    submitText,
    cancelText,
    onClose,
    onSubmit,
    ...rest
  } = props;
  return (
    <DialogModal {...rest} onClose={onClose}>
      {children}
      <div className="flex-center w-full gap-6 p-8">
        <Button
          onClick={onClose}
          className="w-[150px] rounded bg-primary-500 hover:bg-primary-600"
        >
          {cancelText || t('no')}
        </Button>
        <Button
          loading={isLoading}
          onClick={onSubmit}
          className="w-[150px] rounded"
        >
          {submitText || t('yes')}
        </Button>
      </div>
    </DialogModal>
  );
};
