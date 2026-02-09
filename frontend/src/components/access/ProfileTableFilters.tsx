import { Input } from '@/components/ui/input'
import { TableRow, TableCell } from '@/components/ui/table'

interface ProfileTableFiltersProps {
  cpfFilter: string
  instanciaFilter: string
  nomeCompletoFilter: string
  perfilFilter: string
  onCpfChange: (value: string) => void
  onInstanciaChange: (value: string) => void
  onNomeCompletoChange: (value: string) => void
  onPerfilChange: (value: string) => void
}

export function ProfileTableFilters({
  cpfFilter,
  instanciaFilter,
  nomeCompletoFilter,
  perfilFilter,
  onCpfChange,
  onInstanciaChange,
  onNomeCompletoChange,
  onPerfilChange,
}: ProfileTableFiltersProps) {
  return (
    <TableRow>
      {/* CPF Filter */}
      <TableCell className="p-2 sm:p-3">
        <Input
          id="filter-cpf"
          name="filter-cpf"
          aria-label="Filtrar por CPF"
          placeholder="Buscar permissões"
          value={cpfFilter}
          onChange={(e) => onCpfChange(e.target.value)}
          className="h-8 sm:h-9 text-xs sm:text-sm"
        />
      </TableCell>

      {/* Instancia Filter */}
      <TableCell className="p-2 sm:p-3">
        <Input
          id="filter-instancia"
          name="filter-instancia"
          aria-label="Filtrar por Instância"
          placeholder="Buscar Instancia"
          value={instanciaFilter}
          onChange={(e) => onInstanciaChange(e.target.value)}
          className="h-8 sm:h-9 text-xs sm:text-sm"
        />
      </TableCell>

      {/* Nome Completo Filter */}
      <TableCell className="p-2 sm:p-3">
        <Input
          id="filter-nome-completo"
          name="filter-nome-completo"
          aria-label="Filtrar por Nome completo"
          placeholder="Buscar Nome completo"
          value={nomeCompletoFilter}
          onChange={(e) => onNomeCompletoChange(e.target.value)}
          className="h-8 sm:h-9 text-xs sm:text-sm"
        />
      </TableCell>

      {/* Perfil Filter */}
      <TableCell className="p-2 sm:p-3">
        <Input
          id="filter-perfil"
          name="filter-perfil"
          aria-label="Filtrar por Perfil"
          placeholder="Buscar Perfil"
          value={perfilFilter}
          onChange={(e) => onPerfilChange(e.target.value)}
          className="h-8 sm:h-9 text-xs sm:text-sm"
        />
      </TableCell>

      {/* Empty cell for Ação column */}
      <TableCell className="p-2 sm:p-3">{/* Empty */}</TableCell>
    </TableRow>
  )
}
