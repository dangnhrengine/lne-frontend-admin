import { Button } from '@/components/common/ui';
import { cn } from '@/utils';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { ReactNode, useCallback } from 'react';

export type ModalSize = 'sm' | 'md';
export type ModalProps = {
  size?: ModalSize;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  closeOnPressEscape?: boolean;
  closeOnClickOutside?: boolean;
  isShowHeader?: boolean;
  children?: ReactNode;
  className?: string;
  isShowClose?: boolean;
};

export const DialogModal = ({
  title,
  isOpen,
  onClose,
  closeOnPressEscape = true,
  closeOnClickOutside = true,
  isShowHeader = true,
  children,
  className,
  isShowClose = false,
}: ModalProps) => {
  const onOpenChange = useCallback(
    (v: boolean) => {
      if (v === false) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'animate-fade fixed inset-0 z-50 grid h-full w-full',
            'place-items-center overflow-y-auto bg-gray-900/50'
          )}
        >
          <Dialog.Content
            className={cn(
              'animate-zoom relative mx-4 my-8 w-full rounded-lg bg-gray-50 sm:w-[540px]',
              className
            )}
            onEscapeKeyDown={
              closeOnPressEscape ? undefined : (event) => event.preventDefault()
            }
            onPointerDownOutside={
              closeOnClickOutside
                ? undefined
                : (event) => event.preventDefault()
            }
          >
            <div
              className={cn('flex-center z-10 flex-initial', {
                hidden: !isShowHeader,
              })}
            >
              <div className={cn('flex items-center justify-between p-4 pt-8')}>
                {title && (
                  <Dialog.Title className="text-lg font-bold text-gray-900">
                    {title}
                  </Dialog.Title>
                )}
                <Dialog.Description className="hidden" />
                {isShowClose && (
                  <Dialog.Close asChild>
                    <Button size="sm" variant="ghost" onClick={onClose}>
                      <X />
                    </Button>
                  </Dialog.Close>
                )}
              </div>
            </div>
            {children}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

DialogModal.displayName = 'DialogModal';
