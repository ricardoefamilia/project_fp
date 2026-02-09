# Implementação de Autenticação - Frontend

Este documento descreve a implementação completa do sistema de autenticação no frontend da aplicação Farmácia Popular.

## 🏗️ Arquitetura

### Tecnologias Utilizadas

- **Better Auth**: Framework de autenticação moderno e type-safe
- **TanStack Form**: Gerenciamento de formulários com validação
- **Zod**: Validação de schemas em runtime
- **React Query**: Gerenciamento de estado do servidor
- **React Router**: Roteamento client-side

### Estrutura de Arquivos

```
src/
├── schemas/
│   └── auth.schema.ts          # Schemas de validação Zod
├── hooks/
│   └── useAuth.ts             # Hooks de autenticação
├── contexts/
│   └── AuthContext.tsx        # Contexto global de autenticação
├── components/
│   ├── LoginForm.tsx         # Formulário de login
│   ├── ProtectedRoute.tsx     # Componente para rotas protegidas
│   └── ErrorBoundary.tsx      # Tratamento de erros global
├── pages/
│   ├── LoginPage.tsx          # Página de login
│   ├── DashboardPage.tsx      # Dashboard principal
│   └── HomePage.tsx           # Página inicial (redireciona)
├── lib/
│   ├── auth-client.ts         # Cliente Better Auth
│   └── routes.ts              # Configuração de rotas
└── routes/
    └── index.tsx              # Definição de rotas
```

## 🔐 Funcionalidades Implementadas

### 1. Autenticação com Email/Senha

- ✅ Login com validação de formulário
- ✅ Validação em tempo real com Zod
- ✅ Tratamento de erros
- ✅ Estados de loading
- ✅ Redirecionamento automático

### 2. Gerenciamento de Estado

- ✅ Contexto global de autenticação
- ✅ Hooks personalizados para operações de auth
- ✅ Cache de sessão com React Query
- ✅ Sincronização automática de estado

### 3. Roteamento Protegido

- ✅ Rotas protegidas por autenticação
- ✅ Redirecionamento automático para login
- ✅ Proteção contra acesso não autorizado
- ✅ Preservação de URL de destino

### 4. Tratamento de Erros

- ✅ Error Boundary global
- ✅ Toast notifications para feedback
- ✅ Tratamento de erros de rede
- ✅ Fallbacks para estados de erro

## 🚀 Como Usar

### 1. Login

```tsx
import { useLogin } from '@/hooks/useAuth'

function LoginComponent() {
  const loginMutation = useLogin()
  
  const handleLogin = async (credentials) => {
    try {
      await loginMutation.mutateAsync(credentials)
      // Usuário será redirecionado automaticamente
    } catch (error) {
      // Erro já tratado pelo hook
    }
  }
}
```

### 2. Verificar Autenticação

```tsx
import { useAuthContext } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuthContext()
  
  if (isLoading) return <Spinner />
  if (!isAuthenticated) return <LoginPrompt />
  
  return <div>Bem-vindo, {user?.name}!</div>
}
```

### 3. Proteger Rotas

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

### 4. Logout

```tsx
import { useLogout } from '@/hooks/useAuth'

function LogoutButton() {
  const logoutMutation = useLogout()
  
  return (
    <Button onClick={() => logoutMutation.mutate()}>
      Sair
    </Button>
  )
}
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Cliente Better Auth

```typescript
// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: `${env.VITE_API_BASE_URL}/api/auth`,
})
```

## 📋 Schemas de Validação

### Login Schema

```typescript
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
})
```

### Registro Schema

```typescript
export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
})
```

## 🎯 Próximos Passos

### Funcionalidades Planejadas

- [ ] Registro de usuários
- [ ] Recuperação de senha
- [ ] Autenticação social (Gov.br)
- [ ] Two-factor authentication
- [ ] Gerenciamento de perfil
- [ ] Logs de auditoria

### Melhorias Técnicas

- [ ] Testes unitários para hooks
- [ ] Testes de integração para fluxos
- [ ] Otimização de performance
- [ ] Internacionalização
- [ ] Acessibilidade (WCAG 2.1)

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**: Verificar configuração do backend
2. **Token expirado**: Implementar refresh automático
3. **Redirecionamento infinito**: Verificar lógica de rotas
4. **Estado não sincronizado**: Verificar React Query cache

### Debug

```typescript
// Habilitar logs do Better Auth
authClient.setConfig({
  fetchOptions: {
    onError: (error) => console.error('Auth Error:', error),
    onSuccess: (data) => console.log('Auth Success:', data),
  },
})
```

## 📚 Recursos Adicionais

- [Documentação Better Auth](https://better-auth.com)
- [TanStack Form Docs](https://tanstack.com/form)
- [Zod Documentation](https://zod.dev)
- [React Query Guide](https://tanstack.com/query)

---

**Última atualização**: Janeiro 2025  
**Versão**: 1.0.0
