import { PageOptionsDto } from '@/common/dto/offset-pagination/page-options.dto';
import { SubscriptionStatus } from '@/database/enum/subscription.enum';
import {
  DateFieldOptional,
  EnumFieldOptional,
  UUIDFieldOptional,
} from '@/decorators/field.decorators';

export class QuerySubscriptionDto extends PageOptionsDto {
  @UUIDFieldOptional({ description: 'Lọc theo ID học sinh' })
  studentId?: string;

  @EnumFieldOptional(() => SubscriptionStatus, {
    description: 'Lọc theo trạng thái gói học',
  })
  status?: SubscriptionStatus;

  @DateFieldOptional({ description: 'Lọc gói học từ ngày' })
  fromDate?: Date;

  @DateFieldOptional({ description: 'Lọc gói học đến ngày' })
  toDate?: Date;
}
