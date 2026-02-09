import { useState, useMemo, useCallback } from 'react'
import { Plus } from 'lucide-react'
import type { ColumnFiltersState } from '@tanstack/react-table'
import { usePharmacies } from '@/hooks/use-pharmacies'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PageBreadcrumb } from '@/components/access'
import { DataTable } from '@/components/shared/data-table'
import { createPharmacyColumns } from '@/components/pharmacy/pharmacy-columns'
import { PharmacyFormDrawer } from '@/components/pharmacy/pharmacy-form-sheet'
import { PharmacyEditFormSheet } from '@/components/pharmacy/pharmacy-edit-form-sheet'
import { PharmacyDetailsSheet } from '@/components/pharmacy/pharmacy-details-sheet'
import type {
  Pharmacy,
  PharmacyQueryParams,
  PharmacyListResponse,
} from '@/types/pharmacy.types'
import type { PharmacyWithDetails } from '@/mocks/pharmacy.mock'

function isPaginatedResponse(data: unknown): data is PharmacyListResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    Array.isArray((data as PharmacyListResponse).data)
  )
}

export default function EstabelecimentosPage() {
  // Drawer states
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false)
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(
    null
  )
  const [detailsPharmacy, setDetailsPharmacy] =
    useState<PharmacyWithDetails | null>(null)

  // Server-side state management
  const [queryParams, setQueryParams] = useState<PharmacyQueryParams>({
    page: 1,
    pageSize: 10,
  })

  // Fetch pharmacies with server-side params
  const { data: response, isLoading, error } = usePharmacies(queryParams)

  // Handle both legacy array and new paginated response format
  const pharmacies: Pharmacy[] = useMemo(() => {
    if (!response) return []

    if (Array.isArray(response)) return response as Pharmacy[]

    if (isPaginatedResponse(response)) return response.data
    return []
  }, [response])

  const paginationMeta = useMemo(() => {
    if (response && isPaginatedResponse(response)) {
      return response.meta
    }
    return undefined
  }, [response])

  const totalItems = paginationMeta?.totalItems ?? pharmacies.length

  const pageCount =
    paginationMeta?.totalPages ??
    Math.ceil(totalItems / (queryParams.pageSize ?? 10))

  const handlePaginationChange = useCallback(
    (pageIndex: number, pageSize: number) => {
      setQueryParams((prev) => ({
        ...prev,
        page: pageIndex + 1,
        pageSize,
      }))
    },
    []
  )

  // Handle filter changes
  const handleColumnFiltersChange = useCallback(
    (filters: ColumnFiltersState) => {
      const searchFilters: Record<string, string> = {}

      filters.forEach((filter) => {
        if (
          filter.value &&
          typeof filter.value === 'string' &&
          filter.value.trim() !== ''
        ) {
          searchFilters[filter.id] = filter.value
        }
      })

      const allFilterKeys = [
        'cnpjNumber',
        'companyName',
        'operationalStatus',
        'blockStatus',
        'ufCrf',
        'cityCodeIbge',
      ]

      setQueryParams((prev) => {
        const newParams: PharmacyQueryParams = {
          page: 1,
          pageSize: prev.pageSize ?? 10,
        }

        allFilterKeys.forEach((key) => {
          if (searchFilters[key]) {
            newParams[key] = searchFilters[key]
          }
        })

        return newParams
      })
    },
    []
  )

  // Handlers for table actions
  const handleEdit = useCallback((pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy)
    setIsEditDrawerOpen(true)
  }, [])

  const handleDelete = useCallback((pharmacy: Pharmacy) => {
    // TODO: Implement delete functionality
    console.log('Delete pharmacy:', pharmacy)
  }, [])

  const handleDetails = useCallback((pharmacy: Pharmacy) => {
    setDetailsPharmacy(pharmacy as PharmacyWithDetails)
    setIsDetailsDrawerOpen(true)
  }, [])

  const handleAddNew = useCallback(() => {
    setIsCreateDrawerOpen(true)
  }, [])

  const handleEditDrawerClose = useCallback((open: boolean) => {
    setIsEditDrawerOpen(open)
    if (!open) {
      setSelectedPharmacy(null)
    }
  }, [])

  const handleDetailsDrawerClose = useCallback((open: boolean) => {
    setIsDetailsDrawerOpen(open)
    if (!open) {
      setDetailsPharmacy(null)
    }
  }, [])

  // Create columns with action handlers
  const columns = useMemo(
    () =>
      createPharmacyColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onDetails: handleDetails,
      }),
    [handleEdit, handleDelete, handleDetails]
  )

  return (
    <div
      className="flex h-full w-full flex-col"
      data-qa="estabelecimentos-page"
    >
      {/* Main content */}
      <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Breadcrumb Navigation */}
        <PageBreadcrumb
          backLink="/dashboard"
          parentLabel="Cadastro"
          currentLabel="Estabelecimento"
        />

        {/* Single Card with Header and Table */}
        <Card data-qa="estabelecimentos-card">
          <CardHeader className="p-4 sm:p-6">
            <h1
              className="text-xl sm:text-2xl font-semibold"
              data-qa="page-title"
            >
              Lista de Estabelecimentos
            </h1>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6">
            {/* Action Button Section */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4 sm:gap-6 mb-4 sm:mb-6">
              <Button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto flex-shrink-0"
                data-qa="new-pharmacy-button"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Novo registro</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            </div>

            {/* Separator */}
            <Separator className="my-4 sm:my-6" />

            {/* Table Section */}
            {error ? (
              <div className="flex items-center justify-center h-[300px] sm:h-[400px] rounded-md border p-4">
                <div className="text-center space-y-2 max-w-md">
                  <p className="text-base sm:text-lg font-semibold text-destructive">
                    Erro ao carregar estabelecimentos
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {error.message || 'Ocorreu um erro ao buscar os dados.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <div className="min-w-full inline-block align-middle">
                  <DataTable
                    columns={columns}
                    data={pharmacies}
                    isLoading={isLoading}
                    pageCount={pageCount}
                    pageIndex={(queryParams.page ?? 1) - 1} // Convert to 0-based for table
                    pageSize={queryParams.pageSize ?? 10}
                    totalItems={totalItems}
                    onPaginationChange={handlePaginationChange}
                    onColumnFiltersChange={handleColumnFiltersChange}
                    manualPagination={true}
                    manualFiltering={true}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Pharmacy Create Form Drawer */}
      <PharmacyFormDrawer
        open={isCreateDrawerOpen}
        onOpenChange={setIsCreateDrawerOpen}
      />

      {/* Pharmacy Edit Form Drawer */}
      <PharmacyEditFormSheet
        open={isEditDrawerOpen}
        onOpenChange={handleEditDrawerClose}
        pharmacy={selectedPharmacy}
      />

      {/* Pharmacy Details Sheet */}
      <PharmacyDetailsSheet
        open={isDetailsDrawerOpen}
        onOpenChange={handleDetailsDrawerClose}
        pharmacy={detailsPharmacy}
      />
    </div>
  )
}
