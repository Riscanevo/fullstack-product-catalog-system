import type { Product } from '../../../shared/types/product'

interface ProductsTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  deletingProductId: string | null
}

const formatMoney = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

export const ProductsTable = ({
  products,
  onEdit,
  onDelete,
  deletingProductId,
}: ProductsTableProps) => {
  return (
    <section className="panel" aria-label="Listado de productos">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Subcategoria</th>
              <th>Precio</th>
              <th>Precio por cantidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-cell">
                  No se encontraron productos para los filtros aplicados.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.nombre}</td>
                  <td>{product.descripcion}</td>
                  <td>{product.subcategoria}</td>
                  <td>{formatMoney(product.precio)}</td>
                  <td>{formatMoney(product.precioxcantidad)}</td>
                  <td>
                    <span
                      className={`badge ${
                        product.estado === 'activo' ? 'badge-active' : 'badge-inactive'
                      }`}
                    >
                      {product.estado}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="table-btn"
                        onClick={() => onEdit(product)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="table-btn danger"
                        onClick={() => onDelete(product)}
                        disabled={deletingProductId === product.id}
                      >
                        {deletingProductId === product.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
