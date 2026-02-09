import { MigrationInterface, QueryRunner } from 'typeorm';

export class PharmacysTable1763636263126 implements MigrationInterface {
  name = 'PharmacysTable1763636263126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "TB_FARMACIA" ("NU_CNPJ" varchar(14) NOT NULL, "NU_CNPJ_MATRIZ" varchar(14), "NU_LICENCA" varchar(20), "NO_ORGAO_VIGILANCIA" varchar(50), "TP_EMPRESA" varchar(1), "NO_RAZAO_SOCIAL" varchar(100), "DS_ENDERECO" varchar(100), "NO_BAIRRO" varchar(120), "CO_MUNICIPIO_IBGE" varchar(6), "NU_CEP" varchar(8), "NU_DDD" varchar(4), "NU_TELEFONE" varchar(10), "DS_EMAIL" varchar(60), "NO_RESP_LEGAL" varchar(70), "NU_CPF_RESP_LEGAL" varchar(11), "NO_RESP_TECNICO" varchar(70), "NU_CPF_RESP_TECNICO" varchar(11), "NU_CRF" varchar(7), "SG_UF_CRF" varchar(2), "ST_FUNCIONAMENTO" varchar(1) NOT NULL, "CO_USUARIO_INCLUSAO" varchar(255) NOT NULL, "DT_INCLUSAO" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "CO_USUARIO_ALTERACAO" varchar(255) NOT NULL, "DT_ALTERACAO" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "NU_CNPJ_CONCENTRADOR" varchar(14), "NU_IDENTIFICADOR" varchar(6), "ST_CONCENTRADOR" varchar(1) DEFAULT 'N', "TP_RECEBIMENTO_EMAIL" varchar(1), "NO_FANTASIA" varchar(120), "DT_PUBLICACAO_DOU" timestamp, "NU_PROCESSO_SIPAR" varchar(21), "ST_BLOQUEIO" varchar(1), "DT_BLOQUEIO" timestamp, "CO_MOTIVO_BLOQUEIO" integer, "ST_UNIDADE_PROPRIA" varchar(1) DEFAULT 'N', "NU_REG_COMERCIAL" varchar(11), "EFETUA_VENDAS" varchar(1), "CUPOM_VINCULADO" varchar(1), "QT_BLOQUEIO" varchar(3), "DT_RENOV_RTA" timestamp, "DT_RECEB_MDS" timestamp, "NU_DDD2" varchar(4), "NU_TELEFONE2" varchar(10), "NU_DDD3" varchar(4), "NU_FAX" varchar(10), "NO_CONTATO" varchar(70), "NU_CPF_CONTATO" varchar(11), "NU_DDD_C" varchar(4), "NU_TELEFONE_C" varchar(10), "NU_CERTIDAO_INSS" varchar(18), "DT_VENCIMENTO_CND" timestamp, "DS_EMAIL_CONTATO" varchar(60), "DT_VENCIMENTO_AUTORIZACAO" timestamp, "CO_BANCO" varchar(3), "CO_AGENCIA_BANCARIA" varchar(6), "DS_ESFERA" varchar(1), "ST_EFETUA_VENDAS" varchar(1), "ST_CUPOM_VINCULADO" varchar(1), "NU_QTD_BLOQUEIO" varchar(3), "CO_CNAE" varchar(7), "TP_SOCIEDADE" varchar(80), "TP_LOGRADOURO" varchar(30), "NU_LOGRADOURO" varchar(7), "DS_COMPLEMENTO" varchar(160), "CO_FARMACIA_BLOQUEIO" integer, "ST_MIGRACAO" varchar(2), "DT_MIGRACAO" timestamp, CONSTRAINT "PK_7737db16f908866a049c1aae729" PRIMARY KEY ("NU_CNPJ"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "TB_FARMACIA"`);
  }
}
