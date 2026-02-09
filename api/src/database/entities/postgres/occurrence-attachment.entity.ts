import { CreateDateColumn } from 'typeorm';
import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Occurrence } from './occurrence.entity';

@Entity('TB_OCORRENCIA_ANEXO')
export class OccurrenceAttachmentEntity {
    @PrimaryGeneratedColumn('identity', { name: 'CO_SEQ_OCORRENCIA_ANEXO', type: 'bigint' })
    id: number; 

    @ManyToOne(() => Occurrence, (o) => o.attachments,  { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'CO_SEQ_OCORRENCIA' })
    occurrence: Occurrence;

    @Column({ type: 'varchar', name: 'NO_NOME_ARQUIVO', length: 255 })
    originalFileName: string;

    @Column({type: 'varchar', name:  'DS_TIPO_MIME', length: 100})
    mimeType: string;

    @Column({ type: 'bigint', name: 'NU_TAMANHO_ARQUIVO' })
    fileSize: number;

    @Column({ type: 'varchar', name: 'DS_CAMINHO_ARQUIVO', length: 500 })
    filePath: string;   

    @CreateDateColumn({ type: 'timestamp', name: 'DT_CRIACAO' })
    createdAt: Date;
}