import { z } from 'zod'
import { cleanCNPJ, cleanCPF } from '@/lib/utils/brazilian-documents'

/**
 * Pharmacy schema matching backend DTO validation
 * Required fields: cnpjNumber, companyName, operationalStatus
 * Backend: address is optional (@IsOptional)
 */
export const pharmacySchema = z.object({
  cnpjNumber: z
    .string()
    .min(1, 'CNPJ é obrigatório')
    .length(14, 'CNPJ deve conter exatamente 14 dígitos')
    .regex(/^\d{14}$/, 'CNPJ deve conter apenas números'),
  companyName: z
    .string()
    .min(1, 'Razão social é obrigatória')
    .max(100, 'Nome da empresa muito longo'),
  address: z.string().max(100, 'Endereço muito longo').optional(),
  operationalStatus: z
    .string()
    .min(1, 'Status operacional é obrigatório')
    .length(1, 'Status deve ter exatamente 1 caractere'),

  parentCnpjNumber: z
    .string()
    .length(14, 'CNPJ matriz deve conter exatamente 14 dígitos')
    .regex(/^\d{14}$/, 'CNPJ matriz deve conter apenas números')
    .optional(),
  licenseNumber: z.string().max(20, 'Número da licença muito longo').optional(),
  supervisoryBoardNumber: z
    .string()
    .max(50, 'Número do conselho muito longo')
    .optional(),
  companyType: z
    .string()
    .length(1, 'Tipo de empresa deve ter exatamente 1 caractere')
    .optional(),
  fantasyName: z.string().max(120, 'Nome fantasia muito longo').optional(),
  societyType: z.string().max(80, 'Tipo de sociedade muito longo').optional(),
  streetType: z.string().max(30, 'Tipo de logradouro muito longo').optional(),
  streetNumber: z
    .string()
    .max(7, 'Número do logradouro muito longo')
    .optional(),
  addressComplement: z.string().max(160, 'Complemento muito longo').optional(),
  district: z.string().max(120, 'Bairro muito longo').optional(),
  cityCodeIbge: z
    .string()
    .length(6, 'Código IBGE deve ter exatamente 6 dígitos')
    .optional(),
  zipCode: z
    .string()
    .length(8, 'CEP deve conter exatamente 8 dígitos')
    .optional(),
  areaNumber: z.string().max(4, 'DDD muito longo').optional(),
  phoneNumber: z.string().max(10, 'Telefone muito longo').optional(),
  areaNumber2: z.string().max(4, 'DDD muito longo').optional(),
  phoneNumber2: z.string().max(10, 'Telefone muito longo').optional(),
  areaNumber3: z.string().max(4, 'DDD muito longo').optional(),
  faxNumber: z.string().max(10, 'Fax muito longo').optional(),
  email: z
    .string()
    .email('E-mail inválido')
    .max(60, 'E-mail muito longo')
    .optional(),
  contactName: z.string().max(70, 'Nome do contato muito longo').optional(),
  contactCpfNumber: z
    .string()
    .length(11, 'CPF deve conter exatamente 11 dígitos')
    .optional(),
  contactAreaNumber: z.string().max(4, 'DDD muito longo').optional(),
  contactPhoneNumber: z.string().max(10, 'Telefone muito longo').optional(),
  contactEmailDescription: z
    .string()
    .email('E-mail inválido')
    .max(60, 'E-mail muito longo')
    .optional(),
  legalResponsibleName: z.string().max(70, 'Nome muito longo').optional(),
  legalResponsibleCpfNumber: z
    .string()
    .length(11, 'CPF deve conter exatamente 11 dígitos')
    .optional(),
  technicalResponsibleName: z.string().max(70, 'Nome muito longo').optional(),
  technicalResponsibleCpfNumber: z
    .string()
    .length(11, 'CPF deve conter exatamente 11 dígitos')
    .optional(),
  crfNumber: z.string().max(7, 'Número CRF muito longo').optional(),
  ufCrf: z.string().length(2, 'UF deve ter exatamente 2 caracteres').optional(),
  concentratorCnpjNumber: z
    .string()
    .length(14, 'CNPJ concentrador deve conter exatamente 14 dígitos')
    .optional(),
  identificationNumber: z
    .string()
    .max(6, 'Número de identificação muito longo')
    .optional(),
  concentratorStatus: z
    .string()
    .length(1, 'Status do concentrador deve ter exatamente 1 caractere')
    .optional(),
  emailReceiveType: z
    .string()
    .length(1, 'Tipo de recebimento de e-mail deve ter exatamente 1 caractere')
    .optional(),
  douPublicationDate: z.coerce.date().optional().nullable(),
  siparProcessNumber: z
    .string()
    .max(21, 'Número do processo SIPAR muito longo')
    .optional(),
  blockStatus: z
    .string()
    .length(1, 'Status de bloqueio deve ter exatamente 1 caractere')
    .optional(),
  blockDate: z.coerce.date().optional().nullable(),
  blockReasonCode: z
    .number()
    .int('Código de motivo deve ser um número inteiro')
    .optional()
    .nullable(),
  statusOwnUnity: z
    .string()
    .length(1, 'Status da unidade própria deve ter exatamente 1 caractere')
    .optional(),
  comercialRegisterNumber: z
    .string()
    .max(11, 'Número do registro comercial muito longo')
    .optional(),
  makeSales: z
    .string()
    .length(1, 'Faz vendas deve ter exatamente 1 caractere')
    .optional(),
  vinculatedCupom: z
    .string()
    .length(1, 'Cupom vinculado deve ter exatamente 1 caractere')
    .optional(),
  blockAmount: z.string().max(3, 'Valor de bloqueio muito longo').optional(),
  renovationRtaDate: z.coerce.date().optional().nullable(),
  receiveMdsDate: z.coerce.date().optional().nullable(),
  inssCertificateNumber: z
    .string()
    .max(18, 'Número do certificado INSS muito longo')
    .optional(),
  cndExpiresDate: z.coerce.date().optional().nullable(),
  authorizationExpiresDate: z.coerce.date().optional().nullable(),
  bankCode: z.string().max(3, 'Código do banco muito longo').optional(),
  bankAgencyCode: z.string().max(6, 'Código da agência muito longo').optional(),
  sphereDescription: z
    .string()
    .length(1, 'Descrição da esfera deve ter exatamente 1 caractere')
    .optional(),
  makeSalesStatus: z
    .string()
    .length(1, 'Status de vendas deve ter exatamente 1 caractere')
    .optional(),
  statusVinculatedCupom: z
    .string()
    .length(1, 'Status do cupom vinculado deve ter exatamente 1 caractere')
    .optional(),
  blockAmountNumber: z
    .string()
    .max(3, 'Número do valor de bloqueio muito longo')
    .optional(),
  cnaeCodeNumber: z.string().max(7, 'Código CNAE muito longo').optional(),
  pharmacyBlockCode: z
    .string()
    .max(255, 'Código de bloqueio muito longo')
    .optional(),
  migrationStatus: z
    .string()
    .length(2, 'Status de migração deve ter exatamente 2 caracteres')
    .optional(),
  migrationDate: z.coerce.date().optional().nullable(),
})

