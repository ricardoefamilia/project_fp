import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '@/schemas/auth.schema'
import { toast } from 'sonner'

export const authKeys = {
  session: ['auth', 'session'] as const,
} as const

export function useSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: async () => {
      const { data, error } = await authClient.getSession()
      if (error) {
        throw new Error(error.message ?? 'Erro desconhecido')
      }
      return data
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchInterval: 1000 * 60 * 60, // Refetch every 1 hour
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnReconnect: true, // Refetch when network reconnects
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data, error } = await authClient.signIn.email({
        email: input.email,
        password: input.password,
      })

      if (error) {
        throw new Error(error.message ?? 'Erro desconhecido')
      }

      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.session })
      toast.success('Login realizado com sucesso!')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao fazer login')
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const { data, error } = await authClient.signUp.email({
        email: input.email,
        password: input.password,
        name: input.email.split('@')[0] ?? 'Usuário',
      })

      if (error) {
        throw new Error(error.message ?? 'Erro desconhecido')
      }

      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.session })
      toast.success('Conta criada com sucesso!')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao criar conta')
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut()
      if (error) {
        throw new Error(error.message ?? 'Erro desconhecido')
      }
    },
    onSuccess: () => {
      queryClient.clear()
      toast.success('Logout realizado com sucesso!')
      // Redirect to login page (improve if possible)
      window.location.href = '/login'
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao fazer logout')
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (_input: ForgotPasswordInput) => {
      throw new Error('Funcionalidade ainda não implementada')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao solicitar recuperação de senha')
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (_input: ResetPasswordInput) => {
      throw new Error('Funcionalidade ainda não implementada')
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao redefinir senha')
    },
  })
}

export function useIsAuthenticated() {
  const { data: session, isLoading } = useSession()
  return {
    isAuthenticated: !!session?.user,
    isLoading,
    user: session?.user ?? null,
  }
}
