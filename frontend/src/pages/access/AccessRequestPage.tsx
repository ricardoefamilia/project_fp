import { useMemo, useCallback, useState } from 'react'
import {
  useListOrganizationMembers,
  useActiveOrganization,
  useSetActiveOrganization,
} from '@/hooks/use-organization'
import type { ColumnDef } from '@tanstack/react-table'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/shared/data-table'
import {
  PageBreadcrumb,
  UserInfoCard,
  ProfileActionsMenu,
  ProfileTableFilters,
  AccessEmptyState,
  AccessLoadingState,
  ProfileViewSheet,
  ProfileRegistrationSheet,
} from '@/components/access'
import type { OrganizationMemberWithUser } from '@/services/organization.service'
import { getRoleDisplayName } from '@/lib/utils/organization'

interface OrganizationMetadata {
  cnpj?: string
  name?: string
  uf?: string
  municipio?: string
}

interface ProfileTableRow {
  id: string
  cpf: string
  instancia: string
  nomeCompleto: string
  perfil: string
  createdAt?: Date | string
  member: OrganizationMemberWithUser
}

export default function AccessRequestPage() {
  const membersQuery = useListOrganizationMembers()
  const members = useMemo<OrganizationMemberWithUser[]>(() => {
    if (!membersQuery.data || !Array.isArray(membersQuery.data)) {
      return []
    }
    return membersQuery.data
  }, [membersQuery.data])
  const isLoadingMembers = membersQuery.isLoading ?? false

  const { data: activeOrganization } = useActiveOrganization()
  const setActiveOrg = useSetActiveOrganization()

  // Filter states
  const [cpfFilter, setCpfFilter] = useState('')
  const [instanciaFilter, setInstanciaFilter] = useState('')
  const [nomeCompletoFilter, setNomeCompletoFilter] = useState('')
  const [perfilFilter, setPerfilFilter] = useState('')

  // Sheet state
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false)
  const [isRegistrationSheetOpen, setIsRegistrationSheetOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] =
    useState<ProfileTableRow | null>(null)

  // Transform members to table rows
  const tableData = useMemo<ProfileTableRow[]>(() => {
    if (!Array.isArray(members) || members.length === 0) return []
    return members.map((member) => transformMemberToTableRow(member))
  }, [members])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      cpfFilter.trim() ||
      instanciaFilter.trim() ||
      nomeCompletoFilter.trim() ||
      perfilFilter.trim()
    )
  }, [cpfFilter, instanciaFilter, nomeCompletoFilter, perfilFilter])

  // Filtered table data
  const filteredTableData = useMemo<ProfileTableRow[]>(() => {
    if (!tableData || tableData.length === 0) return []
    return tableData.filter((row) => {
      const matchesCpf =
        !cpfFilter || row.cpf.toLowerCase().includes(cpfFilter.toLowerCase())
      const matchesInstancia =
        !instanciaFilter ||
        row.instancia.toLowerCase().includes(instanciaFilter.toLowerCase())
      const matchesNomeCompleto =
        !nomeCompletoFilter ||
        row.nomeCompleto
          .toLowerCase()
          .includes(nomeCompletoFilter.toLowerCase())
      const matchesPerfil =
        !perfilFilter ||
        row.perfil.toLowerCase().includes(perfilFilter.toLowerCase()) ||
        getRoleDisplayName(row.perfil)
          .toLowerCase()
          .includes(perfilFilter.toLowerCase())

      return (
        matchesCpf && matchesInstancia && matchesNomeCompleto && matchesPerfil
      )
    })
  }, [tableData, cpfFilter, instanciaFilter, nomeCompletoFilter, perfilFilter])

  // Action handlers
  const handleViewProfile = useCallback(
    (memberId: string) => {
      const profile = tableData?.find((row) => row.id === memberId)
      if (profile) {
        setSelectedProfile(profile)
        setIsViewSheetOpen(true)
      }
    },
    [tableData]
  )

  const handleActivateProfile = useCallback(
    (memberId: string) => {
      if (!Array.isArray(tableData)) return
      const profile = tableData.find((row) => row.id === memberId)
      if (profile?.member?.organizationId) {
        setActiveOrg.mutate(profile.member.organizationId)
      }
    },
    [tableData, setActiveOrg]
  )

  const handleEditProfile = useCallback((memberId: string) => {
    // TODO: Implement edit profile modal/drawer
    console.log('Edit profile:', memberId)
  }, [])

  const handleNewProfile = useCallback(() => {
    setIsRegistrationSheetOpen(true)
  }, [])

  // Define table columns
  const columns = useMemo<ColumnDef<ProfileTableRow>[]>(
    () => [
      {
        accessorKey: 'cpf',
        header: 'CPF',
        cell: ({ row }) => (
          <span className="font-mono text-sm" data-qa="cpf">
            {row.original.cpf}
          </span>
        ),
      },
      {
        accessorKey: 'instancia',
        header: 'Instancia',
        cell: ({ row }) => (
          <span className="text-sm">{row.original.instancia}</span>
        ),
      },
      {
        accessorKey: 'nomeCompleto',
        header: 'Nome completo',
        cell: ({ row }) => (
          <span className="text-sm">{row.original.nomeCompleto}</span>
        ),
      },
      {
        accessorKey: 'perfil',
        header: 'Perfil',
        cell: ({ row }) => (
          <span className="text-sm" data-qa="profile">
            {getRoleDisplayName(row.original.perfil)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Ação',
        cell: ({ row }) => (
          <ProfileActionsMenu
            profileId={row.original.id}
            isActive={
              row.original.member?.organizationId === activeOrganization?.id
            }
            onView={handleViewProfile}
            onActivate={handleActivateProfile}
            onEdit={handleEditProfile}
          />
        ),
      },
    ],
    [
      handleViewProfile,
      handleActivateProfile,
      handleEditProfile,
      activeOrganization,
    ]
  )

  if (isLoadingMembers) {
    return <AccessLoadingState />
  }

  return (
    <div className="flex h-full w-full flex-col" data-qa="access-request-page">
      {/* Main content */}
      <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Breadcrumb Navigation */}
        <PageBreadcrumb
          backLink="/dashboard"
          parentLabel="Controle de acesso"
          currentLabel="Moderar acesso"
        />

        {/* Single Card with User Info and Table */}
        <Card data-qa="user-info-and-table-card">
          <CardHeader className="p-4 sm:p-6">
            <h1
              className="text-xl sm:text-2xl font-semibold"
              data-qa="page-title"
            >
              Moderar acesso
            </h1>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6">
            {/* User Info Section */}
            <UserInfoCard onNewProfile={handleNewProfile} />

            {/* Separator */}
            <Separator className="my-4 sm:my-6" />

            {/* Table Section */}
            {tableData.length === 0 && !hasActiveFilters ? (
              <AccessEmptyState />
            ) : (
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <div className="min-w-full inline-block align-middle">
                  <DataTable
                    columns={columns}
                    data={filteredTableData}
                    data-qa="organizations-table"
                    filters={
                      <ProfileTableFilters
                        cpfFilter={cpfFilter}
                        instanciaFilter={instanciaFilter}
                        nomeCompletoFilter={nomeCompletoFilter}
                        perfilFilter={perfilFilter}
                        onCpfChange={setCpfFilter}
                        onInstanciaChange={setInstanciaFilter}
                        onNomeCompletoChange={setNomeCompletoFilter}
                        onPerfilChange={setPerfilFilter}
                      />
                    }
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Profile View Sheet */}
      <ProfileViewSheet
        open={isViewSheetOpen}
        onOpenChange={setIsViewSheetOpen}
        profile={selectedProfile}
        isActive={
          selectedProfile?.member?.organizationId === activeOrganization?.id
        }
      />

      {/* Profile Registration Sheet */}
      <ProfileRegistrationSheet
        open={isRegistrationSheetOpen}
        onOpenChange={setIsRegistrationSheetOpen}
      />
    </div>
  )
}

// Helper functions

function parseOrganizationMetadata(
  metadata: string | null | Record<string, unknown>
): OrganizationMetadata | null {
  if (!metadata) return null

  try {
    // If metadata is already an object, return it
    if (typeof metadata === 'object') {
      return metadata as OrganizationMetadata
    }

    // Otherwise parse as JSON string
    return JSON.parse(metadata) as OrganizationMetadata
  } catch (error) {
    console.error('Failed to parse organization metadata:', error)
    return null
  }
}

function formatCpf(cpf?: string): string {
  if (!cpf) return '-'
  // Remove non-numeric characters
  const cleaned = cpf.replace(/\D/g, '')
  // Format as XXX.XXX.XXX-XX
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
  }
  return cpf
}

function transformMemberToTableRow(
  member: OrganizationMemberWithUser
): ProfileTableRow {
  if (!member?.id) {
    throw new Error('Invalid member data')
  }

  const parsedMetadata = parseOrganizationMetadata(
    member.organization?.metadata ?? null
  )

  // Build instancia from UF and Municipio
  const instanciaParts: string[] = []
  if (parsedMetadata?.uf) {
    instanciaParts.push(parsedMetadata.uf)
  }
  if (parsedMetadata?.municipio) {
    instanciaParts.push(parsedMetadata.municipio)
  }
  const instancia = instanciaParts.length > 0 ? instanciaParts.join(' - ') : '-'

  // Keep createdAt as is (can be Date or string)
  const createdAt = member.createdAt

  return {
    id: member.id,
    cpf: formatCpf(member.user?.cpf),
    instancia,
    nomeCompleto: member.user?.name ?? '-',
    perfil: member.role ?? '-',
    createdAt,
    member,
  }
}
