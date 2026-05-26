import './StatusBadge.css'

type StatusBadgeProps = {
  status: 'online' | 'offline' | 'busy'
}

const statusLabels = {
  online: 'Hoạt động',
  offline: 'Ngoại tuyến',
  busy: 'Đang khám',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-badge-${status}`}>{statusLabels[status]}</span>
}
