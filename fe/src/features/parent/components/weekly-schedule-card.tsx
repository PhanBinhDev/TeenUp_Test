'use client';

import { Users, UserCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Class } from '@/types/class';
import useModal from '@/hooks/use-modal';
import { ClassStatus } from '@/types/enum';
import { cn } from '@/lib/utils';
import Hint from '@/components/shared/hint';
import { STATUS_CONFIG } from '@/constants/app';

interface WeeklyScheduleCardProps {
  classItem: Class;
  isCompact?: boolean;
}

export function WeeklyScheduleCard({
  classItem,
  isCompact,
}: WeeklyScheduleCardProps) {
  const { openModal } = useModal();

  const statusConfig = STATUS_CONFIG[classItem.status];

  const handleRegister = () => {
    openModal('ModalRegisterClass', classItem);
  };

  const canRegister =
    classItem.status === ClassStatus.ACTIVE &&
    classItem.currentStudents < classItem.maxStudents;

  return (
    <Card className="py-0 transition-shadow hover:shadow-sm">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <Hint label={classItem.name}>
            <div className="min-w-0 flex-1">
              <h4
                className={cn(
                  'truncate font-semibold',
                  isCompact ? 'text-xs' : 'text-sm',
                )}
              >
                {classItem.name}
              </h4>
              <p
                className={cn(
                  'text-muted-foreground truncate',
                  isCompact ? 'text-[10px]' : 'text-xs',
                )}
              >
                {classItem.subject}
              </p>
            </div>
          </Hint>
          <Badge
            variant="secondary"
            className={cn(
              'shrink-0 text-white',
              statusConfig.color,
              isCompact ? 'px-1.5 py-0 text-[9px]' : 'px-2 py-0.5 text-[10px]',
            )}
          >
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-3 pt-0">
        <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
          <UserCircle2 className="h-3 w-3" />
          <span className="line-clamp-1">
            {classItem?.teacher?.user.fullName}
          </span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
          <Users className="h-3 w-3" />
          <span>
            {classItem.currentStudents}/{classItem.maxStudents}
          </span>
        </div>
        {!isCompact && canRegister && (
          <Button size="sm" className="w-full text-xs" onClick={handleRegister}>
            Đăng ký
          </Button>
        )}

        {isCompact && canRegister && (
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-full text-[10px]"
            onClick={handleRegister}
          >
            Đăng ký
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
