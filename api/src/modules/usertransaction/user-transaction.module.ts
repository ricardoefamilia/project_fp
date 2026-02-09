import { Module } from '@nestjs/common';
import { UserTransactionEntityProvider } from './user-transaction.provider';
import { DatabaseModule } from 'src/config/database.module';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';

@Module({
  imports: [DatabaseModule],
  providers: [...UserTransactionEntityProvider, TransactionInterceptor],
  exports: [...UserTransactionEntityProvider, TransactionInterceptor],
})
export class UserTransactionModule {}
