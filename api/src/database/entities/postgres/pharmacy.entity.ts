import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('TB_FARMACIA')
export class Pharmacy {
  @PrimaryGeneratedColumn('identity', { name: 'CO_SEQ_FARMACIA', type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 14, name: 'NU_CNPJ', unique: true })
  cnpjNumber: string;

  @Column({ type: 'varchar', length: 14, nullable: true, name: 'NU_CNPJ_MATRIZ' })
  parentCnpjNumber: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'NU_LICENCA' })
  licenseNumber: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'NO_ORGAO_VIGILANCIA' })
  supervisoryBoardNumber: string | null;

  @Column({ type: 'varchar', length: 1, nullable: true, name: 'TP_EMPRESA' })
  companyType: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'NO_RAZAO_SOCIAL' })
  companyName: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'DS_ENDERECO' })
  address: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true, name: 'NO_BAIRRO' })
  district?: string | null;

  @Column({ type: 'varchar', length: 6, nullable: true, name: 'CO_MUNICIPIO_IBGE' })
  cityCodeIbge: string | null;

  @Column({ type: 'varchar', length: 8, nullable: true, name: 'NU_CEP' })
  zipCode: string | null;

  @Column({ type: 'varchar', length: 4, nullable: true, name: 'NU_DDD' })
  areaNumber: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true, name: 'NU_TELEFONE' })
  phoneNumber: string | null;

  @Column({ type: 'varchar', length: 60, nullable: true, name: 'DS_EMAIL' })
  email: string | null;

  @Column({ type: 'varchar', length: 70, nullable: true, name: 'NO_RESP_LEGAL' })
  legalResponsibleName: string | null;

  @Column({ type: 'varchar', length: 11, nullable: true, name: 'NU_CPF_RESP_LEGAL' })
  legalResponsibleCpfNumber: string | null;

  @Column({ type: 'varchar', length: 70, nullable: true, name: 'NO_RESP_TECNICO' })
  technicalResponsibleName: string | null;

  @Column({ type: 'varchar', length: 11, nullable: true, name: 'NU_CPF_RESP_TECNICO' })
  technicalResponsibleCpfNumber: string | null;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'NU_CRF' })
  crfNumber: string | null;

  @Column({ type: 'varchar', length: 2, nullable: true, name: 'SG_UF_CRF' })
  ufCrf: string | null;

  @Column({ type: 'varchar', length: 1, name: 'ST_FUNCIONAMENTO' })
  operationalStatus: string;

  @Column({ type: 'varchar', length: 255, name: 'CO_USUARIO_INCLUSAO' })
  userInclusionId: string;

  @CreateDateColumn({ type: 'timestamp', name: 'DT_INCLUSAO' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 255, name: 'CO_USUARIO_ALTERACAO' })
  userUpdateId: string;

  @UpdateDateColumn({ type: 'timestamp', name: 'DT_ALTERACAO' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 14, nullable: true, name: 'NU_CNPJ_CONCENTRADOR' })
  concentratorCnpjNumber: string | null;

  @Column({ type: 'varchar', length: 6, nullable: true, name: 'NU_IDENTIFICADOR' })
  identificationNumber: string | null;

  @Column({ type: 'varchar', length: 1, nullable: true, default: 'N', name: 'ST_CONCENTRADOR' })
  concentratorStatus: string | null;

  @Column({ type: 'varchar', length: 1, nullable: true, name: 'TP_RECEBIMENTO_EMAIL' })
  emailReceiveType: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true, name: 'NO_FANTASIA' })
  fantasyName: string | null;

  @Column({ type: 'timestamp', nullable: true, name: 'DT_PUBLICACAO_DOU' })
  douPublicationDate: Date | null;

  @Column({ type: 'varchar', length: 21, nullable: true, name: 'NU_PROCESSO_SIPAR' })
  siparProcessNumber: string | null;

  @Column({ type: 'varchar', length: 1, nullable: true, name: 'ST_BLOQUEIO' })
  blockStatus: string | null;

  @Column({ type: 'timestamp', nullable: true, name: 'DT_BLOQUEIO' })
  blockDate: Date | null;

  @Column({ type: 'integer', nullable: true, name: 'CO_MOTIVO_BLOQUEIO' })
  blockReasonCode: number | null;

  @Column({ type: 'varchar', length: 1, default: 'N', nullable: true, name: 'ST_UNIDADE_PROPRIA' })
  statusOwnUnity: string | null;

  @Column({ type: 'varchar', length: 11, nullable: true, name: 'NU_REG_COMERCIAL' })
  comercialRegisterNumber: string | null;

  @Column({ type: 'varchar', length: 1, nullable: true, name: 'EFETUA_VENDAS' })
  makeSales: string | null;

  @Column({ type: 'varchar', length: 1, nullable: true, name: 'CUPOM_VINCULADO' })
  vinculatedCupom: string | null;

  @Column({ type: 'varchar', length: 3, nullable: true, name: 'QT_BLOQUEIO' })
  blockAmount: string | null;

  @Column({ type: 'timestamp', nullable: true, name: 'DT_RENOV_RTA' })
  renovationRtaDate: Date | null;

  @Column({ type: 'timestamp', nullable: true, name: 'DT_RECEB_MDS' })
  receiveMdsDate: Date | null;

  @Column({ type: 'varchar', length: 4, nullable: true, name: 'NU_DDD2' })
  areaNumber2: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true, name: 'NU_TELEFONE2' })
  phoneNumber2: string | null;

  @Column({ type: 'varchar', length: 4, nullable: true, name: 'NU_DDD3' })
  areaNumber3: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true, name: 'NU_FAX' })
  faxNumber: string | null;

  @Column({ type: 'varchar', length: 70, nullable: true, name: 'NO_CONTATO' })
  contactName: string | null;

  @Column({ type: 'varchar', length: 11, nullable: true, name: 'NU_CPF_CONTATO' })
  contactCpfNumber: string | null;

  @Column({ type: 'varchar', length: 4, nullable: true, name: 'NU_DDD_C' })
  contactAreaNumber: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true, name: 'NU_TELEFONE_C' })
  contactPhoneNumber: string | null;

  @Column({ type: 'varchar', length: 18, nullable: true, name: 'NU_CERTIDAO_INSS' })
  inssCertificateNumber: string | null;

  @Column({ type: 'timestamp', nullable: true, name: 'DT_VENCIMENTO_CND' })
  cndExpiresDate: Date | null;

  @Column({ type: 'varchar', length: 60, nullable: true, name: 'DS_EMAIL_CONTATO' })
  contactEmailDescription: string | null;

  @Column({ type: 'timestamp', nullable: true, name: 'DT_VENCIMENTO_AUTORIZACAO' })
  authorizationExpiresDate: Date | null;

  @Column({ type: 'varchar', length: 3, nullable: true, name: 'CO_BANCO' })
  bankCode: string | null;

  @Column({ type: 'varchar', length: 6, nullable: true, name: 'CO_AGENCIA_BANCARIA' })
  bankAgencyCode: string | null;

  @Column({ type: 'varchar', length: 1, nullable: true, name: 'DS_ESFERA' })
  sphereDescription: string | null;

  @Column({ type: 'varchar', length: 1, nullable: true, name: 'ST_EFETUA_VENDAS' })
  makeSalesStatus: string | null;

  @Column({ type: 'varchar', length: 1, nullable: true, name: 'ST_CUPOM_VINCULADO' })
  statusVinculatedCupom: string | null;

  @Column({ type: 'varchar', length: 3, nullable: true, name: 'NU_QTD_BLOQUEIO' })
  blockAmountNumber: string | null;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'CO_CNAE' })
  cnaeCodeNumber: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true, name: 'TP_SOCIEDADE' })
  societyType: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'TP_LOGRADOURO' })
  streetType: string | null;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'NU_LOGRADOURO' })
  streetNumber: string | null;

  @Column({ type: 'varchar', length: 160, nullable: true, name: 'DS_COMPLEMENTO' })
  addressComplement: string | null;

  @Column({ type: 'integer', nullable: true, name: 'CO_FARMACIA_BLOQUEIO' })
  pharmacyBlockCode: number | null;

  @Column({ type: 'varchar', length: 2, nullable: true, name: 'ST_MIGRACAO' })
  migrationStatus: string | null;

  @Column({ type: 'timestamp', nullable: true, name: 'DT_MIGRACAO' })
  migrationDate: Date | null;
}
