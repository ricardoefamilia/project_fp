import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { pharmacyService } from '@/services/pharmacy.service'
import { pharmacyKeys } from '@/lib/query-keys'
import type {
  Pharmacy,
  CreatePharmacyInput,
  UpdatePharmacyInput,
  PharmacyQueryParams,
  PharmacyListResponse,
  ApiError,
} from '@/types/pharmacy.types'

/**
 * Hook to fetch all pharmacies with optional filtering, sorting, and pagination
 * @param params - Query parameters for filtering, sorting, and pagination
 * @param options - Additional React Query options
 */
export function usePharmacies(
  params?: PharmacyQueryParams,
  options?: Omit<
    UseQueryOptions<PharmacyListResponse, ApiError>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<PharmacyListResponse, ApiError>({
    queryKey: pharmacyKeys.list(params),
    queryFn: () => pharmacyService.getAll(params),
    select: (data) => {
      if (Array.isArray(data)) {
        return data
      }
      return data
    },
    ...options,
  })
}

/**
 * Hook to fetch a single pharmacy by CNPJ number
 * @param cnpjNumber - The CNPJ number of the pharmacy
 * @param options - Additional React Query options
 */
export function usePharmacy(
  cnpjNumber: string,
  options?: Omit<UseQueryOptions<Pharmacy, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Pharmacy, ApiError>({
    queryKey: pharmacyKeys.detail(cnpjNumber),
    queryFn: () => pharmacyService.getById(cnpjNumber),
    enabled: !!cnpjNumber,
    ...options,
  })
}

/**
 * Hook to create a new pharmacy
 * @param options - Additional React Query mutation options
 */
export function useCreatePharmacy(
  options?: UseMutationOptions<Pharmacy, ApiError, CreatePharmacyInput>
) {
  const queryClient = useQueryClient()

  return useMutation<Pharmacy, ApiError, CreatePharmacyInput>({
    mutationFn: pharmacyService.create,
    onSuccess: (data, variables, context, ...args) => {
      void queryClient.invalidateQueries({ queryKey: pharmacyKeys.lists() })

      queryClient.setQueryData(pharmacyKeys.detail(data.cnpjNumber), data)

      toast.success('Farmácia criada com sucesso!')

      options?.onSuccess?.(data, variables, context, ...args)
    },
    onError: (error, variables, context, ...args) => {
      toast.error(error.message || 'Erro ao criar farmácia')

      options?.onError?.(error, variables, context, ...args)
    },
    ...options,
  })
}

/**
 * Hook to update an existing pharmacy
 * @param options - Additional React Query mutation options
 */
export function useUpdatePharmacy(
  options?: UseMutationOptions<
    Pharmacy,
    ApiError,
    { cnpjNumber: string; data: Partial<UpdatePharmacyInput> }
  >
) {
  const queryClient = useQueryClient()

  return useMutation<
    Pharmacy,
    ApiError,
    { cnpjNumber: string; data: Partial<UpdatePharmacyInput> }
  >({
    mutationFn: ({ cnpjNumber, data }) =>
      pharmacyService.update(cnpjNumber, data),
    onMutate: async ({ cnpjNumber, data }) => {
      await queryClient.cancelQueries({
        queryKey: pharmacyKeys.detail(cnpjNumber),
      })

      const previousPharmacy = queryClient.getQueryData<Pharmacy>(
        pharmacyKeys.detail(cnpjNumber)
      )

      if (previousPharmacy) {
        queryClient.setQueryData<Pharmacy>(
          pharmacyKeys.detail(cnpjNumber),
          (old) => (old ? { ...old, ...data } : old)
        )
      }

      return { previousPharmacy }
    },
    onSuccess: (data, variables, context, ...args) => {
      queryClient.setQueryData(pharmacyKeys.detail(data.cnpjNumber), data)

      void queryClient.invalidateQueries({ queryKey: pharmacyKeys.lists() })

      toast.success('Farmácia atualizada com sucesso!')

      options?.onSuccess?.(data, variables, context, ...args)
    },
    onError: (error, variables, context, ...args) => {
      if (
        context &&
        typeof context === 'object' &&
        'previousPharmacy' in context &&
        context.previousPharmacy
      ) {
        queryClient.setQueryData(
          pharmacyKeys.detail(variables.cnpjNumber),
          context.previousPharmacy as Pharmacy
        )
      }

      toast.error(error.message || 'Erro ao atualizar farmácia')

      options?.onError?.(error, variables, context, ...args)
    },
    onSettled: (_, __, variables) => {
      void queryClient.invalidateQueries({
        queryKey: pharmacyKeys.detail(variables.cnpjNumber),
      })
    },
    ...options,
  })
}

/**
 * Hook to delete a pharmacy
 * @param options - Additional React Query mutation options
 */
export function useDeletePharmacy(
  options?: UseMutationOptions<void, ApiError, string>
) {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, string>({
    mutationFn: pharmacyService.delete,
    onMutate: async (cnpjNumber) => {
      await queryClient.cancelQueries({
        queryKey: pharmacyKeys.detail(cnpjNumber),
      })

      const previousPharmacy = queryClient.getQueryData<Pharmacy>(
        pharmacyKeys.detail(cnpjNumber)
      )

      queryClient.removeQueries({ queryKey: pharmacyKeys.detail(cnpjNumber) })

      return { previousPharmacy }
    },
    onSuccess: (data, cnpjNumber, context, ...args) => {
      void queryClient.invalidateQueries({ queryKey: pharmacyKeys.lists() })

      toast.success('Farmácia excluída com sucesso!')

      options?.onSuccess?.(data, cnpjNumber, context, ...args)
    },
    onError: (error, cnpjNumber, context, ...args) => {
      if (
        context &&
        typeof context === 'object' &&
        'previousPharmacy' in context &&
        context.previousPharmacy
      ) {
        queryClient.setQueryData(
          pharmacyKeys.detail(cnpjNumber),
          context.previousPharmacy as Pharmacy
        )
      }

      toast.error(error.message || 'Erro ao excluir farmácia')

      options?.onError?.(error, cnpjNumber, context, ...args)
    },
    ...options,
  })
}

/**
 * Hook to prefetch a pharmacy (useful for hover states, route transitions)
 * @param cnpjNumber - The CNPJ number of the pharmacy to prefetch
 */
export function usePrefetchPharmacy() {
  const queryClient = useQueryClient()

  return (cnpjNumber: string) => {
    void queryClient.prefetchQuery({
      queryKey: pharmacyKeys.detail(cnpjNumber),
      queryFn: () => pharmacyService.getById(cnpjNumber),
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  }
}

/**
 * Hook to invalidate all pharmacy queries
 * Useful for manual refresh or after external data changes
 */
export function useInvalidatePharmacies() {
  const queryClient = useQueryClient()

  return () => {
    void queryClient.invalidateQueries({ queryKey: pharmacyKeys.all })
  }
}
