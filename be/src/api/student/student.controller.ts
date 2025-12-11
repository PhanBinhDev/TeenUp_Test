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
import { CreateStudentDto } from './dto/create-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import { StudentResDto } from './dto/student.res.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentService } from './student.service';

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiAuth({
    summary: 'Tạo học sinh mới',
    type: StudentResDto,
  })
  @Roles(UserRole.PARENT, UserRole.ADMIN)
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseDto<StudentResDto>> {
    return this.studentService.create(createStudentDto, user);
  }

  @Get()
  @ApiAuth({
    summary: 'Lấy danh sách học sinh',
    type: StudentResDto,
    isArray: true,
    isPaginated: true,
    paginationType: 'offset',
  })
  async findAll(
    @Query() queryDto: QueryStudentDto,
    @CurrentUser() user: UserEntity,
  ): Promise<OffsetPaginatedDto<StudentResDto>> {
    return this.studentService.findAll(queryDto);
  }

  @Get(':id')
  @ApiAuth({
    summary: 'Lấy thông tin chi tiết học sinh (bao gồm thông tin phụ huynh)',
    type: StudentResDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: Uuid,
  ): Promise<ResponseDto<StudentResDto>> {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @ApiAuth({
    summary: 'Cập nhật thông tin học sinh',
  })
  @Roles(UserRole.PARENT, UserRole.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: Uuid,
    @Body() updateStudentDto: UpdateStudentDto,
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseNoDataDto> {
    return this.studentService.update(id, updateStudentDto, user);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Xóa học sinh',
  })
  @Roles(UserRole.PARENT, UserRole.ADMIN)
  async remove(
    @Param('id', ParseUUIDPipe) id: Uuid,
  ): Promise<ResponseNoDataDto> {
    return this.studentService.remove(id);
  }
}
