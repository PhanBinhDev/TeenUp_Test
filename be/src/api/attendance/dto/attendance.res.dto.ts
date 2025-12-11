import { StudentResDto } from '@/api/student/dto/student.res.dto';
import { AuditResDto } from '@/common/dto/audit.res.dto';
import { AttendanceStatus } from '@/database/enum/class.enum';
import { ClassField } from '@/decorators/field.decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AttendanceResDto extends AuditResDto {
  @ApiProperty()
  @Expose()
  classRegistrationId: string;

  @ApiProperty()
  @Expose()
  subscriptionId: string;

  @ApiProperty()
  @Expose()
  attendanceDate: string;

  @ApiProperty({ enum: AttendanceStatus })
  @Expose()
  status: AttendanceStatus;

  @ApiProperty()
  @Expose()
  notes: string | null;

  @ApiProperty()
  @Expose()
  markedById: string | null;

  @ClassField(() => StudentResDto, {
    description: 'Thông tin học sinh',
  })
  @Expose()
  student?: StudentResDto;
}
