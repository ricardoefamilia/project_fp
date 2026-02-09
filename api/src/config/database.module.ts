import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  dataSource,
  getOracleDataSourceOptions,
  getPostgresDataSourceOptions,
  oracleDataSource,
  postgresDataSource,
} from './database.config';

/**
 * Custom injection token for Oracle DataSource
 * Use this to inject the Oracle DataSource in your services and controllers
 * Example: constructor(@Inject(ORACLE_DATA_SOURCE) private dataSource: DataSource) {}
 */
export const ORACLE_DATA_SOURCE = Symbol('ORACLE_DATA_SOURCE');

/**
 * Custom injection token for PostgreSQL DataSource
 * Use this to inject the PostgreSQL DataSource in your services and controllers
 * Example: constructor(@Inject(POSTGRES_DATA_SOURCE) private dataSource: DataSource) {}
 */
export const POSTGRES_DATA_SOURCE = Symbol('POSTGRES_DATA_SOURCE');

/**
 * Custom injection token for default DataSource (Oracle for backward compatibility)
 * Use this to inject the DataSource in your services and controllers
 * Example: constructor(@Inject(DATA_SOURCE) private dataSource: DataSource) {}
 */
export const DATA_SOURCE = Symbol('DATA_SOURCE');

@Global()
@Module({
  imports: [
    // Oracle connection (default)
    TypeOrmModule.forRootAsync({
      name: 'oracle',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options = getOracleDataSourceOptions();

        // Override with ConfigService values if needed
        return {
          ...options,
          synchronize: configService.get('DB_SYNCHRONIZE', 'false') === 'true',
          logging: configService.get('DB_LOGGING', 'false') === 'true',
        };
      },
      dataSourceFactory: async () => {
        if (!oracleDataSource.isInitialized) {
          await oracleDataSource.initialize();
          console.log('✅ Oracle DataSource initialized for NestJS');
        }
        return oracleDataSource;
      },
    }),
    // PostgreSQL connection
    TypeOrmModule.forRootAsync({
      name: 'postgres',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options = getPostgresDataSourceOptions();

        // Override with ConfigService values if needed
        return {
          ...options,
          synchronize: configService.get('POSTGRES_SYNCHRONIZE', 'false') === 'true',
          logging: configService.get('POSTGRES_LOGGING', 'false') === 'true',
        };
      },
      dataSourceFactory: async () => {
        if (!postgresDataSource.isInitialized) {
          await postgresDataSource.initialize();
          console.log('✅ PostgreSQL DataSource initialized for NestJS');
        }
        return postgresDataSource;
      },
    }),
  ],
  providers: [
    {
      provide: ORACLE_DATA_SOURCE,
      useFactory: () => oracleDataSource,
    },
    {
      provide: POSTGRES_DATA_SOURCE,
      useFactory: () => postgresDataSource,
    },
    {
      provide: DATA_SOURCE,
      useFactory: () => dataSource, // Default to Oracle for backward compatibility
    },
  ],
  exports: [ORACLE_DATA_SOURCE, POSTGRES_DATA_SOURCE, DATA_SOURCE],
})
export class DatabaseModule {}
