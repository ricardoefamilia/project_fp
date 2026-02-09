import { DATA_SOURCE } from 'src/config/database.module';
import { UserTransaction } from 'src/database/entities/postgres/user-transaction.entity';
import { DataSource } from 'typeorm';

export const UserTransactionEntityProvider = [
  {
    provide: 'USER_TRANSACTION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserTransaction),
    inject: [DATA_SOURCE],
  },
];
