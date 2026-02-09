import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'RL_SOCIO_PESSOA_JURIDICA', database: 'DBPESSOA'  })
export class RlSocioPessoaJuridicaEntity {
  @PrimaryColumn({ name: 'NU_CNPJ', type: 'varchar2', length: 14 })
  cnpj: string;

  @Column({ name: 'TP_SOCIO', type: 'varchar2', length: 1 })
  partnerType: string;

  @Column({ name: 'NU_DOCUMENTO_SOCIO', type: 'varchar2', length: 14 })
  partnerDocumentNumber: string;

  @Column({ name: 'NO_SOCIO', type: 'varchar2', length: 150 })
  partnerName: string;

  @Column({
    name: 'NU_PERCENTUAL_CAPITAL_SOCIAL',
    type: 'number',
    nullable: true,
  })
  capitalSharePercentage: number;
}
