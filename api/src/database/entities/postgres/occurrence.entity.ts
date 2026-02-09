import {Column, 
    PrimaryGeneratedColumn, 
    Entity,
    JoinColumn, 
    ManyToOne,
    UpdateDateColumn,
} from 'typeorm';
import { OccurrenceType } from './occurrence-type.entity';
import { DocumentType } from './document-type.entity';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { OccurrenceAttachmentEntity} from './occurrence-attachment.entity';
@Entity('TB_OCORRENCIA')
export class Occurrence {
    @PrimaryGeneratedColumn('identity', {name: 'CO_SEQ_OCORRENCIA', type: 'bigint'})
    id: number;

    @Column({type: 'varchar', length: 14, name: 'NU_CNPJ_FARMACIA', unique: true})
    pharmacyCnpj: string;

    @Column({type: 'varchar', length: 20, name: 'NU_OCORRENCIA', unique: true})
    occurrenceNumber: string;

    @Column({type: 'varchar', length: 100, name: 'DS_OCORRENCIA'})
    occurrenceDescription: string;

    @Column({type: 'varchar', length: 1, name: 'ST_ATIVO'})
    isActive: string | null;

    @ManyToOne(() => OccurrenceType)
    @JoinColumn({ name: 'CO_SEQ_TIPO_OCORRENCIA' })
    occurrenceType: OccurrenceType;

    @Column({type: 'timestamp', name: 'DT_CRIACAO'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp', name: 'DT_ATUALIZACAO', nullable: true})
    updatedAt: Date | null;

    @Column({type: 'timestamp', name: 'DT_ABRANGENCIA_INICIO'})
    coverageStartDate: Date;
    
    @Column({type: 'timestamp', name: 'DT_ABRANGENCIA_FIM', nullable: true})
    coverageEndDate?: Date | null;

    @ManyToOne(() => DocumentType, { nullable: true, eager: true })
    @JoinColumn({ name: 'CO_ID_TIPO_DOCUMENTO' })
    documentType?: DocumentType | null;

    @Column({type: 'varchar', name:'NU_DOCUMENTO', length: 60, nullable: true})
    documentNumber?: string | null;

    @Column({type: 'varchar', name: 'DS_TITULO', length: 200, nullable: true})
    title: string;

    @Column({type: 'text', name: 'DS_OBSERVACAO', nullable: true})
    observation: string | null;

    @Column({type: 'bigint', name: 'CO_USUARIO_RESP'})
    responsibleUserId: number;

    @OneToMany(() => OccurrenceAttachmentEntity, (a) => a.occurrence, {cascade: true})
    attachments: OccurrenceAttachmentEntity[];
   
}