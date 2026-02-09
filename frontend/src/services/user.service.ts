import api from '@/lib/axios'
import type { UserProfile } from '@/types/user.types'

/**
 * User service for interacting with user API
 */
export const userService = {
  /**
   * Gets the current user profile with organizations and roles
   * GET /users/me
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/users/me')
    return response.data
  },
}
