import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum, IsOptional } from 'class-validator';
import type { Status } from '../accreditation.types';

export class CreateAccreditationDto {
  @ApiProperty({
    description: 'ID da farmácia',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  pharmacyId: number;

  @ApiPropertyOptional({
    description: 'Status inicial do credenciamento',
    enum: ['ATIVA', 'INATIVA'],
    default: 'ATIVA',
    example: 'ATIVA',
  })
  @IsOptional()
  @IsEnum(['ATIVA', 'INATIVA'])
  initialStatus?: Status;
}

