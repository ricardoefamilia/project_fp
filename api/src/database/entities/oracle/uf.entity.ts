import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TB_UF' })
export class Uf {
  @ApiProperty({ description: 'UF IBGE code of the state', example: 'SP' })
  @PrimaryColumn({ type: 'varchar2', length: 2, name: 'CO_UF_IBGE' })
  codUfIbge: string;

  @ApiProperty({ description: 'UF acronym of the state', example: 'SP' })
  @Column({ type: 'varchar2', length: 2, name: 'SG_UF' })
  sgUf: string;

  @ApiProperty({ description: 'Region code of the state', example: '1234' })
  @Column({ type: 'varchar2', length: 1, name: 'CO_REGIAO', nullable: true })
  codRegion: string;

  @ApiProperty({ description: 'Country code of the state', example: 1234 })
  @Column({ type: 'number', nullable: true, name: 'CO_PAIS' })
  codCountry: number;

  @ApiProperty({ description: 'UF name of the state', example: 'São Paulo' })
  @Column({ type: 'varchar2', length: 30, name: 'NO_UF', nullable: true })
  nameUf: string;

  @ApiProperty({ description: 'UF SINPAS code of the state', example: 'SP' })
  @Column({ type: 'varchar2', length: 2, name: 'CO_UF_SINPAS', nullable: true })
  codUfSinpas: string;

  @ApiProperty({ description: 'UF area of the state', example: 123456 })
  @Column({ type: 'number', nullable: true, precision: 10, scale: 3, name: 'NU_AREA' })
  numArea: number;

  @ApiProperty({ description: 'UF LDO code of the state', example: 'SP' })
  @Column({ type: 'varchar2', length: 4, name: 'CO_UF_LDO', nullable: true })
  codUfldo: string;

  @ApiProperty({ description: 'UF latitude of the state', example: '123456' })
  @Column({ type: 'varchar2', length: 10, name: 'NU_LATITUDE', nullable: true })
  numLatitude: string;

  @ApiProperty({ description: 'UF INSS code of the state', example: 'SP' })
  @Column({ type: 'varchar2', length: 2, name: 'CO_UF_INSS', nullable: true })
  codUfInss: string;

  @ApiProperty({ description: 'UF SIAFI code of the state', example: 'SP' })
  @Column({ type: 'varchar2', length: 2, name: 'CO_UF_SIAFI', nullable: true })
  codUfSiafi: string;

  @ApiProperty({ description: 'UF longitude of the state', example: '123456' })
  @Column({ type: 'varchar2', length: 10, name: 'NU_LONGITUDE', nullable: true })
  numLongitude: string;

  @ApiProperty({ description: 'UF order region of the state', example: 123456 })
  @Column({ type: 'number', nullable: true, name: 'NU_ORDEM_REGIAO' })
  numOrderRegion: number;

  @ApiProperty({ description: 'UF naturalidade of the state', example: 'São Paulo' })
  @Column({ type: 'varchar2', length: 50, name: 'DS_NATURALIDADE', nullable: true })
  dsNatural: string;

  @ApiProperty({ description: 'UF capital city code of the state', example: '123456' })
  @Column({ type: 'varchar2', length: 6, name: 'CO_MUNICIPIO_IBGE_CAPITAL', nullable: true })
  codCityIbgeCapital: string;

  @ApiProperty({ description: 'UF active registry of the state', example: 'S' })
  @Column({ type: 'varchar2', length: 1, name: 'ST_REGISTRO_ATIVO', nullable: true })
  stActiveRegistry: string;

  @ApiProperty({ description: 'UF SVS code of the state', example: 123456 })
  @Column({ type: 'number', nullable: true, name: 'CO_ESTADO_SVS' })
  codStateSvs: number;

  @ApiProperty({ description: 'UF marked name of the state', example: 'São Paulo' })
  @Column({ type: 'varchar2', length: 30, name: 'NO_UF_ACENTUADO', nullable: true })
  numUfMarked: string;

  @ApiProperty({ description: 'UF ISO 3166-2 code of the state', example: 'SP' })
  @Column({ type: 'varchar2', length: 5, name: 'CO_ISO_3166_2', nullable: true })
  codIso31662: string;

  @ApiProperty({ description: 'UF CADSUS status of the state', example: 'S' })
  @Column({ type: 'varchar2', length: 1, default: 'S', name: 'ST_CADSUS', nullable: true })
  stCadSus: string;
}
