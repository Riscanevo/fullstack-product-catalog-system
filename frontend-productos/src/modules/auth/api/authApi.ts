import axios from 'axios'

import type { LoginRequest, LoginResponse } from '../../../shared/types/auth'
import { httpClient } from '../../../shared/api/httpClient'

interface AlternativeLoginResponse {
  token: string
}

const getTokenFromResponse = (
  data: LoginResponse | AlternativeLoginResponse,
): string => {
  if ('access_token' in data && data.access_token) {
    return data.access_token
  }

  if ('token' in data && data.token) {
    return data.token
  }

  throw new Error('El backend no devolvio un token valido.')
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<string> {
    try {
      const { data } = await httpClient.post<LoginResponse>('/auth', credentials)
      return getTokenFromResponse(data)
    } catch (error) {
      const status = axios.isAxiosError(error) ? (error.response?.status ?? 0) : 0

      if (status === 400 || status === 422) {
        const fallbackPayload = {
          username: credentials.usuario,
          password: credentials.contrasena,
        }

        const { data } = await httpClient.post<AlternativeLoginResponse>('/auth', fallbackPayload)
        return getTokenFromResponse(data)
      }

      throw error
    }
  },
}
