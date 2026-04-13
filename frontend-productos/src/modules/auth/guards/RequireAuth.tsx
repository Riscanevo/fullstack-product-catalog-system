import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { hasAccessToken } from '../../../shared/utils/token'

export const RequireAuth = () => {
  const location = useLocation()

  if (!hasAccessToken()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
