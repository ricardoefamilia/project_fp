import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import DashboardPage from './DashboardPage'

export default function HomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    void navigate('/dashboard', { replace: true })
  }, [navigate])

  return <DashboardPage />
}
