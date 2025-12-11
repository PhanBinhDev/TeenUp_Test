import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Class } from '@/types/class';
import {
  Calendar,
  Clock,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { getDayName } from '@/lib/utils';
import useModal from '@/hooks/use-modal';

interface ClassCardProps {
  classData: Class;
}

type StatusConfig = {
  [key in Class['status']]: {
    label: string;
    color: string;
  };
};

const STATUS_CONFIG: StatusConfig = {
  active: { label: 'Đang diễn ra', color: 'bg-green-500' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-500' },
  inactive: { label: 'Chưa bắt đầu', color: 'bg-yellow-500' },
  completed: { label: 'Đã hoàn thành', color: 'bg-blue-500' },
  full: { label: 'Đầy lớp', color: 'bg-gray-500' },
};

export function ClassCard({ classData }: ClassCardProps) {
  const { openModal } = useModal();

  const statusConfig = STATUS_CONFIG[classData.status];
  const canDelete = classData.currentStudents === 0;

  return (
    <Card className="overflow-hidden py-0 transition-all hover:shadow-md">
      <CardHeader className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold">
              Lớp: {classData.name}
            </h3>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Môn: {classData.subject}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Badge
              variant="secondary"
              className={`${statusConfig.color} px-2 py-0.5 text-xs text-white`}
            >
              {statusConfig.label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    openModal('ModalUpdateClass', {
                      classId: classData.id,
                      classData,
                    })
                  }
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Chuyển đổi trạng thái */}
                {classData.status !== 'active' && (
                  <DropdownMenuItem
                    onClick={() =>
                      openModal('ModalChangeClassStatus', {
                        classId: classData.id,
                        currentStatus: classData.status,
                        newStatus: 'active',
                      })
                    }
                  >
                    <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
                    Kích hoạt lớp
                  </DropdownMenuItem>
                )}

                {classData.status !== 'cancelled' && (
                  <DropdownMenuItem
                    onClick={() =>
                      openModal('ModalChangeClassStatus', {
                        classId: classData.id,
                        currentStatus: classData.status,
                        newStatus: 'cancelled',
                      })
                    }
                  >
                    <XCircle className="mr-1 h-4 w-4 text-red-600" />
                    Hủy lớp
                  </DropdownMenuItem>
                )}

                {classData.status !== 'completed' && (
                  <DropdownMenuItem
                    onClick={() =>
                      openModal('ModalChangeClassStatus', {
                        classId: classData.id,
                        currentStatus: classData.status,
                        newStatus: 'completed',
                      })
                    }
                  >
                    <Ban className="mr-1 h-4 w-4 text-blue-600" />
                    Hoàn thành lớp
                  </DropdownMenuItem>
                )}

                {classData.status !== 'inactive' && (
                  <DropdownMenuItem
                    onClick={() =>
                      openModal('ModalChangeClassStatus', {
                        classId: classData.id,
                        currentStatus: classData.status,
                        newStatus: 'inactive',
                      })
                    }
                  >
                    <Ban className="mr-1 h-4 w-4 text-yellow-600" />
                    Tạm dừng lớp
                  </DropdownMenuItem>
                )}

                {/* Xóa lớp - chỉ hiện khi không có học sinh */}
                {canDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() =>
                        openModal('ModalRemoveClass', { classId: classData.id })
                      }
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Xóa lớp
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 px-4 pb-4">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>
            {classData.daysOfWeek.map(day => getDayName(day)).join(', ')}
          </span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>{classData.timeSlot}</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Users className="h-3.5 w-3.5 shrink-0" />
          <span>
            {classData.currentStudents}/{classData.maxStudents} học sinh
          </span>
        </div>
        {classData.description && (
          <p className="text-muted-foreground line-clamp-2 pt-1 text-xs">
            {classData.description}
          </p>
        )}
        <div className="pt-2">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Tỷ lệ lấp đầy</span>
            <span className="font-medium">
              {Math.round(
                (classData.currentStudents / classData.maxStudents) * 100,
              )}
              %
            </span>
          </div>
          <div className="bg-secondary h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{
                width: `${(classData.currentStudents / classData.maxStudents) * 100}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ClassCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 px-4 pb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-3.5" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-3.5" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-3.5" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="mt-1 h-8 w-full" />
        <div className="space-y-1 pt-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
