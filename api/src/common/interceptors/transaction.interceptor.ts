import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { User } from 'better-auth';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserTransaction } from 'src/database/entities/postgres/user-transaction.entity';
import { Repository } from 'typeorm';
import { RequestContext } from '../storage/request-context.storage';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  private auditedCriticalRoutes: string[] = ['/api/auth/sign-in/email', '/users'];

  constructor(
    @Inject('USER_TRANSACTION_REPOSITORY')
    private readonly userTransactionRepo: Repository<UserTransaction>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request & { user: User }>();
    const contextVar = {
      requestIP: (req.ip as string) ?? (req && req.socket && req.socket.remoteAddress) ?? null,
      user: req.user,
    };

    RequestContext.run(contextVar, () => {});

    const route = req.originalUrl || req.url;
    const method = req.method;
    const user: User = req.user;
    const userId = (user && user.id) ?? null;
    const ip = RequestContext.get('requestIP');
    console.log(
      'TransactionInterceptor - route:',
      route,
      'method:',
      method,
      'userId:',
      userId,
      'ip:',
      ip,
    );

    //filter here the routes you want to log on database
    if (this.auditedCriticalRoutes.includes(route.toLowerCase())) {
      // Save transaction (do not await, fire and forget)
      const userTransaction = new UserTransaction();
      userTransaction.route = route;
      userTransaction.method = method;
      userTransaction.userId = userId?.toString() ?? null;
      userTransaction.ip = ip?.toString() ?? null;
      void this.userTransactionRepo.save(userTransaction);
    }
    return next.handle();
  }
}
