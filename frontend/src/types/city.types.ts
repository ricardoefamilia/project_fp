/**
 * City Entity Types
 *
 * These types mirror the backend entity structure.
 * Generated from: api/src/database/entities/city.entity.ts
 */
export interface City {
  ibgeCode: string
  healthRegionCode?: string
  stateAcronym: string
  macroregionCode?: string
  mesoregionCode?: string
  microregionCode?: string
  ufIbgeCode?: string
  municipalityName: string
  municipalityAcronym?: string
  areaCode?: string
  postalCode?: string
  ibgeDigit?: string
  successorCode?: string
  isIbge?: string
  svsMunicipalityCode?: number
}

/**
 * Query parameters for filtering/searching cities
 * Matches backend API query params
 */
export interface CityQueryParams {
  uf?: string
  page?: number
  pageSize?: number
  sortOrder?: 'ASC' | 'DESC'
}

/**
 * Response type for city list
 * Backend returns array of City directly
 */
export type CityListResponse = City[]

/**
 * API Error response structure
 */
export interface ApiError {
  message: string
  statusCode: number
  error?: string
  details?: Record<string, unknown>
}
