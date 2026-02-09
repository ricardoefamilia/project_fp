import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

console.log(
  'Oracle DB:',
  process.env.DB_HOST,
  process.env.DB_PORT,
  process.env.DB_USERNAME,
  process.env.DB_SERVICE_NAME,
);
console.log(
  'PostgreSQL DB:',
  process.env.POSTGRES_HOST,
  process.env.POSTGRES_PORT,
  process.env.POSTGRES_USERNAME,
  process.env.POSTGRES_DATABASE,
);

/**
 * Get Oracle DataSource options
 */
export const getOracleDataSourceOptions = (): DataSourceOptions => ({
  type: 'oracle',
  name: 'oracle', // Named connection
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '1521', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  serviceName: process.env.DB_SERVICE_NAME,
  entities: [__dirname + '/../database/entities/oracle/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/oracle/**/*{.ts,.js}'],
  // Auto-load any subscribers placed under src/database/subscribers
  subscribers: [__dirname + '/../database/subscribers/**/*{.ts,.js}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  extra: {
    poolMin: parseInt(process.env.DB_POOL_MIN || '2', 10),
    poolMax: parseInt(process.env.DB_POOL_SIZE || '10', 10),
  },
});

/**
 * Get PostgreSQL DataSource options
 */
export const getPostgresDataSourceOptions = (): DataSourceOptions => ({
  type: 'postgres',
  name: 'postgres', // Named connection
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USERNAME || 'root',
  password: process.env.POSTGRES_PASSWORD || 'root',
  database: process.env.POSTGRES_DATABASE || 'fpapi',
  entities: [__dirname + '/../database/entities/postgres/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/postgres/**/*{.ts,.js}'],
  subscribers: [__dirname + '/../database/subscribers/**/*{.ts,.js}'],
  synchronize: process.env.POSTGRES_SYNCHRONIZE === 'true',
  logging: process.env.POSTGRES_LOGGING === 'true',
  extra: {
    max: parseInt(process.env.POSTGRES_POOL_SIZE || '10', 10),
    min: parseInt(process.env.POSTGRES_POOL_MIN || '2', 10),
  },
});

/**
 * Get default DataSource options (Oracle for backward compatibility)
 */
export const getDataSourceOptions = (): DataSourceOptions => getOracleDataSourceOptions();

/**
 * Oracle DataSource (default connection)
 */
export const oracleDataSource = new DataSource(getOracleDataSourceOptions());

/**
 * PostgreSQL DataSource
 */
export const postgresDataSource = new DataSource(getPostgresDataSourceOptions());

/**
 * Default DataSource (Oracle) for backward compatibility
 */
export const dataSource = oracleDataSource;

/**
 * Initialize Oracle DataSource
 */
export const initializeOracleDataSource = async (): Promise<DataSource> => {
  if (!oracleDataSource.isInitialized) {
    await oracleDataSource.initialize();
    console.log('✅ Oracle DataSource initialized');
  }
  return oracleDataSource;
};

/**
 * Initialize PostgreSQL DataSource
 */
export const initializePostgresDataSource = async (): Promise<DataSource> => {
  if (!postgresDataSource.isInitialized) {
    await postgresDataSource.initialize();
    console.log('✅ PostgreSQL DataSource initialized');
  }
  return postgresDataSource;
};

/**
 * Initialize default DataSource (Oracle) for backward compatibility
 */
export const initializeDataSource = async (): Promise<DataSource> => {
  return initializeOracleDataSource();
};

export default dataSource;
