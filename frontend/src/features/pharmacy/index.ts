export {
  usePharmacies,
  usePharmacy,
  useCreatePharmacy,
  useUpdatePharmacy,
  useDeletePharmacy,
  usePrefetchPharmacy,
  useInvalidatePharmacies,
} from '@/hooks/use-pharmacies'

// Types
export type {
  Pharmacy,
  CreatePharmacyInput,
  UpdatePharmacyInput,
  PharmacyQueryParams,
  PharmacyListResponse,
  ApiError,
} from '@/types/pharmacy.types'

// Schemas
export {
  pharmacySchema,
  createPharmacySchema,
  updatePharmacySchema,
  pharmacyQueryParamsSchema,
  createPharmacySchemaWithValidation,
  validateCNPJ,
  validateCPF,
  cnpjValidation,
  cpfValidation,
} from '@/schemas/pharmacy.schema'

export type {
  PharmacyFormData,
  CreatePharmacyFormData,
  UpdatePharmacyFormData,
  PharmacyQueryParamsFormData,
} from '@/schemas/pharmacy.schema'

// Service
export { pharmacyService } from '@/services/pharmacy.service'

// Query Keys
export { pharmacyKeys } from '@/lib/query-keys'
