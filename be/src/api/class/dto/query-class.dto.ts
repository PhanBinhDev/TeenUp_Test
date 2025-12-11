import { PageOptionsDto } from '@/common/dto/offset-pagination/page-options.dto';
import { ClassStatus } from '@/database/enum/class.enum';
import {
  DateFieldOptional,
  EnumFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, Max, Min } from 'class-validator';

export class QueryClassDto extends PageOptionsDto {
  @EnumFieldOptional(() => ClassStatus, {
    description: 'Filter by class status',
  })
  status?: ClassStatus;

  @NumberFieldOptional({
    isArray: true,
    description: 'Filter by days of week (0=Sunday, 1=Monday, ..., 6=Saturday)',
  })
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  @ArrayMinSize(1)
  daysOfWeek?: number[];

  @StringFieldOptional({
    description: 'Filter by time slot, e.g., "08:00-09:30"',
  })
  timeSlot?: string;

  @NumberFieldOptional({
    min: 0,
    description: 'Minimum number of students',
  })
  minStudents?: number;

  @NumberFieldOptional({
    min: 0,
    description: 'Maximum number of students',
  })
  maxStudents?: number;

  @DateFieldOptional({
    description: 'Filter classes from this date',
  })
  fromDate?: Date;

  @DateFieldOptional({
    description: 'Filter classes until this date',
  })
  toDate?: Date;
}
