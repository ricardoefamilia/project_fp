import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { z } from 'zod';
import { HealthModule } from './common/health/health.module';
import { TelemetryModule } from './common/telemetry/telemetry.module';
import { TelemetryService } from './common/telemetry/telemetry.service';
import { DatabaseModule } from './config/database.module';
import { DatabaseSeederModule } from './database/seeds/database-seeder.module';
import { AuthModule } from './modules/auth/auth.module';
import { CityModule } from './modules/city/city.module';
import { AccreditationModule } from './modules/pharmacy-accreditation/accreditation.module';
import { PharmacysModule } from './modules/pharmacys/pharmacys.module';
import { UfsModule } from './modules/uf/uf.module';
import { UsersModule } from './modules/users/users.module';
import { UserTransactionModule } from './modules/usertransaction/user-transaction.module';
import { OccurrencesModule } from './modules/pharmacy-occurrences/occurrences.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: (config: Record<string, unknown>) => {
        return z
          .object({
            NODE_ENV: z.string(),
            APP_NAME: z.string(),
            APP_URL: z.string(),
            PORT: z.string(),
            // Oracle database configuration
            DB_HOST: z.string(),
            DB_PORT: z.string(),
            DB_USERNAME: z.string(),
            DB_PASSWORD: z.string(),
            DB_SERVICE_NAME: z.string(),
            DB_POOL_SIZE: z.string().optional(),
            DB_POOL_MIN: z.string().optional(),
            DB_SYNCHRONIZE: z.string().optional(),
            DB_LOGGING: z.string().optional(),
            // PostgreSQL database configuration (optional)
            POSTGRES_HOST: z.string().optional(),
            POSTGRES_PORT: z.string().optional(),
            POSTGRES_USERNAME: z.string().optional(),
            POSTGRES_PASSWORD: z.string().optional(),
            POSTGRES_DATABASE: z.string().optional(),
            POSTGRES_POOL_SIZE: z.string().optional(),
            POSTGRES_POOL_MIN: z.string().optional(),
            POSTGRES_SYNCHRONIZE: z.string().optional(),
            POSTGRES_LOGGING: z.string().optional(),
          })
          .parse(config);
      },
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CityModule,
    UfsModule,
    PharmacysModule,
    UserTransactionModule,
    TelemetryModule,
    DatabaseSeederModule,
    AccreditationModule,
    OccurrencesModule,
  ],
  providers: [AuthGuard, TelemetryService],
  controllers: [],
})
export class AppModule {}
