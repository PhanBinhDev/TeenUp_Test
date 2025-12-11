// /Users/p.binh/Workspaces/TeenUp_Test/fe/src/app/dashboard/parent/schedule/page.tsx
'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addWeeks, startOfWeek, format, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  useGetStudents,
  useGetClassRegistrationsByStudent,
} from '@/features/parent/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { DAY_NAMES, TIME_SLOTS } from '@/constants/app';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Class } from '@/types/class';
import { ScheduleClassCard } from '@/features/parent/components/schedule-class-card';
import { useRouter } from 'next/navigation';

export default function SchedulePage() {
  const router = useRouter();

  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 }),
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const { data: studentsData, isLoading: studentsLoading } = useGetStudents();
  const { data: registrationsData, isLoading: registrationsLoading } =
    useGetClassRegistrationsByStudent(selectedStudentId);

  // Auto-select first student
  React.useEffect(() => {
    if (
      studentsData?.data &&
      studentsData.data.length > 0 &&
      !selectedStudentId
    ) {
      setSelectedStudentId(studentsData.data[0].id);
    }
  }, [studentsData, selectedStudentId]);

  const handlePreviousWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, -1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const getClassesForDayAndTime = (dayOfWeek: number, timeSlot: string) => {
    if (!registrationsData) return [];
    return registrationsData
      .map(reg => reg.class)
      .filter(
        (cls): cls is Class =>
          cls !== undefined &&
          cls.daysOfWeek.includes(dayOfWeek) &&
          cls.timeSlot === timeSlot,
      );
  };

  const isLoading = studentsLoading || registrationsLoading;
  const selectedStudent = studentsData?.data?.find(
    s => s.id === selectedStudentId,
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Lịch học của con
          </h2>
          <p className="text-muted-foreground text-sm">
            Xem lịch học đã đăng ký theo tuần
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousWeek}
            disabled={isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextWeek}
            disabled={isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Student Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Chọn học sinh:</label>
        <Select
          value={selectedStudentId}
          onValueChange={setSelectedStudentId}
          disabled={studentsLoading}
        >
          <SelectTrigger className="w-[250px]">
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

      {/* Week Range */}
      <div className="text-muted-foreground text-sm">
        Tuần: {format(currentWeekStart, 'dd/MM/yyyy', { locale: vi })} -{' '}
        {format(addDays(currentWeekStart, 6), 'dd/MM/yyyy', { locale: vi })}
      </div>

      {!selectedStudentId ? (
        <Card>
          <CardContent className="flex h-[400px] items-center justify-center">
            <p className="text-muted-foreground">
              Vui lòng chọn học sinh để xem lịch học
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-8 gap-0">
              {/* Header row */}
              <div className="bg-muted border-r border-b p-3 text-sm font-semibold">
                Giờ học
              </div>
              {DAY_NAMES.map((day, index) => (
                <div
                  key={index}
                  className="bg-muted border-b p-3 text-center text-sm font-semibold"
                >
                  {day}
                  <div className="text-muted-foreground text-xs font-normal">
                    {format(addDays(currentWeekStart, index), 'dd/MM', {
                      locale: vi,
                    })}
                  </div>
                </div>
              ))}

              {/* Time slot rows */}
              {TIME_SLOTS.map(timeSlot => (
                <React.Fragment key={timeSlot}>
                  <div className="bg-muted/50 flex items-center justify-center border-r border-b p-2 text-sm font-medium">
                    {timeSlot}
                  </div>
                  {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => {
                    const classes = getClassesForDayAndTime(
                      dayOfWeek,
                      timeSlot,
                    );
                    const hasMultiple = classes.length > 1;

                    return (
                      <div
                        key={`${dayOfWeek}-${timeSlot}`}
                        className="relative min-h-[100px] border-r border-b p-2"
                      >
                        {isLoading ? (
                          <Skeleton className="h-full w-full" />
                        ) : classes.length === 0 ? (
                          <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
                            -
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {classes.map((cls: Class) => (
                              <ScheduleClassCard
                                key={cls.id}
                                classItem={cls}
                                isCompact={hasMultiple}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state when student has no classes */}
      {selectedStudentId && !isLoading && registrationsData?.length === 0 && (
        <Card>
          <CardContent className="flex h-[200px] flex-col items-center justify-center gap-2">
            <p className="text-muted-foreground">
              {selectedStudent?.name} chưa đăng ký lớp học nào
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push('/dashboard/parent/classes');
              }}
            >
              Đăng ký lớp học
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
