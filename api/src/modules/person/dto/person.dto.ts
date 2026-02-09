import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDate, Length, MaxLength, IsNumber } from 'class-validator';

export class PersonDto {
  @ApiProperty({ description: 'CPF ou CNPJ da pessoa', example: '12345678901' })
  @IsNotEmpty()
  @IsString()
  @Length(11, 14)
  personDocument: string;

  @ApiProperty({ description: 'Nome completo da pessoa', example: 'Maria da Silva Souza' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  personName: string;

  @ApiProperty({ description: 'Indica se o registro está ativo (S/N)', example: 'S' })
  @IsNotEmpty()
  @IsString()
  isActive: string;

  @ApiProperty({ description: 'Nome do logradouro', example: 'Rua das Flores', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  streetName?: string;

  @ApiProperty({ description: 'Número do endereço', example: '123', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  streetNumber?: string;

  @ApiProperty({ description: 'Complemento do endereço', example: 'Apartamento 301', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  addressComplement?: string;

  @ApiProperty({ description: 'Nome do bairro', example: 'Centro', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  neighborhood?: string;

  @ApiProperty({ description: 'CEP da localização', example: '70040900', required: false })
  @IsOptional()
  @IsString()
  @Length(8, 8)
  postalCode?: string;

  @ApiProperty({ description: 'Nome do município', example: 'Recife', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  cityName?: string;

  @ApiProperty({ description: 'Código IBGE do município', example: '261160', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(6)
  cityIbgeCode?: string;

  @ApiProperty({ description: 'Sigla da unidade federativa', example: 'PE', required: false })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  stateUf?: string;

  @ApiProperty({ description: 'Número de telefone completo sem DDD', example: '99887766', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(11)
  phoneNumber?: string;

  @ApiProperty({ description: 'Código DDD do telefone', example: '81', required: false })
  @IsOptional()
  @IsString()
  @Length(4, 4)
  areaCode?: string;

  @ApiProperty({ description: 'Código DDI internacional', example: '55', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  countryCode?: string;

  @ApiProperty({ description: 'Número do ramal telefônico', example: '1234', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  extensionNumber?: string;

  @ApiProperty({ description: 'Data da última atualização da RFB', example: '2024-01-10', required: false })
  @IsOptional()
  @IsDate()
  rfbUpdateDate?: Date;

  @ApiProperty({ description: 'Data de processamento interno', example: '2024-02-05', required: false })
  @IsOptional()
  @IsDate()
  processingDate?: Date;

  @ApiProperty({ description: 'Data de inscrição no sistema', example: '2024-03-15', required: false })
  @IsOptional()
  @IsDate()
  registrationDate?: Date;
}
