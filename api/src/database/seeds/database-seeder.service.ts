import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Uf } from '../entities/oracle/uf.entity';
import { ufMocks } from './uf.seed';

@Injectable()
export class DatabaseSeederService {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(
    @InjectRepository(Uf, 'oracle')
    private readonly ufRepository: Repository<Uf>,
  ) {}

  async seedDatabase(): Promise<void> {
    await this.seedUfs();
  }

  private async seedUfs(): Promise<void> {
    try {
      // Verifica se já existem dados na tabela
      const count = await this.ufRepository.count();

      if (count > 0) {
        this.logger.log(`UFs já cadastradas (${count} registros). Pulando seed.`);
        return;
      }

      this.logger.log('Iniciando seed de UFs...');

      // Insere os dados
      for (const ufData of ufMocks) {
        try {
          const uf = this.ufRepository.create(ufData);
          await this.ufRepository.save(uf);
          this.logger.debug(`UF ${ufData.sgUf} inserida com sucesso`);
        } catch (error) {
          this.logger.error(`Erro ao inserir UF ${ufData.sgUf}:`, error);
        }
      }

      this.logger.log(`✅ Seed de UFs concluído! ${ufMocks.length} estados cadastrados.`);
    } catch (error) {
      this.logger.error('Erro ao fazer seed de UFs:', error);
      throw error;
    }
  }
}
