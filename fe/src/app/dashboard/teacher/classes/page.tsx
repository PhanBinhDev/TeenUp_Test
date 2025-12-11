/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Input } from '@/components/ui/input';
import { Search, Filter, X, CalendarIcon } from 'lucide-react';
import { DAY_OF_WEEK_LABELS, DayOfWeek } from '@/types/class';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ClassCard,
  ClassCardSkeleton,
} from '@/features/teacher/components/class-card';
import { Button } from '@/components/ui/button';
import useModal from '@/hooks/use-modal';
import { useCallback, useState } from 'react';
import { IFilterClassParams } from '@/types/base';
import { DEFAULT_LIMIT, STATUS_CONFIG, TIME_SLOTS } from '@/constants/app';
import { useGetClassesForTeacher } from '@/features/teacher/hooks';
import { useDebounceValue } from 'usehooks-ts';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { vi } from 'date-fns/locale';

const DAY_TO_NUMBER: Record<DayOfWeek, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

// Map number to day name for UI
const NUMBER_TO_DAY: Record<number, DayOfWeek> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

const TeacherClasses = () => {
  const { openModal } = useModal();
  const [searchInput, setSearchInput] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [debouncedSearch] = useDebounceValue(searchInput, 500);
  const [filters, setFilters] = useState<IFilterClassParams>({
    page: 1,
    limit: DEFAULT_LIMIT,
  });

  const { data, isLoading } = useGetClassesForTeacher({
    ...filters,
    search: debouncedSearch,
    fromDate: dateRange?.from
      ? format(dateRange.from, 'yyyy-MM-dd')
      : undefined,
    toDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
  });

  const updateFilter = useCallback(
    (key: keyof IFilterClassParams, value: any) => {
      setFilters(prev => ({
        ...prev,
        [key]: value === 'all' ? undefined : value,
      }));
    },
    [],
  );

  const clearFilters = () => {
    setFilters({ page: 1, limit: DEFAULT_LIMIT });
    setSearchInput('');
    setDateRange(undefined);
  };

  const activeFilterCount =
    Object.values(filters).filter(
      v => v !== undefined && v !== 1 && v !== DEFAULT_LIMIT,
    ).length +
    (debouncedSearch ? 1 : 0) +
    (dateRange?.from ? 1 : 0);

  return (
    <>
      {/* Content */}
      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Filters and Actions */}
        <div className="space-y-4">
          {/* Row 1: Search + Create Button */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Tìm kiếm lớp học..."
                className="pl-9"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                  onClick={() => setSearchInput('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button onClick={() => openModal('ModalAddClass')}>
              Tạo lớp học mới
            </Button>
          </div>

          {/* Row 2: Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <Filter className="h-4 w-4" />
              <span>Lọc:</span>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !dateRange && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'dd/MM/yyyy', { locale: vi })} -{' '}
                        {format(dateRange.to, 'dd/MM/yyyy', { locale: vi })}
                      </>
                    ) : (
                      format(dateRange.from, 'dd/MM/yyyy', { locale: vi })
                    )
                  ) : (
                    <span>Chọn khoảng thời gian</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={vi}
                />
                {dateRange?.from && (
                  <div className="border-t p-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setDateRange(undefined)}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Xóa
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* Status Filter */}
            <Select
              value={filters.status || 'all'}
              onValueChange={value => updateFilter('status', value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Day Filter */}
            <Select
              value={
                filters.dayOfWeek !== undefined
                  ? NUMBER_TO_DAY[filters.dayOfWeek]
                  : 'all'
              }
              onValueChange={value => {
                if (value === 'all') {
                  updateFilter('dayOfWeek', undefined);
                } else {
                  updateFilter('dayOfWeek', DAY_TO_NUMBER[value as DayOfWeek]);
                }
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Ngày trong tuần" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả các ngày</SelectItem>
                {Object.entries(DAY_OF_WEEK_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Time Slot Filter */}
            <Select
              value={filters.timeSlot || 'all'}
              onValueChange={value => updateFilter('timeSlot', value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Khung giờ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khung giờ</SelectItem>
                {TIME_SLOTS.map(slot => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-9"
              >
                <X className="mr-1 h-4 w-4" />
                Xóa bộ lọc ({activeFilterCount})
              </Button>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Danh sách lớp học</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <>
                {Array.from({ length: 6 }).map((_, index) => (
                  <ClassCardSkeleton key={index} />
                ))}
              </>
            ) : !data?.data.length ? (
              <>
                <div className="border-muted-foreground col-span-full flex h-48 flex-col items-center justify-center">
                  <p className="text-muted-foreground">Không có lớp học nào.</p>
                  {activeFilterCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="mt-2"
                    >
                      Xóa bộ lọc
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                {data?.data.map(classData => (
                  <ClassCard key={classData.id} classData={classData} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherClasses;
