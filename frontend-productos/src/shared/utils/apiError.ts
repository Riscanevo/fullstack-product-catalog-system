import axios from 'axios'

interface BackendErrorResponse {
  message?: string | string[]
  error?: string
}

const normalizeMessage = (message: string | string[]): string => {
  if (Array.isArray(message)) {
    return message.join(' | ')
  }

  return message
}

export const extractApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (axios.isAxiosError<BackendErrorResponse>(error)) {
    const backendMessage = error.response?.data?.message

    if (backendMessage) {
      return normalizeMessage(backendMessage)
    }

    if (error.response?.status === 401) {
      return 'Credenciales incorrectas.'
    }

    if (error.response?.status === 403) {
      return 'No tienes permisos para realizar esta accion.'
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}
