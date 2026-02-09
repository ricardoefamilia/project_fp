import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RlSocioPessoaJuridicaEntity } from '../../database/entities/oracle/person-rel-legal-associate.entity';

@Injectable()
export class PersonRelLegalAssociateService {
  constructor(
    @InjectRepository(RlSocioPessoaJuridicaEntity, 'oracle')
    private readonly rlSocioPessoaJuridicaRepository: Repository<RlSocioPessoaJuridicaEntity>,
  ) {}

  async findByCnpjAndCpf(cnpj: string, cpf: string): Promise<RlSocioPessoaJuridicaEntity | null> {
    const record = await this.rlSocioPessoaJuridicaRepository.findOne({
      where: {
        cnpj,
        partnerDocumentNumber: cpf,
      },
    });

    if (!record) {
      throw new NotFoundException(`Record not found for CNPJ ${cnpj} and CPF ${cpf}`);
    }

    return record;
  }
}