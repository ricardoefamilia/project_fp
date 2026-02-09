import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { RequestContext } from '../storage/request-context.storage';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { User } from 'better-auth';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request & { user: User }>();
    const contextVar = {
      requestIP:
        (request.ip as string) ??
        (request && request.socket && request.socket.remoteAddress) ??
        (request && request.connection && request.connection.remoteAddress) ??
        null,
      user: request.user,
    };

    RequestContext.run(contextVar, () => {});
    return next.handle();
  }
}
