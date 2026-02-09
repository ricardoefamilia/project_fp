import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCpfToUserFixed1769006069210 implements MigrationInterface {
    name = 'AddCpfToUserFixed1769006069210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // --- ORDEM CORRIGIDA ---

        // 1. PRIMEIRO: Cria a coluna (permitindo NULL por enquanto)
        await queryRunner.query(`ALTER TABLE "TB_USUARIO" ADD "NU_CPF_USUARIO" character varying(11)`);

        // 2. SEGUNDO: Preenche os dados existentes com CPFs aleatórios para evitar duplicidade
        await queryRunner.query(`
            UPDATE "TB_USUARIO" 
            SET "NU_CPF_USUARIO" = LPAD(CAST(FLOOR(RANDOM() * 99999999999) AS VARCHAR), 11, '0')
            WHERE "NU_CPF_USUARIO" IS NULL
        `);

        // 3. TERCEIRO: Aplica as restrições (Not Null e Unique)
        await queryRunner.query(`ALTER TABLE "TB_USUARIO" ALTER COLUMN "NU_CPF_USUARIO" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "TB_USUARIO" ADD CONSTRAINT "UQ_62620abf9849a2d1c92784a63e6" UNIQUE ("NU_CPF_USUARIO")`);

        // 4. RESTO DO CÓDIGO (Outras tabelas e comentários gerados pelo TypeORM)
        await queryRunner.query(`COMMENT ON TABLE "TB_MOTIVO_CREDENCIAMENTO" IS 'Tabela de domínio de Motivos de Credenciamento/Descredenciamento da Farmácia. Utilizada como lista de valores estável em FK.'`);
        await queryRunner.query(`COMMENT ON TABLE "TB_FARMACIA_CREDENCIAMENTO" IS 'Armazena o estado atual de credenciamento da farmácia (situação e motivo) e o snapshot persistido do workflow XState para retomada entre requisições.'`);
        await queryRunner.query(`ALTER TABLE "TB_MEMBRO" ADD "NU_CPF_USUARIO" character varying(11)`);
        await queryRunner.query(`ALTER TABLE "TB_CONVITE" ADD "NU_CPF_USUARIO" character varying(11)`);
        
        // Comandos adicionais gerados (apenas mantendo para sincronia)
        try {
            await queryRunner.query(`ALTER TABLE "TB_FARMACIA_CREDENCIAMENTO" DROP CONSTRAINT "FK_07bbfbefb91ab21032726ba72b3"`);
        } catch (e) { /* Ignora se já não existir */ }

        await queryRunner.query(`COMMENT ON COLUMN "TB_MOTIVO_CREDENCIAMENTO"."CO_MOTIVO_CRED" IS 'Código do motivo (chave negocial). Ex.: NAO_RENOVOU_RTA.'`);
        await queryRunner.query(`COMMENT ON COLUMN "TB_MOTIVO_CREDENCIAMENTO"."DS_MOTIVO_CRED" IS 'Descrição do motivo de credenciamento/descredenciamento.'`);
        await queryRunner.query(`COMMENT ON COLUMN "TB_FARMACIA_CREDENCIAMENTO"."CO_FARMACIA" IS 'Identificador da farmácia (FK lógica para a entidade de farmácia no domínio).'`);
        
        try {
             await queryRunner.query(`ALTER TABLE "TB_FARMACIA_CREDENCIAMENTO" DROP CONSTRAINT "UK_TB_FARMACIA_CRED_CO_FARMACIA"`);
        } catch (e) { /* Ignora se já não existir */ }

        await queryRunner.query(`COMMENT ON COLUMN "TB_FARMACIA_CREDENCIAMENTO"."ST_SITUACAO_CRED" IS 'Situação atual do credenciamento. Domínio: ATIVA / INATIVA.'`);
        await queryRunner.query(`COMMENT ON COLUMN "TB_FARMACIA_CREDENCIAMENTO"."CO_MOTIVO_CRED" IS 'Motivo atual (FK para TB_DOM_MOTIVO_CREDENCIAMENTO.CO_MOTIVO_CRED). Pode ser nulo quando ainda não houve alteração registrada.'`);
        await queryRunner.query(`COMMENT ON COLUMN "TB_FARMACIA_CREDENCIAMENTO"."DS_NUP_SIPAR" IS 'Número do Processo SEI/SIPAR (obrigatório conforme regra de negócio Item 18).'`);
        await queryRunner.query(`COMMENT ON COLUMN "TB_FARMACIA_CREDENCIAMENTO"."DT_PUBLICACAO_DOU" IS 'Data da portaria no DOU (obrigatório conforme regra de negócio RN016).'`);
        await queryRunner.query(`COMMENT ON COLUMN "TB_FARMACIA_CREDENCIAMENTO"."NU_SECAO_DOU" IS 'Seção do DOU.'`);
        await queryRunner.query(`COMMENT ON COLUMN "TB_FARMACIA_CREDENCIAMENTO"."NU_PAGINA_INICIAL" IS 'Página inicial da publicação no DOU.'`);
        await queryRunner.query(`COMMENT ON COLUMN "TB_FARMACIA_CREDENCIAMENTO"."NU_PAGINA_FINAL" IS 'Página final da publicação no DOU.'`);
        await queryRunner.query(`COMMENT ON COLUMN "TB_FARMACIA_CREDENCIAMENTO"."DS_ANEXOS" IS 'Documentos comprobatórios (referências aos arquivos anexos).'`);
        await queryRunner.query(`COMMENT ON COLUMN "TB_FARMACIA_CREDENCIAMENTO"."DS_VERSAO_MAQUINA" IS 'Versão do statechart (controle de compatibilidade/migração do snapshot do workflow).'`);
        await queryRunner.query(`COMMENT ON COLUMN "TB_FARMACIA_CREDENCIAMENTO"."DS_XSTATE_SNAPSHOT" IS 'Snapshot persistido do workflow XState (jsonb). Usado para restaurar o actor e continuar o processamento.'`);
        await queryRunner.query(`COMMENT ON COLUMN "TB_FARMACIA_CREDENCIAMENTO"."CO_USUARIO_ATUALIZACAO" IS 'Identificador do usuário responsável pela última atualização do estado.'`);
        await queryRunner.query(`COMMENT ON COLUMN "TB_FARMACIA_CREDENCIAMENTO"."DT_ATUALIZACAO" IS 'Data e hora da última atualização do estado de credenciamento.'`);
        await queryRunner.query(`COMMENT ON COLUMN "TB_FARMACIA_CREDENCIAMENTO"."NU_ROW_VERSION" IS 'Controle de concorrência otimista (incrementado em updates) para evitar race condition em transições.'`);
        await queryRunner.query(`ALTER TABLE "TB_FARMACIA_CREDENCIAMENTO" ALTER COLUMN "NU_ROW_VERSION" SET DEFAULT 1`);
        
        try {
            await queryRunner.query(`CREATE UNIQUE INDEX "UK_TB_FARMACIA_CRED_CO_FARMACIA" ON "TB_FARMACIA_CREDENCIAMENTO" ("CO_FARMACIA") `);
        } catch (e) { /* Ignora se já existir */ }

        await queryRunner.query(`ALTER TABLE "TB_FARMACIA_CREDENCIAMENTO" ADD CONSTRAINT "FK_07bbfbefb91ab21032726ba72b3" FOREIGN KEY ("CO_MOTIVO_CRED") REFERENCES "TB_MOTIVO_CREDENCIAMENTO"("CO_MOTIVO_CRED") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Desfaz na ordem inversa
        await queryRunner.query(`ALTER TABLE "TB_USUARIO" DROP CONSTRAINT "UQ_62620abf9849a2d1c92784a63e6"`);
        await queryRunner.query(`ALTER TABLE "TB_USUARIO" DROP COLUMN "NU_CPF_USUARIO"`);
        await queryRunner.query(`ALTER TABLE "TB_MEMBRO" DROP COLUMN "NU_CPF_USUARIO"`);
        await queryRunner.query(`ALTER TABLE "TB_CONVITE" DROP COLUMN "NU_CPF_USUARIO"`);
    }

}
