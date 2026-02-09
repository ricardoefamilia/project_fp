import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TB_PESSOA_JURIDICA', database: 'DBPESSOA'  })
export class PersonLegal {
  @PrimaryColumn({ name: 'NU_CNPJ', type: 'varchar2', length: 14 })
  cnpj: string;

  @Column({ name: 'DT_ABERTURA', type: 'date', nullable: true })
  openingDate: Date;

  @Column({ name: 'NO_FANTASIA', type: 'varchar2', length: 250, nullable: true })
  tradeName: string;

  @Column({ name: 'CO_NATUREZA_JURIDICA', type: 'varchar2', length: 4, nullable: true })
  legalNatureCode: string;

  @Column({ name: 'TP_SITUACAO_CNPJ', type: 'number', precision: 1, nullable: true })
  cnpjStatusType: number;

  @Column({ name: 'DT_SITUACAO_CNPJ', type: 'date', nullable: true })
  cnpjStatusDate: Date;

  @Column({ name: 'DS_SITUACAO_CNPJ', type: 'varchar2', length: 500, nullable: true })
  cnpjStatusDescription: string;

  @Column({ name: 'TP_MATRIZ_FILIAL', type: 'number', precision: 1, nullable: true })
  branchType: number;

  @Column({ name: 'NO_CIDADE_EXTERIOR', type: 'varchar2', length: 60, nullable: true })
  foreignCityName: string;

  @Column({ name: 'CO_PAIS', type: 'varchar2', length: 3, nullable: true })
  countryCode: string;

  @Column({ name: 'NO_PAIS', type: 'varchar2', length: 70, nullable: true })
  countryName: string;

  @Column({ name: 'TP_LOGRADOURO', type: 'varchar2', length: 30, nullable: true })
  streetType: string;

  @Column({ name: 'NU_DDD', type: 'varchar2', length: 4, nullable: true })
  phoneAreaCode: string;

  @Column({ name: 'NU_TELEFONE', type: 'varchar2', length: 8, nullable: true })
  phoneNumber: string;

  @Column({ name: 'NU_DDD_FAX', type: 'varchar2', length: 4, nullable: true })
  faxAreaCode: string;

  @Column({ name: 'NU_FAX', type: 'varchar2', length: 8, nullable: true })
  faxNumber: string;

  @Column({ name: 'DS_EMAIL', type: 'varchar2', length: 115, nullable: true })
  email: string;

  @Column({ name: 'NU_CPF_RESPONSAVEL', type: 'varchar2', length: 11, nullable: true })
  responsibleCpf: string;

  @Column({ name: 'NU_CAPITAL_SOCIAL', type: 'number', nullable: true })
  shareCapital: number;

  @Column({ name: 'CO_PORTE_EMPRESA', type: 'varchar2', length: 2, nullable: true })
  companySizeCode: string;

  @Column({ name: 'ST_OPCAO_SIMPLES', type: 'varchar2', length: 1, nullable: true })
  isSimplesOption: string;

  @Column({ name: 'DT_OPCAO_SIMPLES', type: 'date', nullable: true })
  simplesOptionDate: Date;

  @Column({ name: 'DT_EXCLUSAO_OPCAO_SIMPLES', type: 'date', nullable: true })
  simplesExclusionDate: Date;

  @Column({ name: 'NU_CNPJ_SUCEDIDA', type: 'varchar2', length: 14, nullable: true })
  predecessorCnpj: string;

  @Column({ name: 'ST_REGISTRO_ATIVO', type: 'varchar2', length: 1, nullable: true })
  isActive: string;

  @Column({ name: 'CO_OPCAO_SIMPLES', type: 'varchar2', length: 1, nullable: true })
  simplesOptionCode: string;

  @Column({ name: 'NU_CNPJ_SUCESSORA', type: 'varchar2', length: 14, nullable: true })
  successorCnpj: string;
}
