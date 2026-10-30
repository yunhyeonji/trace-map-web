'use client';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from './dialog';

interface ConfirmAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message?: string;
  confirmLabel: string;
  onConfirm: () => void;
  destructive?: boolean;
}

/** iOS 경고창: 가운데 정렬된 제목·설명 아래에 취소/확인 버튼이 나란히 놓인다 */
export default function ConfirmAlert({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel,
  onConfirm,
  destructive,
}: ConfirmAlertProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="max-w-[17rem] gap-0 overflow-hidden p-0 text-center">
        <div className="px-4 pt-5 pb-4">
          <DialogTitle className="text-headline">{title}</DialogTitle>
          {message && (
            <DialogDescription className="text-footnote mt-1">{message}</DialogDescription>
          )}
        </div>
        <div className="grid grid-cols-2 border-t">
          <DialogClose className="text-primary text-body active:bg-accent h-11 border-r">
            취소
          </DialogClose>
          <button
            onClick={onConfirm}
            className={
              destructive
                ? 'text-destructive text-headline active:bg-accent h-11'
                : 'text-primary text-headline active:bg-accent h-11'
            }
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
