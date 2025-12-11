import { ResponseNoDataDto } from '@/common/dto/response/response-no-data.dto';
import { ResponseDto } from '@/common/dto/response/response.dto';
import { Uuid } from '@/common/types/common.type';
import { ClassRegistrationEntity } from '@/database/entities/class-registration.entity';
import { ClassEntity } from '@/database/entities/class.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { ClassRegistrationResDto } from './dto/class-registration.res.dto';
import { RegisterClassDto } from './dto/register-class.dto';

@Injectable()
export class ClassRegistrationService {
  constructor(
    @InjectRepository(ClassRegistrationEntity)
    private readonly registrationRepository: Repository<ClassRegistrationEntity>,
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
  ) {}

  async registerStudent(
    classId: Uuid,
    dto: RegisterClassDto,
  ): Promise<ResponseDto<ClassRegistrationResDto>> {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });

    if (!classEntity) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    if (classEntity.currentStudents >= classEntity.maxStudents) {
      throw new BadRequestException('Lớp học đã đầy');
    }

    const existingRegistration = await this.registrationRepository.findOne({
      where: {
        classId,
        studentId: dto.studentId,
      },
    });

    if (existingRegistration) {
      throw new BadRequestException('Học sinh đã đăng ký lớp này rồi');
    }

    const conflictingClass = await this.checkScheduleConflict(
      dto.studentId,
      classEntity.daysOfWeek,
      classEntity.startTime,
      classEntity.endTime,
    );

    if (conflictingClass) {
      throw new BadRequestException(
        `Học sinh đã có lớp "${conflictingClass.name}" vào cùng thời gian này (${classEntity.timeSlot})`,
      );
    }

    // Create registration
    const registration = this.registrationRepository.create({
      classId,
      studentId: dto.studentId,
    });

    const savedRegistration =
      await this.registrationRepository.save(registration);

    classEntity.currentStudents += 1;
    await this.classRepository.save(classEntity);

    return new ResponseDto({
      data: plainToInstance(ClassRegistrationResDto, savedRegistration, {
        excludeExtraneousValues: true,
      }),
      message: 'Đăng ký lớp học thành công',
    });
  }

  async unregisterStudent(
    classId: Uuid,
    studentId: Uuid,
  ): Promise<ResponseNoDataDto> {
    const registration = await this.registrationRepository.findOne({
      where: { classId, studentId },
    });

    if (!registration) {
      throw new NotFoundException('Không tìm thấy đăng ký');
    }

    await this.registrationRepository.remove(registration);

    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });

    if (classEntity && classEntity.currentStudents > 0) {
      classEntity.currentStudents -= 1;
      await this.classRepository.save(classEntity);
    }

    return new ResponseNoDataDto({
      message: 'Hủy đăng ký lớp học thành công',
    });
  }

  async getStudentRegistrations(
    studentId: Uuid,
  ): Promise<ResponseDto<ClassRegistrationResDto[]>> {
    const registrations = await this.registrationRepository.find({
      where: { studentId },
      relations: ['class', 'class.teacher', 'class.teacher.user'],
      order: { createdAt: 'DESC' },
    });

    return new ResponseDto({
      data: plainToInstance(ClassRegistrationResDto, registrations, {
        excludeExtraneousValues: true,
      }),
      message: 'Lấy danh sách đăng ký thành công',
    });
  }

  async getClassRegistrations(
    classId: Uuid,
  ): Promise<ResponseDto<ClassRegistrationResDto[]>> {
    const registrations = await this.registrationRepository.find({
      where: { classId },
      relations: ['student', 'student.parent', 'student.parent.user'],
      order: { createdAt: 'DESC' },
    });

    return new ResponseDto({
      data: plainToInstance(ClassRegistrationResDto, registrations, {
        excludeExtraneousValues: true,
      }),
      message: 'Lấy danh sách học sinh thành công',
    });
  }

  private async checkScheduleConflict(
    studentId: Uuid,
    daysOfWeek: number[],
    startTime: string,
    endTime: string,
  ): Promise<ClassEntity | null> {
    const registrations = await this.registrationRepository.find({
      where: { studentId },
      relations: ['class'],
    });

    for (const registration of registrations) {
      const cls = registration.class;

      // Check if any day overlaps
      const hasOverlappingDay = cls.daysOfWeek.some((day) =>
        daysOfWeek.includes(day),
      );

      if (hasOverlappingDay) {
        // Check if time overlaps
        if (cls.startTime < endTime && cls.endTime > startTime) {
          return cls;
        }
      }
    }

    return null;
  }
}
