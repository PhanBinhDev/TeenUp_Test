import { Gender } from "@/types/enum";
import z from "zod";

export const createStudentSchema = z.object({
  name: z.string().min(1, 'Tên học sinh là bắt buộc'),
  dob: z.date({
    error: 'Ngày sinh là bắt buộc',
  }),
  gender: z.nativeEnum(Gender, {
    error: 'Giới tính là bắt buộc',
  }),
  currentGrade: z.string().min(1, 'Khối lớp là bắt buộc'),
});

export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;