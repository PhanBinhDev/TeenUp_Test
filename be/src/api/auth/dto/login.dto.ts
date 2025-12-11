import { EmailField, PasswordField } from '@/decorators/field.decorators';

export class LoginDto {
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
}
