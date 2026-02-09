import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

import { useSession, useIsAuthenticated } from '@/hooks/use-auth'
import type { User } from '@/schemas/user.schema'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, isLoading: sessionLoading } = useSession()
  const { isAuthenticated, isLoading: authLoading } = useIsAuthenticated()

  const isLoading = sessionLoading || authLoading

  const value: AuthContextType = {
    user: session?.user
      ? {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          createdAt: session.user.createdAt,
          updatedAt: session.user.updatedAt,
          emailVerified: session.user.emailVerified,
          image: session.user.image,
        }
      : null,
    isAuthenticated,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
