import { AttendanceStatus } from '@/database/enum/class.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class MarkAttendanceDto {
  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'ID của đăng ký lớp học',
  })
  @IsUUID()
  @IsNotEmpty()
  classRegistrationId: string;

  @ApiProperty({
    example: '2025-12-11',
    description: 'Ngày điểm danh (YYYY-MM-DD)',
  })
  @IsString()
  @IsNotEmpty()
  attendanceDate: string;

  @ApiProperty({
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
    description: 'Trạng thái điểm danh',
  })
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;

  @ApiProperty({
    example: 'Học sinh đến muộn 10 phút',
    description: 'Ghi chú',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
