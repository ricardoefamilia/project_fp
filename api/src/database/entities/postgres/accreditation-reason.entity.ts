import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'TB_MOTIVO_CREDENCIAMENTO',
  comment:
    'Tabela de domínio de Motivos de Credenciamento/Descredenciamento da Farmácia. Utilizada como lista de valores estável em FK.',
})
export class AccreditationReason {
  @PrimaryGeneratedColumn('increment', { name: 'CO_SEQ_DOM_MOTIVO_CRED', type: 'int' })
  id: number;

  @Index({ unique: true })
  @Column({
    name: 'CO_MOTIVO_CRED',
    type: 'varchar',
    length: 80,
    comment: 'Código do motivo (chave negocial). Ex.: NAO_RENOVOU_RTA.',
  })
  code: string;

  @Column({
    name: 'DS_MOTIVO_CRED',
    type: 'varchar',
    length: 255,
    comment: 'Descrição do motivo de credenciamento/descredenciamento.',
  })
  description: string;
}