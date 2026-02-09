import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { ufService } from '@/services/uf.service'
import { ufKeys } from '@/lib/query-keys'
import type { UfListResponse, ApiError } from '@/types/uf.types'

/**
 * Hook to fetch all UFs (states)
 * @param options - Additional React Query options
 */
export function useUfs(
  options?: Omit<
    UseQueryOptions<UfListResponse, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<UfListResponse, ApiError>({
    queryKey: ufKeys.list(),
    queryFn: () => ufService.getAll(),
    ...options,
  })
}

/**
 * Hook to invalidate all UF queries
 * Useful for manual refresh or after external data changes
 */
export function useInvalidateUfs() {
  const queryClient = useQueryClient()

  return () => {
    void queryClient.invalidateQueries({ queryKey: ufKeys.all })
  }
}
