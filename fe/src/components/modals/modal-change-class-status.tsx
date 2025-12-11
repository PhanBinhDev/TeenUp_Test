'use client';

import useModal from '@/hooks/use-modal';
import { ClassStatus } from '@/types/enum';
import { ConfirmDialog } from './confirm';
import { useChangeClassStatus } from '@/features/teacher/hooks';
import { STATUS_CONFIG, STATUS_DESCRIPTIONS } from '@/constants/app';

export function ModalChangeClassStatus() {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const { mutate: changeStatus, isPending } = useChangeClassStatus();

  const { classId, newStatus } = getModalData('ModalChangeClassStatus') as {
    classId: string;
    currentStatus: ClassStatus;
    newStatus: ClassStatus;
  };

  const handleConfirm = () => {
    changeStatus({ id: classId, status: newStatus });
  };

  return (
    <ConfirmDialog
      open={isModalOpen('ModalChangeClassStatus')}
      onOpenChange={() => closeModal('ModalChangeClassStatus')}
      title={`${STATUS_CONFIG[newStatus].label} lớp học`}
      description={STATUS_DESCRIPTIONS[newStatus]}
      onConfirm={handleConfirm}
      confirmText="Xác nhận"
      cancelText="Hủy"
      loading={isPending}
    />
  );
}
