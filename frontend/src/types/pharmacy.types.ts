/**
 * Pharmacy Entity Types
 *
 * These types mirror the backend DTO structure.
 * Generated from: api/src/modules/pharmacys/dto/pharmacy.dto.ts
 */
export interface Pharmacy {
  cnpjNumber: string
  parentCnpjNumber?: string
  licenseNumber?: string
  supervisoryBoardNumber?: string
  companyType?: string
  companyName: string
  fantasyName?: string
  societyType?: string
  address: string
  streetType?: string
  streetNumber?: string
  addressComplement?: string
  district?: string
  cityCodeIbge?: string
  zipCode?: string
  areaNumber?: string
  phoneNumber?: string
  areaNumber2?: string
  phoneNumber2?: string
  areaNumber3?: string
  faxNumber?: string
  email?: string
  contactName?: string
  contactCpfNumber?: string
  contactAreaNumber?: string
  contactPhoneNumber?: string
  contactEmailDescription?: string
  legalResponsibleName?: string
  legalResponsibleCpfNumber?: string
  technicalResponsibleName?: string
  technicalResponsibleCpfNumber?: string
  crfNumber?: string
  ufCrf?: string
  operationalStatus: string
  concentratorStatus?: string
  blockStatus?: string
  blockDate?: Date
  blockReasonCode?: number
  blockAmount?: string
  blockAmountNumber?: string
  pharmacyBlockCode?: string
  concentratorCnpjNumber?: string
  identificationNumber?: string
  emailReceiveType?: string
  makeSales?: string
  makeSalesStatus?: string
  vinculatedCupom?: string
  statusVinculatedCupom?: string
  douPublicationDate?: Date
  renovationRtaDate?: Date
  receiveMdsDate?: Date
  cndExpiresDate?: Date
  authorizationExpiresDate?: Date
  siparProcessNumber?: string
  inssCertificateNumber?: string
  bankCode?: string
  bankAgencyCode?: string
  statusOwnUnity?: string
  comercialRegisterNumber?: string
  cnaeCodeNumber?: string
  sphereDescription?: string
  migrationStatus?: string
  migrationDate?: Date
}

/**
 * DTO for creating a new pharmacy
 * Matches backend PharmacyDto structure
 */
export interface CreatePharmacyInput {
  cnpjNumber: string
  companyName: string
  address: string
  operationalStatus: string
  parentCnpjNumber?: string
  licenseNumber?: string
  supervisoryBoardNumber?: string
  companyType?: string
  fantasyName?: string
  societyType?: string
  streetType?: string
  streetNumber?: string
  addressComplement?: string
  district?: string
  cityCodeIbge?: string
  zipCode?: string
  areaNumber?: string
  phoneNumber?: string
  areaNumber2?: string
  phoneNumber2?: string
  areaNumber3?: string
  faxNumber?: string
  email?: string
  contactName?: string
  contactCpfNumber?: string
  contactAreaNumber?: string
  contactPhoneNumber?: string
  contactEmailDescription?: string
  legalResponsibleName?: string
  legalResponsibleCpfNumber?: string
  technicalResponsibleName?: string
  technicalResponsibleCpfNumber?: string
  crfNumber?: string
  ufCrf?: string
  concentratorStatus?: string
  blockStatus?: string
  blockDate?: Date
  blockReasonCode?: number
  blockAmount?: string
  blockAmountNumber?: string
  pharmacyBlockCode?: string
  concentratorCnpjNumber?: string
  identificationNumber?: string
  emailReceiveType?: string
  makeSales?: string
  makeSalesStatus?: string
  vinculatedCupom?: string
  statusVinculatedCupom?: string
  douPublicationDate?: Date
  renovationRtaDate?: Date
  receiveMdsDate?: Date
  cndExpiresDate?: Date
  authorizationExpiresDate?: Date
  siparProcessNumber?: string
  inssCertificateNumber?: string
  bankCode?: string
  bankAgencyCode?: string
  statusOwnUnity?: string
  comercialRegisterNumber?: string
  cnaeCodeNumber?: string
  sphereDescription?: string
  migrationStatus?: string
  migrationDate?: Date
}

/**
 * DTO for updating an existing pharmacy
 * All fields are optional except the CNPJ (used as identifier)
 */
export interface UpdatePharmacyInput extends Partial<CreatePharmacyInput> {
  cnpjNumber: string
}

/**
 * Query parameters for filtering/searching pharmacies
 * Matches backend API query params
 */
export interface PharmacyQueryParams {
  page?: number
  pageSize?: number
  search?: string
  sortField?: string
  sortOrder?: 'ASC' | 'DESC'
  // Column-specific filters
  cnpjNumber?: string
  companyName?: string
  operationalStatus?: string
  blockStatus?: string
  ufCrf?: string
  cityCodeIbge?: string
  [key: string]: string | number | undefined
}

/**
 * Pagination metadata from backend
 */
export interface PaginationMeta {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

/**
 * Response type for pharmacy list with pagination
 * Backend should return this structure for server-side pagination
 */
export interface PharmacyListResponse {
  data: Pharmacy[]
  meta?: PaginationMeta
}

/**
 * API Error response structure
 */
export interface ApiError {
  message: string
  statusCode: number
  error?: string
  details?: Record<string, unknown>
}
