import './SegmentedTabs.css'

export type SegmentedTabOption<T extends string> = {
  value: T
  label: string
}

type SegmentedTabsProps<T extends string> = {
  options: Array<SegmentedTabOption<T>>
  value: T
  ariaLabel: string
  onChange: (value: T) => void
  className?: string
}

export function SegmentedTabs<T extends string>({
  options,
  value,
  ariaLabel,
  onChange,
  className,
}: SegmentedTabsProps<T>) {
  return (
    <div className={['segmented-tabs', className].filter(Boolean).join(' ')} role="tablist" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          className={value === option.value ? 'is-active' : undefined}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
