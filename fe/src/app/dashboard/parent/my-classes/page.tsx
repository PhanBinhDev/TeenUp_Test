'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useGetStudents,
  useGetClassRegistrationsByStudent,
} from '@/features/parent/hooks';
import { MyClassCard } from '@/features/parent/components/my-class-card';
import { ClassCardSkeleton } from '@/features/teacher/components/class-card';

export default function MyClassesPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const { data: studentsData } = useGetStudents();
  const { data: registrationsData, isLoading } =
    useGetClassRegistrationsByStudent(selectedStudentId);

  if (
    !selectedStudentId &&
    studentsData?.data &&
    studentsData.data.length > 0
  ) {
    setSelectedStudentId(studentsData.data[0].id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Lớp học của tôi</h2>
          <p className="text-muted-foreground text-sm">
            Các lớp học mà con bạn đã đăng ký
          </p>
        </div>
      </div>

      <div className="w-full sm:w-[300px]">
        <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn học sinh" />
          </SelectTrigger>
          <SelectContent>
            {studentsData?.data?.map(student => (
              <SelectItem key={student.id} value={student.id}>
                {student.name} - Lớp {student.currentGrade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedStudentId ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-sm">
            Vui lòng chọn học sinh để xem các lớp học đã đăng ký.
          </p>
        </div>
      ) : isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ClassCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {registrationsData?.map(registration => (
            <MyClassCard
              key={registration.id}
              registration={registration}
              studentId={selectedStudentId}
            />
          ))}
        </div>
      )}

      {!isLoading && selectedStudentId && registrationsData?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-sm">
            Học sinh chưa đăng ký lớp học nào. Hãy xem danh sách lớp học và đăng
            ký ngay!
          </p>
        </div>
      )}
    </div>
  );
}
