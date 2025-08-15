import { ConfirmationModal } from '@/components/common/ui';
import React from 'react';
import { ConfirmationModalProps } from '@/components/common/ui/ConfirmationModal';

export const ToggleArchiveModal = (props: ConfirmationModalProps) => {
  return (
    <ConfirmationModal {...props}>
      <div className="px-10">
        <p className="whitespace-pre-line text-sm leading-6 text-gray-900">
          {props.description}
        </p>
      </div>
    </ConfirmationModal>
  );
};
