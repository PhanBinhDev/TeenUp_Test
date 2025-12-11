import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { ResponseNoDataDto } from '@/common/dto/response/response-no-data.dto';
import { ResponseDto } from '@/common/dto/response/response.dto';
import { Uuid } from '@/common/types/common.type';
import { ParentEntity } from '@/database/entities/parent.entity';
import { StudentEntity } from '@/database/entities/student.entity';
import { UserEntity } from '@/database/entities/user.entity';
import { paginate } from '@/utils/offset-pagination';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import { StudentResDto } from './dto/student.res.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(ParentEntity)
    private readonly parentRepository: Repository<ParentEntity>,
  ) {}

  async create(
    dto: CreateStudentDto,
    user: UserEntity,
  ): Promise<ResponseDto<StudentResDto>> {
    const parent = await this.parentRepository.findOne({
      where: { id: user.parent.id },
    });

    if (!parent) {
      throw new NotFoundException('Không tìm thấy phụ huynh');
    }

    const age = this.calculateAge(dto.dob);
    if (age < 6 || age > 18) {
      throw new BadRequestException('Học sinh phải từ 6-18 tuổi');
    }

    const student = this.studentRepository.create({
      ...dto,
      parentId: parent.id,
    });
    const savedStudent = await this.studentRepository.save(student);

    return new ResponseDto({
      data: plainToInstance(StudentResDto, savedStudent, {
        excludeExtraneousValues: true,
      }),
      message: 'Tạo học sinh thành công',
    });
  }

  async findAll(
    query: QueryStudentDto,
  ): Promise<OffsetPaginatedDto<StudentResDto>> {
    const qb = this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('parent.user', 'user');

    if (query.parentId) {
      qb.andWhere('student.parentId = :parentId', {
        parentId: query.parentId,
      });
    }

    if (query.gender) {
      qb.andWhere('student.gender = :gender', { gender: query.gender });
    }

    if (query.currentGrade) {
      qb.andWhere('student.currentGrade = :currentGrade', {
        currentGrade: query.currentGrade,
      });
    }

    if (query.search) {
      qb.andWhere('student.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    qb.orderBy(`student.${query.sortBy || 'createdAt'}`, query.order || 'DESC');

    const [students, metaDto] = await paginate<StudentEntity>(qb, query, {
      skipCount: false,
      takeAll: false,
    });

    return new OffsetPaginatedDto({
      data: plainToInstance(StudentResDto, students, {
        excludeExtraneousValues: true,
      }),
      meta: metaDto,
      message: 'Lấy danh sách học sinh thành công',
    });
  }

  async findOne(id: Uuid): Promise<ResponseDto<StudentResDto>> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: [
        'parent',
        'parent.user',
        'registrations',
        'registrations.class',
        'subscriptions',
      ],
    });

    if (!student) {
      throw new NotFoundException('Không tìm thấy học sinh');
    }

    return new ResponseDto({
      data: plainToInstance(StudentResDto, student, {
        excludeExtraneousValues: true,
      }),
      message: 'Lấy thông tin học sinh thành công',
    });
  }

  async update(
    id: Uuid,
    dto: UpdateStudentDto,
    user: UserEntity,
  ): Promise<ResponseNoDataDto> {
    const student = await this.studentRepository.findOne({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Không tìm thấy học sinh');
    }

    if (user.parent.id && user.parent.id !== student.parentId) {
      const parent = await this.parentRepository.findOne({
        where: { id: user.parent.id },
      });

      if (!parent) {
        throw new NotFoundException('Không tìm thấy phụ huynh');
      }
    }

    if (dto.dob) {
      const age = this.calculateAge(dto.dob);
      if (age < 6 || age > 18) {
        throw new BadRequestException('Học sinh phải từ 6-18 tuổi');
      }
    }

    Object.assign(student, dto);
    await this.studentRepository.save(student);

    return new ResponseNoDataDto({
      message: 'Cập nhật học sinh thành công',
    });
  }

  async remove(id: Uuid): Promise<ResponseNoDataDto> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['registrations', 'subscriptions'],
    });

    if (!student) {
      throw new NotFoundException('Không tìm thấy học sinh');
    }

    if (student.classRegistrations && student.classRegistrations.length > 0) {
      throw new BadRequestException(
        'Không thể xóa học sinh đang có đăng ký lớp học. Vui lòng hủy tất cả đăng ký trước.',
      );
    }

    if (student.subscriptions && student.subscriptions.length > 0) {
      throw new BadRequestException(
        'Không thể xóa học sinh đang có gói học. Vui lòng xóa tất cả gói học trước.',
      );
    }

    await this.studentRepository.remove(student);

    return new ResponseNoDataDto({
      message: 'Xóa học sinh thành công',
    });
  }

  private calculateAge(dob: Date): number {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}
