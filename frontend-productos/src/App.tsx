import { Navigate, Route, Routes } from 'react-router-dom'

import { RequireAuth } from './modules/auth/guards/RequireAuth'
import { LoginPage } from './modules/auth/pages/LoginPage'
import { ProductsPage } from './modules/products/pages/ProductsPage'
import { hasAccessToken } from './shared/utils/token'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/productos" element={<ProductsPage />} />
      </Route>

      <Route
        path="/"
        element={
          <Navigate
            to={hasAccessToken() ? '/productos' : '/login'}
            replace
          />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
