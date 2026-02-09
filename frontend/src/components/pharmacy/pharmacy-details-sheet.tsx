import { LogIn, Printer } from 'lucide-react'

import { cn } from '@/lib/utils'
import { formatCNPJ, formatCEP } from '@/lib/utils/brazilian-documents'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PharmacyWithDetails, MockPharmacist } from '@/mocks/pharmacy.mock'

interface PharmacyDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pharmacy: PharmacyWithDetails | null
  isLoading?: boolean
}

/**
 * Get establishment type label
 */
function getEstablishmentTypeLabel(type?: string): string {
  const types: Record<string, string> = {
    FARMACIA_DISPENSARIO: 'Farmácia/Dispensário',
    UNIDADE_SAUDE: 'Unidade de Saúde',
    HOSPITAL: 'Hospital',
    CLINICA: 'Clínica',
  }
  return types[type ?? ''] ?? type ?? '-'
}

/**
 * Get status badge class
 */
function getStatusBadgeClass(status: string): string {
  const normalizedStatus = status.toUpperCase()
  if (normalizedStatus === 'ATIVO') {
    return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
  }
  if (normalizedStatus === 'BLOQUEADO') {
    return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30'
  }
  return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30'
}

/**
 * Field skeleton for loading states
 */
function FieldSkeleton() {
  return <Skeleton className="h-4 w-32" />
}

/**
 * Info row component for consistent styling
 */
function InfoRow({
  label,
  value,
  isLoading,
  className,
}: {
  label: string
  value?: string | React.ReactNode
  isLoading?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className="text-xs font-medium text-primary">{label}</span>
      {isLoading ? (
        <FieldSkeleton />
      ) : (
        <span className="text-sm text-foreground">{value ?? '-'}</span>
      )}
    </div>
  )
}

/**
 * Pharmacist responsible label
 */
function ResponsibleLabel({ isResponsible }: { isResponsible: boolean }) {
  if (!isResponsible) return null
  return (
    <span className="text-xs text-blue-600 font-medium">
      Chefe de Fulano de tal
    </span>
  )
}

