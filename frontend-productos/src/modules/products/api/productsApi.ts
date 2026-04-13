import type {
  PaginatedProducts,
  Product,
  ProductPayload,
  ProductQueryParams,
  ProductStatus,
} from '../../../shared/types/product'
import { httpClient } from '../../../shared/api/httpClient'

interface ApiMeta {
  total?: number
  totalItems?: number
  itemCount?: number
  currentPage?: number
  page?: number
  perPage?: number
  limit?: number
  totalPages?: number
  pageCount?: number
}

interface PaginatedApiResponse {
  data?: unknown[]
  items?: unknown[]
  results?: unknown[]
  productos?: unknown[]
  total?: number
  totalItems?: number
  page?: number
  limit?: number
  totalPages?: number
  meta?: ApiMeta
}

const toNumber = (value: unknown): number => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

const normalizeStatus = (value: unknown): ProductStatus => {
  return String(value).toLowerCase() === 'inactivo' ? 'inactivo' : 'activo'
}

const toProduct = (value: unknown, index: number): Product => {
  const candidate = (value ?? {}) as Record<string, unknown>
  const candidateId = candidate.id ?? candidate._id ?? `tmp-${index}-${candidate.nombre ?? 'producto'}`

  return {
    id: String(candidateId),
    nombre: String(candidate.nombre ?? ''),
    descripcion: String(candidate.descripcion ?? ''),
    subcategoria: String(candidate.subcategoria ?? ''),
    precio: toNumber(candidate.precio),
    precioxcantidad: toNumber(candidate.precioxcantidad),
    estado: normalizeStatus(candidate.estado),
  }
}

const applyLocalFilters = (
  products: Product[],
  params: ProductQueryParams,
): Product[] => {
  return products.filter((product) => {
    const byName = params.nombre
      ? product.nombre.toLowerCase().includes(params.nombre.toLowerCase().trim())
      : true

    const bySubcategory = params.subcategoria
      ? product.subcategoria === params.subcategoria
      : true

    const byStatus = params.estado ? product.estado === params.estado : true

    return byName && bySubcategory && byStatus
  })
}

const normalizePaginatedResponse = (
  payload: unknown,
  params: ProductQueryParams,
): PaginatedProducts => {
  if (Array.isArray(payload)) {
    const normalized = payload.map((product, index) => toProduct(product, index))
    const filtered = applyLocalFilters(normalized, params)
    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / params.limit))
    const page = Math.min(params.page, totalPages)
    const start = (page - 1) * params.limit

    return {
      items: filtered.slice(start, start + params.limit),
      page,
      limit: params.limit,
      total,
      totalPages,
    }
  }

  const data = (payload ?? {}) as PaginatedApiResponse
  const collection = data.data ?? data.items ?? data.results ?? data.productos ?? []
  const normalized = collection.map((product, index) => toProduct(product, index))

  const metaTotal = data.meta?.total ?? data.meta?.totalItems ?? data.total ?? data.totalItems
  const metaPage = data.meta?.currentPage ?? data.meta?.page ?? data.page ?? params.page
  const metaLimit = data.meta?.perPage ?? data.meta?.limit ?? data.limit ?? params.limit
  const metaTotalPages = data.meta?.totalPages ?? data.meta?.pageCount ?? data.totalPages

  const total = metaTotal ? Number(metaTotal) : normalized.length
  const limit = Number(metaLimit) || params.limit
  const totalPages = Number(metaTotalPages) || Math.max(1, Math.ceil(total / limit))

  return {
    items: normalized,
    page: Number(metaPage) || params.page,
    limit,
    total,
    totalPages,
  }
}

const buildQueryParams = (params: ProductQueryParams): Record<string, unknown> => {
  const query: Record<string, unknown> = {
    page: params.page,
    limit: params.limit,
  }

  if (params.nombre.trim()) {
    query.nombre = params.nombre.trim()
  }

  if (params.subcategoria) {
    query.subcategoria = params.subcategoria
  }

  if (params.estado) {
    query.estado = params.estado
  }

  return query
}

export const productsApi = {
  async list(params: ProductQueryParams): Promise<PaginatedProducts> {
    const { data } = await httpClient.get<unknown>('/productos', {
      params: buildQueryParams(params),
    })

    return normalizePaginatedResponse(data, params)
  },

  async create(payload: ProductPayload): Promise<void> {
    await httpClient.post('/productos', payload)
  },

  async update(id: string, payload: ProductPayload): Promise<void> {
    await httpClient.put(`/productos/${id}`, payload)
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/productos/${id}`)
  },
}
