import { MigrationInterface, QueryRunner } from "typeorm";

export class AssociatesTable1764348218802 implements MigrationInterface {
    name = 'AssociatesTable1764348218802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "RL_SOCIO_PESSOA_JURIDICA" (
    "NU_CNPJ" VARCHAR2(14) NOT NULL,
    "TP_SOCIO" VARCHAR2(1) NOT NULL,
    "NU_DOCUMENTO_SOCIO" VARCHAR2(14) NOT NULL,
    "NO_SOCIO" VARCHAR2(150) NOT NULL,
    "NU_PERCENTUAL_CAPITAL_SOCIAL" NUMBER,
 CONSTRAINT "PK_7737db16f908866a049c1aae879" PRIMARY KEY ("NU_CNPJ"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "RL_SOCIO_PESSOA_JURIDICA"`);
    }

}
