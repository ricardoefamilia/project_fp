import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from 'src/database/entities/oracle/city.entity';
import { CitiesControllers } from './city.controller';
import { CitiesService } from './city.service';

@Module({
  imports: [TypeOrmModule.forFeature([City], 'oracle')],
  controllers: [CitiesControllers],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CityModule {}