export const createPharmacySchema = pharmacySchema

export const updatePharmacySchema = pharmacySchema.partial().required({
  cnpjNumber: true,
})

export const pharmacyQueryParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  sortField: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
})

export type PharmacyFormData = z.infer<typeof pharmacySchema>
export type CreatePharmacyFormData = z.infer<typeof createPharmacySchema>
export type UpdatePharmacyFormData = z.infer<typeof updatePharmacySchema>
export type PharmacyQueryParamsFormData = z.infer<
  typeof pharmacyQueryParamsSchema
>

/**
 * Helper function to validate CNPJ with check digits
 * @param cnpj - CNPJ string with 14 digits
 * @returns true if valid, false otherwise
 */
export function validateCNPJ(cnpj: string): boolean {
  cnpj = cleanCNPJ(cnpj)

  if (cnpj.length !== 14) {
    return false
  }

  if (/^(\d)\1+$/.test(cnpj)) {
    return false
  }

  let sum = 0
  let weight = 5

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight
    weight = weight === 2 ? 9 : weight - 1
  }

  let checkDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (checkDigit !== parseInt(cnpj.charAt(12))) {
    return false
  }

  sum = 0
  weight = 6

  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight
    weight = weight === 2 ? 9 : weight - 1
  }

  checkDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (checkDigit !== parseInt(cnpj.charAt(13))) {
    return false
  }

  return true
}

/**
 * Helper function to validate CPF with check digits
 * @param cpf - CPF string with 11 digits
 * @returns true if valid, false otherwise
 */
export function validateCPF(cpf: string): boolean {
  cpf = cleanCPF(cpf)

  if (cpf.length !== 11) {
    return false
  }

  if (/^(\d)\1+$/.test(cpf)) {
    return false
  }

  let sum = 0

  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }

  let checkDigit = 11 - (sum % 11)

  if (checkDigit >= 10) {
    checkDigit = 0
  }

  if (checkDigit !== parseInt(cpf.charAt(9))) {
    return false
  }

  sum = 0

  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }

  checkDigit = 11 - (sum % 11)
  if (checkDigit >= 10) {
    checkDigit = 0
  }

  if (checkDigit !== parseInt(cpf.charAt(10))) {
    return false
  }

  return true
}

/**
 * Custom Zod refinement for CNPJ validation
 */
export const cnpjValidation = z
  .string()
  .length(14)
  .regex(/^\d{14}$/)
  .refine(validateCNPJ, {
    message: 'CNPJ inválido',
  })

/**
 * Custom Zod refinement for CPF validation
 */
export const cpfValidation = z
  .string()
  .length(11)
  .regex(/^\d{11}$/)
  .refine(validateCPF, {
    message: 'CPF inválido',
  })

/**
 * Enhanced create pharmacy schema with CNPJ/CPF validation
 */
export const createPharmacySchemaWithValidation = createPharmacySchema.extend({
  cnpjNumber: cnpjValidation,
  parentCnpjNumber: cnpjValidation.optional(),
  concentratorCnpjNumber: cnpjValidation.optional(),
  legalResponsibleCpfNumber: cpfValidation.optional(),
  technicalResponsibleCpfNumber: cpfValidation.optional(),
  contactCpfNumber: cpfValidation.optional(),
})
