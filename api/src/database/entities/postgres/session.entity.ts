import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, Index, Generated } from 'typeorm';
import { User } from './user.entity';

@Entity('TB_SESSAO')
@Index(['userId'])
export class Session {
  @Generated('uuid')
  @PrimaryColumn({ type: 'uuid', name: 'CO_ID_SESSAO' })
  id: string;

  @Column({ type: 'uuid', name: 'CO_ID_USUARIO' })
  userId: string;

  @Column({ type: 'varchar', length: 500, unique: true, name: 'DS_TOKEN' })
  token: string;

  @Column({ type: 'timestamp', name: 'DT_EXPIRACAO' })
  expiresAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'DS_ENDERECO_IP' })
  ipAddress: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'DS_USER_AGENT' })
  userAgent: string | null;

  @Column({ type: 'uuid', nullable: true, name: 'CO_ID_USUARIO_IMPERSONANTE' })
  impersonatedBy: string | null;

  @Column({ type: 'uuid', nullable: true, name: 'CO_ID_ORGANIZACAO_ATIVA' })
  activeOrganizationId: string | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'CO_ID_USUARIO' })
  user: User;
}
