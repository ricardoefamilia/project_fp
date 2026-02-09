import { useState, useMemo, useEffect } from 'react'
import { LogIn, Search, Building2, Loader2 } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { getRoleDisplayName } from '@/lib/utils/organization'
import type { Organization } from '@/types/organization.types'
import type { OrganizationWithRole } from '@/types/user.types'

interface ProfileSelectorSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizations: OrganizationWithRole[] // Organizations from /users/me endpoint with roles
  activeOrganization: Organization | null
  isLoading: boolean
  onSelectOrganization: (organizationId: string) => void
  isChanging: boolean
}

export function ProfileSelectorSheet({
  open,
  onOpenChange,
  organizations,
  activeOrganization,
  isLoading,
  onSelectOrganization,
  isChanging,
}: ProfileSelectorSheetProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Reset selection when sheet opens/closes
  useEffect(() => {
    if (open) {
      setSelectedId(activeOrganization?.id ?? null)
      setSearchQuery('')
    }
  }, [open, activeOrganization?.id])

  const filteredOrganizations = useMemo(() => {
    if (!searchQuery.trim()) return organizations

    const query = searchQuery.toLowerCase().trim()
    return organizations.filter((org) => {
      const orgName = org.name.toLowerCase()
      const roleName = getRoleDisplayName(org.role).toLowerCase()
      return orgName.includes(query) || roleName.includes(query)
    })
  }, [organizations, searchQuery])

  const handleConfirmSelection = () => {
    if (selectedId && selectedId !== activeOrganization?.id) {
      onSelectOrganization(selectedId)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isChanging) {
      onOpenChange(newOpen)
    }
  }

  const canSelect =
    selectedId && selectedId !== activeOrganization?.id && !isChanging

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        showCloseButton={false}
        side="right"
        className="w-full sm:max-w-lg flex flex-col p-0"
        data-qa="profile-selector-sheet"
      >
        {/* Header */}
        <SheetHeader className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-semibold text-gray-700">
            <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            Seleção de perfil
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 flex flex-col min-h-0 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          {/* Section Label & Search */}
          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              Meus perfis
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="profile-search"
                name="profile-search"
                placeholder="Busque um perfil"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Buscar perfil"
                data-qa="profile-search-input"
              />
            </div>
          </div>

          {/* Organization List */}
          <ScrollArea className="flex-1 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
            {isLoading ? (
              <div className="space-y-2" data-qa="profile-list-loading">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-3 rounded-lg border border-border">
                    <Skeleton className="h-3 w-16 mb-1.5" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            ) : filteredOrganizations.length === 0 ? (
              organizations.length > 0 && searchQuery ? (
                <div
                  className="py-8 text-center text-muted-foreground"
                  data-qa="profile-list-no-results"
                >
                  <Search className="mx-auto h-10 w-10 opacity-30 mb-3" />
                  <p className="font-medium">Nenhum perfil encontrado</p>
                  <p className="text-sm">
                    Nenhum resultado para "{searchQuery}". Tente buscar por
                    outro termo.
                  </p>
                </div>
              ) : (
                <div
                  className="py-8 text-center text-muted-foreground"
                  data-qa="profile-list-empty"
                >
                  <Building2 className="mx-auto h-10 w-10 opacity-30 mb-3" />
                  <p className="font-medium">Nenhum perfil disponível</p>
                  <p className="text-sm">
                    Você não faz parte de nenhuma organização.
                  </p>
                </div>
              )
            ) : (
              <div
                className="space-y-2 pb-4"
                role="listbox"
                aria-label="Lista de perfis"
                data-qa="profile-list"
              >
                {filteredOrganizations.map((org) => {
                  const isActive = activeOrganization?.id === org.id
                  const isSelected = selectedId === org.id
                  // Each organization now has a role from the /users/me endpoint
                  const roleDisplay = getRoleDisplayName(org.role)

                  return (
                    <button
                      key={org.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => setSelectedId(org.id)}
                      disabled={isChanging}
                      className={cn(
                        'w-full flex flex-col gap-0.5 p-3 rounded-lg border text-left transition-colors',
                        'hover:bg-accent/50',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        'disabled:pointer-events-none disabled:opacity-50',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-accent-foreground/20'
                      )}
                      data-qa={`profile-item-${org.id}`}
                    >
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">
                        {roleDisplay}
                        {isActive && (
                          <span className="ml-2 text-muted-foreground normal-case">
                            (atual)
                          </span>
                        )}
                      </span>
                      <span className="text-sm text-foreground">
                        {org.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Footer */}
        <SheetFooter className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            className="w-full sm:flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isChanging}
            data-qa="profile-close-button"
          >
            Fechar
          </Button>
          <Button
            variant="default"
            className="w-full sm:flex-1"
            onClick={handleConfirmSelection}
            disabled={!canSelect}
            data-qa="profile-select-button"
          >
            {isChanging ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ativando...
              </>
            ) : (
              'Selecionar'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
