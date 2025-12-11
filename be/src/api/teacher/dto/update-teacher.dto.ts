import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateTeacherDto {
  // User fields
  @ApiPropertyOptional({
    description: 'Họ và tên',
    example: 'Nguyễn Văn A',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại',
    example: '0912345678',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Địa chỉ',
    example: 'Hà Nội',
  })
  @IsOptional()
  @IsString()
  address?: string;

  // Teacher fields
  @ApiPropertyOptional({
    description: 'Chuyên môn của giáo viên',
    example: 'Toán học',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  specialization?: string;

  @ApiPropertyOptional({
    description: 'Tiểu sử giáo viên',
    example: 'Giáo viên có 10 năm kinh nghiệm giảng dạy...',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Số năm kinh nghiệm',
    example: 10,
    minimum: 0,
    maximum: 50,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  yearsOfExperience?: number;
}
