'use client';

import { Clock, Users, UserCircle2, Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Class } from '@/types/class';
import useModal from '@/hooks/use-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { ClassStatus } from '@/types/enum';
import { getDayName, getStatusColor, getStatusLabel } from '@/lib/utils';

interface ClassCardForParentProps {
  classItem: Class;
}

export function ClassCardForParent({ classItem }: ClassCardForParentProps) {
  const { openModal } = useModal();

  const handleRegister = () => {
    openModal('ModalRegisterClass', classItem);
  };

  const canRegister =
    classItem.status === ClassStatus.ACTIVE &&
    classItem.currentStudents < classItem.maxStudents;

  return (
    <Card className="py-0 transition-shadow hover:shadow-md">
      <CardHeader className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{classItem.name}</CardTitle>
            <CardDescription className="mt-1 text-xs">
              {classItem.description || 'Không có mô tả'}
            </CardDescription>
          </div>
          <Badge className={`text-xs ${getStatusColor(classItem.status)}`}>
            {getStatusLabel(classItem.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="mt-auto space-y-3 px-4 pb-4">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <UserCircle2 className="h-3.5 w-3.5" />
          <span>
            Giáo viên: {classItem?.teacher.user?.fullName || 'Chưa có'}
          </span>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {classItem.daysOfWeek.map(day => getDayName(day)).join(', ')}
          </span>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Clock className="h-3.5 w-3.5" />
          <span>{classItem.timeSlot}</span>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Users className="h-3.5 w-3.5" />
          <span>
            {classItem.currentStudents}/{classItem.maxStudents} học sinh
          </span>
        </div>

        {canRegister && (
          <Button size="sm" className="mt-2 w-full" onClick={handleRegister}>
            Đăng ký lớp học
          </Button>
        )}

        {classItem.status === ClassStatus.FULL && (
          <Button
            size="sm"
            className="mt-2 w-full"
            disabled
            variant="secondary"
          >
            Đã đầy
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function ClassCardSkeleton() {
  return (
    <Card>
      <CardHeader className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="ml-2 h-5 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="mt-2 h-9 w-full" />
      </CardContent>
    </Card>
  );
}
