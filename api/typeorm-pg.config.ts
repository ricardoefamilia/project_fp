import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// Load environment variables
config();

// Oracle DataSource (default for migrations)
export default new DataSource({
  type: 'postgres',
  name: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USERNAME || 'root',
  password: process.env.POSTGRES_PASSWORD || 'root',
  database: process.env.POSTGRES_DATABASE || 'fpapi',
  entities: ['src/database/entities/postgres/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/postgres/**/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
