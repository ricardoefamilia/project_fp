import { Navigate, useLocation, useNavigate } from 'react-router'
import { useAuthContext } from '@/contexts/AuthContext'
import { Spinner } from '@/components/ui/spinner'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useEffect } from 'react'
import { SiteFooter } from './site-footer'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string[]
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthContext()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      void navigate('/login')
    }
  }, [isAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        data-qa="protected-route-loading"
      >
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // if (requiredRole && user?.role && !requiredRole.includes(user.role)) {
  //   return <Navigate to="/unauthorized" replace />
  // }

  return (
    <div
      className="[var(--header-height):var(--header-height)]"
      data-qa="protected-route-container"
    >
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <SidebarInset className="flex-1 overflow-auto">
            <div
              className="flex flex-1 flex-col gap-3 sm:gap-4 p-2 sm:p-3 md:p-4 min-w-0"
              data-qa="protected-route-content"
            >
              {children}
            </div>
          </SidebarInset>
        </div>
        <SiteFooter />
      </SidebarProvider>
    </div>
  )
}
