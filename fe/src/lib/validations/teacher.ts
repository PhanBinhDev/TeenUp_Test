import z from 'zod';

export const teacherProfileSchema = z.object({
  // User fields
  fullName: z.string().min(3, 'Tên phải có ít nhất 3 ký tự').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  // Teacher fields
  specialization: z.string().max(100).optional(),
  yearsOfExperience: z.number().min(0).max(50).optional(),
  bio: z.string().optional(),
});

export type TeacherProfileFormData = z.infer<typeof teacherProfileSchema>;
