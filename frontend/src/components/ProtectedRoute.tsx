import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import type { UserRole } from '../types'
import AppFrame from './AppFrame'

type Props = {
  role: UserRole | null
  onLogout: () => void
  children: ReactNode
}

function ProtectedRoute({
  role,
  onLogout,
  children,
}: Props) {
  if (role === null) {
    return <Navigate to="/user-login" replace />
  }

  return (
    <AppFrame
      role={role}
      onLogout={onLogout}
    >
      {children}
    </AppFrame>
  )
}

export default ProtectedRoute