export interface LoginRequest {
  usuario: string
  contrasena: string
}

export interface LoginResponse {
  access_token: string
}
