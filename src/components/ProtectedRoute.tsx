import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/userAuth'
import { JSX } from 'react'

interface ProtectedRouteProps {
  children: JSX.Element
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/signin" replace />
}
