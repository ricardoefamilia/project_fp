import { Routes, Route, Navigate } from 'react-router'
import { useAuthContext } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import HomePage from '@/pages/HomePage'
import DashboardPage from '@/pages/DashboardPage'
import EstabelecimentosPage from '@/pages/register/EstabelecimentosPage'
import AccessRequestPage from '@/pages/access/AccessRequestPage'
import NotFoundPage from '@/pages/NotFoundPage'
import LoginPage from '@/pages/LoginPage'
import SettingsPage from '@/pages/SettingsPage'

function AppRoutes() {
  const { isAuthenticated } = useAuthContext()

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />

      {/* Rotas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cadastro/estabelecimentos"
        element={
          <ProtectedRoute>
            <EstabelecimentosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/access/manager"
        element={
          <ProtectedRoute>
            <AccessRequestPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Rota de não autorizado */}
      <Route
        path="/unauthorized"
        element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-destructive">
                Acesso Negado
              </h1>
              <p className="text-muted-foreground">
                Você não tem permissão para acessar esta página.
              </p>
            </div>
          </div>
        }
      />

      {/* Rota 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
