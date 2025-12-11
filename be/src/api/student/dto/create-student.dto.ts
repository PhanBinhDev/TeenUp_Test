import { Gender } from '@/database/enum/user.enum';
import {
  DateField,
  EnumField,
  StringField,
} from '@/decorators/field.decorators';

export class CreateStudentDto {
  @StringField({
    minLength: 2,
    maxLength: 100,
    description: 'Tên học sinh',
  })
  name: string;

  @DateField({ description: 'Ngày sinh' })
  dob: Date;

  @EnumField(() => Gender, {
    description: 'Giới tính',
  })
  gender: Gender;

  @StringField({
    minLength: 1,
    maxLength: 20,
    description: 'Khối lớp hiện tại (VD: 1, 2, 10A, 12B)',
  })
  currentGrade: string;
}
