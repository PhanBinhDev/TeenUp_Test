import { ClassResDto } from '@/api/class/dto/class.res.dto';
import { AuditResDto } from '@/common/dto/audit.res.dto';
import { RegistrationStatus } from '@/database/enum/class.enum';
import { ClassField } from '@/decorators/field.decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ClassRegistrationResDto extends AuditResDto {
  @ApiProperty()
  @Expose()
  classId: string;

  @ApiProperty()
  @Expose()
  studentId: string;

  @ApiProperty()
  @Expose()
  registeredAt: Date;

  @ApiProperty({ enum: RegistrationStatus })
  @Expose()
  status: RegistrationStatus;

  @ClassField(() => ClassResDto, {
    description: 'Thông tin lớp học',
  })
  @Expose()
  class: ClassResDto;
}
