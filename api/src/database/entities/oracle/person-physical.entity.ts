import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TB_PESSOA_FISICA', database: 'DBPESSOA'  })
export class PersonPhysical {
  @PrimaryColumn({ name: 'NU_CPF', type: 'varchar2', length: 11 })
  cpf: string;

  @Column({ name: 'DT_NASCIMENTO', type: 'date', nullable: true })
  birthDate: Date;

  @Column({ name: 'NO_MAE', type: 'varchar2', length: 70, nullable: true })
  motherName: string;

  @Column({ name: 'TP_SEXO', type: 'number', precision: 1, nullable: true })
  sexType: number;

  @Column({ name: 'TP_SITUACAO_CPF', type: 'number', precision: 1, nullable: true })
  cpfStatusType: number;

  @Column({ name: 'SG_SEXO', type: 'varchar2', length: 1, nullable: true })
  sexAbbreviation: string;

  @Column({ name: 'ST_RESIDENTE_EXTERIOR', type: 'varchar2', length: 1, nullable: true })
  isForeignResident: string;

  @Column({ name: 'CO_PAIS_EXTERIOR', type: 'varchar2', length: 4, nullable: true })
  foreignCountryCode: string;

  @Column({ name: 'NO_PAIS_EXTERIOR', type: 'varchar2', length: 60, nullable: true })
  foreignCountryName: string;

  @Column({ name: 'CO_NATUREZA_OCUPACAO', type: 'varchar2', length: 3, nullable: true })
  occupationNatureCode: string;

  @Column({ name: 'CO_OCUPACAO_PRINCIPAL', type: 'varchar2', length: 3, nullable: true })
  mainOccupationCode: string;

  @Column({ name: 'NU_ANO_EXERCICIO_NATOCUP', type: 'varchar2', length: 4, nullable: true })
  occupationYear: string;

  @Column({ name: 'CO_UNIDADE_ADMINISTRATIVA', type: 'varchar2', length: 7, nullable: true })
  administrativeUnitCode: string;

  @Column({ name: 'NU_ANO_OBITO', type: 'varchar2', length: 4, nullable: true })
  deathYear: string;

  @Column({ name: 'ST_ESTRANGEIRO', type: 'varchar2', length: 1, nullable: true })
  isForeigner: string;

  @Column({ name: 'NU_TITULO_ELEITOR', type: 'varchar2', length: 13, nullable: true })
  voterRegistration: string;

  @Column({ name: 'NU_CARTAO_SUS', type: 'varchar2', length: 15, nullable: true })
  susCardNumber: string;

  @Column({ name: 'NO_PAIS_NACIONALIDADE', type: 'varchar2', length: 60, nullable: true })
  nationalityCountryName: string;

  @Column({ name: 'CO_MUNICIPIO_IBGE_NATURALIDADE', type: 'varchar2', length: 6, nullable: true })
  birthplaceIbgeCode: string;

  @Column({ name: 'NO_MUNICIPIO_NATURALIDADE', type: 'varchar2', length: 50, nullable: true })
  birthplaceCityName: string;

  @Column({ name: 'SG_UF_NATURALIDADE', type: 'varchar2', length: 2, nullable: true })
  birthplaceStateUf: string;

  @Column({ name: 'NO_UNIDADE_ADMINISTRATIVA', type: 'varchar2', length: 50, nullable: true })
  administrativeUnitName: string;

  @Column({ name: 'NO_SOCIAL_PESSOA', type: 'varchar2', length: 150, nullable: true })
  socialName: string;
}
