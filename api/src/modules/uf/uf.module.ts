import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uf } from 'src/database/entities/oracle/uf.entity';
import { UfsControllers } from './uf.controller';
import { UfsService } from './uf.service';

@Module({
  imports: [TypeOrmModule.forFeature([Uf], 'oracle')],
  controllers: [UfsControllers],
  providers: [UfsService],
  exports: [UfsService],
})
export class UfsModule {}
