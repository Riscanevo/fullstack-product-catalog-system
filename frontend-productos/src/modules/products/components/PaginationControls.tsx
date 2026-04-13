interface PaginationControlsProps {
  page: number
  totalPages: number
  total: number
  onPrevious: () => void
  onNext: () => void
}

export const PaginationControls = ({
  page,
  totalPages,
  total,
  onPrevious,
  onNext,
}: PaginationControlsProps) => {
  return (
    <section className="pagination" aria-label="Paginacion">
      <p>
        Pagina {page} de {totalPages} - {total} producto{total === 1 ? '' : 's'}
      </p>

      <div className="pagination-actions">
        <button type="button" className="secondary-btn" onClick={onPrevious} disabled={page <= 1}>
          Anterior
        </button>
        <button
          type="button"
          className="secondary-btn"
          onClick={onNext}
          disabled={page >= totalPages}
        >
          Siguiente
        </button>
      </div>
    </section>
  )
}
