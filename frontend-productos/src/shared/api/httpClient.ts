import axios from 'axios'

import { env } from '../config/env'
import {
  clearAccessToken,
  getAccessToken,
  setAuthRedirectMessage,
} from '../utils/token'

const shouldSkipAutoRedirect = (url?: string): boolean => {
  return Boolean(url?.includes('/auth'))
}

const getRedirectMessageByStatus = (status: number): string => {
  if (status === 401) {
    return 'Tu sesion expiro o el token es invalido. Inicia sesion nuevamente.'
  }

  return 'Tu usuario esta inactivo o no tiene acceso. Inicia sesion nuevamente.'
}

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
})

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status as number | undefined
    const requestUrl = error.config?.url as string | undefined

    if (
      status &&
      (status === 401 || status === 403) &&
      !shouldSkipAutoRedirect(requestUrl)
    ) {
      clearAccessToken()
      setAuthRedirectMessage(getRedirectMessageByStatus(status))

      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.replace('/login')
      }
    }

    return Promise.reject(error)
  },
)
