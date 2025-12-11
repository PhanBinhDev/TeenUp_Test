import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  requireConfirmation?: {
    text: string;
    label?: string;
    placeholder?: string;
  };
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'default',
  requireConfirmation,
  loading,
}: ConfirmDialogProps) {
  const [confirmationInput, setConfirmationInput] = useState('');

  const handleConfirm = () => {
    onConfirm();
    setConfirmationInput('');
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setConfirmationInput('');
    }
    onOpenChange(isOpen);
  };

  const isConfirmEnabled = requireConfirmation
    ? confirmationInput === requireConfirmation.text
    : true;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {requireConfirmation && (
          <div className="space-y-2 py-4">
            <Label htmlFor="confirmation">
              {requireConfirmation.label ||
                `Vui lòng nhập "${requireConfirmation.text}" để xác nhận`}
            </Label>
            <Input
              id="confirmation"
              value={confirmationInput}
              onChange={e => setConfirmationInput(e.target.value)}
              placeholder={requireConfirmation.placeholder}
              className="font-mono"
              autoFocus
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            variant={variant}
            disabled={!isConfirmEnabled}
            loading={loading}
          >
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
