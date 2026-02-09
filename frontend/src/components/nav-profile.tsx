import { useState, useEffect, useMemo } from 'react'
import { AlertCircle } from 'lucide-react'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from './ui/sidebar'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { ProfileSelectorSheet } from './profile-selector-sheet'
import { getRoleDisplayName } from '@/lib/utils/organization'
import type { OrganizationWithRole } from '@/types/user.types'
import {
  useActiveOrganization,
  useActiveMember,
  useSetActiveOrganization,
} from '@/hooks/use-organization'
import { useUserProfile } from '@/hooks/use-user'
import { useAuthContext } from '@/contexts/AuthContext'

export function NavProfile() {
  const { isAuthenticated } = useAuthContext()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile({
    enabled: isAuthenticated,
  })

  const organizations = useMemo(
    () => userProfile?.organizations ?? [],
    [userProfile?.organizations]
  )

  const { data: activeOrganization, isLoading: isLoadingActive } =
    useActiveOrganization({ enabled: isAuthenticated })

  const { data: activeMember, isLoading: isLoadingMember } = useActiveMember({
    enabled: isAuthenticated,
  })

  const { mutate: setActiveOrganization, isPending: isChanging } =
    useSetActiveOrganization()

  // Auto-open sheet if no active organization after data loads
  useEffect(() => {
    const hasLoaded = !isLoadingProfile && !isLoadingActive
    const hasOrganizations = organizations.length > 0
    const noActiveOrg = !activeOrganization

    if (isAuthenticated && hasLoaded && hasOrganizations && noActiveOrg) {
      setIsSheetOpen(true)
    }
  }, [
    isAuthenticated,
    isLoadingProfile,
    isLoadingActive,
    organizations,
    activeOrganization,
  ])

  const handleSelectOrganization = (organizationId: string) => {
    setActiveOrganization(organizationId, {
      onSuccess: () => {
        setIsSheetOpen(false)
      },
    })
  }

  const isLoading = isLoadingProfile || isLoadingActive || isLoadingMember

  // Get role from active organization in userProfile, fallback to activeMember
  const activeOrgWithRole = activeOrganization
    ? organizations.find(
        (org: OrganizationWithRole) => org.id === activeOrganization.id
      )
    : null
  const activeRole: string | undefined =
    activeOrgWithRole?.role ?? activeMember?.role
  const roleDisplayName = getRoleDisplayName(activeRole)

  return (
    <>
      <SidebarGroup data-qa="nav-profile-group">
        <SidebarGroupLabel className="p-0">Perfil Ativo</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem className="my-2" data-qa="nav-profile-info">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : activeOrganization ? (
                <>
                  <p
                    className="text-xs font-medium text-primary uppercase tracking-wide"
                    data-qa="nav-profile-role"
                  >
                    {roleDisplayName}
                  </p>
                  <p
                    className="text-sm text-foreground line-clamp-2"
                    data-qa="nav-profile-establishment"
                  >
                    {activeOrganization.name}
                  </p>
                </>
              ) : (
                <div className="flex items-start gap-2 text-amber-600">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p
                      className="text-sm font-medium"
                      data-qa="nav-profile-no-org"
                    >
                      Nenhum perfil selecionado
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Clique para selecionar
                    </p>
                  </div>
                </div>
              )}
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Button
                size="sm"
                className="w-full"
                variant="outline"
                onClick={() => setIsSheetOpen(true)}
                disabled={isLoading || isChanging}
                data-qa="nav-profile-change-button"
              >
                {activeOrganization ? 'Mudar Perfil' : 'Selecionar Perfil'}
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <ProfileSelectorSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        organizations={organizations}
        activeOrganization={activeOrganization ?? null}
        isLoading={isLoadingProfile}
        onSelectOrganization={handleSelectOrganization}
        isChanging={isChanging}
      />
    </>
  )
}
