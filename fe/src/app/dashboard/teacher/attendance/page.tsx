'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  useGetClassesForTeacher,
  useGetAttendance,
  useMarkAttendance,
} from '@/features/teacher/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, getDayName } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TeacherAttendancePage() {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: classesData, isLoading: isLoadingClasses } =
    useGetClassesForTeacher({});
  const { data: attendanceData, isLoading: isLoadingAttendance } =
    useGetAttendance(selectedClassId, format(selectedDate, 'yyyy-MM-dd'));
  const { mutate: markAttendance, isPending: isMarking } = useMarkAttendance();

  const selectedClass = classesData?.data?.find(
    cls => cls.id === selectedClassId,
  );

  const isValidDay = useMemo(() => {
    if (!selectedClass || !selectedDate) return true;
    const selectedDay = new Date(selectedDate).getDay();
    return selectedClass.daysOfWeek.includes(selectedDay);
  }, [selectedClass, selectedDate]);

  const validDaysText = useMemo(() => {
    if (!selectedClass) return '';
    return selectedClass.daysOfWeek.map(day => getDayName(day)).join(', ');
  }, [selectedClass]);

  const stats = useMemo(() => {
    if (!attendanceData?.data) {
      return { total: 0, present: 0, absent: 0, late: 0 };
    }

    const total = attendanceData.data.length;
    const present = attendanceData.data.filter(
      a => a.status === 'present',
    ).length;
    const absent = attendanceData.data.filter(
      a => a.status === 'absent',
    ).length;
    const late = attendanceData.data.filter(a => a.status === 'late').length;

    return { total, present, absent, late };
  }, [attendanceData]);

  const handleMarkAttendance = (
    classRegistrationId: string,
    status: 'present' | 'absent' | 'late',
  ) => {
    markAttendance({
      classRegistrationId,
      attendanceDate: format(selectedDate, 'yyyy-MM-dd'),
      status,
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Điểm danh</h2>
        <p className="text-muted-foreground text-sm">
          Quản lý điểm danh học sinh theo lớp học
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Chọn lớp học</label>
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn lớp học để điểm danh" />
            </SelectTrigger>
            <SelectContent>
              {classesData?.data?.map(cls => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} - {cls.subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedClass && (
            <p className="text-muted-foreground mt-1 text-xs">
              Lịch học: {validDaysText} ({selectedClass.timeSlot})
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Chọn ngày</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !selectedDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, 'dd/MM/yyyy', { locale: vi })
                ) : (
                  <span>Chọn ngày</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={date => date && setSelectedDate(date)}
                locale={vi}
                disabled={date => date > new Date()}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Valid Day Warning */}
      {selectedClassId && !isValidDay && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Lớp học này chỉ học vào các ngày: <strong>{validDaysText}</strong>.
            Vui lòng chọn ngày phù hợp để điểm danh.
          </AlertDescription>
        </Alert>
      )}

      {/* Class Info */}
      {selectedClassId && isValidDay && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Tổng học sinh
              </CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Có mặt
              </CardDescription>
              <CardTitle className="text-3xl text-green-500">
                {stats.present}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Vắng mặt
              </CardDescription>
              <CardTitle className="text-3xl text-red-500">
                {stats.absent}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                Đi muộn
              </CardDescription>
              <CardTitle className="text-3xl text-orange-500">
                {stats.late}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Attendance Table */}
      {isLoadingClasses ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : !selectedClassId ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <CalendarIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">
                Chọn lớp học để điểm danh
              </h3>
              <p className="text-muted-foreground text-sm">
                Vui lòng chọn lớp học từ danh sách bên trên
              </p>
            </div>
          </CardContent>
        </Card>
      ) : isLoadingAttendance ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : !isValidDay ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <CalendarIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">Ngày không hợp lệ</h3>
              <p className="text-muted-foreground text-sm">
                Lớp học này chỉ học vào: {validDaysText}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : !attendanceData?.data || attendanceData.data.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">
                Chưa có học sinh trong lớp
              </h3>
              <p className="text-muted-foreground text-sm">
                Lớp học này chưa có học sinh đăng ký
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Điểm danh - {selectedClass?.name}</span>
              <Badge variant="outline">
                {format(selectedDate, 'dd/MM/yyyy', { locale: vi })}
              </Badge>
            </CardTitle>
            <CardDescription>
              Điểm danh cho {stats.total} học sinh
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Họ và tên</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.data.map((attendance, index) => {
                    const statusColor = attendance.status
                      ? attendance.status === 'present'
                        ? 'text-green-600 bg-green-50'
                        : attendance.status === 'late'
                          ? 'text-orange-600 bg-orange-50'
                          : 'text-red-600 bg-red-50'
                      : '';

                    const statusText = attendance.status
                      ? attendance.status === 'present'
                        ? 'Có mặt'
                        : attendance.status === 'late'
                          ? 'Đi muộn'
                          : 'Vắng mặt'
                      : 'Chưa điểm danh';

                    return (
                      <TableRow key={attendance.classRegistrationId}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          {attendance.student?.name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={attendance.status ? 'default' : 'outline'}
                            className={statusColor}
                          >
                            {statusText}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant={
                                attendance.status === 'present'
                                  ? 'default'
                                  : 'outline'
                              }
                              className="h-8"
                              onClick={() =>
                                handleMarkAttendance(
                                  attendance.classRegistrationId,
                                  'present',
                                )
                              }
                              disabled={isMarking}
                            >
                              <CheckCircle2 className="mr-1 h-4 w-4" />
                              Có mặt
                            </Button>
                            <Button
                              size="sm"
                              variant={
                                attendance.status === 'late'
                                  ? 'default'
                                  : 'outline'
                              }
                              className="h-8"
                              onClick={() =>
                                handleMarkAttendance(
                                  attendance.classRegistrationId,
                                  'late',
                                )
                              }
                              disabled={isMarking}
                            >
                              <Clock className="mr-1 h-4 w-4" />
                              Muộn
                            </Button>
                            <Button
                              size="sm"
                              variant={
                                attendance.status === 'absent'
                                  ? 'default'
                                  : 'outline'
                              }
                              className="h-8"
                              onClick={() =>
                                handleMarkAttendance(
                                  attendance.classRegistrationId,
                                  'absent',
                                )
                              }
                              disabled={isMarking}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Vắng
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
