import { MigrationInterface, QueryRunner } from 'typeorm';

export class UfTables1763821555857 implements MigrationInterface {
  name = 'UfTables1763821555857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "TB_UF" (
    "CO_UF_IBGE"              VARCHAR2(2)   NOT NULL,
    "SG_UF"                   VARCHAR2(2)   NOT NULL,
    "CO_REGIAO"               VARCHAR2(1),
    "CO_PAIS"                 NUMBER(3),
    "NO_UF"                   VARCHAR2(30),
    "CO_UF_SINPAS"            VARCHAR2(2),
    "NU_AREA"                 NUMBER(11,3),
    "CO_UF_LDO"               VARCHAR2(4),
    "NU_LATITUDE"             VARCHAR2(10),
    "CO_UF_INSS"              VARCHAR2(2),
    "CO_UF_SIAFI"             VARCHAR2(2),
    "NU_LONGITUDE"            VARCHAR2(10),
    "NU_ORDEM_REGIAO"         NUMBER(2),
    "DS_NATURALIDADE"         VARCHAR2(50),
    "CO_MUNICIPIO_IBGE_CAPITAL" VARCHAR2(6),
    "ST_REGISTRO_ATIVO"       VARCHAR2(1),
    "CO_ESTADO_SVS"           NUMBER(2),
    "NO_UF_ACENTUADO"         VARCHAR2(30),
    "CO_ISO_3166_2"           VARCHAR2(5),
    "ST_CADSUS"               VARCHAR2(1) DEFAULT 'S',
    CONSTRAINT PK_7737db16f908866a049c1aae758 PRIMARY KEY ("CO_UF_IBGE")
)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "TB_UF"`);
  }
}
