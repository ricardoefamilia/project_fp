import api from '@/lib/axios'
import type { CityListResponse, CityQueryParams } from '@/types/city.types'

/**
 * Base API path for city endpoints
 */
const CITY_API_PATH = '/cities'

/**
 * City Service
 * Contains all operations for city management matching backend API
 */
export const cityService = {
  /**
   * Get all cities with optional filtering and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with city list array
   */
  getAll: async (params?: CityQueryParams): Promise<CityListResponse> => {
    const response = await api.get<CityListResponse>(CITY_API_PATH, {
      params,
    })
    return response.data
  },
}
