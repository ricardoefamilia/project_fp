import { Entity, Column, CreateDateColumn, Generated, PrimaryColumn, Index } from 'typeorm';

@Entity('TB_AUDITORIA')
@Index(['userId'])
export class Audit {
  @Generated('uuid')
  @PrimaryColumn({ type: 'uuid', name: 'CO_ID_AUDITORIA' })
  id: string;

  @Column({ type: 'varchar', length: 32, name: 'DS_ACAO' })
  action: string;

  @Column({ type: 'varchar', length: 128, name: 'DS_TABELA' })
  tableName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'CO_ID_ENTIDADE' })
  primaryKey?: string | null;

  @Column({ type: 'text', nullable: true, name: 'DS_OBJETO_ANTES' })
  before?: string | null;

  @Column({ type: 'text', nullable: true, name: 'DS_OBJETO_DEPOIS' })
  after?: string | null;

  @Column({ nullable: true, type: 'varchar', length: 255, name: 'CO_ID_USUARIO_AUDITORIA' })
  userId?: string | null;

  @Column({ nullable: true, type: 'varchar', length: 255, name: 'DS_ENDERECO_IP' })
  ip?: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'DT_CRIACAO' })
  createdAt!: Date;
}
