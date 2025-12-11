import { AuditResDto } from '@/common/dto/audit.res.dto';
import { UserRole } from '@/database/enum/user.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResDto extends AuditResDto {
  @ApiProperty({ example: 'john.doe@email.com' })
  @Expose()
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.PARENT })
  @Expose()
  role: UserRole;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @Expose()
  fullName: string;

  @ApiProperty({ example: '0865294312', required: false })
  @Expose()
  phone: string | null;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @Expose()
  avatarUrl: string | null;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({ example: false })
  @Expose()
  emailVerified: boolean;
}
