import { Expose } from 'class-transformer';

export class AuthResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    phone?: string;
    avatarUrl?: string;
  };
}
