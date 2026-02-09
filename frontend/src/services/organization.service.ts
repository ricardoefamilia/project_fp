import { authClient } from '@/lib/auth-client'
import api from '@/lib/axios'
import type { Organization, ActiveMember } from '@/types/organization.types'

/**
 * Better-auth API response type
 */
interface BetterAuthResponse<T> {
  data: T | null
  error: {
    code?: string
    message?: string
  } | null
}

/**
 * Organization member with user details (from API response)
 */
export interface OrganizationMemberWithUser {
  id: string
  organizationId: string
  userId: string
  role: string
  createdAt: Date | string
  user: {
    id: string
    name: string
    email: string
    cpf?: string
    image?: string | null
  }
  organization?: Organization
}

/**
 * Organization service for interacting with better-auth organization API
 */
export const organizationService = {
  /**
   * Lists all organizations the current user is a member of (basic info)
   * GET /api/auth/organization/list
   */
  async list(): Promise<Organization[]> {
    const { data, error } =
      (await authClient.organization.list()) as BetterAuthResponse<
        Organization[]
      >

    if (error) {
      throw new Error(error.message ?? 'Erro ao carregar organizações')
    }

    return data ?? []
  },

  /**
   * Gets the active organization for the current user with full details
   * GET /api/auth/organization/get-full-organization
   */
  async getActiveOrganization(): Promise<Organization | null> {
    const { data, error } =
      (await authClient.organization.getFullOrganization()) as BetterAuthResponse<Organization>

    if (error) {
      // No active organization is a valid state
      if (error.code === 'ORGANIZATION_NOT_FOUND') {
        return null
      }
      throw new Error(error.message ?? 'Erro ao carregar organização ativa')
    }

    return data
  },

  /**
   * Gets the active member details for the current user
   * GET /api/auth/organization/get-active-member
   */
  async getActiveMember(): Promise<ActiveMember | null> {
    const { data, error } =
      (await authClient.organization.getActiveMember()) as BetterAuthResponse<ActiveMember>

    if (error) {
      // No active member is a valid state
      if (error.code === 'MEMBER_NOT_FOUND') {
        return null
      }
      throw new Error(error.message ?? 'Erro ao carregar membro ativo')
    }

    return data
  },

  /**
   * Sets the active organization for the current user
   * POST /api/auth/organization/set-active
   */
  async setActive(organizationId: string): Promise<{ id: string } | null> {
    const { data, error } = (await authClient.organization.setActive({
      organizationId,
    })) as BetterAuthResponse<{ id: string }>

    if (error) {
      throw new Error(error.message ?? 'Erro ao ativar organização')
    }

    return data
  },

  /**
   * Lists all organization members with user details
   * GET /api/auth/organization/list-members
   */
  async listMembers(): Promise<OrganizationMemberWithUser[]> {
    const response = await api.get<{
      members: OrganizationMemberWithUser[]
      total: number
    }>('/auth/organization/list-members')

    // Fetch organizations to get full details
    const organizations = await this.list()

    // Create a map of organizationId -> organization
    const orgMap = new Map<string, Organization>()
    organizations.forEach((org) => {
      orgMap.set(org.id, org)
    })

    // Match members with their organizations
    const membersWithOrgs = response.data.members.map((member) => {
      const organization = orgMap.get(member.organizationId)
      return {
        ...member,
        organization,
      } as OrganizationMemberWithUser
    })

    return membersWithOrgs
  },
}
