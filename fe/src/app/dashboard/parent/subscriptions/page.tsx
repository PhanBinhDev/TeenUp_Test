'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetStudents } from '@/features/parent/hooks';
import {
  SubscriptionCard,
  SubscriptionCardSkeleton,
} from '@/features/subscriptions/components/subscription-card';
import useModal from '@/hooks/use-modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { SubscriptionStatus } from '@/types/subscription';
import { useGetSubscriptions } from '@/features/subscriptions/hooks';

export default function SubscriptionsPage() {
  const { openModal } = useModal();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const { data: studentsData } = useGetStudents();
  const { data, isLoading } = useGetSubscriptions({
    studentId: selectedStudentId !== 'all' ? selectedStudentId : undefined,
    status:
      selectedStatus !== 'all'
        ? (selectedStatus as SubscriptionStatus)
        : undefined,
  });

  const handleAddSubscription = () => {
    openModal('ModalAddSubscription');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gói học</h2>
          <p className="text-muted-foreground text-sm">
            Quản lý gói học của học sinh
          </p>
        </div>
        <Button onClick={handleAddSubscription}>
          <Plus className="h-4 w-4" />
          Mua gói học
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 items-center gap-2">
          <Select
            value={selectedStudentId}
            onValueChange={setSelectedStudentId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn học sinh" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả học sinh</SelectItem>
              {studentsData?.data?.map(student => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value={SubscriptionStatus.ACTIVE}>
                Đang hoạt động
              </SelectItem>
              <SelectItem value={SubscriptionStatus.COMPLETED}>
                Hoàn thành
              </SelectItem>
              <SelectItem value={SubscriptionStatus.EXPIRED}>
                Hết hạn
              </SelectItem>
              <SelectItem value={SubscriptionStatus.CANCELLED}>
                Đã hủy
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SubscriptionCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.data?.map(subscription => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
            />
          ))}
        </div>
      )}

      {!isLoading && data?.data?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-sm">
            Chưa có gói học nào. Nhấn nút &quot;Mua gói học&quot; để bắt đầu.
          </p>
        </div>
      )}
    </div>
  );
}
