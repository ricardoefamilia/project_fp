import { Building2 } from 'lucide-react'

interface AccessEmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
}

export function AccessEmptyState({
  icon,
  title = 'Nenhum perfil encontrado',
  description = 'Você ainda não faz parte de nenhuma organização. Entre em contato com o administrador para solicitar acesso.',
}: AccessEmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 text-center"
      data-qa="empty-state"
    >
      {icon ?? (
        <Building2 className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  )
}
