import { AttendanceEntity } from '@/database/entities/attendance.entity';
import { ClassRegistrationEntity } from '@/database/entities/class-registration.entity';
import { StudentEntity } from '@/database/entities/student.entity';
import { SubscriptionEntity } from '@/database/entities/subscription.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AttendanceEntity,
      ClassRegistrationEntity,
      StudentEntity,
      SubscriptionEntity,
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
