import {Column, PrimaryGeneratedColumn, Entity} from 'typeorm';

@Entity('TB_TIPO_OCORRENCIA')
export class OccurrenceType {
    @PrimaryGeneratedColumn('identity', {name: 'CO_SEQ_TIPO_OCORRENCIA', type: 'bigint'})
    id: number;

    @Column({type: 'varchar', name: 'CO_ID_TIPO_OCORRENCIA', unique: true})
    occurrenceTypeId: string;

    @Column({type: 'varchar', length: 100, name: 'DS_TIPO_OCORRENCIA'})
    occurrenceDescription: string;

    @Column({type: 'varchar', length: 1, name: 'ST_ATIVO'})
    isActive: string | null;

    
}