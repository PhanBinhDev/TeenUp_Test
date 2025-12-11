import { CookieOptions } from '@/api/auth/types/cookie-options';

export function getCookieConfig(origin?: string): CookieOptions {
  const isProduction =
    this.configService.getOrThrow('app.nodeEnv', {
      infer: true,
    }) === 'production';

  const frontendUrl = this.configService.getOrThrow('app.frontendUrl', {
    infer: true,
  });

  // Check if origin is localhost
  const isLocalhost =
    origin?.includes('localhost') || origin?.includes('127.0.0.1');

  const isSameDomain =
    origin &&
    frontendUrl &&
    new URL(origin).hostname === new URL(frontendUrl).hostname;

  const config: CookieOptions = {
    httpOnly: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: false,
    sameSite: 'lax',
  };

  if (isLocalhost) {
    // Local development
    config.secure = false;
    config.sameSite = 'lax';
  } else if (isSameDomain) {
    // Same domain in production
    config.secure = isProduction;
    config.sameSite = 'lax';
  } else {
    // Cross-domain in production
    config.secure = true; // Required for sameSite: 'none'
    config.sameSite = 'none'; // Required for cross-domain
  }

  this.logger.log(
    `Cookie Config - isProduction: ${isProduction}, isLocalhost: ${isLocalhost}, isSameDomain: ${isSameDomain}, Config: ${JSON.stringify(config)}`,
  );

  return config;
}
