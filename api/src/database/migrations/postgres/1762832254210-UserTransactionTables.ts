import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTransactionTables1762832254210 implements MigrationInterface {
  name = 'UserTransactionTables1762832254210';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "TB_TRANSACAO_USUARIO" ("CO_ID_TRANSACAO" uuid DEFAULT gen_random_uuid(), "DS_ROTA" varchar(1024) NOT NULL, "CO_ID_USUARIO_TRANSACAO" uuid, "DS_ENDERECO_IP" varchar(255), "DS_METODO" varchar(30), "DT_CRIACAO" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, CONSTRAINT "PK_83f2248c99b066f1ed9408073cb" PRIMARY KEY ("CO_ID_TRANSACAO"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6702d2db1cb43ffbaf14f32e92" ON "TB_TRANSACAO_USUARIO" ("CO_ID_USUARIO_TRANSACAO")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_6702d2db1cb43ffbaf14f32e92"`);
    await queryRunner.query(`DROP TABLE "TB_TRANSACAO_USUARIO"`);
  }
}
