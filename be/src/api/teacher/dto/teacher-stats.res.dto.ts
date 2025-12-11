import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TeacherStatsResDto {
  @ApiProperty({
    example: 8,
    description: 'Tổng số lớp học đang giảng dạy',
  })
  @Expose()
  totalClasses: number;

  @ApiProperty({
    example: 124,
    description: 'Tổng số học sinh trong các lớp của giáo viên',
  })
  @Expose()
  totalStudents: number;

  @ApiProperty({
    example: 3,
    description: 'Số buổi học trong ngày hôm nay',
  })
  @Expose()
  sessionsToday: number;

  @ApiProperty({
    example: 24,
    description: 'Tổng số giờ dạy trong tuần này',
  })
  @Expose()
  hoursThisWeek: number;
}
