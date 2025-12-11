'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Clock, Users, UserCircle2, Calendar, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClassRegistration } from '@/types/class-registration';
import { getDayName, getStatusColor, getStatusLabel } from '@/lib/utils';
import { ClassStatus } from '@/types/enum';
import useModal from '@/hooks/use-modal';

interface MyClassCardProps {
  registration: ClassRegistration;
  studentId: string;
}

export function MyClassCard({ registration, studentId }: MyClassCardProps) {
  const { openModal } = useModal();

  const handleUnregister = () => {
    if (!registration.class) return;

    openModal('ModalConfirmUnregister', {
      classId: registration.classId,
      studentId,
      className: registration.class.name,
    });
  };

  if (!registration.class) return null;

  const classItem = registration.class;

  return (
    <Card className="overflow-hidden py-0 transition-shadow hover:shadow-md">
      <CardHeader className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{classItem.name}</CardTitle>
            <CardDescription className="mt-1 text-xs">
              Đăng ký:{' '}
              {format(new Date(registration.createdAt), 'dd/MM/yyyy', {
                locale: vi,
              })}
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
            Giáo viên: {classItem?.teacher?.user?.fullName || 'Chưa có'}
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

        {classItem.status === ClassStatus.ACTIVE && (
          <Button
            size="sm"
            variant="destructive"
            className="mt-2 w-full"
            onClick={handleUnregister}
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Hủy đăng ký
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
