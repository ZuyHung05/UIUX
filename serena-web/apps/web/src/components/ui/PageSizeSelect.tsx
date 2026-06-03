import { FilterSelect } from './FilterSelect'
import './PageSizeSelect.css'

type PageSizeSelectProps = {
  value: number
  options: number[]
  onChange: (value: number) => void
  label?: string
  suffix?: string
  className?: string
}

/**
 * Shared rows-per-page selector. Reuses the system FilterSelect pill so the
 * dropdown is visually consistent (rounded) with the filter buttons across all
 * manager pages.
 */
export function PageSizeSelect({
  value,
  options,
  onChange,
  label = 'Hiển thị',
  suffix = 'dòng / trang',
  className,
}: PageSizeSelectProps) {
  return (
    <div className={['page-size-select', className].filter(Boolean).join(' ')}>
      {label ? <span className="page-size-select-label">{label}</span> : null}
      <FilterSelect
        className="page-size-select-control"
        value={String(value)}
        options={options.map((option) => ({ value: String(option), label: String(option) }))}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {suffix ? <span className="page-size-select-label">{suffix}</span> : null}
    </div>
  )
}
