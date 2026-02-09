import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TB_MUNICIPIO', database: 'DBGERAL' })
export class City {
  @ApiProperty({ description: 'IBGE code of the city', example: '123456' })
  @PrimaryColumn({ name: 'CO_MUNICIPIO_IBGE', type: 'varchar2', length: 6 })
  ibgeCode: string;

  @ApiProperty({ description: 'Health region code of the city', example: '1234' })
  @Column({ name: 'CO_REGIONAL_SAUDE', type: 'varchar2', length: 4, nullable: true })
  healthRegionCode?: string;

  @ApiProperty({ description: 'State acronym of the city', example: 'SP' })
  @Column({ name: 'SG_UF', type: 'varchar2', length: 2 })
  stateAcronym: string;

  @ApiProperty({ description: 'Macroregion code of the city', example: '1234' })
  @Column({ name: 'CO_MACRORREGIONAL', type: 'varchar2', length: 4, nullable: true })
  macroregionCode?: string;

  @ApiProperty({ description: 'Mesoregion code of the city', example: '1234' })
  @Column({ name: 'CO_MESORREGIAO', type: 'varchar2', length: 4, nullable: true })
  mesoregionCode?: string;

  @ApiProperty({ description: 'Microregion code of the city', example: '12345' })
  @Column({ name: 'CO_MICRORREGIAO', type: 'varchar2', length: 5, nullable: true })
  microregionCode?: string;

  @ApiProperty({ description: 'UF IBGE code of the city', example: 'SP' })
  @Column({ name: 'CO_UF_IBGE', type: 'varchar2', length: 2, nullable: true })
  ufIbgeCode?: string;

  @ApiProperty({ description: 'Municipality name of the city', example: 'São Paulo' })
  @Column({ name: 'NO_MUNICIPIO', type: 'varchar2', length: 60 })
  municipalityName: string;

  @ApiProperty({ description: 'Municipality acronym of the city', example: 'SP' })
  @Column({ name: 'SG_MUNICIPIO', type: 'varchar2', length: 3, nullable: true })
  municipalityAcronym?: string;

  @ApiProperty({ description: 'Area code of the city', example: '11' })
  @Column({ name: 'NU_DDD', type: 'varchar2', length: 4, nullable: true })
  areaCode?: string;

  @ApiProperty({ description: 'Postal code of the city', example: '12345678' })
  @Column({ name: 'NU_CEP', type: 'varchar2', length: 8, nullable: true })
  postalCode?: string;

  @ApiProperty({ description: 'IBGE digit of the city', example: '1' })
  @Column({ name: 'DV_MUNICIPIO_IBGE', type: 'varchar2', length: 1, nullable: true })
  ibgeDigit?: string;

  @ApiProperty({ description: 'Successor code of the city', example: '123456' })
  @Column({ name: 'CO_SUCESSOR', type: 'varchar2', length: 6, nullable: true })
  successorCode?: string;

  @ApiProperty({ description: 'IBGE status of the city', example: 'S' })
  @Column({ name: 'ST_IBGE', type: 'varchar2', length: 1, nullable: true })
  isIbge?: string;

  @ApiProperty({ description: 'SVS municipality code of the city', example: 123456 })
  @Column({ name: 'CO_MUNICIPIO_SVS', type: 'number', precision: 6, nullable: true })
  svsMunicipalityCode?: number;
}
