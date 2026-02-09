import { useState, useMemo, useEffect } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type Column,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight } from 'lucide-react'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    filterComponent?: (props: {
      column: Column<TData, TValue>
    }) => React.ReactNode
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filters?: React.ReactNode
  onFiltersChange?: (filters: ColumnFiltersState) => void
  isLoading?: boolean
  pageCount?: number
  pageIndex?: number
  pageSize?: number
  totalItems?: number
  onPaginationChange?: (pageIndex: number, pageSize: number) => void
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void
  manualPagination?: boolean
  manualFiltering?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filters,
  onFiltersChange,
  isLoading = false,
  pageCount,
  pageIndex: externalPageIndex,
  pageSize: externalPageSize,
  totalItems,
  onPaginationChange,
  onColumnFiltersChange,
  manualPagination = false,
  manualFiltering = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [internalPagination, setInternalPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Use external pagination if provided, otherwise use internal
  const pagination = useMemo(() => {
    if (externalPageIndex !== undefined && externalPageSize !== undefined) {
      return {
        pageIndex: externalPageIndex,
        pageSize: externalPageSize,
      }
    }
    return internalPagination
  }, [externalPageIndex, externalPageSize, internalPagination])

  // Notify parent when filters change (for server-side filtering)
  useEffect(() => {
    if (onColumnFiltersChange && manualFiltering) {
      onColumnFiltersChange(columnFilters)
    }
  }, [columnFilters, onColumnFiltersChange, manualFiltering])

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: (updater) => {
      const newFilters =
        typeof updater === 'function' ? updater(columnFilters) : updater

      const cleanedFilters = newFilters.filter((filter) => {
        if (typeof filter.value === 'string' && filter.value.trim() === '') {
          return false
        }
        return (
          filter.value !== undefined &&
          filter.value !== null &&
          filter.value !== ''
        )
      })

      setColumnFilters(cleanedFilters)
      if (onFiltersChange && !manualFiltering) {
        onFiltersChange(cleanedFilters)
      }
    },
    onPaginationChange: (updater) => {
      if (manualPagination && onPaginationChange) {
        const newPagination =
          typeof updater === 'function' ? updater(pagination) : updater
        onPaginationChange(newPagination.pageIndex, newPagination.pageSize)
      } else {
        setInternalPagination(
          typeof updater === 'function' ? updater(pagination) : updater
        )
      }
    },
    manualPagination,
    manualFiltering,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  })

  // Calculate display values for pagination
  const displayStartItem = useMemo(() => {
    if (manualPagination && totalItems !== undefined) {
      return pagination.pageIndex * pagination.pageSize + 1
    }
    return pagination.pageIndex * pagination.pageSize + 1
  }, [manualPagination, totalItems, pagination])

  const displayEndItem = useMemo(() => {
    if (manualPagination && totalItems !== undefined) {
      return Math.min(
        (pagination.pageIndex + 1) * pagination.pageSize,
        totalItems
      )
    }
    return Math.min(
      (pagination.pageIndex + 1) * pagination.pageSize,
      table.getFilteredRowModel().rows.length
    )
  }, [manualPagination, totalItems, pagination, table])

  const displayTotalItems = useMemo(() => {
    if (manualPagination && totalItems !== undefined) {
      return totalItems
    }
    return table.getFilteredRowModel().rows.length
  }, [manualPagination, totalItems, table])

  const displayPageCount = useMemo(() => {
    if (manualPagination && pageCount !== undefined) {
      return pageCount
    }
    return table.getPageCount()
  }, [manualPagination, pageCount, table])

  // Check if filters are provided via column meta or as a prop
  const hasColumnMetaFilters = table
    .getHeaderGroups()[0]
    ?.headers.some((header) => header.column.columnDef.meta?.filterComponent)

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
              {/* Filters Row - support both column meta filters and prop filters */}
              {hasColumnMetaFilters ? (
                <TableRow className="hover:bg-transparent">
                  {table.getHeaderGroups()[0]?.headers.map((header) => (
                    <TableHead
                      key={`filter-${header.id}`}
                      className="h-12"
                    >
                      {header.column.columnDef.meta?.filterComponent
                        ? header.column.columnDef.meta.filterComponent({
                            column: header.column,
                          })
                        : null}
                    </TableHead>
                  ))}
                </TableRow>
              ) : (
                filters
              )}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination controls - Bottom (matches prototype) */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 sm:gap-6 px-2 sm:px-4 py-2">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="pagination-page-size"
            className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap"
          >
            Exibir
          </label>
          <Select
            value={String(pagination.pageSize)}
            onValueChange={(value) => {
              const newPageSize = Number(value)
              if (manualPagination && onPaginationChange) {
                onPaginationChange(0, newPageSize) // Reset to first page when changing page size
              } else {
                table.setPageSize(newPageSize)
              }
            }}
          >
            <SelectTrigger
              id="pagination-page-size"
              name="pagination-page-size"
              aria-label="Itens por página"
              className="w-[70px] h-8"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Items range info */}
        <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
          {displayTotalItems > 0 ? (
            <>
              {displayStartItem}-{displayEndItem} de {displayTotalItems} itens
            </>
          ) : (
            '0 itens'
          )}
        </div>

        {/* Page selector and Navigation buttons */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="pagination-page-number"
            className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap"
          >
            Página
          </label>
          <Select
            value={String(pagination.pageIndex + 1)}
            onValueChange={(value) => {
              const newPageIndex = Number(value) - 1
              if (manualPagination && onPaginationChange) {
                onPaginationChange(newPageIndex, pagination.pageSize)
              } else {
                table.setPageIndex(newPageIndex)
              }
            }}
          >
            <SelectTrigger
              id="pagination-page-number"
              name="pagination-page-number"
              aria-label="Número da página"
              className="w-[70px] h-8"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: displayPageCount }, (_, i) => i + 1).map(
                (page) => (
                  <SelectItem key={page} value={String(page)}>
                    {page}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          {/* Navigation buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                if (manualPagination && onPaginationChange) {
                  onPaginationChange(
                    Math.max(0, pagination.pageIndex - 1),
                    pagination.pageSize
                  )
                } else {
                  table.previousPage()
                }
              }}
              disabled={
                manualPagination
                  ? pagination.pageIndex === 0
                  : !table.getCanPreviousPage()
              }
            >
              {manualPagination ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <span className="text-lg">‹</span>
              )}
              <span className="sr-only">Página anterior</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                if (manualPagination && onPaginationChange) {
                  onPaginationChange(
                    pagination.pageIndex + 1,
                    pagination.pageSize
                  )
                } else {
                  table.nextPage()
                }
              }}
              disabled={
                manualPagination
                  ? pagination.pageIndex >= displayPageCount - 1
                  : !table.getCanNextPage()
              }
            >
              {manualPagination ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <span className="text-lg">›</span>
              )}
              <span className="sr-only">Próxima página</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
