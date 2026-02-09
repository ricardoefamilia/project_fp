import { User } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import { useNavigate } from 'react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/hooks/use-auth'
import { loginSchema } from '@/schemas/auth.schema'
import logoBrasil from '@/assets/images/logo-br.svg'
import logoFarmaciaPopular from '@/assets/images/logo-fp.svg'
import { toast } from 'sonner'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await loginMutation.mutateAsync(value)

        void navigate('/')
      } catch {
        toast.error('Erro ao fazer login', {
          description: 'Verifique suas credenciais e tente novamente',
        })
      }
    },
  })

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      data-qa="login-form"
      {...props}
    >
      <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 text-center">
        <img
          src={logoBrasil}
          alt="Logo do Brasil"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
          data-qa="logo-brasil"
        />
        <img
          src={logoFarmaciaPopular}
          alt="Logo do Farmácia Popular"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
          data-qa="logo-farmacia-popular"
        />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-xl sm:text-2xl font-semibold">Bem vindo!</h1>
        <p className="text-balance text-xs sm:text-sm text-muted-foreground font-medium">
          Entre com sua conta Gov.br
          <br />
          ou
          <br />
          Cadastre-se para
          <br />
          ter acesso a plataforma
        </p>
      </div>
      <div className="flex flex-row justify-center items-center gap-2 sm:gap-4">
        <Button
          variant="link"
          className="underline text-sm sm:text-base"
          data-qa="login-link-button"
        >
          Entrar
        </Button>
        <Button
          variant="link"
          className="underline text-sm sm:text-base"
          data-qa="register-link-button"
        >
          Cadastrar
        </Button>
      </div>
      <div className="grid gap-4 sm:gap-6">
        {/* Email field */}
        <form.Field
          name="email"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Email</Label>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                placeholder="m@example.com"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                required
                data-qa="login-email-input"
              />
              {field.state.meta.errors.length > 0 && (
                <p
                  className="text-sm text-destructive"
                  data-qa="login-email-error"
                >
                  {field.state.meta.errors[0]?.message ??
                    JSON.stringify(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        />

        {/* Password field */}
        <form.Field
          name="password"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Password</Label>
              <Input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                required
                data-qa="login-password-input"
              />
              {field.state.meta.errors.length > 0 && (
                <p
                  className="text-sm text-destructive"
                  data-qa="login-password-error"
                >
                  {field.state.meta.errors[0]?.message ??
                    JSON.stringify(field.state.meta.errors[0])}
                </p>
              )}
              <div className="flex items-center">
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                  data-qa="forgot-password-link"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
          data-qa="login-submit-button"
        >
          {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <Button className="w-full" type="button" data-qa="login-gov-br-button">
          <User className="w-4 h-4" />
          <span>
            Entrar com o <strong>gov.br</strong>
          </span>
        </Button>
      </div>
    </form>
  )
}
