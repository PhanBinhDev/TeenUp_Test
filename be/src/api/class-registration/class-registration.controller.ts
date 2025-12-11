import { ResponseNoDataDto } from '@/common/dto/response/response-no-data.dto';
import { ResponseDto } from '@/common/dto/response/response.dto';
import { Uuid } from '@/common/types/common.type';
import { ApiAuth } from '@/decorators/http.decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClassRegistrationService } from './class-registration.service';
import { ClassRegistrationResDto } from './dto/class-registration.res.dto';
import { RegisterClassDto } from './dto/register-class.dto';

@ApiTags('Class Registrations')
@Controller('classes')
export class ClassRegistrationController {
  constructor(
    private readonly classRegistrationService: ClassRegistrationService,
  ) {}

  @Post(':classId/register')
  @ApiAuth({
    summary: 'Đăng ký học sinh vào lớp học',
    type: ClassRegistrationResDto,
  })
  async register(
    @Param('classId', ParseUUIDPipe) classId: Uuid,
    @Body() registerDto: RegisterClassDto,
  ): Promise<ResponseDto<ClassRegistrationResDto>> {
    return this.classRegistrationService.registerStudent(classId, registerDto);
  }

  @Delete(':classId/unregister/:studentId')
  @ApiAuth({
    summary: 'Hủy đăng ký học sinh khỏi lớp học',
  })
  async unregister(
    @Param('classId', ParseUUIDPipe) classId: Uuid,
    @Param('studentId', ParseUUIDPipe) studentId: Uuid,
  ): Promise<ResponseNoDataDto> {
    return this.classRegistrationService.unregisterStudent(classId, studentId);
  }

  @Get(':classId/registrations')
  @ApiAuth({
    summary: 'Lấy danh sách học sinh đăng ký lớp học',
    type: ClassRegistrationResDto,
    isArray: true,
  })
  async getClassRegistrations(@Param('classId', ParseUUIDPipe) classId: Uuid) {
    return this.classRegistrationService.getClassRegistrations(classId);
  }

  @Get('student/:studentId/registrations')
  @ApiAuth({
    summary: 'Lấy danh sách lớp học đã đăng ký của học sinh',
    type: ClassRegistrationResDto,
    isArray: true,
  })
  async getStudentRegistrations(
    @Param('studentId', ParseUUIDPipe) studentId: Uuid,
  ): Promise<ResponseDto<ClassRegistrationResDto[]>> {
    return this.classRegistrationService.getStudentRegistrations(studentId);
  }
}
