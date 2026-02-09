import { Entity, Column, CreateDateColumn, Generated, PrimaryColumn, Index } from 'typeorm';

@Index(['userId'])
@Entity('TB_TRANSACAO_USUARIO')
export class UserTransaction {
  @Generated('uuid')
  @PrimaryColumn({ type: 'uuid', name: 'CO_ID_TRANSACAO' })
  id: string;

  @Column({ type: 'varchar', length: 1024, name: 'DS_ROTA' })
  route: string;

  @Column({ nullable: true, type: 'uuid', name: 'CO_ID_USUARIO_TRANSACAO' })
  userId?: string | null;

  @Column({ nullable: true, type: 'varchar', length: 255, name: 'DS_ENDERECO_IP' })
  ip?: string | null;

  @Column({ nullable: true, type: 'varchar', length: 30, name: 'DS_METODO' })
  method?: string;

  @CreateDateColumn({ type: 'timestamp', name: 'DT_CRIACAO' })
  createdAt: Date;
}
