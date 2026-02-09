import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import type { Status, ReasonCode } from '../accreditation.types';

const REASON_CODE_VALUES = [
  'DIVERGENCIA_CADASTRAL',
  'NAO_RENOVOU_RTA',
  'MONITORAMENTO',
  'ENVIADO_AO_DENASUS',
  'PENDENCIA_FINANCEIRA',
  'DESCREDENCIAMENTO_PROPRIO',
  'DESCREDENCIAMENTO_POR_IRREGULARIDADES',
  'DESCREDENCIAMENTO_POR_FUSAO_INCORPORACAO',
  'DESCREDENCIAMENTO_POR_NAO_HOMOLOGACAO',
  'DESCREDENCIAMENTO_POR_BAIXA_CNPJ',
  'INATIVACAO_POR_DECISAO_JUDICIAL',
  'REGULARIDADE',
  'ATIVACAO_POR_DECISAO_JUDICIAL',
  'RECREDENCIAMENTO',
] as const;

const STATUS_VALUES = ['ATIVA', 'INATIVA'] as const;

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Novo status do credenciamento',
    enum: STATUS_VALUES,
    example: 'INATIVA',
  })
  @IsNotEmpty()
  @IsEnum(STATUS_VALUES)
  status: Status;

  @ApiPropertyOptional({
    description: 'Código do motivo da alteração',
    enum: REASON_CODE_VALUES,
    example: 'DIVERGENCIA_CADASTRAL',
  })
  @IsOptional()
  @IsEnum(REASON_CODE_VALUES)
  reasonCode?: ReasonCode | null;
}

