import api from '@/lib/axios'
import type { UfListResponse } from '@/types/uf.types'

/**
 * Base API path for UF endpoints
 */
const UF_API_PATH = '/ufs'

/**
 * UF Service
 * Contains all operations for UF (states) management matching backend API
 */
export const ufService = {
  /**
   * Get all UFs (states)
   * @returns Promise with UF list array
   */
  getAll: async (): Promise<UfListResponse> => {
    const response = await api.get<UfListResponse>(UF_API_PATH)
    return response.data
  },
}
