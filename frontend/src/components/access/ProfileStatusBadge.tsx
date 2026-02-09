import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ProfileStatusBadgeProps {
  status: 'Ativo' | 'Inativo'
}

export function ProfileStatusBadge({ status }: ProfileStatusBadgeProps) {
  const isActive = status === 'Ativo'

  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      className={cn(
        'font-medium',
        isActive
          ? 'bg-green-100 text-green-800 border-green-200'
          : 'bg-red-100 text-red-800 border-red-200'
      )}
      data-qa={`status-${status.toLowerCase()}`}
    >
      {status}
    </Badge>
  )
}