export function PharmacyDetailsSheet({
  open,
  onOpenChange,
  pharmacy,
  isLoading = false,
}: PharmacyDetailsSheetProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        side="right"
        className="w-full sm:max-w-2xl p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-semibold text-gray-700">
            <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            Detalhes do estabelecimento
          </SheetTitle>
        </SheetHeader>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            {/* Main Card */}
            <div className="border rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4 bg-card">
              {/* Logo */}
              <div className="flex justify-center py-2">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md flex items-center gap-1">
                    <span className="text-base sm:text-lg font-bold">e</span>
                    <span className="text-base sm:text-lg font-bold">SUS</span>
                    <span className="text-[8px] sm:text-[10px] leading-tight ml-1">
                      AF
                    </span>
                  </div>
                  <div className="text-[8px] sm:text-[10px] leading-tight text-primary font-medium">
                    <div>ASSISTÊNCIA</div>
                    <div>FARMACÊUTICA</div>
                  </div>
                </div>
              </div>

              {/* Establishment header */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 border-t pt-3 sm:pt-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-primary">
                    Estabelecimento
                  </span>
                  {isLoading ? (
                    <FieldSkeleton />
                  ) : (
                    <p className="text-sm text-foreground">
                      {formatCNPJ(pharmacy?.cnpjNumber ?? '')}
                      {pharmacy?.fantasyName && `/${pharmacy.fantasyName}`}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-primary">
                    Situação do estabelecimento
                  </span>
                  {isLoading ? (
                    <FieldSkeleton />
                  ) : (
                    <span
                      className={cn(
                        'inline-block text-sm px-2 py-0.5 rounded-md font-medium',
                        getStatusBadgeClass(pharmacy?.operationalStatus ?? '')
                      )}
                    >
                      {pharmacy?.operationalStatus ?? '-'}
                    </span>
                  )}
                </div>
              </div>

              {/* Last modified info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 border-t pt-3 sm:pt-4">
                <InfoRow
                  label="Nome e CPF do último alterador"
                  value={
                    pharmacy?.lastModifiedBy && pharmacy?.lastModifiedByCpf
                      ? `${pharmacy.lastModifiedBy} / ${pharmacy.lastModifiedByCpf}`
                      : '-'
                  }
                  isLoading={isLoading}
                />
                <InfoRow
                  label="Alterado pela última vez em"
                  value={pharmacy?.lastModifiedAt}
                  isLoading={isLoading}
                />
              </div>

              {/* Details grid */}
              <div className="border-t pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                {/* Row 1: CNES, CNPJ, Razão social, Esfera */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <InfoRow
                    label="CNES"
                    value={pharmacy?.cnes}
                    isLoading={isLoading}
                  />
                  <InfoRow
                    label="CNPJ"
                    value={formatCNPJ(pharmacy?.cnpjNumber ?? '')}
                    isLoading={isLoading}
                  />
                  <InfoRow
                    label="Razão social"
                    value={pharmacy?.companyName}
                    isLoading={isLoading}
                  />
                  <InfoRow
                    label="Esfera"
                    value={pharmacy?.sphereDescription}
                    isLoading={isLoading}
                  />
                </div>

                {/* Row 2: Nome fantasia, Tipo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <InfoRow
                    label="Nome fantasia"
                    value={pharmacy?.fantasyName}
                    isLoading={isLoading}
                  />
                  <InfoRow
                    label="Tipo de estabelecimento"
                    value={getEstablishmentTypeLabel(pharmacy?.companyType)}
                    isLoading={isLoading}
                  />
                </div>

                {/* Row 3: CEP, Logradouro, Complemento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <InfoRow
                    label="CEP"
                    value={formatCEP(pharmacy?.zipCode ?? '')}
                    isLoading={isLoading}
                  />
                  <InfoRow
                    label="Logradouro"
                    value={pharmacy?.address}
                    isLoading={isLoading}
                  />
                  <InfoRow
                    label="Complemento"
                    value={pharmacy?.addressComplement}
                    isLoading={isLoading}
                  />
                </div>

                {/* Row 4: Bairro, Cidade, Estado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <InfoRow
                    label="Bairro"
                    value={pharmacy?.district}
                    isLoading={isLoading}
                  />
                  <InfoRow
                    label="Cidade"
                    value={pharmacy?.city}
                    isLoading={isLoading}
                  />
                  <InfoRow
                    label="Estado"
                    value={pharmacy?.state}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Pharmacists Section */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <h3 className="text-sm sm:text-base font-semibold text-foreground">
                  Dados dos farmaceuticos
                </h3>
                <span className="text-xs sm:text-sm text-primary font-medium">
                  {pharmacy?.pharmacists?.length ?? 0} Farmaceuticos cadastrados
                </span>
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted">
                        <TableHead className="text-xs font-medium text-primary">
                          Nome
                        </TableHead>
                        <TableHead className="text-xs font-medium text-primary">
                          CPF
                        </TableHead>
                        <TableHead className="text-xs font-medium text-primary">
                          UF/CRF
                        </TableHead>
                        <TableHead className="text-xs font-medium text-primary">
                          Responsável
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pharmacy?.pharmacists?.map(
                        (pharmacist: MockPharmacist, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="text-sm">
                              {pharmacist.name}
                            </TableCell>
                            <TableCell className="text-sm">
                              {pharmacist.cpf}
                            </TableCell>
                            <TableCell className="text-sm">
                              {pharmacist.ufCrf}
                            </TableCell>
                            <TableCell>
                              <ResponsibleLabel
                                isResponsible={pharmacist.isResponsible}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      )}
                      {(!pharmacy?.pharmacists ||
                        pharmacy.pharmacists.length === 0) && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-sm text-muted-foreground py-4"
                          >
                            Nenhum farmacêutico cadastrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Departments Section */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-sm sm:text-base font-semibold text-foreground">
                Departamento (s)
              </h3>
              {isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <div className="border rounded-lg p-4 min-h-[60px]">
                  {pharmacy?.departments && pharmacy.departments.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {pharmacy.departments.map((dept, index) => (
                        <span
                          key={index}
                          className="text-sm bg-secondary px-3 py-1 rounded-full"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhum departamento cadastrado
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Map Section */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-sm sm:text-base font-semibold text-foreground">
                Mapa de endereçamento físico do armazenamento
              </h3>
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <div className="border rounded-lg p-4 min-h-[120px] bg-muted flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Mapa não disponível
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full sm:flex-1"
          >
            Fechar
          </Button>
          <Button
            onClick={handlePrint}
            className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
