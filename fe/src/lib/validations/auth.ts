import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không được quá 100 ký tự'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số'),
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu không được quá 100 ký tự'),
  role: z.enum(['parent', 'teacher'], {
    message: 'Vai trò người dùng không hợp lệ',
  }),
});

export const teacherRegisterSchema = registerSchema.extend({
  specialization: z
    .string()
    .min(2, 'Chuyên môn là bắt buộc')
    .max(100, 'Chuyên môn không được quá 100 ký tự'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type TeacherRegisterFormData = z.infer<typeof teacherRegisterSchema>;

// Student validation
export const studentSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên học sinh phải có ít nhất 2 ký tự')
    .max(100, 'Tên không được quá 100 ký tự'),
  dob: z
    .string()
    .refine(date => !isNaN(Date.parse(date)), 'Ngày sinh không hợp lệ'),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Giới tính không hợp lệ',
  }),
  currentGrade: z.string().min(1, 'Lớp học là bắt buộc'),
  notes: z.string().optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;

// Class validation
export const classSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên lớp phải có ít nhất 2 ký tự')
    .max(100, 'Tên lớp không được quá 100 ký tự'),
  subject: z.string().min(2, 'Môn học là bắt buộc'),
  dayOfWeek: z.enum(
    [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ],
    {
      message: 'Ngày trong tuần không hợp lệ',
    },
  ),
  timeSlot: z
    .string()
    .regex(
      /^\d{2}:\d{2}-\d{2}:\d{2}$/,
      'Thời gian phải theo định dạng HH:MM-HH:MM',
    ),
  maxStudents: z
    .number()
    .int()
    .min(1, 'Số học sinh tối thiểu là 1')
    .max(50, 'Số học sinh tối đa là 50'),
  room: z.string().optional(),
  description: z.string().optional(),
});

export type ClassFormData = z.infer<typeof classSchema>;

// Subscription validation
export const subscriptionSchema = z.object({
  studentId: z.string().uuid('ID học sinh không hợp lệ'),
  packageName: z.string().min(2, 'Tên gói học là bắt buộc'),
  startDate: z
    .string()
    .refine(date => !isNaN(Date.parse(date)), 'Ngày bắt đầu không hợp lệ'),
  endDate: z
    .string()
    .refine(date => !isNaN(Date.parse(date)), 'Ngày kết thúc không hợp lệ'),
  totalSessions: z.number().int().min(1, 'Số buổi học phải ít nhất là 1'),
  notes: z.string().optional(),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
