import { LogIn } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { getRoleDisplayName } from '@/lib/utils/organization'

interface ProfileViewSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: {
    id: string
    cpf: string
    instancia: string
    nomeCompleto: string
    perfil: string
    createdAt?: Date | string
    member: {
      id: string
      organizationId: string
      userId: string
      role: string
      createdAt: Date | string
      user: {
        id: string
        name: string
        email: string
        cpf?: string
        image?: string | null
      }
      organization?: {
        id: string
        name: string
        slug: string
        logo?: string | null
        createdAt: Date
        metadata?: Record<string, unknown> | null
      }
    }
  } | null
  isActive?: boolean
}

export function ProfileViewSheet({
  open,
  onOpenChange,
  profile,
  isActive = false,
}: ProfileViewSheetProps) {
  if (!profile?.member) return null

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, 'dd/MM/yyyy', { locale: ptBR })
  }

  // Determine status - "Solicitado" for requested, "Ativo" for active
  const status = isActive ? 'Ativo' : 'Solicitado'

  // Use createdAt for both "Solicitado em" and "Atualizado em" if updatedAt is not available
  const requestedDate = profile.createdAt ?? profile.member.createdAt
  const updatedDate = profile.createdAt ?? profile.member.createdAt

  // Instância should be the organization name
  const instancia = profile.member.organization?.name ?? '-'

  // Get role display name
  const memberRole: string | undefined = profile.member.role
  const roleDisplayName = getRoleDisplayName(memberRole)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="w-full sm:max-w-[465px] p-0 flex flex-col"
      >
        <SheetHeader className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b mb-0">
          <SheetTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-semibold text-gray-700">
            <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            Informações sobre solicitação
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {/* Two-column grid for first four items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Status */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm sm:text-base font-bold text-blue-900">
                Status
              </Label>
              <p className="text-sm sm:text-base text-gray-600">{status}</p>
            </div>

            {/* Instância */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm sm:text-base font-bold text-blue-900">
                Instância
              </Label>
              <p className="text-sm sm:text-base text-gray-600">{instancia}</p>
            </div>

            {/* Solicitado em */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm sm:text-base font-bold text-blue-900">
                Solicitado em
              </Label>
              <p className="text-sm sm:text-base text-gray-600">
                {formatDate(requestedDate)}
              </p>
            </div>

            {/* Atualizado em */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm sm:text-base font-bold text-blue-900">
                Atualizado em
              </Label>
              <p className="text-sm sm:text-base text-gray-600">
                {formatDate(updatedDate)}
              </p>
            </div>
          </div>

          {/* Single-column section for Informações sobre a solicitação */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-sm sm:text-base font-bold text-blue-900">
              Informações sobre a solicitação
            </Label>
            <p className="text-sm sm:text-base text-gray-600">
              {roleDisplayName}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
