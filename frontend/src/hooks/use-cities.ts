import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { cityService } from '@/services/city.service'
import { cityKeys } from '@/lib/query-keys'
import type {
  CityListResponse,
  CityQueryParams,
  ApiError,
} from '@/types/city.types'

/**
 * Hook to fetch all cities with optional filtering and pagination
 * @param params - Query parameters for filtering and pagination
 * @param options - Additional React Query options
 */
export function useCities(
  params?: CityQueryParams,
  options?: Omit<
    UseQueryOptions<CityListResponse, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<CityListResponse, ApiError>({
    queryKey: cityKeys.list(params),
    queryFn: () => cityService.getAll(params),
    ...options,
  })
}

/**
 * Hook to fetch cities by UF (state acronym)
 * @param uf - State acronym (e.g., 'SP', 'RJ')
 * @param options - Additional React Query options
 */
export function useCitiesByUf(
  uf: string,
  options?: Omit<
    UseQueryOptions<CityListResponse, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<CityListResponse, ApiError>({
    queryKey: cityKeys.byUf(uf),
    queryFn: () => cityService.getAll({ uf }),
    enabled: !!uf,
    ...options,
  })
}

/**
 * Hook to prefetch cities (useful for hover states, route transitions)
 * @param params - Query parameters for filtering and pagination
 */
export function usePrefetchCities() {
  const queryClient = useQueryClient()

  return (params?: CityQueryParams) => {
    void queryClient.prefetchQuery({
      queryKey: cityKeys.list(params),
      queryFn: () => cityService.getAll(params),
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  }
}

/**
 * Hook to invalidate all city queries
 * Useful for manual refresh or after external data changes
 */
export function useInvalidateCities() {
  const queryClient = useQueryClient()

  return () => {
    void queryClient.invalidateQueries({ queryKey: cityKeys.all })
  }
}
