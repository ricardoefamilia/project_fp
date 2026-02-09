import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { userService } from '@/services/user.service'

/**
 * Query keys for user-related queries
 */
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
} as const

interface UseUserOptions {
  enabled?: boolean
}

/**
 * Hook to get the current user profile with organizations and roles
 * @param options.enabled - Only fetch when true (default: true)
 */
export function useUserProfile(options: UseUserOptions = {}) {
  const { enabled } = options

  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => userService.getProfile(),
    retry: false,
    placeholderData: keepPreviousData,
    enabled,
  })
}
