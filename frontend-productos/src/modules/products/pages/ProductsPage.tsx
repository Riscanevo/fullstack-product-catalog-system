import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { productsApi } from '../api/productsApi'
import { ProductFilters } from '../components/ProductFilters'
import { ProductFormModal } from '../components/ProductFormModal'
import { ProductsTable } from '../components/ProductsTable'
import { PaginationControls } from '../components/PaginationControls'
import type { PaginatedProducts, Product, ProductPayload, ProductQueryParams } from '../../../shared/types/product'
import { extractApiErrorMessage } from '../../../shared/utils/apiError'
import { clearAccessToken } from '../../../shared/utils/token'

const initialQuery: ProductQueryParams = {
  nombre: '',
  subcategoria: '',
  estado: '',
  page: 1,
  limit: 8,
}

const initialPagination: PaginatedProducts = {
  items: [],
  page: 1,
  limit: 8,
  total: 0,
  totalPages: 1,
}

export const ProductsPage = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState<ProductQueryParams>(initialQuery)
  const [debouncedName, setDebouncedName] = useState(query.nombre)

  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<PaginatedProducts>(initialPagination)

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [modalError, setModalError] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedName(query.nombre)
    }, 350)

    return () => window.clearTimeout(timer)
  }, [query.nombre])

  const effectiveQuery = useMemo(
    () => ({ ...query, nombre: debouncedName }),
    [debouncedName, query],
  )

  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await productsApi.list(effectiveQuery)
      setProducts(response.items)
      setPagination(response)

      if (response.page !== effectiveQuery.page) {
        setQuery((previous) => ({ ...previous, page: response.page }))
      }
    } catch (requestError) {
      setError(
        extractApiErrorMessage(
          requestError,
          'No se pudieron cargar los productos. Intenta nuevamente.',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }, [effectiveQuery])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    if (!success) return

    const timer = window.setTimeout(() => {
      setSuccess('')
    }, 3500)

    return () => window.clearTimeout(timer)
  }, [success])

  const subcategories = useMemo(() => {
    const categories = products.map((product) => product.subcategoria.trim()).filter(Boolean)
    return Array.from(new Set(categories)).sort((left, right) => left.localeCompare(right))
  }, [products])

  const updateQuery = (changes: Partial<ProductQueryParams>) => {
    setQuery((previous) => {
      const next = { ...previous, ...changes }
      const shouldResetPage =
        Object.prototype.hasOwnProperty.call(changes, 'nombre') ||
        Object.prototype.hasOwnProperty.call(changes, 'subcategoria') ||
        Object.prototype.hasOwnProperty.call(changes, 'estado') ||
        Object.prototype.hasOwnProperty.call(changes, 'limit')

      if (shouldResetPage) {
        next.page = 1
      }

      return next
    })
  }

  const handleOpenCreateModal = () => {
    setModalMode('create')
    setSelectedProduct(null)
    setModalError('')
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (product: Product) => {
    setModalMode('edit')
    setSelectedProduct(product)
    setModalError('')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalError('')
  }

  const handleSubmitProduct = async (payload: ProductPayload) => {
    setIsSaving(true)
    setModalError('')

    try {
      if (modalMode === 'create') {
        await productsApi.create(payload)
        setSuccess('Producto creado correctamente.')
      } else if (selectedProduct) {
        await productsApi.update(selectedProduct.id, payload)
        setSuccess('Producto actualizado correctamente.')
      }

      handleCloseModal()
      await loadProducts()
    } catch (requestError) {
      setModalError(
        extractApiErrorMessage(
          requestError,
          'No se pudo guardar el producto. Revisa los datos e intenta de nuevo.',
        ),
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `Seguro que deseas eliminar "${product.nombre}"? Esta accion no se puede deshacer.`,
    )

    if (!confirmed) {
      return
    }

    setDeletingProductId(product.id)

    try {
      await productsApi.remove(product.id)
      setSuccess('Producto eliminado correctamente.')

      if (products.length === 1 && pagination.page > 1) {
        setQuery((previous) => ({ ...previous, page: previous.page - 1 }))
      } else {
        await loadProducts()
      }
    } catch (requestError) {
      setError(
        extractApiErrorMessage(
          requestError,
          'No se pudo eliminar el producto. Intenta nuevamente.',
        ),
      )
    } finally {
      setDeletingProductId(null)
    }
  }

  const handleLogout = () => {
    clearAccessToken()
    navigate('/login', { replace: true })
  }

  return (
    <main className="products-page">
      <header className="products-header">
        <div>
          <p className="eyebrow">Panel administrativo</p>
          <h1>Productos</h1>
          <p className="products-subtitle">
            Administra catalogo, filtra resultados y controla el estado de cada producto.
          </p>
        </div>

        <div className="header-actions">
          <button type="button" className="primary-btn" onClick={handleOpenCreateModal}>
            Nuevo producto
          </button>
          <button type="button" className="secondary-btn" onClick={handleLogout}>
            Cerrar sesion
          </button>
        </div>
      </header>

      {error ? <p className="alert error">{error}</p> : null}
      {success ? <p className="alert success">{success}</p> : null}

      <ProductFilters
        filters={query}
        subcategories={subcategories}
        onChange={updateQuery}
        onClear={() => setQuery(initialQuery)}
      />

      {isLoading ? (
        <section className="panel loading-state" aria-live="polite">
          Cargando productos...
        </section>
      ) : (
        <ProductsTable
          products={products}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteProduct}
          deletingProductId={deletingProductId}
        />
      )}

      <PaginationControls
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        onPrevious={() => updateQuery({ page: Math.max(1, pagination.page - 1) })}
        onNext={() => updateQuery({ page: Math.min(pagination.totalPages, pagination.page + 1) })}
      />

      <ProductFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialProduct={selectedProduct}
        submitError={modalError}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProduct}
      />

      {isSaving ? <p className="saving-indicator">Guardando cambios...</p> : null}
    </main>
  )
}
