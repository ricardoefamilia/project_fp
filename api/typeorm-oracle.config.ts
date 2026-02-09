import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// Load environment variables
config();

// Oracle DataSource (default for migrations)
export default new DataSource({
  type: 'oracle',
  name: 'oracle',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1521', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  serviceName: process.env.DB_SERVICE_NAME || 'FPAPI',
  entities: ['src/database/entities/oracle/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/oracle/**/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
