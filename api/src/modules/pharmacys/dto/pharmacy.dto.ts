import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  Length,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class PharmacyDto {
  @ApiProperty({ description: 'CNPJ number', maxLength: 14 })
  @IsNotEmpty()
  @IsString()
  @Length(14, 14)
  cnpjNumber: string;

  @ApiProperty({ description: 'Parent CNPJ number', maxLength: 14, required: false })
  @IsOptional()
  @IsString()
  @Length(14, 14)
  parentCnpjNumber?: string;

  @ApiProperty({ description: 'License number', maxLength: 20, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  licenseNumber?: string;

  @ApiProperty({ description: 'Supervisory board number', maxLength: 50, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  supervisoryBoardNumber?: string;

  @ApiProperty({ description: 'Company type', maxLength: 1, required: false })
  @IsOptional()
  @IsString()
  @Length(1, 1)
  companyType?: string;

  @ApiProperty({ description: 'Company name', maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  companyName: string;

  @ApiProperty({ description: 'Address', maxLength: 100, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  address: string;

  @ApiProperty({ description: 'District', maxLength: 120, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  district?: string;

  @ApiProperty({ description: 'City code IBGE', maxLength: 6, required: false })
  @IsOptional()
  @IsString()
  @Length(6, 6)
  cityCodeIbge?: string;

  @ApiProperty({ description: 'ZIP code', maxLength: 8, required: false })
  @IsOptional()
  @IsString()
  @Length(8, 8)
  zipCode?: string;

  @ApiProperty({ description: 'Area number', maxLength: 4, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(4)
  areaNumber?: string;

  @ApiProperty({ description: 'Phone number', maxLength: 10, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  phoneNumber?: string;

  @ApiProperty({ description: 'Email', maxLength: 60, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  email?: string;

  @ApiProperty({ description: 'Legal responsible name', maxLength: 70, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  legalResponsibleName?: string;

  @ApiProperty({ description: 'Legal responsible CPF number', maxLength: 11, required: false })
  @IsOptional()
  @IsString()
  @Length(11, 11)
  legalResponsibleCpfNumber?: string;

  @ApiProperty({ description: 'Technical responsible name', maxLength: 70, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  technicalResponsibleName?: string;

  @ApiProperty({ description: 'Technical responsible CPF number', maxLength: 11, required: false })
  @IsOptional()
  @IsString()
  @Length(11, 11)
  technicalResponsibleCpfNumber?: string;

  @ApiProperty({ description: 'CRF number', maxLength: 7, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  crfNumber?: string;

  @ApiProperty({ description: 'UF CRF', maxLength: 2, required: false })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  ufCrf?: string;

  @ApiProperty({ description: 'Operational status', maxLength: 1 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 1)
  operationalStatus: string;

  @ApiProperty({ description: 'Concentrator CNPJ number', maxLength: 14, required: false })
  @IsOptional()
  @IsString()
  @Length(14, 14)
  concentratorCnpjNumber?: string;

  @ApiProperty({ description: 'Identification number', maxLength: 6, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(6)
  identificationNumber?: string;

  @ApiProperty({ description: 'Concentrator status', maxLength: 1, required: false })
  @IsOptional()
  @IsString()
  @Length(1, 1)
  concentratorStatus?: string;

  @ApiProperty({ description: 'Email receive type', maxLength: 1, required: false })
  @IsOptional()
  @IsString()
  @Length(1, 1)
  emailReceiveType?: string;

  @ApiProperty({ description: 'Fantasy name', maxLength: 120, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  fantasyName?: string;

  @ApiProperty({ description: 'DOU publication date', required: false })
  @IsOptional()
  @IsDate()
  douPublicationDate?: Date;

  @ApiProperty({ description: 'SIPAR process number', maxLength: 21, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(21)
  siparProcessNumber?: string;

  @ApiProperty({ description: 'Block status', maxLength: 1, required: false })
  @IsOptional()
  @IsString()
  @Length(1, 1)
  blockStatus?: string;

  @ApiProperty({ description: 'Block date', required: false })
  @IsOptional()
  @IsDate()
  blockDate?: Date;

  @ApiProperty({ description: 'Block reason code', required: false })
  @IsOptional()
  @IsNumber()
  blockReasonCode?: number;

  @ApiProperty({ description: 'Status own unity', maxLength: 1, required: false })
  @IsOptional()
  @IsString()
  @Length(1, 1)
  statusOwnUnity?: string;

  @ApiProperty({ description: 'Commercial register number', maxLength: 11, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(11)
  comercialRegisterNumber?: string;

  @ApiProperty({ description: 'Make sales', maxLength: 1, required: false })
  @IsOptional()
  @IsString()
  @Length(1, 1)
  makeSales?: string;

  @ApiProperty({ description: 'Vinculated coupon', maxLength: 1, required: false })
  @IsOptional()
  @IsString()
  @Length(1, 1)
  vinculatedCupom?: string;

  @ApiProperty({ description: 'Block amount', maxLength: 3, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  blockAmount?: string;

  @ApiProperty({ description: 'Renovation RTA date', required: false })
  @IsOptional()
  @IsDate()
  renovationRtaDate?: Date;

  @ApiProperty({ description: 'Receive MDS date', required: false })
  @IsOptional()
  @IsDate()
  receiveMdsDate?: Date;

  @ApiProperty({ description: 'Area number 2', maxLength: 4, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(4)
  areaNumber2?: string;

  @ApiProperty({ description: 'Phone number 2', maxLength: 10, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  phoneNumber2?: string;

  @ApiProperty({ description: 'Area number 3', maxLength: 4, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(4)
  areaNumber3?: string;

  @ApiProperty({ description: 'Fax number', maxLength: 10, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  faxNumber?: string;

  @ApiProperty({ description: 'Contact name', maxLength: 70, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  contactName?: string;

  @ApiProperty({ description: 'Contact CPF number', maxLength: 11, required: false })
  @IsOptional()
  @IsString()
  @Length(11, 11)
  contactCpfNumber?: string;

  @ApiProperty({ description: 'Contact area number', maxLength: 4, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(4)
  contactAreaNumber?: string;

  @ApiProperty({ description: 'Contact phone number', maxLength: 10, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  contactPhoneNumber?: string;

  @ApiProperty({ description: 'INSS certificate number', maxLength: 18, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(18)
  inssCertificateNumber?: string;

  @ApiProperty({ description: 'CND expires date', required: false })
  @IsOptional()
  @IsDate()
  cndExpiresDate?: Date;

  @ApiProperty({ description: 'Contact email description', maxLength: 60, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  contactEmailDescription?: string;

  @ApiProperty({ description: 'Authorization expires date', required: false })
  @IsOptional()
  @IsDate()
  authorizationExpiresDate?: Date;

  @ApiProperty({ description: 'Bank code', maxLength: 3, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  bankCode?: string;

  @ApiProperty({ description: 'Bank agency code', maxLength: 6, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(6)
  bankAgencyCode?: string;

  @ApiProperty({ description: 'Sphere description', maxLength: 1, required: false })
  @IsOptional()
  @IsString()
  @Length(1, 1)
  sphereDescription?: string;

  @ApiProperty({ description: 'Make sales status', maxLength: 1, required: false })
  @IsOptional()
  @IsString()
  @Length(1, 1)
  makeSalesStatus?: string;

  @ApiProperty({ description: 'Status vinculated coupon', maxLength: 1, required: false })
  @IsOptional()
  @IsString()
  @Length(1, 1)
  statusVinculatedCupom?: string;

  @ApiProperty({ description: 'Block amount number', maxLength: 3, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  blockAmountNumber?: string;

  @ApiProperty({ description: 'CNAE code number', maxLength: 7, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  cnaeCodeNumber?: string;

  @ApiProperty({ description: 'Society type', maxLength: 80, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  societyType?: string;

  @ApiProperty({ description: 'Street type', maxLength: 30, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  streetType?: string;

  @ApiProperty({ description: 'Street number', maxLength: 7, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  streetNumber?: string;

  @ApiProperty({ description: 'Address complement', maxLength: 160, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  addressComplement?: string;

  @ApiProperty({ description: 'Pharmacy block code', maxLength: 255, required: false })
  @IsOptional()
  @IsString()
  pharmacyBlockCode?: string;

  @ApiProperty({ description: 'Migration status', maxLength: 2, required: false })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  migrationStatus?: string;

  @ApiProperty({ description: 'Migration date', required: false })
  @IsOptional()
  @IsDate()
  migrationDate?: Date;
}
