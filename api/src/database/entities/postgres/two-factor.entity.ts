import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, Index, Generated, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('TB_2FA')
@Index(['userId'])
export class TwoFactor {
  @Generated('uuid')
  @PrimaryColumn({ type: 'uuid', name: 'CO_ID_2FA' })
  id: string;

  @Column({ type: 'uuid', name: 'CO_ID_USUARIO' })
  userId: string;

  @Column({ type: 'varchar', length: 500, name: 'DS_SECRET' })
  secret: string;

  @Column({ type: 'text', nullable: true, name: 'DS_BACKUP_CODES' })
  backupCodes: string | null;

  @CreateDateColumn({ type: 'timestamp', nullable: true, name: 'DT_CRIACAO' })
  createdAt: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'DT_ATUALIZACAO' })
  updatedAt: Date | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'CO_ID_USUARIO' })
  user: User;
}
