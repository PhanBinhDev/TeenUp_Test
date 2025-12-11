import { ClassStatus } from '@/database/enum/class.enum';
import { EnumField } from '@/decorators/field.decorators';

export class ChangeStatusClassDto {
  @EnumField(() => ClassStatus, {
    description: 'New status of the class',
  })
  status: ClassStatus;
}
