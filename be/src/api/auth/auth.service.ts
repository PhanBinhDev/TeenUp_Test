import { UserResDto } from '@/api/users/dto/user.res.dto';
import { UserService } from '@/api/users/user.service';
import { ResponseDto } from '@/common/dto/response/response.dto';
import { Uuid } from '@/common/types/common.type';
import { SALT_ROUNDS } from '@/constants/app.constant';
import { ParentEntity } from '@/database/entities/parent.entity';
import { TeacherEntity } from '@/database/entities/teacher.entity';
import { UserEntity } from '@/database/entities/user.entity';
import { UserRole } from '@/database/enum/user.enum';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ParentEntity)
    private readonly parentRepository: Repository<ParentEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
  ) {}

  async generateTokenForDev(userId: Uuid): Promise<{ accessToken: string }> {
    const user = await this.userService.findOne(userId);
    if (!user?.data) {
      throw new UnauthorizedException('User không tồn tại');
    }
    const payload = {
      id: user.data.id,
      email: user.data.email,
      role: user.data.role,
      iat: Math.floor(Date.now() / 1000),
    };
    const options: JwtSignOptions = {
      algorithm: 'RS256',
    };
    const accessToken = this.jwtService.sign(payload, options);
    return { accessToken };
  }

  generateJwt(user: UserEntity): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
    };
    const options: JwtSignOptions = {
      algorithm: 'RS256',
    };
    return this.jwtService.sign(payload, options);
  }

  verifyAccessToken(token: string) {
    try {
      const options: JwtVerifyOptions = {
        algorithms: ['RS256'],
      };
      const payload = this.jwtService.verify(token, options);
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async getMe(user: UserEntity): Promise<ResponseDto<UserResDto>> {
    const email = user?.email;
    if (!email) {
      throw new UnauthorizedException('Email not found in token payload');
    }

    const userData = await this.userService.findByEmail(email);

    if (!userData) {
      throw new UnauthorizedException('User not found');
    }

    return new ResponseDto<UserResDto>({
      data: plainToInstance(UserResDto, userData, {
        excludeExtraneousValues: true,
      }),
      message: 'User information retrieved successfully',
    });
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<ResponseDto<AuthResponseDto>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, SALT_ROUNDS);

    const user = this.userRepository.create({
      email: registerDto.email,
      passwordHash,
      fullName: registerDto.fullName,
      phone: registerDto.phone,
      role: registerDto.role,
      isActive: true,
      emailVerified: false,
    });

    const savedUser = await this.userRepository.save(user);

    // Create role-specific record
    if (registerDto.role === UserRole.PARENT) {
      const parent = this.parentRepository.create({
        userId: savedUser.id,
        address: registerDto.address,
        occupation: registerDto.occupation,
      });
      await this.parentRepository.save(parent);
    } else if (registerDto.role === UserRole.TEACHER) {
      const teacher = this.teacherRepository.create({
        userId: savedUser.id,
        specialization: registerDto.specialization,
        bio: registerDto.bio,
        yearsOfExperience: registerDto.yearsOfExperience,
      });
      await this.teacherRepository.save(teacher);
    }

    const accessToken = this.generateJwt(savedUser);

    const response = plainToInstance(AuthResponseDto, {
      accessToken,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        fullName: savedUser.fullName,
        role: savedUser.role,
        phone: savedUser.phone,
        avatarUrl: savedUser.avatarUrl,
      },
    });

    return new ResponseDto<AuthResponseDto>({
      data: response,
      message: 'Registration successful',
    });
  }

  async login(loginDto: LoginDto): Promise<ResponseDto<AuthResponseDto>> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const accessToken = this.generateJwt(user);

    const response = plainToInstance(AuthResponseDto, {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
      },
    });

    return new ResponseDto<AuthResponseDto>({
      data: response,
      message: 'Login successful',
    });
  }

  async logout(): Promise<ResponseDto<null>> {
    return new ResponseDto<null>({
      data: null,
      message: 'Logout successful',
    });
  }
}
