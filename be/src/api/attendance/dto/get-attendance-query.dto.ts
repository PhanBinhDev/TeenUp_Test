import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetAttendanceQueryDto {
  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'ID của lớp học',
  })
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @ApiProperty({
    example: '2025-12-11',
    description: 'Ngày điểm danh (YYYY-MM-DD)',
  })
  @IsString()
  @IsNotEmpty()
  attendanceDate: string;
}
