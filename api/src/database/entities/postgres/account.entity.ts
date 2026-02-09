import { Column, CreateDateColumn, Entity, Generated, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('TB_CONTA')
@Index(['userId'])
export class Account {
  @Generated('uuid')
  @PrimaryColumn({ type: 'uuid', name: 'CO_ID_CONTA' })
  id: string;

  @Column({ type: 'uuid', name: 'CO_ID_USUARIO' })
  userId: string;

  @Column({ type: 'varchar', length: 255, name: 'CO_ID_CONTA_EXTERNA' })
  accountId: string;

  @Column({ type: 'varchar', length: 255, name: 'CO_ID_PROVEDOR' })
  providerId: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'DS_TOKEN_ACESSO' })
  accessToken: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'DS_TOKEN_ATUALIZACAO' })
  refreshToken: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'DS_TOKEN_IDENTIDADE' })
  idToken: string | null;

  @Column({ type: 'timestamp', nullable: true, name: 'DT_EXPIRACAO_TOKEN_ACESSO' })
  accessTokenExpiresAt: Date | null;

  @Column({ type: 'timestamp', nullable: true, name: 'DT_EXPIRACAO_TOKEN_ATUALIZACAO' })
  refreshTokenExpiresAt: Date | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'DS_ESCOPO' })
  scope: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'DS_SENHA' })
  password: string | null;

  @CreateDateColumn({ type: 'timestamp', nullable: true, name: 'DT_CRIACAO' })
  createdAt: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'DT_ATUALIZACAO' })
  updatedAt: Date | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'CO_ID_USUARIO' })
  user: User;
}
