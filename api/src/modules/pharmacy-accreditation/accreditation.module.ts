import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmacyAccreditation } from 'src/database/entities/postgres/pharmacy-accreditation.entity';
import { AccreditationReason } from 'src/database/entities/postgres/accreditation-reason.entity';
import { AccreditationService } from './accreditation.service';
import { AccreditationController } from './accreditation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PharmacyAccreditation, AccreditationReason], 'postgres')],
  controllers: [AccreditationController],
  providers: [AccreditationService],
  exports: [AccreditationService],
})
export class AccreditationModule {}

