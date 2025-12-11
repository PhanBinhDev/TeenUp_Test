import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { ResponseNoDataDto } from '@/common/dto/response/response-no-data.dto';
import { ResponseDto } from '@/common/dto/response/response.dto';
import { Uuid } from '@/common/types/common.type';
import { UserEntity } from '@/database/entities/user.entity';
import { UserRole } from '@/database/enum/user.enum';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth } from '@/decorators/http.decorators';
import { Roles } from '@/decorators/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { QuerySubscriptionDto } from './dto/query-subscription.dto';
import { SubscriptionResDto } from './dto/subscription.res.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionService } from './subscription.service';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiAuth({
    summary: 'Tạo gói học mới',
    type: SubscriptionResDto,
  })
  @Roles(UserRole.PARENT, UserRole.ADMIN)
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseDto<SubscriptionResDto>> {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  @ApiAuth({
    summary: 'Lấy danh sách gói học',
    type: SubscriptionResDto,
    isArray: true,
    isPaginated: true,
    paginationType: 'offset',
  })
  async findAll(
    @Query() queryDto: QuerySubscriptionDto,
  ): Promise<OffsetPaginatedDto<SubscriptionResDto>> {
    return this.subscriptionService.findAll(queryDto);
  }

  @Get(':id')
  @ApiAuth({
    summary: 'Lấy thông tin chi tiết gói học',
    type: SubscriptionResDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: Uuid,
  ): Promise<ResponseDto<SubscriptionResDto>> {
    return this.subscriptionService.findOne(id);
  }

  @Patch(':id')
  @ApiAuth({
    summary: 'Cập nhật thông tin gói học',
  })
  @Roles(UserRole.PARENT, UserRole.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<ResponseNoDataDto> {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Patch(':id/use')
  @ApiAuth({
    summary: 'Sử dụng một buổi học từ gói',
    type: SubscriptionResDto,
  })
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  async useSession(
    @Param('id', ParseUUIDPipe) id: Uuid,
  ): Promise<ResponseDto<SubscriptionResDto>> {
    return this.subscriptionService.useSession(id);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Xóa gói học',
  })
  @Roles(UserRole.PARENT, UserRole.ADMIN)
  async remove(
    @Param('id', ParseUUIDPipe) id: Uuid,
  ): Promise<ResponseNoDataDto> {
    return this.subscriptionService.remove(id);
  }
}
