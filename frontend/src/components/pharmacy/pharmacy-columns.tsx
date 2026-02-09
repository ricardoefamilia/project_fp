import type { ColumnDef, Column } from '@tanstack/react-table'
import {
  LucideEye,
  LucidePencil,
  LucideXCircle,
  MoreHorizontal,
} from 'lucide-react'
import type { Pharmacy } from '@/types/pharmacy.types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PharmacyColumnsProps {
  onEdit?: (pharmacy: Pharmacy) => void
  onDelete?: (pharmacy: Pharmacy) => void
  onDetails?: (pharmacy: Pharmacy) => void
}

// Extend the ColumnMeta type to include our custom filterComponent
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    filterComponent?: (props: {
      column: Column<TData, TValue>
    }) => React.ReactNode
  }
}

export const createPharmacyColumns = ({
  onEdit,
  onDelete,
  onDetails,
}: PharmacyColumnsProps = {}): ColumnDef<Pharmacy>[] => [
  {
    accessorKey: 'cnpjNumber',
    header: () => <div className="text-left">CNPJ</div>,
    cell: ({ row }) => {
      const cnpj = String(row.getValue('cnpjNumber'))
      return <div className="text-left">{cnpj}</div>
    },
    meta: {
      filterComponent: ({ column }) => (
        <Input
          id={`filter-${column.id}`}
          name={`filter-${column.id}`}
          aria-label="Filtrar por CNPJ"
          placeholder="Buscar CNPJ"
          value={(column.getFilterValue() as string) ?? ''}
          onChange={(event) => column.setFilterValue(event.target.value)}
          className="h-8 w-full"
        />
      ),
    },
  },
  {
    accessorKey: 'companyName',
    header: () => <div className="text-left">Razão Social</div>,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue('companyName')}</div>
    },
    meta: {
      filterComponent: ({ column }) => (
        <Input
          id={`filter-${column.id}`}
          name={`filter-${column.id}`}
          aria-label="Filtrar por Razão Social"
          placeholder="Buscar Razão Social"
          value={(column.getFilterValue() as string) ?? ''}
          onChange={(event) => column.setFilterValue(event.target.value)}
          className="h-8 w-full"
        />
      ),
    },
  },
  {
    accessorKey: 'operationalStatus',
    header: () => <div className="text-left">Status da farmácia</div>,
    cell: ({ row }) => {
      const status = String(row.getValue('operationalStatus'))
      const isActive = status === 'Ativo'
      return (
        <div className="flex items-center gap-2">
          <span className={isActive ? 'text-green-600' : 'text-red-600'}>
            {status}
          </span>
        </div>
      )
    },
    meta: {
      filterComponent: ({ column }) => {
        const currentValue = (column.getFilterValue() as string) ?? 'all'
        return (
          <Select
            value={currentValue}
            onValueChange={(value) =>
              column.setFilterValue(value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger
              id={`filter-${column.id}`}
              name={`filter-${column.id}`}
              aria-label="Filtrar por Status da farmácia"
              className="h-8 w-full"
            >
              <SelectValue placeholder="Filtrar Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        )
      },
    },
  },
  {
    accessorKey: 'blockStatus',
    header: () => <div className="text-left">Motivo do bloqueio</div>,
    cell: ({ row }) => {
      const blockStatus = row.getValue('blockStatus')
      return (
        <div className="text-left">
          {blockStatus && typeof blockStatus === 'string' ? blockStatus : '-'}
        </div>
      )
    },
    meta: {
      filterComponent: ({ column }) => (
        <Input
          id={`filter-${column.id}`}
          name={`filter-${column.id}`}
          aria-label="Filtrar por Motivo do bloqueio"
          placeholder="Buscar Motivo"
          value={(column.getFilterValue() as string) ?? ''}
          onChange={(event) => column.setFilterValue(event.target.value)}
          className="h-8 w-full"
        />
      ),
    },
  },
  {
    accessorKey: 'ufCrf',
    header: () => <div className="text-left">UF</div>,
    cell: ({ row }) => {
      const uf = row.getValue('ufCrf')
      return (
        <div className="text-left">
          {uf && typeof uf === 'string' ? uf : '-'}
        </div>
      )
    },
    meta: {
      filterComponent: ({ column }) => {
        const currentValue = (column.getFilterValue() as string) ?? 'all'
        return (
          <Select
            value={currentValue}
            onValueChange={(value) =>
              column.setFilterValue(value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger
              id={`filter-${column.id}`}
              name={`filter-${column.id}`}
              aria-label="Filtrar por UF"
              className="h-8 w-full"
            >
              <SelectValue placeholder="Filtrar UF" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="AC">AC</SelectItem>
              <SelectItem value="AL">AL</SelectItem>
              <SelectItem value="AP">AP</SelectItem>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="BA">BA</SelectItem>
              <SelectItem value="CE">CE</SelectItem>
              <SelectItem value="DF">DF</SelectItem>
              <SelectItem value="ES">ES</SelectItem>
              <SelectItem value="GO">GO</SelectItem>
              <SelectItem value="MA">MA</SelectItem>
              <SelectItem value="MT">MT</SelectItem>
              <SelectItem value="MS">MS</SelectItem>
              <SelectItem value="MG">MG</SelectItem>
              <SelectItem value="PA">PA</SelectItem>
              <SelectItem value="PB">PB</SelectItem>
              <SelectItem value="PR">PR</SelectItem>
              <SelectItem value="PE">PE</SelectItem>
              <SelectItem value="PI">PI</SelectItem>
              <SelectItem value="RJ">RJ</SelectItem>
              <SelectItem value="RN">RN</SelectItem>
              <SelectItem value="RS">RS</SelectItem>
              <SelectItem value="RO">RO</SelectItem>
              <SelectItem value="RR">RR</SelectItem>
              <SelectItem value="SC">SC</SelectItem>
              <SelectItem value="SP">SP</SelectItem>
              <SelectItem value="SE">SE</SelectItem>
              <SelectItem value="TO">TO</SelectItem>
            </SelectContent>
          </Select>
        )
      },
    },
  },
  {
    accessorKey: 'cityCodeIbge',
    header: () => <div className="text-left">Município</div>,
    cell: ({ row }) => {
      const city = row.getValue('cityCodeIbge')
      return (
        <div className="text-left">
          {city && typeof city === 'string' ? city : '-'}
        </div>
      )
    },
    meta: {
      filterComponent: ({ column }) => (
        <Input
          id={`filter-${column.id}`}
          name={`filter-${column.id}`}
          aria-label="Filtrar por Município"
          placeholder="Buscar Município"
          value={(column.getFilterValue() as string) ?? ''}
          onChange={(event) => column.setFilterValue(event.target.value)}
          className="h-8 w-full"
        />
      ),
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-left">Ação</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const pharmacy = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(pharmacy)}>
                <button className="w-full flex items-center justify-start cursor-pointer text-blue-700 dark:text-blue-600 focus:text-blue-700 dark:focus:text-blue-600">
                  <LucidePencil className="mr-2 h-4 w-4 text-blue-700 dark:text-blue-600 focus:text-blue-700 dark:focus:text-blue-600" />
                  <span>Editar</span>
                </button>
              </DropdownMenuItem>
            )}
            {onDetails && (
              <DropdownMenuItem onClick={() => onDetails(pharmacy)}>
                <button className="w-full flex items-center justify-start cursor-pointer text-blue-700 dark:text-blue-600 focus:text-blue-700 dark:focus:text-blue-600">
                  <LucideEye className="mr-2 h-4 w-4 text-blue-700 dark:text-blue-600 focus:text-blue-700 dark:focus:text-blue-600" />
                  <span>Detalhes</span>
                </button>
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(pharmacy)}>
                <button className="w-full flex items-center justify-start cursor-pointer text-rose-600 dark:text-rose-500 focus:text-rose-600 dark:focus:text-rose-500">
                  <LucideXCircle className="mr-2 h-4 w-4 text-rose-600 dark:text-rose-500 focus:text-rose-600 dark:focus:text-rose-500" />
                  <span>Desativar</span>
                </button>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
