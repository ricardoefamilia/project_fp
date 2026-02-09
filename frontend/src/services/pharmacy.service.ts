import api from '@/lib/axios'
import type {
  Pharmacy,
  CreatePharmacyInput,
  UpdatePharmacyInput,
  PharmacyQueryParams,
  PharmacyListResponse,
} from '@/types/pharmacy.types'

/**
 * Base API path for pharmacy endpoints
 */
const PHARMACY_API_PATH = '/pharmacys'

/**
 * Pharmacy Service
 * Contains all CRUD operations for pharmacy management matching backend API
 */
export const pharmacyService = {
  /**
   * Get all pharmacies with optional filtering, sorting, and pagination
   * @param params - Query parameters for filtering, sorting, and pagination
   * @returns Promise with pharmacy list array or paginated response
   */
  getAll: async (
    params?: PharmacyQueryParams
  ): Promise<PharmacyListResponse> => {
    const response = await api.get<PharmacyListResponse>(PHARMACY_API_PATH, {
      params,
    })
    return response.data
  },

  /**
   * Get a single pharmacy by CNPJ number
   * @param cnpjNumber - The CNPJ number of the pharmacy (primary key)
   * @returns Promise with pharmacy data
   */
  getById: async (cnpjNumber: string): Promise<Pharmacy> => {
    const response = await api.get<Pharmacy>(
      `${PHARMACY_API_PATH}/${cnpjNumber}`
    )
    return response.data
  },

  /**
   * Create a new pharmacy
   * @param data - Pharmacy data for creation
   * @returns Promise with created pharmacy data
   */
  create: async (data: CreatePharmacyInput): Promise<Pharmacy> => {
    const response = await api.post<Pharmacy>(PHARMACY_API_PATH, data)
    return response.data
  },

  /**
   * Update an existing pharmacy
   * @param cnpjNumber - The CNPJ number of the pharmacy to update
   * @param data - Partial pharmacy data for update
   * @returns Promise with updated pharmacy data
   */
  update: async (
    cnpjNumber: string,
    data: Partial<UpdatePharmacyInput>
  ): Promise<Pharmacy> => {
    const response = await api.patch<Pharmacy>(
      `${PHARMACY_API_PATH}/${cnpjNumber}`,
      data
    )
    return response.data
  },

  /**
   * Delete a pharmacy
   * @param cnpjNumber - The CNPJ number of the pharmacy to delete
   * @returns Promise with void (no content on success)
   */
  delete: async (cnpjNumber: string): Promise<void> => {
    await api.delete(`${PHARMACY_API_PATH}/${cnpjNumber}`)
  },
}
