import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuditTables1762823018169 implements MigrationInterface {
  name = 'AuditTables1762823018169';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "TB_AUDITORIA" ("CO_ID_AUDITORIA" uuid DEFAULT gen_random_uuid(), "DS_ACAO" varchar(32) NOT NULL, "DS_TABELA" varchar(128) NOT NULL, "CO_ID_ENTIDADE" varchar(255), "DS_OBJETO_ANTES" text, "DS_OBJETO_DEPOIS" text, "CO_ID_USUARIO_AUDITORIA" varchar(255), "DS_ENDERECO_IP" varchar(255), "DT_CRIACAO" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, CONSTRAINT "PK_c7aeca3237062b35384810b7486" PRIMARY KEY ("CO_ID_AUDITORIA"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b69aaa1f5772dd77fe40d058f7" ON "TB_AUDITORIA" ("CO_ID_USUARIO_AUDITORIA")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_b69aaa1f5772dd77fe40d058f7"`);
    await queryRunner.query(`DROP TABLE "TB_AUDITORIA"`);
  }
}
