import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router'
import { queryClient } from '@/lib/query-client'
import { ThemeProvider } from '@/hooks/use-theme'
import { AuthProvider } from '@/contexts/AuthContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Toaster } from '@/components/ui/sonner'
import AppRoutes from '@/routes'
import { useEffect, useState } from 'react'

function App() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark')
  useEffect(() => {
    const theme = localStorage.getItem('ui-theme') as
      | 'dark'
      | 'light'
      | 'system'
    if (theme) {
      setTheme(theme)
    }
  }, [])

  console.log(theme)

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme={theme} storageKey="ui-theme">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
