import z from 'zod';

export const subscriptionFormSchema = z.object({
  studentId: z.string().min(1, 'Vui lòng chọn học sinh'),
  packageName: z.string().min(1, 'Vui lòng chọn gói học'),
  startDate: z.date({
    error: 'Vui lòng chọn ngày bắt đầu',
  }),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;
