import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm';

@Entity('TB_USUARIO')
export class User {
  @Generated('uuid')
  @PrimaryColumn({ type: 'uuid', name: 'CO_ID_USUARIO' })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true, name: 'DS_EMAIL' })
  email: string;

  @Column({ type: 'boolean', nullable: true, name: 'ST_EMAIL_VERIFICADO', default: false })
  emailVerified: boolean | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'NO_USUARIO' })
  name: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'IM_URL_IMAGEM' })
  image: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'DT_CRIACAO' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'DT_ATUALIZACAO' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: false, name: 'ST_2FA_HABILITADO' })
  twoFactorEnabled: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'NO_PERFIL' })
  role: string | null;

  @Column({ type: 'boolean', default: false, name: 'ST_BANIDO' })
  banned: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'DS_MOTIVO_BANIMENTO' })
  banReason: string | null;

  @Column({ type: 'timestamp', nullable: true, name: 'DT_EXPIRACAO_BANIMENTO' })
  banExpires: Date | null;

  @Column({ type: 'varchar', length: 11, unique: true, nullable: false, name: 'NU_CPF_USUARIO' })
  cpf: string | null;
}
