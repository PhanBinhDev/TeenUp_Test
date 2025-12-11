// /Users/p.binh/Workspaces/TeenUp_Test/fe/src/features/parent/components/student-card.tsx
'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  UserCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Student } from '@/types/student';
import useModal from '@/hooks/use-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { getGenderLabel } from '@/lib/utils';

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const { openModal } = useModal();

  const handleEdit = () => {
    openModal('ModalUpdateStudent', student);
  };

  const handleDelete = () => {
    openModal('ModalRemoveStudent', student);
  };

  return (
    <Card className="overflow-hidden py-0 transition-shadow hover:shadow-md">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
              <UserCircle className="text-primary h-7 w-7" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold">
                {student.name}
              </h3>
              <p className="text-muted-foreground text-sm">
                Lớp {student.currentGrade}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>
            Ngày sinh:{' '}
            {student.dob
              ? format(new Date(student.dob), 'dd/MM/yyyy', {
                  locale: vi,
                })
              : 'Chưa cập nhật'}
          </span>
        </div>
        <div>
          <Badge variant="secondary" className="text-sm">
            {getGenderLabel(student.gender)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function StudentCardSkeleton() {
  return (
    <Card className="overflow-hidden py-0">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-6 w-16" />
      </CardContent>
    </Card>
  );
}
