import { PageOptionsDto } from '@/common/dto/offset-pagination/page-options.dto';
import { Gender } from '@/database/enum/user.enum';
import {
  EnumFieldOptional,
  StringFieldOptional,
  UUIDFieldOptional,
} from '@/decorators/field.decorators';

export class QueryStudentDto extends PageOptionsDto {
  @UUIDFieldOptional({ description: 'Lọc theo ID phụ huynh' })
  parentId?: string;

  @EnumFieldOptional(() => Gender, {
    description: 'Lọc theo giới tính',
  })
  gender?: Gender;

  @StringFieldOptional({
    description: 'Lọc theo khối lớp (VD: 1, 10A, 12B)',
  })
  currentGrade?: string;
}
