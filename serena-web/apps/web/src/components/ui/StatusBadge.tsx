import './StatusBadge.css'

export type StatusBadgeTone =
  | 'active'
  | 'inactive'
  | 'online'
  | 'offline'
  | 'busy'
  | 'waiting'
  | 'completed'
  | 'in-progress'
  | 'priority'

type StatusBadgeProps = {
  status: StatusBadgeTone
  label?: string
}

const statusLabels: Record<StatusBadgeTone, string> = {
  active: 'Đang hoạt động',
  inactive: 'Tạm ngưng',
  online: 'Hoạt động',
  offline: 'Ngoại tuyến',
  busy: 'Đang khám',
  waiting: 'Đang chờ',
  completed: 'Đã kết thúc',
  'in-progress': 'Đang khám',
  priority: 'Ưu tiên cao',
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const displayLabel = label || statusLabels[status]

  return (
    <span className={`status-badge status-badge-${status}`} title={displayLabel}>
      <span className="status-badge-dot" aria-hidden="true" />
      <span className="status-badge-label">{displayLabel}</span>
    </span>
  )
}
