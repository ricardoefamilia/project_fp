import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryModule } from 'src/common/telemetry/telemetry.module';
import { Pharmacy } from 'src/database/entities/postgres/pharmacy.entity';
import { PharmacysController } from './pharmacys.controller';
import { PharmacysService } from './pharmacys.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pharmacy], 'postgres'), TelemetryModule],
  controllers: [PharmacysController],
  providers: [PharmacysService],
  exports: [PharmacysService],
})
export class PharmacysModule {}
