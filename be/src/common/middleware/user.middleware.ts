import { RequestContextService } from '@/services/request-context.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Lấy token từ header hoặc cookie
    let token: string | undefined;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies['accessToken']) {
      token = req.cookies['accessToken'];
    }

    if (token) {
      try {
        const user = this.jwtService.verify(token);
        RequestContextService.run(() => {
          RequestContextService.set('user', user);
          next();
        });
      } catch {
        next();
      }
    } else {
      next();
    }
  }
}
