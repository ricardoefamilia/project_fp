import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { LogIn, Search } from 'lucide-react'
import { toast } from 'sonner'
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
import { Skeleton } from '@/components/ui/skeleton'
import { usePharmacy, useUpdatePharmacy } from '@/hooks/use-pharmacies'
import type {
  Pharmacy,
  UpdatePharmacyInput,
  ApiError,
} from '@/types/pharmacy.types'
import { updatePharmacySchema } from '@/schemas/pharmacy.schema'
import {
  cleanCEP,
  formatCNPJ,
  formatCEP,
} from '@/lib/utils/brazilian-documents'

// Brazilian states list
const UF_OPTIONS = [] as { value: string; label: string }[]

// Establishment types
const ESTABLISHMENT_TYPES = [] as { value: string; label: string }[]

// Sphere types
const SPHERE_TYPES = [] as { value: string; label: string }[]

// Form validation schema - extend the update schema to include CNES field for UI
const pharmacyEditFormSchema = updatePharmacySchema.extend({
  cnes: z.string().optional(),
})

type PharmacyEditFormData = z.infer<typeof pharmacyEditFormSchema>

// Helper to safely get error messages from field errors
function getErrorMessages(errors: unknown[]): string {
  return errors
    .map((err) => {
      if (typeof err === 'string') return err
      if (err && typeof err === 'object' && 'message' in err) {
        return String((err as { message: unknown }).message)
      }
      return String(err)
    })
    .join(', ')
}

interface PharmacyEditFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pharmacy: Pharmacy | null
}

