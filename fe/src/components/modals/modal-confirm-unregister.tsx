'use client';

import useModal from '@/hooks/use-modal';
import { useUnregisterClass } from '@/features/parent/hooks';
import { ConfirmDialog } from './confirm';

export function ModalConfirmUnregister() {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const { mutate: unregisterClass, isPending } = useUnregisterClass();

  const { classId, studentId, className } = getModalData(
    'ModalConfirmUnregister',
  ) as {
    classId: string;
    studentId: string;
    className: string;
  };

  const handleConfirm = () => {
    unregisterClass({ classId, studentId });
  };

  return (
    <ConfirmDialog
      open={isModalOpen('ModalConfirmUnregister')}
      onOpenChange={() => closeModal('ModalConfirmUnregister')}
      title="Xác nhận hủy đăng ký"
      description={`Bạn có chắc muốn hủy đăng ký lớp "${className}"? Hành động này không thể hoàn tác.`}
      onConfirm={handleConfirm}
      confirmText="Hủy đăng ký"
      cancelText="Không"
      loading={isPending}
      variant="destructive"
    />
  );
}
