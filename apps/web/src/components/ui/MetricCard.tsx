import React from 'react'
import './MetricCard.css'

export type MetricIconName = 'message' | 'clock' | 'pulse' | 'currency' | 'star'

export type MetricCardProps = {
  label: string
  value: string | number
  delta: string
  tone: 'blue' | 'yellow' | 'green' | 'pink' | string
  icon: MetricIconName
}

function MetricIcon({ icon }: { icon: MetricIconName }) {
  const paths = {
    message: <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H10l-5 4V6.5Z" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5v4.8l3.2 1.9" />
      </>
    ),
    pulse: <path d="M4 13h3.5l2-6 4 11 2.3-5H20" />,
    currency: (
      <path d="M12 4v16M16 8.5c-.9-1-2.2-1.5-3.8-1.5-2 0-3.4 1-3.4 2.5 0 3.8 7.4 1.8 7.4 5.8 0 1.7-1.5 2.8-3.8 2.8-1.9 0-3.4-.6-4.4-1.8" />
    ),
    star: (
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    ),
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill={icon === 'star' ? 'currentColor' : 'none'}>
      {paths[icon]}
    </svg>
  )
}

export function MetricCard({ label, value, delta, tone, icon }: MetricCardProps) {
  return (
    <article className="metric-card">
      <div className={`metric-icon metric-icon-${tone}`}>
        <MetricIcon icon={icon} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{delta}</span>
      </div>
    </article>
  )
}
