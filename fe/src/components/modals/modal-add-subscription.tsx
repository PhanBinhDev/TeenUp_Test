'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, addMonths } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useModal from '@/hooks/use-modal';
import { useGetStudents } from '@/features/parent/hooks';
import { cn } from '@/lib/utils';
import { vi } from 'date-fns/locale';
import { PACKAGE_OPTIONS } from '@/constants/app';
import {
  subscriptionFormSchema,
  SubscriptionFormValues,
} from '@/lib/validations/subscription';
import { useCreateSubscription } from '@/features/subscriptions/hooks';

export function ModalAddSubscription() {
  const { isModalOpen, closeModal } = useModal();
  const isOpen = isModalOpen('ModalAddSubscription');
  const { mutate: createSubscription, isPending } = useCreateSubscription();
  const { data: studentsData } = useGetStudents();

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      studentId: '',
      packageName: '',
    },
  });

  const startDate = form.watch('startDate');
  const packageName = form.watch('packageName');

  const selectedPackage = PACKAGE_OPTIONS.find(
    pkg => pkg.value === packageName,
  );

  const endDate =
    startDate && selectedPackage
      ? addMonths(startDate, selectedPackage.durationMonths)
      : null;

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = (values: SubscriptionFormValues) => {
    if (!selectedPackage || !endDate) return;

    createSubscription(
      {
        studentId: values.studentId,
        packageName: values.packageName,
        startDate: values.startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalSessions: selectedPackage.sessions,
      },
      {
        onSuccess: () => {
          closeModal('ModalAddSubscription');
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => closeModal('ModalAddSubscription')}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mua gói học mới</DialogTitle>
          <DialogDescription>
            Chọn gói học phù hợp cho học sinh
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Học sinh</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn học sinh" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {studentsData?.data?.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} - Lớp {student.currentGrade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="packageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gói học</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn gói học" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PACKAGE_OPTIONS.map(pkg => (
                        <SelectItem key={pkg.value} value={pkg.value}>
                          <div className="flex flex-col items-start">
                            <span>{pkg.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPackage && (
                    <FormDescription>
                      {selectedPackage.sessions} buổi học - Thời hạn{' '}
                      {selectedPackage.durationMonths} tháng
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ngày bắt đầu</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'dd/MM/yyyy', { locale: vi })
                          ) : (
                            <span>Chọn ngày bắt đầu</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                        locale={vi}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Auto-calculated end date display */}
            {startDate && endDate && selectedPackage && (
              <div className="bg-muted space-y-2 rounded-md p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ngày kết thúc:</span>
                  <span className="font-medium">
                    {format(endDate, 'dd/MM/yyyy', { locale: vi })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Thời hạn:</span>
                  <span className="font-medium">
                    {selectedPackage.durationMonths} tháng
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Số buổi:</span>
                  <span className="font-medium">
                    {selectedPackage.sessions} buổi
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => closeModal('ModalAddSubscription')}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} loading={isPending}>
                Mua gói học
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
