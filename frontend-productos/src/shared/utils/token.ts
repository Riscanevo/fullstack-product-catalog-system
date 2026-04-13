import { STORAGE_KEYS } from '../constants/storageKeys'

const isBrowser = typeof window !== 'undefined'

export const getAccessToken = (): string | null => {
  if (!isBrowser) return null

  return (
    sessionStorage.getItem(STORAGE_KEYS.accessToken) ||
    localStorage.getItem(STORAGE_KEYS.accessToken)
  )
}

export const hasAccessToken = (): boolean => Boolean(getAccessToken())

export const setAccessToken = (token: string, remember = false): void => {
  if (!isBrowser) return

  if (remember) {
    localStorage.setItem(STORAGE_KEYS.accessToken, token)
    sessionStorage.removeItem(STORAGE_KEYS.accessToken)
    return
  }

  sessionStorage.setItem(STORAGE_KEYS.accessToken, token)
  localStorage.removeItem(STORAGE_KEYS.accessToken)
}

export const clearAccessToken = (): void => {
  if (!isBrowser) return

  sessionStorage.removeItem(STORAGE_KEYS.accessToken)
  localStorage.removeItem(STORAGE_KEYS.accessToken)
}

export const setAuthRedirectMessage = (message: string): void => {
  if (!isBrowser) return

  sessionStorage.setItem(STORAGE_KEYS.authRedirectMessage, message)
}

export const consumeAuthRedirectMessage = (): string => {
  if (!isBrowser) return ''

  const message = sessionStorage.getItem(STORAGE_KEYS.authRedirectMessage) || ''
  sessionStorage.removeItem(STORAGE_KEYS.authRedirectMessage)
  return message
}
