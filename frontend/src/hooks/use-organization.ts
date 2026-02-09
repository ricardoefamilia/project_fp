import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { organizationService } from '@/services/organization.service'
import { userKeys } from './use-user'
import { toast } from 'sonner'

/**
 * Query keys for organization-related queries
 */
export const organizationKeys = {
  all: ['organization'] as const,
  list: () => [...organizationKeys.all, 'list'] as const,
  listMembers: () => [...organizationKeys.all, 'listMembers'] as const,
  active: () => [...organizationKeys.all, 'active'] as const,
  activeMember: () => [...organizationKeys.all, 'activeMember'] as const,
} as const

interface UseOrganizationOptions {
  enabled?: boolean
}

/**
 * Hook to list all organizations the current user is a member of (basic info)
 * @param options.enabled - Only fetch when true (default: true)
 */
export function useListOrganizations(options: UseOrganizationOptions = {}) {
  const { enabled } = options

  return useQuery({
    queryKey: organizationKeys.list(),
    queryFn: () => organizationService.list(),
    retry: false,
    placeholderData: keepPreviousData,
    enabled,
  })
}

/**
 * Hook to list all organization members with user details
 * @param options.enabled - Only fetch when true (default: true)
 */
export function useListOrganizationMembers(
  options: UseOrganizationOptions = {}
) {
  const { enabled } = options

  return useQuery({
    queryKey: organizationKeys.listMembers(),
    queryFn: () => organizationService.listMembers(),
    retry: false,
    placeholderData: keepPreviousData,
    enabled,
  })
}

/**
 * Hook to get the active organization for the current user
 * @param options.enabled - Only fetch when true (default: true)
 */
export function useActiveOrganization(options: UseOrganizationOptions = {}) {
  const { enabled } = options

  return useQuery({
    queryKey: organizationKeys.active(),
    queryFn: () => organizationService.getActiveOrganization(),
    retry: false,
    placeholderData: keepPreviousData,
    enabled,
  })
}

/**
 * Hook to get the active member (current user's member details in the active organization)
 * @param options.enabled - Only fetch when true (default: true)
 */
export function useActiveMember(options: UseOrganizationOptions = {}) {
  const { enabled } = options

  return useQuery({
    queryKey: organizationKeys.activeMember(),
    queryFn: () => organizationService.getActiveMember(),
    placeholderData: keepPreviousData,
    enabled,
  })
}

/**
 * Hook to set the active organization
 */
export function useSetActiveOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (organizationId: string) =>
      organizationService.setActive(organizationId),
    onSuccess: async () => {
      toast.success('Perfil ativado com sucesso!')

      await queryClient.refetchQueries({
        queryKey: organizationKeys.active(),
        exact: true,
      })

      await queryClient.refetchQueries({
        queryKey: organizationKeys.activeMember(),
        exact: true,
      })

      // Also refetch user profile to get updated organizations
      await queryClient.refetchQueries({
        queryKey: userKeys.profile(),
        exact: true,
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao ativar perfil')
    },
  })
}
