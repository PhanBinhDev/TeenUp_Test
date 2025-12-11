'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Calendar, BookOpen, Clock, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useModal from '@/hooks/use-modal';
import {
  useGetTeacherStatistics,
  useGetTodaySchedule,
} from '@/features/teacher/hooks';
import { useRouter } from 'next/navigation';

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { openModal } = useModal();
  const { data: statsData, isLoading } = useGetTeacherStatistics();
  const { data: scheduleData, isLoading: isLoadingSchedule } =
    useGetTodaySchedule();

  const stats = [
    {
      title: 'Tổng lớp học',
      value: statsData?.data?.totalClasses?.toString() || '0',
      icon: BookOpen,
      description: 'Đang giảng dạy',
      color: 'bg-blue-500',
    },
    {
      title: 'Học sinh',
      value: statsData?.data?.totalStudents?.toString() || '0',
      icon: Users,
      description: 'Tổng số học sinh',
      color: 'bg-green-500',
    },
    {
      title: 'Buổi học hôm nay',
      value: statsData?.data?.sessionsToday?.toString() || '0',
      icon: Calendar,
      description: 'Đã lên lịch',
      color: 'bg-purple-500',
    },
    {
      title: 'Giờ dạy tuần này',
      value: statsData?.data?.hoursThisWeek?.toString() || '0',
      icon: Clock,
      description: 'Tổng số giờ',
      color: 'bg-orange-500',
    },
  ];

  return (
    <>
      {/* Content */}
      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="mb-2 h-8 w-16" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))
            : stats.map(stat => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="text-muted-foreground text-sm font-medium">
                      {stat.title}
                    </div>
                    <div className={`${stat.color} rounded-lg p-2 text-white`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-muted-foreground text-xs">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Lịch dạy hôm nay</h2>
          </CardHeader>
          <CardContent>
            {isLoadingSchedule ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </div>
            ) : scheduleData?.data && scheduleData.data.length > 0 ? (
              <div className="space-y-4">
                {scheduleData.data.map(schedule => (
                  <div
                    key={schedule.id}
                    className="hover:bg-accent flex flex-col justify-between gap-3 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{schedule.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {schedule.currentStudents} học sinh
                          {schedule.room && ` • ${schedule.room}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-primary font-medium">
                        {schedule.timeSlot}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                Không có buổi học nào hôm nay
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Thao tác nhanh</h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Button
                variant="outline"
                className="h-auto justify-start gap-3 p-4"
                onClick={() => openModal('ModalAddClass')}
              >
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="font-medium">Tạo lớp học mới</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto justify-start gap-3 p-4"
                onClick={() => {
                  router.push('/dashboard/teacher/attendance');
                }}
              >
                <div className="rounded-lg bg-green-100 p-2 text-green-600">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <span className="font-medium">Điểm danh</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
