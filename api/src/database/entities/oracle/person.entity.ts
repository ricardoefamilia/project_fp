import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TB_PESSOA', database: 'DBPESSOA' })
export class Person {
  @PrimaryColumn({ name: 'NU_CPF_CNPJ_PESSOA', type: 'varchar2', length: 14 })
  personDocument: string;

  @Column({ name: 'NO_PESSOA', type: 'varchar2', length: 150 })
  personName: string;

  @Column({ name: 'ST_REGISTRO_ATIVO', type: 'varchar2', length: 1 })
  isActive: string;

  @Column({ name: 'NO_LOGRADOURO', type: 'varchar2', length: 100, nullable: true })
  streetName: string | null;

  @Column({ name: 'NU_LOGRADOURO', type: 'varchar2', length: 7, nullable: true })
  streetNumber: string | null;

  @Column({ name: 'DS_COMPLEMENTO', type: 'varchar2', length: 160, nullable: true })
  addressComplement: string | null;

  @Column({ name: 'NO_BAIRRO', type: 'varchar2', length: 50, nullable: true })
  neighborhood: string | null;

  @Column({ name: 'NU_CEP', type: 'varchar2', length: 8, nullable: true })
  postalCode: string | null;

  @Column({ name: 'NO_MUNICIPIO', type: 'varchar2', length: 50, nullable: true })
  cityName: string | null;

  @Column({ name: 'CO_MUNICIPIO_IBGE', type: 'varchar2', length: 6, nullable: true })
  cityIbgeCode: string | null;

  @Column({ name: 'SG_UF', type: 'varchar2', length: 2, nullable: true })
  stateUf: string | null;

  @Column({ name: 'NU_TELEFONE', type: 'varchar2', length: 11, nullable: true })
  phoneNumber: string | null;

  @Column({ name: 'NU_DDD', type: 'varchar2', length: 4, nullable: true })
  areaCode: string | null;

  @Column({ name: 'NU_DDI', type: 'varchar2', length: 5, nullable: true })
  countryCode: string | null;

  @Column({ name: 'NU_RAMAL', type: 'varchar2', length: 5, nullable: true })
  extensionNumber: string | null;

  @Column({ name: 'DT_ATUALIZACAO_RFB', type: 'date', nullable: true })
  rfbUpdateDate: Date | null;

  @Column({ name: 'DT_PROCESSAMENTO', type: 'date', nullable: true })
  processingDate: Date | null;

  @Column({ name: 'DT_INSCRICAO', type: 'date', nullable: true })
  registrationDate: Date | null;
}
