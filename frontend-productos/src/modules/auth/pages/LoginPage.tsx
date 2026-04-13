import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { authApi } from '../api/authApi'
import { extractApiErrorMessage } from '../../../shared/utils/apiError'
import { consumeAuthRedirectMessage, setAccessToken } from '../../../shared/utils/token'

const loginSchema = z.object({
  usuario: z.string().trim().min(1, 'El usuario es obligatorio.'),
  contrasena: z.string().trim().min(1, 'La contrasena es obligatoria.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginPage = () => {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState(() => consumeAuthRedirectMessage())

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usuario: '',
      contrasena: '',
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setServerError('')

    try {
      const token = await authApi.login(values)
      setAccessToken(token)
      navigate('/productos', { replace: true })
    } catch (error) {
      setServerError(
        extractApiErrorMessage(error, 'No se pudo iniciar sesion. Intenta de nuevo.'),
      )
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="eyebrow">Parcial Frontend</p>
        <h1 id="login-title">Gestion de productos</h1>
        <p className="auth-description">
          Inicia sesion para administrar el catalogo con autenticacion JWT.
        </p>

        <form className="form-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="field-group" htmlFor="usuario">
            Usuario
            <input
              id="usuario"
              type="text"
              autoComplete="username"
              placeholder="admin"
              {...register('usuario')}
            />
            {errors.usuario ? (
              <span className="error-text">{errors.usuario.message}</span>
            ) : null}
          </label>

          <label className="field-group" htmlFor="contrasena">
            Contrasena
            <input
              id="contrasena"
              type="password"
              autoComplete="current-password"
              placeholder="********"
              {...register('contrasena')}
            />
            {errors.contrasena ? (
              <span className="error-text">{errors.contrasena.message}</span>
            ) : null}
          </label>

          {serverError ? <p className="alert error">{serverError}</p> : null}

          <button type="submit" className="primary-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Iniciando sesion...' : 'Iniciar sesion'}
          </button>
        </form>

        <div className="login-hint" role="note">
          <strong>Flujo de prueba:</strong> prueba con admin/admin123 para acceso normal y usuario inactivo para validar 403.
        </div>
      </section>
    </main>
  )
}
