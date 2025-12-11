import { AuthService } from '@/api/auth/auth.service';
import { UserResDto } from '@/api/users/dto/user.res.dto';
import { ResponseNoDataDto } from '@/common/dto/response/response-no-data.dto';
import { ResponseDto } from '@/common/dto/response/response.dto';
import { Uuid } from '@/common/types/common.type';
import { UserEntity } from '@/database/entities/user.entity';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators';
import { Public } from '@/decorators/public.decorator';
import { getCookieConfig } from '@/utils/cookies.util';
import { Body, Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('dev-token')
  @ApiPublic({
    summary: 'Generate dev token',
    description:
      'Generate a JWT token for development purposes given a user ID.',
  })
  async generateDevToken(@Body('userId') userId: Uuid) {
    return this.authService.generateTokenForDev(userId);
  }

  @ApiPublic()
  @Delete('logout')
  async logout(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseNoDataDto> {
    const origin = req.get('origin');
    const cookieConfig = getCookieConfig(origin);

    res.clearCookie('accessToken', {
      httpOnly: cookieConfig.httpOnly,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: cookieConfig.path,
    });

    return new ResponseNoDataDto({
      message: 'Logout successful',
    });
  }

  @ApiAuth({
    summary: 'Get current user',
    description: 'Returns the current authenticated user information.',
    type: UserResDto,
  })
  @Get('me')
  async getMe(@CurrentUser() user: UserEntity) {
    return this.authService.getMe(user);
  }

  @ApiPublic({
    summary: 'Register new user',
    description: 'Register a new parent or teacher account.',
    type: AuthResponseDto,
  })
  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ResponseDto<AuthResponseDto>> {
    return this.authService.register(registerDto);
  }

  @ApiPublic({
    summary: 'Login',
    description: 'Login with email and password.',
    type: AuthResponseDto,
  })
  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<ResponseDto<AuthResponseDto>> {
    return this.authService.login(loginDto);
  }
}
