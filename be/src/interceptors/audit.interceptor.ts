import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id || 'system';

    return next.handle().pipe(
      map((data) => {
        // Nếu là entity, gắn user vào
        if (data && typeof data === 'object') {
          if ('createdBy' in data && !data.createdBy) data.createdBy = userId;
          if ('updatedBy' in data) data.updatedBy = userId;
        }
        return data;
      }),
    );
  }
}
