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
import { ClassService } from './class.service';
import { ChangeStatusClassDto } from './dto/change-status.dto';
import { ClassResDto } from './dto/class.res.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { QueryClassDto } from './dto/query-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@ApiTags('Class')
@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @ApiAuth({
    summary: 'Tạo lớp học mới',
    type: ClassResDto,
  })
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  async create(
    @CurrentUser() user: UserEntity,
    @Body() createClassDto: CreateClassDto,
  ): Promise<ResponseDto<ClassResDto>> {
    return this.classService.createClass(user.teacher.id, createClassDto);
  }

  @Get()
  @ApiAuth({
    summary: 'Lấy danh sách lớp học',
    type: ClassResDto,
    isArray: true,
    isPaginated: true,
    paginationType: 'offset',
  })
  async findAll(
    @Query() queryDto: QueryClassDto,
    @CurrentUser() user: UserEntity,
  ) {
    const teacherId =
      user.role === UserRole.TEACHER ? user.teacher.id : undefined;

    return this.classService.findAll(queryDto, teacherId);
  }

  @Get(':id')
  @ApiAuth({
    summary: 'Lấy thông tin chi tiết lớp học',
    type: ClassResDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: Uuid,
  ): Promise<ResponseDto<ClassResDto>> {
    return this.classService.findOne(id);
  }

  @Patch(':id')
  @ApiAuth({
    summary: 'Cập nhật thông tin lớp học',
    type: ClassResDto,
  })
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Body() updateClassDto: UpdateClassDto,
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseNoDataDto> {
    const teacherId =
      user.role === UserRole.TEACHER ? user.teacher.id : undefined;

    return this.classService.update(id, updateClassDto, teacherId);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Xóa lớp học',
  })
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  async remove(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseNoDataDto> {
    const teacherId =
      user.role === UserRole.TEACHER ? user.teacher.id : undefined;

    return this.classService.remove(id, teacherId);
  }

  @Patch(':id/status')
  @ApiAuth({
    summary: 'Thay đổi trạng thái lớp học',
  })
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Body() dto: ChangeStatusClassDto,
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseNoDataDto> {
    const teacherId =
      user.role === UserRole.TEACHER ? user.teacher.id : undefined;

    return this.classService.changeStatus(id, dto.status, teacherId);
  }
}
