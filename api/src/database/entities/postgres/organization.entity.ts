import { Entity, Column, PrimaryColumn, CreateDateColumn, Generated } from 'typeorm';

@Entity('TB_ORGANIZACAO')
export class Organization {
  @Generated('uuid')
  @PrimaryColumn({ type: 'uuid', name: 'CO_ID_ORGANIZACAO' })
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'NO_ORGANIZACAO' })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true, name: 'DS_SLUG' })
  slug: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'IM_URL_LOGO' })
  logo: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'DT_CRIACAO' })
  createdAt: Date;

  @Column({ type: 'text', nullable: true, name: 'DS_METADADOS' })
  metadata: string | null;
}
