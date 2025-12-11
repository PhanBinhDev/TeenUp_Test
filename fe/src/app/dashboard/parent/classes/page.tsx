'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetClassesForParent } from '@/features/parent/hooks';
import { ClassCardForParent } from '@/features/parent/components/class-card-for-parent';
import { useDebounceValue } from 'usehooks-ts';
import { ClassStatus } from '@/types/enum';
import { ClassCardSkeleton } from '@/features/teacher/components/class-card';

const DAY_OPTIONS = [
  { value: 'all', label: 'Tất cả các ngày' },
  { value: '0', label: 'Chủ nhật' },
  { value: '1', label: 'Thứ hai' },
  { value: '2', label: 'Thứ ba' },
  { value: '3', label: 'Thứ tư' },
  { value: '4', label: 'Thứ năm' },
  { value: '5', label: 'Thứ sáu' },
  { value: '6', label: 'Thứ bảy' },
];

export default function ClassesPage() {
  const [search, setSearch] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const [debouncedSearch] = useDebounceValue(search, 500);

  const { data, isLoading } = useGetClassesForParent({
    search: debouncedSearch || undefined,
    dayOfWeek: dayOfWeek !== 'all' ? Number(dayOfWeek) : undefined,
    status: status !== 'all' ? (status as ClassStatus) : undefined,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Danh sách lớp học</h2>
        <p className="text-muted-foreground text-sm">
          Tìm và đăng ký lớp học phù hợp cho con bạn
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Tìm kiếm lớp học..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Chọn ngày" />
          </SelectTrigger>
          <SelectContent>
            {DAY_OPTIONS.map(day => (
              <SelectItem key={day.value} value={day.value}>
                {day.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value={ClassStatus.ACTIVE}>Đang hoạt động</SelectItem>
            <SelectItem value={ClassStatus.FULL}>Đã đầy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <ClassCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.data?.map(classItem => (
            <ClassCardForParent key={classItem.id} classItem={classItem} />
          ))}
        </div>
      )}

      {!isLoading && data?.data?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-sm">
            Không tìm thấy lớp học nào phù hợp với bộ lọc của bạn.
          </p>
        </div>
      )}
    </div>
  );
}
