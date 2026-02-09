import type { Organization } from './organization.types'

/**
 * Base user type matching better-auth User structure
 */
export interface User {
  id: string
  email: string
  name: string | null
  image?: string | null
  emailVerified?: boolean | null
  createdAt: Date | string
  updatedAt: Date | string
  twoFactorEnabled?: boolean
  role?: string | null
  banned?: boolean
  banReason?: string | null
  banExpires?: Date | string | null
}

/**
 * Organization with role information from /users/me endpoint
 * This is the structure returned by findUserOrganizationsWithRole
 * The role field is required (not optional) in this context
 */
export interface OrganizationWithRole extends Omit<Organization, 'role'> {
  role: string
}

/**
 * User profile response from /users/me endpoint
 * Returns the user data with all organizations they belong to (with roles)
 */
export interface UserProfile extends User {
  organizations: OrganizationWithRole[]
}
