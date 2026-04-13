import type { ProductQueryParams } from '../../../shared/types/product'

interface ProductFiltersProps {
  filters: Pick<ProductQueryParams, 'nombre' | 'subcategoria' | 'estado'>
  subcategories: string[]
  onChange: (changes: Partial<ProductQueryParams>) => void
  onClear: () => void
}

export const ProductFilters = ({
  filters,
  subcategories,
  onChange,
  onClear,
}: ProductFiltersProps) => {
  return (
    <section className="panel" aria-label="Filtros de productos">
      <div className="panel-header">
        <h2>Busqueda y filtros</h2>
      </div>

      <div className="filters-grid">
        <label className="field-group" htmlFor="searchByName">
          Buscar por nombre
          <input
            id="searchByName"
            type="text"
            placeholder="Ej: Laptop"
            value={filters.nombre}
            onChange={(event) => onChange({ nombre: event.target.value })}
          />
        </label>

        <label className="field-group" htmlFor="filterBySubcategory">
          Subcategoria
          <select
            id="filterBySubcategory"
            value={filters.subcategoria}
            onChange={(event) => onChange({ subcategoria: event.target.value })}
          >
            <option value="">Todas</option>
            {subcategories.map((subcategory) => (
              <option value={subcategory} key={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </label>

        <label className="field-group" htmlFor="filterByStatus">
          Estado
          <select
            id="filterByStatus"
            value={filters.estado}
            onChange={(event) =>
              onChange({
                estado: event.target.value as ProductQueryParams['estado'],
              })
            }
          >
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </label>

        <button type="button" className="secondary-btn" onClick={onClear}>
          Limpiar filtros
        </button>
      </div>
    </section>
  )
}
