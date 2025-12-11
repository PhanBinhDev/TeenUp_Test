import validateConfig from '@/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';
import process from 'node:process';
import { AuthConfig } from './auth-config.type';

class AuthVariablesValidator {
  @IsString()
  @IsOptional()
  AUTH_JWT_SECRET: string;

  @IsString()
  @IsOptional()
  AUTH_JWT_TOKEN_EXPIRES_IN: string;

  @IsString()
  @IsOptional()
  AUTH_JWT_REFRESH_SECRET: string;

  @IsString()
  @IsOptional()
  AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  @IsOptional()
  AUTH_GOOGLE_CLIENT_ID: string;

  @IsString()
  @IsOptional()
  AUTH_GOOGLE_CLIENT_SECRET: string;

  @IsString()
  @IsOptional()
  AUTH_GOOGLE_CALLBACK_URL: string;

  @IsString()
  @IsOptional()
  AUTH_GOOGLE_SCOPE: string;
}

export default registerAs<AuthConfig>('auth', () => {
  console.log('Loading auth configuration...');

  validateConfig(process.env, AuthVariablesValidator);

  return {
    jwtSecret: process.env.AUTH_JWT_SECRET || '',
    jwtExpiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN || '15m',
    jwtRefreshSecret: process.env.AUTH_JWT_REFRESH_SECRET || '',
    jwtRefreshExpiresIn: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
    googleClientId: process.env.AUTH_GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET || '',
    googleCallbackUrl: process.env.AUTH_GOOGLE_CALLBACK_URL || '',
    googleScope: process.env.AUTH_GOOGLE_SCOPE
      ? process.env.AUTH_GOOGLE_SCOPE.split(',').map((s) => s.trim())
      : [],
  };
});
