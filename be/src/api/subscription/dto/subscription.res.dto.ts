import { SubscriptionStatus } from '@/database/enum/subscription.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SubscriptionResDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  studentId: string;

  @ApiProperty()
  @Expose()
  packageName: string;

  @ApiProperty()
  @Expose()
  startDate: Date;

  @ApiProperty()
  @Expose()
  endDate: Date;

  @ApiProperty()
  @Expose()
  totalSessions: number;

  @ApiProperty()
  @Expose()
  usedSessions: number;

  @ApiProperty({ description: 'Số buổi còn lại' })
  @Expose()
  get remainingSessions(): number {
    return this.totalSessions - this.usedSessions;
  }

  @ApiProperty({ enum: SubscriptionStatus })
  @Expose()
  status: SubscriptionStatus;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
