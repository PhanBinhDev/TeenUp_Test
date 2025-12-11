'use client';

import useModal from '@/hooks/use-modal';
import { ConfirmDialog } from './confirm';
import { useDeleteClassForTeacher } from '@/features/teacher/hooks';

export function ModalRemoveClass() {
  const { isModalOpen, closeModal, getModalData } = useModal();

  const { classId } = getModalData('ModalRemoveClass') as {
    classId: string;
  };

  const { mutateAsync: deleteClass } = useDeleteClassForTeacher();

  const handleConfirm = async () => {
    deleteClass(classId);
  };

  return (
    <ConfirmDialog
      open={isModalOpen('ModalRemoveClass')}
      onOpenChange={() => closeModal('ModalRemoveClass')}
      onConfirm={handleConfirm}
      title="Xóa lớp học"
      description="Bạn có chắc chắn muốn xóa lớp học này? Hành động này không thể hoàn tác."
      confirmText="Xóa lớp học"
      variant="destructive"
    />
  );
}
