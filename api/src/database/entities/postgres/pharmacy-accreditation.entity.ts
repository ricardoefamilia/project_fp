import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { AccreditationReason } from './accreditation-reason.entity';
  
  export type Status = 'ATIVA' | 'INATIVA';
  
  @Entity({
    name: 'TB_FARMACIA_CREDENCIAMENTO',
    comment:
      'Armazena o estado atual de credenciamento da farmácia (situação e motivo) e o snapshot persistido do workflow XState para retomada entre requisições.',
  })
  @Index('UK_TB_FARMACIA_CRED_CO_FARMACIA', ['pharmacyId'], { unique: true })
  export class PharmacyAccreditation {
    @PrimaryGeneratedColumn('identity', { name: 'CO_SEQ_FARMACIA_CRED', type: 'bigint' })
    id: number;
  
    @Column({
      name: 'CO_FARMACIA',
      type: 'bigint',
      comment: 'Identificador da farmácia (FK lógica para a entidade de farmácia no domínio).',
    })
    pharmacyId: number;
  
    @Column({
      name: 'ST_SITUACAO_CRED',
      type: 'varchar',
      length: 10,
      comment: 'Situação atual do credenciamento. Domínio: ATIVA / INATIVA.',
    })
    status: string;
  
    // Motivo atual como FK para domínio
    @Column({
      name: 'CO_MOTIVO_CRED',
      type: 'varchar',
      length: 80,
      nullable: true,
      comment:
        'Motivo atual (FK para TB_DOM_MOTIVO_CREDENCIAMENTO.CO_MOTIVO_CRED). Pode ser nulo quando ainda não houve alteração registrada.',
    })
    reasonId: string | null;

    @ManyToOne(() => AccreditationReason, { eager: false })
    @JoinColumn({ name: 'CO_MOTIVO_CRED', referencedColumnName: 'code' })
    reason?: AccreditationReason;

    @Column({
      name: 'DS_NUP_SIPAR',
      type: 'varchar',
      length: 255,
      nullable: false,
      comment: 'Número do Processo SEI/SIPAR (obrigatório conforme regra de negócio Item 18).',
    })
    nupSipar: string;

    @Column({
      name: 'DT_PUBLICACAO_DOU',
      type: 'date',
      nullable: false,
      comment: 'Data da portaria no DOU (obrigatório conforme regra de negócio RN016).',
    })
    dtPublicacao: Date;

    @Column({
      name: 'NU_SECAO_DOU',
      type: 'varchar',
      length: 50,
      nullable: true,
      comment: 'Seção do DOU.',
    })
    nuSecao: string | null;

    @Column({
      name: 'NU_PAGINA_INICIAL',
      type: 'integer',
      nullable: true,
      comment: 'Página inicial da publicação no DOU.',
    })
    nuPaginaInicial: number | null;

    @Column({
      name: 'NU_PAGINA_FINAL',
      type: 'integer',
      nullable: true,
      comment: 'Página final da publicação no DOU.',
    })
    nuPaginaFinal: number | null;

    @Column({
      name: 'DS_ANEXOS',
      type: 'jsonb',
      nullable: true,
      comment: 'Documentos comprobatórios (referências aos arquivos anexos).',
    })
    anexos: string[] | null;
  
    @Column({
      name: 'DS_VERSAO_MAQUINA',
      type: 'varchar',
      length: 50,
      default: () => `'CREDENCIAMENTO@1'`,
      comment:
        'Versão do statechart (controle de compatibilidade/migração do snapshot do workflow).',
    })
    machineVersion: string;
  
    @Column({
      name: 'DS_XSTATE_SNAPSHOT',
      type: 'jsonb',
      nullable: true,
      comment:
        'Snapshot persistido do workflow XState (jsonb). Usado para restaurar o actor e continuar o processamento.',
    })
    xstateSnapshot: unknown | null;
  
    @Column({
      name: 'CO_USUARIO_ATUALIZACAO',
      type: 'uuid',
      nullable: true,
      comment: 'Identificador do usuário responsável pela última atualização do estado.',
    })
    userId: string | null;
  
    @Column({
      name: 'DT_ATUALIZACAO',
      type: 'timestamptz',
      nullable: true,
      comment: 'Data e hora da última atualização do estado de credenciamento.',
    })
    updatedAt: Date | null;
  
    @Column({
      name: 'NU_ROW_VERSION',
      type: 'integer',
      default: () => '1',
      comment:
        'Controle de concorrência otimista (incrementado em updates) para evitar race condition em transições.',
    })
    rowVersion: number;
  }