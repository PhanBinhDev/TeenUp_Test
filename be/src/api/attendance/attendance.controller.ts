import { ResponseDto } from '@/common/dto/response/response.dto';
import { UserEntity } from '@/database/entities/user.entity';
import { UserRole } from '@/database/enum/user.enum';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth } from '@/decorators/http.decorators';
import { Roles } from '@/decorators/roles.decorator';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { AttendanceResDto } from './dto/attendance.res.dto';
import { GetAttendanceQueryDto } from './dto/get-attendance-query.dto';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@ApiTags('Attendance')
@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @ApiAuth({
    summary: 'Lấy danh sách điểm danh theo lớp và ngày',
    type: AttendanceResDto,
    isArray: true,
  })
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  async getAttendance(
    @Query() query: GetAttendanceQueryDto,
  ): Promise<ResponseDto<AttendanceResDto[]>> {
    return this.attendanceService.getAttendanceByClassAndDate(
      query.classId,
      query.attendanceDate,
    );
  }

  @Post('mark')
  @ApiAuth({
    summary: 'Điểm danh học sinh',
    type: AttendanceResDto,
  })
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  async markAttendance(
    @Body() dto: MarkAttendanceDto,
    @CurrentUser() user: UserEntity,
  ): Promise<ResponseDto<AttendanceResDto>> {
    return this.attendanceService.markAttendance(dto, user.id);
  }
}
