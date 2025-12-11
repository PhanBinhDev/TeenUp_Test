import { TeacherResDto } from '@/api/teacher/dto/teacher.res.dto';
import { AuditResDto } from '@/common/dto/audit.res.dto';
import { Uuid } from '@/common/types/common.type';
import { ClassStatus } from '@/database/enum/class.enum';
import {
  ClassField,
  EnumFieldOptional,
  NumberField,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '@/decorators/field.decorators';
import { Expose } from 'class-transformer';

export class ClassResDto extends AuditResDto {
  @UUIDField()
  @Expose()
  teacherId: Uuid;

  @StringField()
  @Expose()
  name: string;

  @StringField()
  @Expose()
  subject: string;

  @StringFieldOptional()
  @Expose()
  description?: string | null;

  @NumberField({ isArray: true })
  @Expose()
  daysOfWeek: number[];

  @StringField()
  @Expose()
  timeSlot: string;

  @StringField()
  @Expose()
  startTime: string;

  @StringField()
  @Expose()
  endTime: string;

  @NumberField()
  @Expose()
  maxStudents: number;

  @NumberField()
  @Expose()
  currentStudents: number;

  @EnumFieldOptional(() => ClassStatus)
  @Expose()
  status: ClassStatus;

  @ClassField(() => TeacherResDto, { description: 'Thông tin giáo viên' })
  @Expose()
  teacher: TeacherResDto;
}
