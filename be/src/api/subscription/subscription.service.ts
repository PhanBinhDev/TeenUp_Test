import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { ResponseNoDataDto } from '@/common/dto/response/response-no-data.dto';
import { ResponseDto } from '@/common/dto/response/response.dto';
import { Uuid } from '@/common/types/common.type';
import { SubscriptionEntity } from '@/database/entities/subscription.entity';
import { SubscriptionStatus } from '@/database/enum/subscription.enum';
import { paginate } from '@/utils/offset-pagination';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { QuerySubscriptionDto } from './dto/query-subscription.dto';
import { SubscriptionResDto } from './dto/subscription.res.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
  ) {}

  async create(
    dto: CreateSubscriptionDto,
  ): Promise<ResponseDto<SubscriptionResDto>> {
    // Validate dates
    if (dto.startDate >= dto.endDate) {
      throw new BadRequestException('Ngày bắt đầu phải trước ngày kết thúc');
    }

    const subscription = this.subscriptionRepository.create({
      ...dto,
      usedSessions: 0,
      status: dto.status || SubscriptionStatus.ACTIVE,
    });

    const savedSubscription =
      await this.subscriptionRepository.save(subscription);

    return new ResponseDto({
      data: plainToInstance(SubscriptionResDto, savedSubscription, {
        excludeExtraneousValues: true,
      }),
      message: 'Tạo gói học thành công',
    });
  }

  async findAll(
    query: QuerySubscriptionDto,
  ): Promise<OffsetPaginatedDto<SubscriptionResDto>> {
    const qb = this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.student', 'student')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('parent.user', 'parentUser');

    if (query.studentId) {
      qb.andWhere('subscription.studentId = :studentId', {
        studentId: query.studentId,
      });
    }

    if (query.status) {
      qb.andWhere('subscription.status = :status', { status: query.status });
    }

    if (query.fromDate) {
      qb.andWhere('subscription.startDate >= :fromDate', {
        fromDate: query.fromDate,
      });
    }

    if (query.toDate) {
      qb.andWhere('subscription.endDate <= :toDate', { toDate: query.toDate });
    }

    if (query.search) {
      qb.andWhere('subscription.packageName ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    qb.orderBy(
      `subscription.${query.sortBy || 'createdAt'}`,
      query.order || 'DESC',
    );

    const [subscriptions, metaDto] = await paginate<SubscriptionEntity>(
      qb,
      query,
      {
        skipCount: false,
        takeAll: false,
      },
    );

    return new OffsetPaginatedDto({
      data: plainToInstance(SubscriptionResDto, subscriptions, {
        excludeExtraneousValues: true,
      }),
      meta: metaDto,
      message: 'Lấy danh sách gói học thành công',
    });
  }

  async findOne(id: Uuid): Promise<ResponseDto<SubscriptionResDto>> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['student', 'student.parent', 'student.parent.user'],
    });

    if (!subscription) {
      throw new NotFoundException('Không tìm thấy gói học');
    }

    return new ResponseDto({
      data: plainToInstance(SubscriptionResDto, subscription, {
        excludeExtraneousValues: true,
      }),
      message: 'Lấy thông tin gói học thành công',
    });
  }

  async update(
    id: Uuid,
    dto: UpdateSubscriptionDto,
  ): Promise<ResponseNoDataDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Không tìm thấy gói học');
    }

    // Validate dates if both are provided
    if (dto.startDate && dto.endDate && dto.startDate >= dto.endDate) {
      throw new BadRequestException('Ngày bắt đầu phải trước ngày kết thúc');
    }

    Object.assign(subscription, dto);
    await this.subscriptionRepository.save(subscription);

    return new ResponseNoDataDto({
      message: 'Cập nhật gói học thành công',
    });
  }

  async useSession(id: Uuid): Promise<ResponseDto<SubscriptionResDto>> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Không tìm thấy gói học');
    }

    // Check if subscription is active
    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('Gói học không còn hoạt động');
    }

    // Check if subscription has expired
    if (new Date() > subscription.endDate) {
      subscription.status = SubscriptionStatus.EXPIRED;
      await this.subscriptionRepository.save(subscription);
      throw new BadRequestException('Gói học đã hết hạn');
    }

    // Check if there are sessions left
    if (subscription.usedSessions >= subscription.totalSessions) {
      subscription.status = SubscriptionStatus.COMPLETED;
      await this.subscriptionRepository.save(subscription);
      throw new BadRequestException('Gói học đã hết số buổi');
    }

    // Use one session
    subscription.usedSessions += 1;

    // Update status if all sessions are used
    if (subscription.usedSessions >= subscription.totalSessions) {
      subscription.status = SubscriptionStatus.COMPLETED;
    }

    const updatedSubscription =
      await this.subscriptionRepository.save(subscription);

    return new ResponseDto({
      data: plainToInstance(SubscriptionResDto, updatedSubscription, {
        excludeExtraneousValues: true,
      }),
      message: 'Sử dụng buổi học thành công',
    });
  }

  async remove(id: Uuid): Promise<ResponseNoDataDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Không tìm thấy gói học');
    }

    // Only allow delete if no sessions used
    if (subscription.usedSessions > 0) {
      throw new BadRequestException(
        'Không thể xóa gói học đã sử dụng. Vui lòng hủy gói thay vì xóa.',
      );
    }

    await this.subscriptionRepository.remove(subscription);

    return new ResponseNoDataDto({
      message: 'Xóa gói học thành công',
    });
  }
}
