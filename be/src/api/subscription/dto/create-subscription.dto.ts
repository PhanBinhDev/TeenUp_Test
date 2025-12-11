import { SubscriptionStatus } from '@/database/enum/subscription.enum';
import {
  DateField,
  EnumFieldOptional,
  NumberField,
  StringField,
  UUIDField,
} from '@/decorators/field.decorators';
import { Min } from 'class-validator';

export class CreateSubscriptionDto {
  @UUIDField({ description: 'ID của học sinh' })
  studentId: string;

  @StringField({
    minLength: 3,
    maxLength: 255,
    description: 'Tên gói học (VD: Gói 20 buổi Toán)',
  })
  packageName: string;

  @DateField({ description: 'Ngày bắt đầu gói học' })
  startDate: Date;

  @DateField({ description: 'Ngày kết thúc gói học' })
  endDate: Date;

  @NumberField({
    min: 1,
    description: 'Tổng số buổi học trong gói',
  })
  @Min(1)
  totalSessions: number;

  @EnumFieldOptional(() => SubscriptionStatus, {
    default: SubscriptionStatus.ACTIVE,
    description: 'Trạng thái gói học',
  })
  status?: SubscriptionStatus;
}
