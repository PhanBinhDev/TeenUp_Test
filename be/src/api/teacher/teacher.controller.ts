import { ResponseNoDataDto } from '@/common/dto/response/response-no-data.dto';
import { ResponseDto } from '@/common/dto/response/response.dto';
import { UserEntity } from '@/database/entities/user.entity';
import { UserRole } from '@/database/enum/user.enum';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth } from '@/decorators/http.decorators';
import { Roles } from '@/decorators/roles.decorator';
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TeacherStatsResDto } from './dto/teacher-stats.res.dto';
import { TeacherResDto } from './dto/teacher.res.dto';
import { TodayScheduleItemDto } from './dto/today-schedule.res.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherService } from './teacher.service';

@ApiTags('Teacher')
@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('profile')
  @ApiAuth({
    summary: 'Lấy thông tin profile giáo viên',
    type: TeacherResDto,
  })
  @Roles(UserRole.TEACHER)
  async getProfile(
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseDto<TeacherResDto>> {
    return this.teacherService.getProfile(user.teacher.id);
  }

  @Patch('profile')
  @ApiAuth({
    summary: 'Cập nhật thông tin profile giáo viên',
  })
  @Roles(UserRole.TEACHER)
  async updateProfile(
    @CurrentUser() user: UserEntity,
    @Body() updateDto: UpdateTeacherDto,
  ): Promise<ResponseNoDataDto> {
    return this.teacherService.updateProfile(user.teacher.id, updateDto);
  }

  @Get('statistics')
  @ApiAuth({
    summary: 'Lấy thống kê dashboard giáo viên',
    type: TeacherStatsResDto,
  })
  @Roles(UserRole.TEACHER)
  async getStatistics(
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseDto<TeacherStatsResDto>> {
    return this.teacherService.getStatistics(user.teacher.id);
  }

  @Get('today-schedule')
  @ApiAuth({
    summary: 'Lấy lịch dạy hôm nay của giáo viên',
    type: TodayScheduleItemDto,
    isArray: true,
  })
  @Roles(UserRole.TEACHER)
  async getTodaySchedule(
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseDto<TodayScheduleItemDto[]>> {
    return this.teacherService.getTodaySchedule(user.teacher.id);
  }
}
