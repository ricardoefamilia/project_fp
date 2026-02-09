import { MigrationInterface, QueryRunner } from 'typeorm';

export class BetterAuthTables1760646933071 implements MigrationInterface {
  name = 'BetterAuthTables1760646933071';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "TB_VERIFICACAO" ("CO_ID_VERIFICACAO" uuid DEFAULT gen_random_uuid(), "DS_IDENTIFICADOR" varchar(255) NOT NULL, "DS_VALOR" varchar(500) NOT NULL, "DT_EXPIRACAO" timestamp NOT NULL, "DT_CRIACAO" timestamp DEFAULT CURRENT_TIMESTAMP, "DT_ATUALIZACAO" timestamp DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_81d4e56e2d16c2ac93d96b1b0f1" PRIMARY KEY ("CO_ID_VERIFICACAO"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4b32c75259648e1833c43a884c" ON "TB_VERIFICACAO" ("DS_IDENTIFICADOR")`,
    );
    await queryRunner.query(
      `CREATE TABLE "TB_USUARIO" ("CO_ID_USUARIO" uuid DEFAULT gen_random_uuid(), "DS_EMAIL" varchar(255) NOT NULL, "ST_EMAIL_VERIFICADO" boolean DEFAULT false, "NO_USUARIO" varchar(255), "IM_URL_IMAGEM" varchar(500), "DT_CRIACAO" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "DT_ATUALIZACAO" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "ST_2FA_HABILITADO" boolean DEFAULT false NOT NULL, "NO_PERFIL" varchar(50), "ST_BANIDO" boolean DEFAULT false NOT NULL, "DS_MOTIVO_BANIMENTO" varchar(255), "DT_EXPIRACAO_BANIMENTO" timestamp, CONSTRAINT "UQ_dbe2da2896a996db6c2f1f327d9" UNIQUE ("DS_EMAIL"), CONSTRAINT "PK_6917632b73f242284906642abf9" PRIMARY KEY ("CO_ID_USUARIO"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "TB_2FA" ("CO_ID_2FA" uuid DEFAULT gen_random_uuid(), "CO_ID_USUARIO" uuid NOT NULL, "DS_SECRET" varchar(500) NOT NULL, "DS_BACKUP_CODES" text, "DT_CRIACAO" timestamp DEFAULT CURRENT_TIMESTAMP, "DT_ATUALIZACAO" timestamp DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_59c743389ab574f87ae2e231162" PRIMARY KEY ("CO_ID_2FA"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_56b9dd53f8f670658c8bc689b4" ON "TB_2FA" ("CO_ID_USUARIO")`,
    );
    await queryRunner.query(
      `CREATE TABLE "TB_SESSAO" ("CO_ID_SESSAO" uuid DEFAULT gen_random_uuid(), "CO_ID_USUARIO" uuid NOT NULL, "DS_TOKEN" varchar(500) NOT NULL, "DT_EXPIRACAO" timestamp NOT NULL, "DS_ENDERECO_IP" varchar(255), "DS_USER_AGENT" varchar(500), "CO_ID_USUARIO_IMPERSONANTE" uuid, "CO_ID_ORGANIZACAO_ATIVA" uuid, CONSTRAINT "UQ_79ff926fdbbfa67381d0f990f19" UNIQUE ("DS_TOKEN"), CONSTRAINT "PK_49adc2c17a0bebeed1da1366a55" PRIMARY KEY ("CO_ID_SESSAO"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5e74176e65242ec959720ae00a" ON "TB_SESSAO" ("CO_ID_USUARIO")`,
    );
    await queryRunner.query(
      `CREATE TABLE "TB_ORGANIZACAO" ("CO_ID_ORGANIZACAO" uuid DEFAULT gen_random_uuid(), "NO_ORGANIZACAO" varchar(255) NOT NULL, "DS_SLUG" varchar(255), "IM_URL_LOGO" varchar(500), "DT_CRIACAO" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "DS_METADADOS" text, CONSTRAINT "UQ_f501f550d59014cd05741d87b2e" UNIQUE ("DS_SLUG"), CONSTRAINT "PK_5e84d92fd8f9691c9d07c4d4a74" PRIMARY KEY ("CO_ID_ORGANIZACAO"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "TB_MEMBRO" ("CO_ID_MEMBRO" uuid DEFAULT gen_random_uuid(), "CO_ID_ORGANIZACAO" uuid NOT NULL, "CO_ID_USUARIO" uuid NOT NULL, "TP_PERFIL" varchar(50) DEFAULT 'member' NOT NULL, "DT_CRIACAO" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, CONSTRAINT "PK_d818a6f617dfb9681aba3f2f5f3" PRIMARY KEY ("CO_ID_MEMBRO"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_40881067762d7053bed97d7743" ON "TB_MEMBRO" ("CO_ID_ORGANIZACAO")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d102e3078c55711649cdcf3d7" ON "TB_MEMBRO" ("CO_ID_USUARIO")`,
    );
    await queryRunner.query(
      `CREATE TABLE "TB_CONVITE" ("CO_ID_CONVITE" uuid DEFAULT gen_random_uuid(), "CO_ID_ORGANIZACAO" uuid NOT NULL, "DS_EMAIL" varchar(255) NOT NULL, "TP_PERFIL" varchar(50) DEFAULT 'member' NOT NULL, "ST_SITUACAO" varchar(50) DEFAULT 'pending' NOT NULL, "DT_EXPIRACAO" timestamp NOT NULL, "CO_ID_USUARIO" uuid, "DT_CRIACAO" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, CONSTRAINT "PK_e3f446570a182f02b87303651b0" PRIMARY KEY ("CO_ID_CONVITE"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f13cffdc26f9766b998971fc2a" ON "TB_CONVITE" ("CO_ID_ORGANIZACAO")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d783bb0e4b9bf969ebe560a9ad" ON "TB_CONVITE" ("DS_EMAIL")`,
    );
    await queryRunner.query(
      `CREATE TABLE "TB_CONTA" ("CO_ID_CONTA" uuid DEFAULT gen_random_uuid(), "CO_ID_USUARIO" uuid NOT NULL, "CO_ID_CONTA_EXTERNA" varchar(255) NOT NULL, "CO_ID_PROVEDOR" varchar(255) NOT NULL, "DS_TOKEN_ACESSO" varchar(500), "DS_TOKEN_ATUALIZACAO" varchar(500), "DS_TOKEN_IDENTIDADE" varchar(255), "DT_EXPIRACAO_TOKEN_ACESSO" timestamp, "DT_EXPIRACAO_TOKEN_ATUALIZACAO" timestamp, "DS_ESCOPO" varchar(500), "DS_SENHA" varchar(255), "DT_CRIACAO" timestamp DEFAULT CURRENT_TIMESTAMP, "DT_ATUALIZACAO" timestamp DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_dab6cfb5baf479d83db5f96ce9c" PRIMARY KEY ("CO_ID_CONTA"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_974f6d8986346f501e4815e834" ON "TB_CONTA" ("CO_ID_USUARIO")`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_2FA" ADD CONSTRAINT "FK_56b9dd53f8f670658c8bc689b45" FOREIGN KEY ("CO_ID_USUARIO") REFERENCES "TB_USUARIO" ("CO_ID_USUARIO") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_SESSAO" ADD CONSTRAINT "FK_5e74176e65242ec959720ae00ab" FOREIGN KEY ("CO_ID_USUARIO") REFERENCES "TB_USUARIO" ("CO_ID_USUARIO") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_MEMBRO" ADD CONSTRAINT "FK_40881067762d7053bed97d77431" FOREIGN KEY ("CO_ID_ORGANIZACAO") REFERENCES "TB_ORGANIZACAO" ("CO_ID_ORGANIZACAO") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_MEMBRO" ADD CONSTRAINT "FK_3d102e3078c55711649cdcf3d7e" FOREIGN KEY ("CO_ID_USUARIO") REFERENCES "TB_USUARIO" ("CO_ID_USUARIO") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_CONVITE" ADD CONSTRAINT "FK_f13cffdc26f9766b998971fc2ab" FOREIGN KEY ("CO_ID_ORGANIZACAO") REFERENCES "TB_ORGANIZACAO" ("CO_ID_ORGANIZACAO") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_CONTA" ADD CONSTRAINT "FK_974f6d8986346f501e4815e8349" FOREIGN KEY ("CO_ID_USUARIO") REFERENCES "TB_USUARIO" ("CO_ID_USUARIO") ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "TB_CONTA" DROP CONSTRAINT "FK_974f6d8986346f501e4815e8349"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_CONVITE" DROP CONSTRAINT "FK_f13cffdc26f9766b998971fc2ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_MEMBRO" DROP CONSTRAINT "FK_3d102e3078c55711649cdcf3d7e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_MEMBRO" DROP CONSTRAINT "FK_40881067762d7053bed97d77431"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_SESSAO" DROP CONSTRAINT "FK_5e74176e65242ec959720ae00ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TB_2FA" DROP CONSTRAINT "FK_56b9dd53f8f670658c8bc689b45"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_974f6d8986346f501e4815e834"`);
    await queryRunner.query(`DROP TABLE "TB_CONTA"`);
    await queryRunner.query(`DROP INDEX "IDX_d783bb0e4b9bf969ebe560a9ad"`);
    await queryRunner.query(`DROP INDEX "IDX_f13cffdc26f9766b998971fc2a"`);
    await queryRunner.query(`DROP TABLE "TB_CONVITE"`);
    await queryRunner.query(`DROP INDEX "IDX_3d102e3078c55711649cdcf3d7"`);
    await queryRunner.query(`DROP INDEX "IDX_40881067762d7053bed97d7743"`);
    await queryRunner.query(`DROP TABLE "TB_MEMBRO"`);
    await queryRunner.query(`DROP TABLE "TB_ORGANIZACAO"`);
    await queryRunner.query(`DROP INDEX "IDX_5e74176e65242ec959720ae00a"`);
    await queryRunner.query(`DROP TABLE "TB_SESSAO"`);
    await queryRunner.query(`DROP INDEX "IDX_56b9dd53f8f670658c8bc689b4"`);
    await queryRunner.query(`DROP TABLE "TB_2FA"`);
    await queryRunner.query(`DROP TABLE "TB_USUARIO"`);
    await queryRunner.query(`DROP INDEX "IDX_4b32c75259648e1833c43a884c"`);
    await queryRunner.query(`DROP TABLE "TB_VERIFICACAO"`);
  }
}
