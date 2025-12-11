import { Module } from '@nestjs/common';

import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';
import { ClassRegistrationModule } from './class-registration/class-registration.module';
import { ClassModule } from './class/class.module';
import { HealthModule } from './health/health.module';
import { HomeModule } from './home/home.module';
import { StudentModule } from './student/student.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TeacherModule } from './teacher/teacher.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    AttendanceModule,
    ClassModule,
    ClassRegistrationModule,
    StudentModule,
    SubscriptionModule,
    TeacherModule,
    HomeModule,
    HealthModule,
    AuthModule,
    UserModule,
    UploadModule,
  ],
})
export class ApiModule {}
