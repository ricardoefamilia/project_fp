import {Column, PrimaryGeneratedColumn, Entity} from 'typeorm';

@Entity('TB_TIPO_DOCUMENTO')
export class DocumentType {
    @PrimaryGeneratedColumn('identity', {name: 'CO_SEQ_TIPO_DOCUMENTO', type: 'bigint'})
    id: number;

    @Column({type: 'varchar', name: 'CO_ID_TIPO_DOCUMENTO', unique: true})
    documentTypeId: string;

    @Column({type: 'varchar', length: 100, name: 'DS_TIPO_DOCUMENTO'})
    documentTypeDescription: string;

    @Column({type: 'varchar', length: 1, name: 'ST_ATIVO'})
    isActive: string | null;
}