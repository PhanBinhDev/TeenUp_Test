import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TodayScheduleItemDto {
  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'ID của lớp học',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'Toán 10A1',
    description: 'Tên lớp học',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: '08:00-09:30',
    description: 'Khung giờ học',
  })
  @Expose()
  timeSlot: string;

  @ApiProperty({
    example: '08:00',
    description: 'Giờ bắt đầu',
  })
  @Expose()
  startTime: string;

  @ApiProperty({
    example: '09:30',
    description: 'Giờ kết thúc',
  })
  @Expose()
  endTime: string;

  @ApiProperty({
    example: 30,
    description: 'Số học sinh hiện tại',
  })
  @Expose()
  currentStudents: number;

  @ApiProperty({
    example: 'Phòng 101',
    description: 'Phòng học',
    required: false,
  })
  @Expose()
  room?: string;

  @ApiProperty({
    example: 'Toán học',
    description: 'Môn học',
  })
  @Expose()
  subject: string;
}
