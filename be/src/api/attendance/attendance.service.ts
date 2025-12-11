import { ResponseDto } from '@/common/dto/response/response.dto';
import { Uuid } from '@/common/types/common.type';
import { AttendanceEntity } from '@/database/entities/attendance.entity';
import { ClassRegistrationEntity } from '@/database/entities/class-registration.entity';
import { StudentEntity } from '@/database/entities/student.entity';
import { SubscriptionEntity } from '@/database/entities/subscription.entity';
import { RegistrationStatus } from '@/database/enum/class.enum';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { AttendanceResDto } from './dto/attendance.res.dto';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepository: Repository<AttendanceEntity>,
    @InjectRepository(ClassRegistrationEntity)
    private readonly classRegistrationRepository: Repository<ClassRegistrationEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
  ) {}

  async getAttendanceByClassAndDate(
    classId: Uuid,
    attendanceDate: string,
  ): Promise<ResponseDto<AttendanceResDto[]>> {
    const registrations = await this.classRegistrationRepository.find({
      where: {
        classId,
        status: RegistrationStatus.ACTIVE,
      },
      relations: ['student'],
    });

    const attendances = await this.attendanceRepository.find({
      where: {
        classRegistration: {
          classId,
        },
        attendanceDate: new Date(attendanceDate),
      },
      relations: ['classRegistration', 'classRegistration.student'],
    });

    const attendanceData = registrations.map((reg) => {
      const attendance = attendances.find(
        (a) => a.classRegistrationId === reg.id,
      );

      if (attendance) {
        return plainToInstance(
          AttendanceResDto,
          {
            ...attendance,
            student: reg.student,
          },
          { excludeExtraneousValues: true },
        );
      }

      return plainToInstance(
        AttendanceResDto,
        {
          id: null,
          classRegistrationId: reg.id,
          subscriptionId: null,
          attendanceDate,
          status: null,
          notes: null,
          markedById: null,
          student: reg.student,
          createdAt: null,
          updatedAt: null,
        },
        { excludeExtraneousValues: true },
      );
    });

    return new ResponseDto({
      data: attendanceData,
      message: 'Lấy dữ liệu điểm danh thành công',
    });
  }

  async markAttendance(
    dto: MarkAttendanceDto,
    markedBy: Uuid,
  ): Promise<ResponseDto<AttendanceResDto>> {
    const registration = await this.classRegistrationRepository.findOne({
      where: { id: dto.classRegistrationId as any },
      relations: ['student', 'class'],
    });

    if (!registration) {
      throw new NotFoundException('Không tìm thấy đăng ký lớp học');
    }

    const attendanceDay = new Date(dto.attendanceDate).getDay();
    if (!registration.class.daysOfWeek.includes(attendanceDay)) {
      throw new BadRequestException(
        'Ngày điểm danh không trùng với lịch học của lớp',
      );
    }

    const student = await this.studentRepository.findOne({
      where: { id: registration.studentId },
      relations: ['subscriptions'],
    });

    if (!student) {
      throw new NotFoundException('Không tìm thấy học sinh');
    }

    const activeSubscription = student.subscriptions?.find(
      (sub) =>
        sub.status === 'active' &&
        sub.remainingSessions > 0 &&
        new Date(sub.startDate) <= new Date(dto.attendanceDate) &&
        new Date(sub.endDate) >= new Date(dto.attendanceDate),
    );

    if (!activeSubscription) {
      throw new BadRequestException(
        'Học sinh không có gói học phù hợp (đã hết hạn hoặc hết buổi học)',
      );
    }

    // Check if attendance already exists
    let attendance = await this.attendanceRepository.findOne({
      where: {
        classRegistrationId: dto.classRegistrationId,
        attendanceDate: new Date(dto.attendanceDate),
      },
      relations: ['subscription'],
    });

    const previousStatus = attendance?.status;
    const newStatus = dto.status;

    // Determine which subscription to use for session tracking
    let usedSubscription: SubscriptionEntity;
    if (attendance) {
      // Update existing attendance - use the subscription that was originally assigned
      usedSubscription = attendance.subscription;
      attendance.status = dto.status;
      attendance.notes = dto.notes || null;
      attendance.markedById = markedBy;
    } else {
      // Create new attendance - use the active subscription found above
      usedSubscription = activeSubscription;
      attendance = this.attendanceRepository.create({
        classRegistrationId: dto.classRegistrationId,
        subscriptionId: activeSubscription.id,
        attendanceDate: new Date(dto.attendanceDate),
        status: dto.status,
        notes: dto.notes || null,
        markedById: markedBy,
      });
    }

    await this.attendanceRepository.save(attendance);

    // Handle session tracking - update usedSessions (not remainingSessions which is computed)
    const statusThatConsumesSession = ['present', 'late'];
    const previousConsumes = statusThatConsumesSession.includes(previousStatus);
    const newConsumes = statusThatConsumesSession.includes(newStatus);

    if (newConsumes && !previousConsumes) {
      // Tăng số buổi đã dùng: null/absent -> present/late
      usedSubscription.usedSessions += 1;
      await this.subscriptionRepository.save(usedSubscription);
    } else if (previousConsumes && !newConsumes) {
      // Giảm số buổi đã dùng: present/late -> absent
      usedSubscription.usedSessions -= 1;
      await this.subscriptionRepository.save(usedSubscription);
    }

    const result = plainToInstance(
      AttendanceResDto,
      {
        ...attendance,
        student: registration.student,
      },
      { excludeExtraneousValues: true },
    );

    return new ResponseDto({
      data: result,
      message: 'Điểm danh thành công',
    });
  }
}
