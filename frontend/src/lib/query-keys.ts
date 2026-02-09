/**
 * Query Keys Factory
 *
 * Centralized query key management for TanStack Query.
 * This pattern provides type-safe query keys and makes cache invalidation easier.
 *
 * Example of how to extend this pattern for other entities:
 *
 * export const userKeys = {
 *   all: ['users'] as const,
 *   lists: () => [...userKeys.all, 'list'] as const,
 *   list: (filters: string) => [...userKeys.lists(), { filters }] as const,
 *   details: () => [...userKeys.all, 'detail'] as const,
 *   detail: (id: string) => [...userKeys.details(), id] as const,
 * }
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys
 */

import type { PharmacyQueryParams } from '@/types/pharmacy.types'
import type { CityQueryParams } from '@/types/city.types'

/**
 * Query keys factory for Organization-related queries
 */
export const organizationKeys = {
  /**
   * Base key for all organization queries
   */
  all: ['organization'] as const,

  /**
   * Key for organization list query
   */
  list: () => [...organizationKeys.all, 'list'] as const,

  /**
   * Key for active organization query
   */
  active: () => [...organizationKeys.all, 'active'] as const,

  /**
   * Key for active member query
   */
  activeMember: () => [...organizationKeys.all, 'activeMember'] as const,
}

/**
 * Query keys factory for Pharmacy-related queries
 */
export const pharmacyKeys = {
  /**
   * Base key for all pharmacy queries
   */
  all: ['pharmacies'] as const,

  /**
   * Key for pharmacy list queries
   */
  lists: () => [...pharmacyKeys.all, 'list'] as const,

  /**
   * Key for a specific pharmacy list query with filters
   * @param params - Query parameters for filtering
   */
  list: (params?: PharmacyQueryParams) =>
    [...pharmacyKeys.lists(), params] as const,

  /**
   * Key for all pharmacy detail queries
   */
  details: () => [...pharmacyKeys.all, 'detail'] as const,

  /**
   * Key for a specific pharmacy detail query
   * @param cnpjNumber - The CNPJ number of the pharmacy
   */
  detail: (cnpjNumber: string) =>
    [...pharmacyKeys.details(), cnpjNumber] as const,
}

/**
 * Query keys factory for UF (states) queries
 */
export const ufKeys = {
  /**
   * Base key for all UF queries
   */
  all: ['ufs'] as const,

  /**
   * Key for UF list queries
   */
  lists: () => [...ufKeys.all, 'list'] as const,

  /**
   * Key for the UF list query
   */
  list: () => [...ufKeys.lists()] as const,
}

/**
 * Query keys factory for City queries
 */
export const cityKeys = {
  /**
   * Base key for all city queries
   */
  all: ['cities'] as const,

  /**
   * Key for city list queries
   */
  lists: () => [...cityKeys.all, 'list'] as const,

  /**
   * Key for a specific city list query with filters
   * @param params - Query parameters for filtering
   */
  list: (params?: CityQueryParams) => [...cityKeys.lists(), params] as const,

  /**
   * Key for cities filtered by UF (state)
   * @param uf - State acronym
   */
  byUf: (uf: string) => [...cityKeys.all, 'byUf', uf] as const,
}
