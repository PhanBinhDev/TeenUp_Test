'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Class } from '@/types/class';
import { STATUS_CONFIG } from '@/constants/app';
import useModal from '@/hooks/use-modal';

interface ScheduleClassCardProps {
  classItem: Class;
  isCompact?: boolean;
}

export function ScheduleClassCard({
  classItem,
  isCompact = false,
}: ScheduleClassCardProps) {
  const { openModal } = useModal();

  const handleClick = () => {
    openModal('ModalClassDetail', { classItem });
  };

  return (
    <Card
      className={cn(
        'cursor-pointer overflow-hidden transition-shadow hover:shadow-md',
        isCompact ? 'p-2' : 'p-3',
      )}
      onClick={handleClick}
    >
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-1">
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
          <Badge
            variant="secondary"
            className={cn(
              'shrink-0 text-white',
              STATUS_CONFIG[classItem.status].color,
              isCompact ? 'px-1.5 py-0 text-[9px]' : 'px-2 py-0.5 text-[10px]',
            )}
          >
            {STATUS_CONFIG[classItem.status].label}
          </Badge>
        </div>
        {!isCompact && classItem.teacher?.user && (
          <p className="text-muted-foreground text-xs">
            Giáo viên: {classItem.teacher.user.fullName}
          </p>
        )}
      </div>
    </Card>
  );
}
