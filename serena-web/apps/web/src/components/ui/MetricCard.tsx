import type { ReactNode } from 'react'
import './MetricCard.css'

export type MetricCardProps = {
  label: string
  value: string | number
  delta?: string
  deltaTrend?: 'positive' | 'negative' | 'neutral'
  icon: ReactNode
  iconClassName?: string
}

export function MetricCard({ label, value, delta, deltaTrend = 'neutral', icon, iconClassName = '' }: MetricCardProps) {
  return (
    <article className="metric-card">
      <div className={['metric-icon', iconClassName].filter(Boolean).join(' ')}>{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        {delta ? <span className={`metric-delta metric-delta-${deltaTrend}`}>{delta}</span> : null}
      </div>
    </article>
  )
}
