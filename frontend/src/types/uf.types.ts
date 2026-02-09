/**
 * UF Entity Types
 *
 * These types mirror the backend entity structure.
 * Generated from: api/src/database/entities/uf.entity.ts
 */
export interface Uf {
  codUfIbge: string
  sgUf: string
  codRegion?: string
  codCountry?: number
  nameUf?: string
  codUfSinpas?: string
  numArea?: number
  codUfldo?: string
  numLatitude?: string
  codUfInss?: string
  codUfSiafi?: string
  numLongitude?: string
  numOrderRegion?: number
  dsNatural?: string
  codCityIbgeCapital?: string
  stActiveRegistry?: string
  codStateSvs?: number
  numUfMarked?: string
  codIso31662?: string
  stCadSus?: string
}

/**
 * Response type for UF list
 * Backend returns array of Uf directly
 */
export type UfListResponse = Uf[]

/**
 * API Error response structure
 */
export interface ApiError {
  message: string
  statusCode: number
  error?: string
  details?: Record<string, unknown>
}
