'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useModal from '@/hooks/use-modal';
import { useDeleteStudent } from '@/features/parent/hooks';
import { Student } from '@/types/student';

export function ModalRemoveStudent() {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const isOpen = isModalOpen('ModalRemoveStudent');
  const student = getModalData('ModalRemoveStudent') as Student | undefined;
  const { mutate: deleteStudent, isPending } = useDeleteStudent();

  const handleConfirm = () => {
    if (!student) return;

    deleteStudent(student.id, {
      onSuccess: () => {
        closeModal('ModalRemoveStudent');
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => closeModal('ModalRemoveStudent')}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa học sinh</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa học sinh{' '}
            <span className="font-semibold">{student?.name}</span>? Hành động
            này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => closeModal('ModalRemoveStudent')}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
