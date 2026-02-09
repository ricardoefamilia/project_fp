/**
 * Organization types for better-auth organization plugin integration
 */
export interface Organization {
  id: string
  name: string
  slug: string
  logo?: string | null
  createdAt: Date
  metadata?: Record<string, unknown> | null
}

export interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  role: string
  createdAt: Date
}

export interface ActiveMember extends OrganizationMember {
  user?: {
    id: string
    name: string
    email: string
    image?: string | null
  }
}

/**
 * Organization with member role information
 * Used in profile selector to display role + organization name
 */
export interface OrganizationWithMember extends Organization {
  member: {
    id: string
    role: string
    createdAt: Date
  }
}

/**
 * @deprecated Use OrganizationWithMember instead
 */
export interface OrganizationWithRole extends Organization {
  member?: OrganizationMember
}
