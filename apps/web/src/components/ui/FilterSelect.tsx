import React, { useState } from 'react'
import './FilterButton.css'
import './FilterSelect.css'

export type FilterOption = {
  value: string
  label: string
}

export type FilterSelectProps = {
  options: FilterOption[]
  defaultValue?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export function FilterSelect({ options, defaultValue, value, onChange }: FilterSelectProps) {
  const [internalVal, setInternalVal] = useState(defaultValue || options[0]?.value)
  const currentVal = value !== undefined ? value : internalVal

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (value === undefined) setInternalVal(e.target.value)
    if (onChange) onChange(e)
  }

  const selectedLabel = options.find((o) => o.value === currentVal)?.label || 'Chọn...'

  return (
    <div className="filter-select-wrapper">
      <button className="date-filter-button" type="button" tabIndex={-1}>
        <svg className="date-filter-menu-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 7h14M5 12h10M5 17h14" />
        </svg>
        <span>{selectedLabel}</span>
        <svg className="date-filter-chevron" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <select
        className="filter-select-native"
        value={currentVal}
        onChange={handleSelectChange}
        title="Filter options"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
