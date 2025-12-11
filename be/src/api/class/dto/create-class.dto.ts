import { ClassStatus } from '@/database/enum/class.enum';
import {
  EnumFieldOptional,
  NumberField,
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, Max, Min } from 'class-validator';

export class CreateClassDto {
  @StringField({
    description: 'Name of the class',
    maxLength: 100,
    example: 'Lớp học toán nâng cao',
  })
  name: string;

  @StringField({
    description: 'Subject of the class',
    maxLength: 100,
    example: 'Toán học',
  })
  subject: string;

  @StringFieldOptional({
    description: 'Description of the class',
    maxLength: 255,
    example: 'Lớp học toán nâng cao dành cho học sinh lớp 10',
  })
  description?: string;

  @ApiProperty({
    description: 'Days of the week (0=Sunday, 1=Monday, ..., 6=Saturday)',
    example: [1, 3, 5],
    type: [Number],
    isArray: true,
  })
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  @ArrayMinSize(1, { message: 'Phải chọn ít nhất 1 ngày trong tuần' })
  daysOfWeek: number[];

  @StringField({
    description: 'Time slot of the class, e.g., "08:00-09:30"',
    example: '08:00-09:30',
  })
  timeSlot: string;

  @NumberField({
    min: 1,
    max: 50,
    description: 'Maximum number of students allowed in the class',
  })
  maxStudents: number;

  @EnumFieldOptional(() => ClassStatus, {
    description: 'Status of the class',
  })
  status?: ClassStatus;
}
