import { UserRole } from '@/database/enum/user.enum';
import {
  EmailField,
  EnumField,
  NumberFieldOptional,
  PasswordField,
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { Matches } from 'class-validator';

export class RegisterDto {
  @EmailField({
    name: 'Email',
    description: 'The email address of the user',
  })
  email: string;

  @PasswordField({
    name: 'Password',
    description: 'The password for the user account',
  })
  password: string;

  @StringField({
    name: 'Full Name',
    description: 'The full name of the user',
  })
  fullName: string;

  @StringFieldOptional({
    name: 'Phone Number',
    description: 'The phone number of the user',
  })
  @Matches(/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/, {
    message: 'phone must be a valid Vietnamese phone number',
  })
  phone?: string;

  @EnumField(() => UserRole, {
    name: 'User Role',
    description: 'The role of the user (e.g., PARENT, TEACHER)',
  })
  role: UserRole;

  @StringFieldOptional({
    name: 'Address',
    description: 'The address of the parent',
  })
  address?: string;

  @StringFieldOptional({
    name: 'Occupation',
    description: 'The occupation of the parent',
  })
  occupation?: string;

  @StringFieldOptional({
    name: 'Specialization',
    description: 'The specialization of the teacher',
  })
  specialization?: string;

  @StringFieldOptional({
    name: 'Bio',
    description: 'The bio of the teacher',
  })
  bio?: string;

  @NumberFieldOptional({
    name: 'Years of Experience',
    description: 'The number of years of experience the teacher has',
  })
  yearsOfExperience?: number;
}
