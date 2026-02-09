import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
  Generated,
} from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity('TB_MEMBRO')
@Index(['userId'])
@Index(['organizationId'])
export class Member {
  @Generated('uuid')
  @PrimaryColumn({ type: 'uuid', name: 'CO_ID_MEMBRO' })
  id: string;

  @Column({ type: 'uuid', name: 'CO_ID_ORGANIZACAO' })
  organizationId: string;

  @Column({ type: 'uuid', name: 'CO_ID_USUARIO' })
  userId: string;

  @Column({ type: 'varchar', length: 50, default: 'member', name: 'TP_PERFIL' })
  role: string;

  @CreateDateColumn({ type: 'timestamp', name: 'DT_CRIACAO' })
  createdAt: Date;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'CO_ID_ORGANIZACAO' })
  organization: Organization;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'CO_ID_USUARIO' })
  user: User;

  @Column({ type: 'varchar', length: 11, nullable: true, name: 'NU_CPF_USUARIO' })
  cpf: string | null;
}
