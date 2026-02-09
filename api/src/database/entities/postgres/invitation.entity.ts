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
import { Organization } from './organization.entity';

@Entity('TB_CONVITE')
@Index(['email'])
@Index(['organizationId'])
export class Invitation {
  @Generated('uuid')
  @PrimaryColumn({ type: 'uuid', name: 'CO_ID_CONVITE' })
  id: string;

  @Column({ type: 'uuid', name: 'CO_ID_ORGANIZACAO' })
  organizationId: string;

  @Column({ type: 'varchar', length: 255, name: 'DS_EMAIL' })
  email: string;

  @Column({ type: 'varchar', length: 50, default: 'member', name: 'TP_PERFIL' })
  role: string;

  @Column({ type: 'varchar', length: 50, default: 'pending', name: 'ST_SITUACAO' })
  status: string;

  @Column({ type: 'timestamp', name: 'DT_EXPIRACAO' })
  expiresAt: Date;

  @Column({ type: 'uuid', nullable: true, name: 'CO_ID_USUARIO' })
  inviterId: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'DT_CRIACAO' })
  createdAt: Date;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'CO_ID_ORGANIZACAO' })
  organization: Organization;

  @Column({ type: 'varchar', length: 11, nullable: true, name: 'NU_CPF_USUARIO' })
  cpf: string | null;
}
