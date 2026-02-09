import { MoreVertical, Pencil, Eye, X, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ProfileActionsMenuProps {
  profileId: string
  isActive: boolean
  onView: (id: string) => void
  onActivate: (id: string) => void
  onEdit: (id: string) => void
}

export function ProfileActionsMenu({
  profileId,
  isActive,
  onView,
  onActivate,
  onEdit,
}: ProfileActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" data-qa="action-menu-trigger">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => onEdit(profileId)}
          className="cursor-pointer"
        >
          <Pencil className="mr-2 h-4 w-4 text-blue-600" />
          <span className="text-blue-600">Editar</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onView(profileId)}
          className="cursor-pointer"
        >
          <Eye className="mr-2 h-4 w-4 text-blue-600" />
          <span className="text-blue-600">Detalhes</span>
        </DropdownMenuItem>
        {isActive ? (
          <DropdownMenuItem
            data-qa="action-deactivate"
            onClick={() => onActivate(profileId)}
            className="cursor-pointer"
          >
            <X className="mr-2 h-4 w-4 text-red-600" />
            <span className="text-red-600">Desativar</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            data-qa="action-activate"
            onClick={() => onActivate(profileId)}
            className="cursor-pointer"
          >
            <Check className="mr-2 h-4 w-4 text-green-600" />
            <span className="text-green-600">Ativar</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
