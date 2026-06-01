import './Pagination.css'

type PaginationProps = {
  className?: string
  currentPage: number
  pageCount?: number
  totalPages?: number
  onPageChange: (page: number) => void
}

function getVisiblePages(currentPage: number, pageCount: number) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_item, index) => index + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', pageCount] as const
  }

  if (currentPage >= pageCount - 3) {
    return [1, 'ellipsis', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount] as const
  }

  return [1, 'ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', pageCount] as const
}

function ChevronLeftIcon() {
  return (
    <svg className="pagination-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg className="pagination-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

export function Pagination({
  className,
  currentPage,
  pageCount: pageCountProp,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageCount = Math.max(1, pageCountProp ?? totalPages ?? 1)
  const visiblePages = getVisiblePages(currentPage, pageCount)

  return (
    <nav className={['ui-pagination', className].filter(Boolean).join(' ')} aria-label="Phân trang">
      <div className="ui-pagination-pages">
        <button
          className="ui-pagination-arrow"
          type="button"
          disabled={currentPage === 1}
          aria-label="Trang trước"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          <ChevronLeftIcon />
        </button>

        {visiblePages.map((page, index) =>
          typeof page === 'number' ? (
            <button
              className={page === currentPage ? 'ui-pagination-page active' : 'ui-pagination-page'}
              type="button"
              key={page}
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ) : (
            <span className="ui-pagination-ellipsis" key={`${page}-${index}`} aria-hidden="true">
              ...
            </span>
          ),
        )}

        <button
          className="ui-pagination-arrow ui-pagination-arrow-next"
          type="button"
          disabled={currentPage === pageCount}
          aria-label="Trang sau"
          onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
        >
          <ChevronRightIcon />
        </button>
      </div>
    </nav>
  )
}