import { Column, CreateDateColumn, Entity, Generated, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('TB_VERIFICACAO')
@Index(['identifier'])
export class Verification {
  @Generated('uuid')
  @PrimaryColumn({ type: 'uuid', name: 'CO_ID_VERIFICACAO', default: () => 'gen_random_uuid()' })
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'DS_IDENTIFICADOR' })
  identifier: string;

  @Column({ type: 'varchar', length: 500, name: 'DS_VALOR' })
  value: string;

  @Column({ type: 'timestamp', name: 'DT_EXPIRACAO' })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: true, name: 'DT_CRIACAO' })
  createdAt: Date | null;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'DT_ATUALIZACAO' })
  updatedAt: Date | null;
}
