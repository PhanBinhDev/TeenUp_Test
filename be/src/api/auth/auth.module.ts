import { UserModule } from '@/api/users/user.module';
import { AllConfigType } from '@/config/config.type';
import { ParentEntity } from '@/database/entities/parent.entity';
import { TeacherEntity } from '@/database/entities/teacher.entity';
import { UserEntity } from '@/database/entities/user.entity';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import path from 'path';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserEntity, ParentEntity, TeacherEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        privateKey: fs.readFileSync(
          path.resolve(process.cwd(), 'secrets/private.key'),
        ),
        publicKey: fs.readFileSync(
          path.resolve(process.cwd(), 'secrets/public.key'),
        ),
        signOptions: {
          algorithm: 'RS256',
          expiresIn: configService.getOrThrow('auth.jwtExpiresIn', {
            infer: true,
          }),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
