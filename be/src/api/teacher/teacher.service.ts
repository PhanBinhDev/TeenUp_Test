import { ResponseNoDataDto } from '@/common/dto/response/response-no-data.dto';
import { ResponseDto } from '@/common/dto/response/response.dto';
import { Uuid } from '@/common/types/common.type';
import { ClassEntity } from '@/database/entities/class.entity';
import { TeacherEntity } from '@/database/entities/teacher.entity';
import { ClassStatus } from '@/database/enum/class.enum';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { TeacherStatsResDto } from './dto/teacher-stats.res.dto';
import { TeacherResDto } from './dto/teacher.res.dto';
import { TodayScheduleItemDto } from './dto/today-schedule.res.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
  ) {}

  async getProfile(teacherId: Uuid): Promise<ResponseDto<TeacherResDto>> {
    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
      relations: ['user'],
    });

    if (!teacher) {
      throw new NotFoundException('Không tìm thấy thông tin giáo viên');
    }

    return new ResponseDto({
      data: plainToInstance(TeacherResDto, teacher, {
        excludeExtraneousValues: true,
      }),
      message: 'Lấy thông tin giáo viên thành công',
    });
  }

  async updateProfile(
    teacherId: Uuid,
    dto: UpdateTeacherDto,
  ): Promise<ResponseNoDataDto> {
    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
      relations: ['user'],
    });

    if (!teacher) {
      throw new NotFoundException('Không tìm thấy thông tin giáo viên');
    }

    if (
      dto.fullName !== undefined ||
      dto.phone !== undefined ||
      dto.address !== undefined
    ) {
      const user = teacher.user;
      if (dto.fullName !== undefined) user.fullName = dto.fullName;
      if (dto.phone !== undefined) user.phone = dto.phone;
      await this.teacherRepository.manager.save(user);
    }

    // Update teacher fields
    if (dto.specialization !== undefined)
      teacher.specialization = dto.specialization;
    if (dto.bio !== undefined) teacher.bio = dto.bio;
    if (dto.yearsOfExperience !== undefined)
      teacher.yearsOfExperience = dto.yearsOfExperience;

    await this.teacherRepository.save(teacher);

    return new ResponseNoDataDto({
      message: 'Cập nhật thông tin giáo viên thành công',
    });
  }

  async getStatistics(
    teacherId: Uuid,
  ): Promise<ResponseDto<TeacherStatsResDto>> {
    const classes = await this.classRepository.find({
      where: {
        teacherId,
        status: ClassStatus.ACTIVE,
      },
    });

    const totalClasses = classes.length;

    const totalStudents = classes.reduce(
      (sum, cls) => sum + cls.currentStudents,
      0,
    );

    const today = new Date().getDay();
    const sessionsToday = classes.filter((cls) =>
      cls.daysOfWeek.includes(today),
    ).length;

    const now = new Date();
    const currentDay = now.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const daysInWeek = [1, 2, 3, 4, 5, 6, 0];

    let hoursThisWeek = 0;
    for (const cls of classes) {
      const [startHour, startMinute] = cls.startTime.split(':').map(Number);
      const [endHour, endMinute] = cls.endTime.split(':').map(Number);

      const startInMinutes = startHour * 60 + startMinute;
      const endInMinutes = endHour * 60 + endMinute;
      const durationInHours = (endInMinutes - startInMinutes) / 60;

      // Count hours for each day this class meets in the week
      const daysThisWeek = cls.daysOfWeek.filter((day) =>
        daysInWeek.includes(day),
      ).length;
      hoursThisWeek += durationInHours * daysThisWeek;
    }

    const stats = plainToInstance(
      TeacherStatsResDto,
      {
        totalClasses,
        totalStudents,
        sessionsToday,
        hoursThisWeek: Math.round(hoursThisWeek * 10) / 10,
      },
      { excludeExtraneousValues: true },
    );

    return new ResponseDto({
      data: stats,
      message: 'Lấy thống kê giáo viên thành công',
    });
  }

  async getTodaySchedule(
    teacherId: Uuid,
  ): Promise<ResponseDto<TodayScheduleItemDto[]>> {
    const today = new Date().getDay();

    const allClasses = await this.classRepository.find({
      where: {
        teacherId,
        status: ClassStatus.ACTIVE,
      },
      order: {
        startTime: 'ASC',
      },
    });

    const classes = allClasses.filter((cls) => cls.daysOfWeek.includes(today));

    const scheduleItems = classes.map((cls) =>
      plainToInstance(
        TodayScheduleItemDto,
        {
          id: cls.id,
          name: cls.name,
          timeSlot: cls.timeSlot,
          startTime: cls.startTime,
          endTime: cls.endTime,
          currentStudents: cls.currentStudents,
          subject: cls.subject,
        },
        { excludeExtraneousValues: true },
      ),
    );

    return new ResponseDto({
      data: scheduleItems,
      message: 'Lấy lịch dạy hôm nay thành công',
    });
  }
}
