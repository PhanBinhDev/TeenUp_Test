import z from 'zod';

export const createClassSchema = z.object({
  name: z.string().min(3, 'Tên lớp phải có ít nhất 3 ký tự'),
  subject: z.string().min(2, 'Môn học không được để trống'),
  daysOfWeek: z
    .array(z.number().min(0).max(6))
    .min(1, 'Vui lòng chọn ít nhất 1 ngày'),
  timeSlot: z.string().min(1, 'Vui lòng chọn khung giờ'),
  maxStudents: z
    .number()
    .min(1, 'Số lượng học sinh tối thiểu là 1')
    .max(50, 'Tối đa 50 học sinh'),
  description: z.string().optional(),
});

export type CreateClassFormData = z.infer<typeof createClassSchema>;
