import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Uf } from 'src/database/entities/oracle/uf.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UfsService {
  constructor(
    @InjectRepository(Uf, 'oracle')
    private ufsRepository: Repository<Uf>,
  ) {}

  async findAll(): Promise<Uf[]> {
    return await this.ufsRepository.find();
  }
}
