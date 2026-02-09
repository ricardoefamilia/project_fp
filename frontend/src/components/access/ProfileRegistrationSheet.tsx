import { useState } from 'react'
import { LogIn } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getRoleDisplayName } from '@/lib/utils/organization'

interface ProfileRegistrationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Available roles for profile registration
 * @TODO: Remove this once the backend is ready
 */
const AVAILABLE_ROLES = [
  'masterFp',
  'analistaFp',
  'financeiroFp',
  'consultaFp',
  'representanteLegal',
  'gestor',
  'vendedor',
  'admin',
  'member',
] as const

/**
 * Formats CPF input as user types (XXX.XXX.XXX-XX)
 */
function formatCpfInput(value: string): string {
  // Remove all non-numeric characters
  const cleaned = value.replace(/\D/g, '')

  // Limit to 11 digits
  const limited = cleaned.slice(0, 11)

  // Apply formatting
  if (limited.length <= 3) {
    return limited
  } else if (limited.length <= 6) {
    return `${limited.slice(0, 3)}.${limited.slice(3)}`
  } else if (limited.length <= 9) {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`
  } else {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`
  }
}

export function ProfileRegistrationSheet({
  open,
  onOpenChange,
}: ProfileRegistrationSheetProps) {
  const [cpf, setCpf] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('')

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpfInput(e.target.value)
    setCpf(formatted)
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset form when closing
    setCpf('')
    setSelectedRole('')
  }

  const handleRegister = () => {
    // TODO: Implement API call when backend is ready
    console.log('Register profile:', { cpf, role: selectedRole })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        side="right"
        className="w-full sm:max-w-lg p-0"
      >
        <SheetHeader className="p-3 sm:p-4 md:p-6 pb-3 sm:pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-700">
            <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            Novo Registro de Perfil
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 h-[calc(100vh-180px)]">
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
            {/* CPF Field */}
            <div className="space-y-2">
              <Label
                className="text-sm sm:text-base font-normal text-gray-700"
                htmlFor="cpf"
              >
                CPF
              </Label>
              <Input
                id="cpf"
                name="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                maxLength={14}
                className="bg-muted text-sm sm:text-base text-gray-700"
                autoComplete="off"
              />
            </div>

            {/* Perfil Field */}
            <div className="space-y-2">
              <Label
                className="text-sm sm:text-base font-normal text-gray-700"
                htmlFor="perfil"
              >
                Perfil
              </Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger
                  id="perfil"
                  name="perfil"
                  aria-label="Selecionar perfil"
                  className="text-sm sm:text-base text-gray-700 data-[placeholder]:text-gray-600 [&>svg]:text-blue-600"
                >
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {getRoleDisplayName(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="border-t p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1"
              onClick={handleClose}
            >
              Fechar
            </Button>
            <Button
              type="button"
              onClick={handleRegister}
              className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!cpf || !selectedRole}
            >
              Cadastrar
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
