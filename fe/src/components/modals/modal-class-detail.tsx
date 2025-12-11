'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import useModal from '@/hooks/use-modal';
import { Class } from '@/types/class';
import { STATUS_CONFIG } from '@/constants/app';
import { Calendar, Clock, Users, BookOpen, User, FileText } from 'lucide-react';
import { getDayName } from '@/lib/utils';

export function ModalClassDetail() {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const isOpen = isModalOpen('ModalClassDetail');
  const { classItem } = (getModalData('ModalClassDetail') as {
    classItem: Class;
  }) || { classItem: null };

  if (!classItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => closeModal('ModalClassDetail')}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chi tiết lớp học</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Class Header */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold">{classItem.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {classItem.subject}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={`${STATUS_CONFIG[classItem.status].color} text-white`}
              >
                {STATUS_CONFIG[classItem.status].label}
              </Badge>
            </div>
          </div>

          {/* Class Info Card */}
          <Card>
            <CardContent className="grid gap-3 p-4">
              {/* Teacher */}
              {classItem.teacher?.user && (
                <div className="flex items-start gap-3">
                  <User className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground text-sm">Giáo viên</p>
                    <p className="font-medium">
                      {classItem.teacher.user.fullName}
                    </p>
                    {classItem.teacher.specialization && (
                      <p className="text-muted-foreground text-xs">
                        Chuyên môn: {classItem.teacher.specialization}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Subject */}
              <div className="flex items-start gap-3">
                <BookOpen className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground text-sm">Môn học</p>
                  <p className="font-medium">{classItem.subject}</p>
                </div>
              </div>

              {/* Schedule */}
              <div className="flex items-start gap-3">
                <Calendar className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground text-sm">Lịch học</p>
                  <p className="font-medium">
                    {classItem.daysOfWeek.map(day => getDayName(day)).join(', ')}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3">
                <Clock className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground text-sm">Giờ học</p>
                  <p className="font-medium">{classItem.timeSlot}</p>
                </div>
              </div>

              {/* Students */}
              <div className="flex items-start gap-3">
                <Users className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground text-sm">Sĩ số</p>
                  <p className="font-medium">
                    {classItem.currentStudents}/{classItem.maxStudents} học sinh
                  </p>
                  <div className="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{
                        width: `${(classItem.currentStudents / classItem.maxStudents) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              {classItem.description && (
                <div className="flex items-start gap-3">
                  <FileText className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground text-sm">Mô tả</p>
                    <p className="text-sm">{classItem.description}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
