'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetStudents } from '@/features/parent/hooks';
import {
  StudentCard,
  StudentCardSkeleton,
} from '@/features/parent/components/student-card';
import useModal from '@/hooks/use-modal';

export default function StudentsPage() {
  const { data, isLoading } = useGetStudents();
  const { openModal } = useModal();

  const handleAddStudent = () => {
    openModal('ModalAddStudent');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Học sinh</h2>
          <p className="text-muted-foreground text-sm">
            Quản lý thông tin học sinh của bạn
          </p>
        </div>
        <Button onClick={handleAddStudent}>
          <Plus className="mr-1 h-4 w-4" />
          Thêm học sinh
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <StudentCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.data?.map(student => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}

      {!isLoading && data?.data?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-sm">
            Chưa có học sinh nào. Nhấn nút &quot;Thêm học sinh&quot; để bắt đầu.
          </p>
        </div>
      )}
    </div>
  );
}
