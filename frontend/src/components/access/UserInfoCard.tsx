import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserInfoCardProps {
  onNewProfile: () => void
}

export function UserInfoCard({ onNewProfile }: UserInfoCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4 sm:gap-6 mb-4 sm:mb-6">
      {/* Atribuir Perfil button */}
      <Button
        onClick={onNewProfile}
        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto flex-shrink-0"
      >
        <Plus className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Atribuir Perfil</span>
        <span className="sm:hidden">Novo</span>
      </Button>
    </div>
  )
}
