import { MigrationInterface, QueryRunner } from "typeorm";

export class PersonsTable1764290941001 implements MigrationInterface {
  name = 'PersonsTable1764290941001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "TB_PESSOA" (
    "NU_CPF_CNPJ_PESSOA" VARCHAR2(14) NOT NULL,
    "NO_PESSOA" VARCHAR2(150) NOT NULL,
    "ST_REGISTRO_ATIVO" VARCHAR2(1) NOT NULL,
    "NO_LOGRADOURO" VARCHAR2(100),
    "NU_LOGRADOURO" VARCHAR2(7),
    "DS_COMPLEMENTO" VARCHAR2(160),
    "NO_BAIRRO" VARCHAR2(50),
    "NU_CEP" VARCHAR2(8),
    "NO_MUNICIPIO" VARCHAR2(50),
    "CO_MUNICIPIO_IBGE" VARCHAR2(6),
    "SG_UF" VARCHAR2(2),
    "NU_TELEFONE" VARCHAR2(11),
    "NU_DDD" VARCHAR2(4),
    "NU_DDI" VARCHAR2(5),
    "NU_RAMAL" VARCHAR2(5),
    "DT_ATUALIZACAO_RFB" DATE,
    "DT_PROCESSAMENTO" DATE,
    "DT_INSCRICAO" DATE,

      CONSTRAINT "PK_7737db16f908866a049c1aae961" PRIMARY KEY ("NU_CPF_CNPJ_PESSOA"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "TB_PESSOA"`);
  }

}
