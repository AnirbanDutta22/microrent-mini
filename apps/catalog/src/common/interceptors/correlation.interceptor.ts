import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CorrelationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const id = req.headers['x-request-id'] || uuidv4();
    req.headers['x-request-id'] = id;
    res.setHeader('x-request-id', id);
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const method = req.method;
        const url = req.url;
        console.log(`[${id}] ${method} ${url} -> ${Date.now() - now}ms`);
      }),
    );
  }
}
