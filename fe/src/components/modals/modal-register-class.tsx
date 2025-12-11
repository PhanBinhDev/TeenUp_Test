'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import useModal from '@/hooks/use-modal';
import { useGetStudents, useRegisterClass } from '@/features/parent/hooks';
import { Class } from '@/types/class';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calendar, Clock, Users, BookOpen } from 'lucide-react';
import { SubscriptionStatus } from '@/types/subscription';
import { getDayName } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useGetSubscriptions } from '@/features/subscriptions/hooks';

export function ModalRegisterClass() {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const isOpen = isModalOpen('ModalRegisterClass');
  const classItem = getModalData('ModalRegisterClass') as Class | undefined;

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  const { data: studentsData } = useGetStudents();
  const { mutate: registerClass, isPending } = useRegisterClass();

  const { data: subscriptionsData } = useGetSubscriptions({
    studentId: selectedStudentId,
    status: SubscriptionStatus.ACTIVE,
  });

  useEffect(() => {
    if (!isOpen) {
      setSelectedStudentId('');
      setValidationError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedStudentId && subscriptionsData) {
      const hasActiveSubscription =
        subscriptionsData.data &&
        subscriptionsData.data.length > 0 &&
        subscriptionsData.data.some(sub => sub.remainingSessions > 0);

      if (!hasActiveSubscription) {
        setValidationError(
          'Học sinh này chưa có gói học hoặc đã hết buổi học. Vui lòng mua gói học trước.',
        );
      } else {
        setValidationError('');
      }
    }
  }, [selectedStudentId, subscriptionsData]);

  const handleConfirm = () => {
    if (!selectedStudentId || !classItem) return;

    if (validationError) {
      return;
    }

    registerClass({
      classId: classItem.id,
      payload: { studentId: selectedStudentId },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => closeModal('ModalRegisterClass')}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Đăng ký lớp học</DialogTitle>
          <DialogDescription>
            Chọn học sinh để đăng ký vào lớp học
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Class Information Card */}
          {classItem && (
            <Card className="py-0">
              <CardContent className="space-y-3 p-4">
                <div>
                  <h3 className="text-base font-semibold">{classItem.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {classItem.subject}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-muted-foreground">Giáo viên:</span>
                  </div>
                  <div className="font-medium">
                    {classItem?.teacher?.user.fullName}
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-muted-foreground">Ngày học:</span>
                  </div>
                  <div className="font-medium">
                    {classItem.daysOfWeek.map(day => getDayName(day)).join(', ')}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-muted-foreground">Giờ học:</span>
                  </div>
                  <div className="font-medium">{classItem.timeSlot}</div>

                  <div className="flex items-center gap-2">
                    <Users className="text-muted-foreground h-4 w-4 shrink-0" />
                    <span className="text-muted-foreground">Sĩ số:</span>
                  </div>
                  <div className="font-medium">
                    {classItem.currentStudents}/{classItem.maxStudents} học sinh
                  </div>
                </div>

                {classItem.description && (
                  <div className="border-t pt-2">
                    <p className="text-muted-foreground text-sm">
                      {classItem.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Student Selection */}
          <div className="space-y-2">
            <Label htmlFor="student">Chọn học sinh</Label>
            <Select
              value={selectedStudentId}
              onValueChange={setSelectedStudentId}
              disabled={isPending}
            >
              <SelectTrigger id="student" className="w-full">
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

          {/* Validation Error */}
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => closeModal('ModalRegisterClass')}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending || !selectedStudentId || !!validationError}
            loading={isPending}
          >
            Đăng ký
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