export function PharmacyEditFormSheet({
  open,
  onOpenChange,
  pharmacy,
}: PharmacyEditFormSheetProps) {
  const updatePharmacy = useUpdatePharmacy()

  // Fetch fresh pharmacy data when editing
  const {
    data: pharmacyData,
    isLoading: isLoadingPharmacy,
    error: pharmacyError,
  } = usePharmacy(pharmacy?.cnpjNumber ?? '', {
    enabled: open && !!pharmacy?.cnpjNumber,
  })

  // Use fresh data from API or fallback to passed pharmacy
  const currentPharmacy = pharmacyData ?? pharmacy

  const form = useForm({
    defaultValues: {
      cnes: '',
      cnpjNumber: '',
      companyName: '',
      companyType: '',
      fantasyName: '',
      sphereDescription: '',
      zipCode: '',
      address: '',
      district: '',
      cityCodeIbge: '',
      ufCrf: '',
      operationalStatus: 'A',
    } as PharmacyEditFormData,
    onSubmit: ({ value }) => {
      if (!currentPharmacy?.cnpjNumber) {
        return
      }

      // Validate the entire form using the schema
      const validationResult = pharmacyEditFormSchema.safeParse(value)
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0]
        toast.error('Erro de validação', {
          description:
            firstError?.message ??
            'Por favor, verifique os campos do formulário.',
        })

        return
      }

      const payload: Partial<UpdatePharmacyInput> = {
        companyName: value.companyName,
        address: value.address ?? undefined,
        operationalStatus: value.operationalStatus ?? 'A',
        companyType: value.companyType ?? undefined,
        fantasyName: value.fantasyName ?? undefined,
        sphereDescription: value.sphereDescription ?? undefined,
        zipCode: value.zipCode ? cleanCEP(value.zipCode) : undefined,
        district: value.district ?? undefined,
        cityCodeIbge: value.cityCodeIbge ?? undefined,
        ufCrf: value.ufCrf ?? undefined,
      }

      updatePharmacy.mutate(
        {
          cnpjNumber: currentPharmacy.cnpjNumber,
          data: payload,
        },
        {
          onSuccess: () => {
            toast.success('Estabelecimento atualizado com sucesso!', {
              description: `${payload.companyName} foi atualizado.`,
            })
            onOpenChange(false)
          },
          onError: (error: ApiError) => {
            toast.error('Erro ao atualizar estabelecimento', {
              description:
                error.message ?? 'Ocorreu um erro ao salvar os dados.',
            })
          },
        }
      )
    },
  })

  // Reset form when pharmacy data changes
  useEffect(() => {
    if (currentPharmacy && open) {
      form.reset()
      form.setFieldValue('cnes', currentPharmacy.identificationNumber ?? '')
      form.setFieldValue('cnpjNumber', currentPharmacy.cnpjNumber ?? '')
      form.setFieldValue('companyName', currentPharmacy.companyName ?? '')
      form.setFieldValue('companyType', currentPharmacy.companyType ?? '')
      form.setFieldValue('fantasyName', currentPharmacy.fantasyName ?? '')
      form.setFieldValue(
        'sphereDescription',
        currentPharmacy.sphereDescription ?? ''
      )
      form.setFieldValue('zipCode', currentPharmacy.zipCode ?? '')
      form.setFieldValue('address', currentPharmacy.address ?? '')
      form.setFieldValue('district', currentPharmacy.district ?? '')
      form.setFieldValue('cityCodeIbge', currentPharmacy.cityCodeIbge ?? '')
      form.setFieldValue('ufCrf', currentPharmacy.ufCrf ?? '')
      form.setFieldValue(
        'operationalStatus',
        currentPharmacy.operationalStatus ?? 'A'
      )
    }
  }, [currentPharmacy, open, form])

  const handleSearchCNES = () => {
    // TODO: Implement CNES search API integration
    console.log('Searching CNES...')
  }

  // Get establishment type label
  const getEstablishmentTypeLabel = (value: string): string => {
    const type = ESTABLISHMENT_TYPES.find((t) => t.value === value)
    return type?.label ?? value
  }

  // Get sphere label
  const getSphereLabel = (value: string): string => {
    const sphere = SPHERE_TYPES.find((s) => s.value === value)
    return sphere?.label ?? value
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        side="right"
        className="w-full sm:max-w-lg p-0"
      >
        <SheetHeader className="p-3 sm:p-4 md:p-6 pb-3 sm:pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-semibold text-gray-700">
            <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            Editar estabelecimento
          </SheetTitle>
        </SheetHeader>

        {isLoadingPharmacy ? (
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
            <FormFieldSkeleton />
            <FormFieldSkeleton />
            <FormFieldSkeleton />
            <FormFieldSkeleton />
            <FormFieldSkeleton />
            <FormFieldSkeleton />
          </div>
        ) : pharmacyError ? (
          <div className="p-3 sm:p-4 md:p-6 flex items-center justify-center h-[400px]">
            <div className="text-center space-y-2 px-3">
              <p className="text-base sm:text-lg font-semibold text-destructive">
                Erro ao carregar dados
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {pharmacyError.message ?? 'Ocorreu um erro ao buscar os dados.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 h-[calc(100vh-180px)]">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  void form.handleSubmit()
                }}
                className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5"
              >
                {/* CNES Search */}
                <form.Field name="cnes">
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        className="text-sm sm:text-base font-normal text-gray-700"
                        htmlFor={field.name}
                      >
                        CNES
                      </Label>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Busque um CNES"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2"
                          onClick={handleSearchCNES}
                        >
                          <Search className="h-4 w-4 text-blue-600" />
                        </Button>
                      </div>
                    </div>
                  )}
                </form.Field>

                {/* CNPJ - Read only */}
                <form.Field name="cnpjNumber">
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        className="text-sm sm:text-base font-normal text-gray-700"
                        htmlFor={field.name}
                      >
                        CNPJ
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={formatCNPJ(field.state.value)}
                        className="bg-muted"
                        disabled
                        readOnly
                      />
                    </div>
                  )}
                </form.Field>

                {/* Razão Social */}
                <form.Field
                  name="companyName"
                  validators={{
                    onChange: ({ value }) => {
                      const result =
                        pharmacyEditFormSchema.shape.companyName.safeParse(
                          value
                        )
                      if (!result.success) {
                        return (
                          result.error.errors[0]?.message ??
                          'Razão social inválida'
                        )
                      }
                      return undefined
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        className="text-sm sm:text-base font-normal text-gray-700"
                        htmlFor={field.name}
                      >
                        Razão social
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="bg-muted"
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {getErrorMessages(field.state.meta.errors)}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                {/* Tipo de estabelecimento */}
                <form.Field name="companyType">
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        className="text-sm sm:text-base font-normal text-gray-700"
                        htmlFor={field.name}
                      >
                        Tipo de estabelecimento
                      </Label>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger
                          id={field.name}
                          aria-label="Tipo de estabelecimento"
                        >
                          <SelectValue placeholder="Escolha o tipo de estabelecimento">
                            {field.state.value
                              ? getEstablishmentTypeLabel(field.state.value)
                              : 'Escolha o tipo de estabelecimento'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {ESTABLISHMENT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>

                {/* Nome Fantasia */}
                <form.Field name="fantasyName">
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        className="text-sm sm:text-base font-normal text-gray-700"
                        htmlFor={field.name}
                      >
                        Nome fantasia
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="bg-muted"
                      />
                    </div>
                  )}
                </form.Field>

                {/* Esfera */}
                <form.Field name="sphereDescription">
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        className="text-sm sm:text-base font-normal text-gray-700"
                        htmlFor={field.name}
                      >
                        Esfera
                      </Label>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger id={field.name} aria-label="Esfera">
                          <SelectValue placeholder="Selecione a esfera">
                            {field.state.value
                              ? getSphereLabel(field.state.value)
                              : 'Selecione a esfera'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {SPHERE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>

                {/* CEP */}
                <form.Field name="zipCode">
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        className="text-sm sm:text-base font-normal text-gray-700"
                        htmlFor={field.name}
                      >
                        CEP
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Digite o CEP"
                        value={formatCEP(field.state.value ?? '')}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="bg-muted"
                        autoComplete="postal-code"
                      />
                    </div>
                  )}
                </form.Field>

                {/* Logradouro e número */}
                <form.Field
                  name="address"
                  validators={{
                    onChange: ({ value }) => {
                      // Address is optional in backend, but validate max length if provided
                      if (value && value.length > 0) {
                        const result =
                          pharmacyEditFormSchema.shape.address.safeParse(value)
                        if (!result.success) {
                          return (
                            result.error.errors[0]?.message ??
                            'Endereço inválido'
                          )
                        }
                      }
                      return undefined
                    },
                  }}
                >
                  {(field) => (
                    <>
                      <div className="space-y-2">
                        <Label
                          className="text-sm sm:text-base font-normal text-gray-700"
                          htmlFor={field.name}
                        >
                          Logradouro e número
                        </Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Digite o logradouro"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          autoComplete="street-address"
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-destructive">
                            {getErrorMessages(field.state.meta.errors)}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </form.Field>

                {/* Bairro */}
                <form.Field name="district">
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        className="text-sm sm:text-base font-normal text-gray-700"
                        htmlFor={field.name}
                      >
                        Bairro
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Digite o bairro"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>

                {/* Município */}
                <form.Field name="cityCodeIbge">
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        className="text-sm sm:text-base font-normal text-gray-700"
                        htmlFor={field.name}
                      >
                        Município
                      </Label>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger id={field.name} aria-label="Município">
                          <SelectValue placeholder="Selecione o município">
                            {field.state.value ?? 'Selecione o município'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {/* TODO: Load municipalities dynamically based on UF */}
                          {field.state.value && (
                            <SelectItem value={field.state.value}>
                              {field.state.value}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>

                {/* UF */}
                <form.Field name="ufCrf">
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        className="text-sm sm:text-base font-normal text-gray-700"
                        htmlFor={field.name}
                      >
                        UF
                      </Label>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger id={field.name} aria-label="UF">
                          <SelectValue placeholder="Selecione a UF" />
                        </SelectTrigger>
                        <SelectContent>
                          {UF_OPTIONS.map((uf) => (
                            <SelectItem key={uf.value} value={uf.value}>
                              {uf.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>
              </form>
            </ScrollArea>

            <SheetFooter className="border-t p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:flex-1"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={updatePharmacy.isPending}
                  onClick={() => void form.handleSubmit()}
                >
                  {updatePharmacy.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

// Skeleton component for loading state
function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
