import { Uuid } from '@/common/types/common.type';
import { UUIDField } from '@/decorators/field.decorators';

export class RegisterClassDto {
  @UUIDField({ description: 'ID của học sinh' })
  studentId: Uuid;
}
