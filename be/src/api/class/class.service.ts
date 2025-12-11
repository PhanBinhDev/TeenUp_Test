import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { ResponseNoDataDto } from '@/common/dto/response/response-no-data.dto';
import { ResponseDto } from '@/common/dto/response/response.dto';
import { Uuid } from '@/common/types/common.type';
import { ClassEntity } from '@/database/entities/class.entity';
import { ClassStatus } from '@/database/enum/class.enum';
import { paginate } from '@/utils/offset-pagination';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { ClassResDto } from './dto/class.res.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { QueryClassDto } from './dto/query-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
  ) {}

  private parseTimeSlot(timeSlot: string): {
    startTime: string;
    endTime: string;
  } {
    try {
      const [start, end] = timeSlot.split('-').map((t) => t.trim());
      return {
        startTime: `${start}:00`,
        endTime: `${end}:00`,
      };
    } catch {
      throw new BadRequestException(
        'Định dạng khung giờ không hợp lệ. Định dạng mong đợi: HH:mm-HH:mm',
      );
    }
  }

  async createClass(
    teacherId: Uuid,
    dto: CreateClassDto,
  ): Promise<ResponseDto<ClassResDto>> {
    const { startTime, endTime } = this.parseTimeSlot(dto.timeSlot);

    const hasConflict = await this.checkScheduleConflict(
      teacherId,
      dto.daysOfWeek,
      startTime,
      endTime,
    );

    if (hasConflict) {
      throw new BadRequestException('Bạn đã có lớp học vào khung giờ này');
    }

    const classEntity = this.classRepository.create({
      ...dto,
      teacherId,
      startTime,
      endTime,
      currentStudents: 0,
    });

    const savedClass = await this.classRepository.save(classEntity);

    return new ResponseDto({
      data: plainToInstance(ClassResDto, savedClass, {
        excludeExtraneousValues: true,
      }),
      message: 'Tạo lớp học thành công',
    });
  }

  async findOne(id: Uuid): Promise<ResponseDto<ClassResDto>> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['teacher', 'teacher.user', 'registrations'],
    });

    if (!classEntity) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    return new ResponseDto({
      data: plainToInstance(ClassResDto, classEntity, {
        excludeExtraneousValues: true,
      }),
      message: 'Lấy thông tin lớp học thành công',
    });
  }

  async update(
    id: Uuid,
    dto: UpdateClassDto,
    teacherId?: Uuid,
  ): Promise<ResponseNoDataDto> {
    const classEntity = await this.findOne(id);

    if (classEntity.data.teacherId !== teacherId) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    let startTime: string | undefined;
    let endTime: string | undefined;

    if (dto.timeSlot) {
      const parsed = this.parseTimeSlot(dto.timeSlot);
      startTime = parsed.startTime;
      endTime = parsed.endTime;

      const hasConflict = await this.checkScheduleConflict(
        teacherId,
        dto.daysOfWeek ?? classEntity.data.daysOfWeek,
        startTime,
        endTime,
        id,
      );

      if (hasConflict) {
        throw new BadRequestException('Bạn đã có lớp học vào khung giờ này');
      }
    }

    Object.assign(classEntity.data, {
      ...dto,
      ...(startTime && { startTime }),
      ...(endTime && { endTime }),
    });

    await this.classRepository.save(classEntity.data);

    return new ResponseNoDataDto({ message: 'Cập nhật lớp học thành công' });
  }

  async remove(id: Uuid, teacherId?: string): Promise<ResponseNoDataDto> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['registrations'],
    });

    if (classEntity.teacherId !== teacherId) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    if (classEntity.registrations && classEntity.registrations.length > 0) {
      throw new BadRequestException(
        'Không thể xóa lớp học đã có học sinh đăng ký. Vui lòng hủy tất cả đăng ký trước.',
      );
    }

    if (classEntity.currentStudents > 0) {
      throw new BadRequestException(
        'Không thể xóa lớp học đã có học sinh. Vui lòng chuyển trạng thái sang "Đã hủy" thay vì xóa.',
      );
    }

    await this.classRepository.remove(classEntity);

    return new ResponseNoDataDto({ message: 'Xóa lớp học thành công' });
  }

  async checkScheduleConflict(
    teacherId: Uuid,
    daysOfWeek: number[],
    startTime: string,
    endTime: string,
    excludeClassId?: string,
  ): Promise<boolean> {
    const qb = this.classRepository
      .createQueryBuilder('class')
      .where('class.teacherId = :teacherId', { teacherId })
      .andWhere('class.daysOfWeek && :daysOfWeek', { daysOfWeek })
      .andWhere('(class.startTime < :endTime AND class.endTime > :startTime)', {
        startTime,
        endTime,
      });

    if (excludeClassId) {
      qb.andWhere('class.id != :excludeClassId', { excludeClassId });
    }

    const count = await qb.getCount();
    return count > 0;
  }

  async changeStatus(
    id: Uuid,
    status: ClassStatus,
    teacherId?: Uuid,
  ): Promise<ResponseNoDataDto> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
    });

    if (!classEntity) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    if (teacherId && classEntity.teacherId !== teacherId) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    classEntity.status = status;
    await this.classRepository.save(classEntity);

    return new ResponseNoDataDto({
      message: 'Cập nhật trạng thái lớp học thành công',
    });
  }

  async findAll(
    query: QueryClassDto,
    teacherId: Uuid,
  ): Promise<OffsetPaginatedDto<ClassResDto>> {
    const qb = this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user');

    if (query.search) {
      qb.andWhere(
        '(class.name ILIKE :search OR class.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.status) {
      qb.andWhere('class.status = :status', { status: query.status });
    }

    if (query.daysOfWeek !== undefined && query.daysOfWeek.length > 0) {
      qb.andWhere('class.daysOfWeek && :daysOfWeek', {
        daysOfWeek: query.daysOfWeek,
      });
    }

    if (query.timeSlot) {
      const { startTime, endTime } = this.parseTimeSlot(query.timeSlot);
      qb.andWhere('class.startTime = :startTime AND class.endTime = :endTime', {
        startTime,
        endTime,
      });
    }

    if (query.minStudents !== undefined) {
      qb.andWhere('class.currentStudents >= :minStudents', {
        minStudents: query.minStudents,
      });
    }

    if (query.maxStudents !== undefined) {
      qb.andWhere('class.currentStudents <= :maxStudents', {
        maxStudents: query.maxStudents,
      });
    }

    if (teacherId) {
      qb.andWhere('class.teacherId = :teacherId', { teacherId });
    }

    if (query.fromDate) {
      qb.andWhere('class.createdAt >= :fromDate', { fromDate: query.fromDate });
    }

    if (query.toDate) {
      qb.andWhere('class.createdAt <= :toDate', { toDate: query.toDate });
    }

    const allowedSortFields = ['createdAt', 'name', 'currentStudents'];
    const sortField = allowedSortFields.includes(query.sortBy || '')
      ? query.sortBy
      : 'createdAt';

    qb.orderBy(`class.${sortField}`, query.order || 'DESC');

    const [classes, metaDto] = await paginate<ClassEntity>(qb, query, {
      skipCount: false,
      takeAll: false,
    });

    return new OffsetPaginatedDto({
      data: plainToInstance(ClassResDto, classes, {
        excludeExtraneousValues: true,
      }),
      meta: metaDto,
      message: 'Lấy danh sách lớp học thành công',
    });
  }
}
