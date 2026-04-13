export type ProductStatus = 'activo' | 'inactivo'

export interface ProductPayload {
  nombre: string
  descripcion: string
  subcategoria: string
  precio: number
  precioxcantidad: number
  estado: ProductStatus
}

export interface Product extends ProductPayload {
  id: string
}

export interface ProductQueryParams {
  nombre: string
  subcategoria: string
  estado: '' | ProductStatus
  page: number
  limit: number
}

export interface PaginatedProducts {
  items: Product[]
  page: number
  limit: number
  total: number
  totalPages: number
}
