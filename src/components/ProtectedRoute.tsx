import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { checkAuthStatus } from '../lib/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthStatus().then(({ session, error }) => {
      setAuthenticated(!!session)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
} 