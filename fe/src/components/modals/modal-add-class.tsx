'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useModal from '@/hooks/use-modal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DAY_OF_WEEK_LABELS, DayOfWeek } from '@/types/class';
import { Textarea } from '@/components/ui/textarea';
import {
  CreateClassFormData,
  createClassSchema,
} from '@/lib/validations/class';
import { useCreateClassForTeacher } from '@/features/teacher/hooks';
import { Checkbox } from '@/components/ui/checkbox';

const DAY_OF_WEEK_MAP: Record<DayOfWeek, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const ModalAddClass = () => {
  const { isModalOpen, closeModal } = useModal();
  const open = isModalOpen('ModalAddClass');
  const { mutateAsync: createClass, isPending } = useCreateClassForTeacher();

  const form = useForm<CreateClassFormData>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      name: '',
      subject: '',
      daysOfWeek: [],
      timeSlot: '',
      maxStudents: 30,
      description: '',
    },
  });

  const onSubmit = async (data: CreateClassFormData) => {
    try {
      await createClass(data);
      closeModal('ModalAddClass');
      form.reset();
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const onOpenChange = () => {
    closeModal('ModalAddClass');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo lớp học mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để tạo lớp học mới cho học sinh
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên lớp</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Toán 10A1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Môn học</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Toán, Lý, Hóa..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="daysOfWeek"
              render={() => (
                <FormItem>
                  <FormLabel>Ngày học trong tuần</FormLabel>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(DAY_OF_WEEK_LABELS).map(([key, label]) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name="daysOfWeek"
                        render={({ field }) => {
                          const dayNumber = DAY_OF_WEEK_MAP[key as DayOfWeek];
                          return (
                            <FormItem className="flex items-center space-y-0 space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(dayNumber)}
                                  onCheckedChange={checked => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange(
                                        [...currentValues, dayNumber].sort(),
                                      );
                                    } else {
                                      field.onChange(
                                        currentValues.filter(
                                          val => val !== dayNumber,
                                        ),
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="cursor-pointer text-sm font-normal">
                                {label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeSlot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khung giờ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn giờ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="08:00-09:30">08:00 - 09:30</SelectItem>
                      <SelectItem value="10:00-11:30">10:00 - 11:30</SelectItem>
                      <SelectItem value="14:00-15:30">14:00 - 15:30</SelectItem>
                      <SelectItem value="16:00-17:30">16:00 - 17:30</SelectItem>
                      <SelectItem value="18:00-19:30">18:00 - 19:30</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxStudents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng học sinh tối đa</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="30"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả về lớp học..."
                      {...field}
                      className="max-h-[140px] min-h-[80px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onOpenChange}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} loading={isPending}>
                Tạo lớp
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddClass;
