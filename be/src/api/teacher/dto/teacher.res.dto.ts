import { UserResDto } from '@/api/users/dto/user.res.dto';
import { AuditResDto } from '@/common/dto/audit.res.dto';
import { Uuid } from '@/common/types/common.type';
import {
  ClassField,
  NumberFieldOptional,
  StringFieldOptional,
  UUIDField,
} from '@/decorators/field.decorators';
import { Expose } from 'class-transformer';

export class TeacherResDto extends AuditResDto {
  @UUIDField()
  @Expose()
  userId: Uuid;

  @StringFieldOptional()
  @Expose()
  specialization: string | null;

  @StringFieldOptional()
  @Expose()
  bio: string | null;

  @NumberFieldOptional()
  @Expose()
  yearsOfExperience: number | null;

  @ClassField(() => UserResDto, { description: 'Thông tin người dùng' })
  @Expose()
  user: UserResDto;
}
