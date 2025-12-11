import { ClassRegistrationEntity } from '@/database/entities/class-registration.entity';
import { ClassEntity } from '@/database/entities/class.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassRegistrationController } from './class-registration.controller';
import { ClassRegistrationService } from './class-registration.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClassRegistrationEntity, ClassEntity])],
  controllers: [ClassRegistrationController],
  providers: [ClassRegistrationService],
  exports: [ClassRegistrationService],
})
export class ClassRegistrationModule {}
