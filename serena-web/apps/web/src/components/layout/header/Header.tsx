import { useEffect, useMemo, useRef, useState } from 'react'
import './Header.css'

type HeaderProps = {
  profileRole: string
}

type NotificationItem = {
  id: string
  title: string
  body: string
  time: string
  unread?: boolean
}

const managerNotifications: NotificationItem[] = [
  {
    id: 'manager-schedule',
    title: 'Lịch làm việc cần duyệt',
    body: 'Có 3 ca trực mới được đề xuất cho chi nhánh Hà Nội.',
    time: '10 phút trước',
    unread: true,
  },
  {
    id: 'manager-chatbot',
    title: 'Cảnh báo Chatbot',
    body: 'Một phiên tư vấn có đánh giá thấp cần kiểm tra.',
    time: '35 phút trước',
    unread: true,
  },
  {
    id: 'manager-report',
    title: 'Báo cáo ngày đã sẵn sàng',
    body: 'Doanh thu và tỷ lệ hoàn tất lịch khám đã được cập nhật.',
    time: 'Hôm nay',
  },
]

const doctorNotifications: NotificationItem[] = [
  {
    id: 'doctor-consultation',
    title: 'Ca tư vấn mới',
    body: 'Bệnh nhân Nguyễn Thị Lan đang chờ tư vấn trực tiếp.',
    time: '5 phút trước',
    unread: true,
  },
  {
    id: 'doctor-appointment',
    title: 'Lịch hẹn sắp tới',
    body: 'Bạn có lịch khám lúc 14:30 tại phòng khám số 2.',
    time: '20 phút trước',
    unread: true,
  },
  {
    id: 'doctor-record',
    title: 'Hồ sơ bệnh án cập nhật',
    body: 'Kết quả xét nghiệm của bệnh nhân đã được bổ sung.',
    time: 'Hôm nay',
  },
]

export function Header({ profileRole }: HeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const normalizedRole = profileRole.toLowerCase()
  const isDoctor = normalizedRole.includes('bác sĩ') || normalizedRole.includes('bÃ¡c sÄ©')
  const profileName = isDoctor ? 'Nguyễn Minh Anh' : 'Trần Hoài Nam'
  const notifications = useMemo(() => (isDoctor ? doctorNotifications : managerNotifications), [isDoctor])
  const unreadCount = notifications.filter((item) => item.unread).length

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (!notificationRef.current?.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    return () => document.removeEventListener('mousedown', handleDocumentClick)
  }, [])

  return (
    <header className="app-header">
      <div className="header-profile">
        <div className="notification-menu" ref={notificationRef}>
          <button
            className={unreadCount > 0 ? 'notification-button has-unread' : 'notification-button'}
            type="button"
            aria-expanded={isNotificationOpen}
            aria-haspopup="menu"
            aria-label={`Thông báo${unreadCount > 0 ? `, ${unreadCount} thông báo mới` : ''}`}
            onClick={() => setIsNotificationOpen((current) => !current)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5.2c-2.76 0-5 2.24-5 5v2.46c0 .82-.3 1.61-.84 2.23L5 16.2h14l-1.16-1.31a3.4 3.4 0 0 1-.84-2.23V10.2c0-2.76-2.24-5-5-5Z" />
              <path d="M10.25 19a2 2 0 0 0 3.5 0" />
              <path d="M12 3.5v1.7" />
            </svg>
          </button>

          {isNotificationOpen ? (
            <div className="notification-dropdown" role="menu" aria-label="Danh sách thông báo">
              <div className="notification-dropdown-head">
                <div>
                  <strong>Thông báo</strong>
                  <span>{unreadCount} thông báo mới</span>
                </div>
              </div>
              <div className="notification-list">
                {notifications.map((item) => (
                  <button
                    className={item.unread ? 'notification-item is-unread' : 'notification-item'}
                    key={item.id}
                    type="button"
                    role="menuitem"
                  >
                    <span className="notification-item-dot" aria-hidden="true" />
                    <span className="notification-item-copy">
                      <strong>{item.title}</strong>
                      <span>{item.body}</span>
                      <time>{item.time}</time>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="profile-text">
          <strong>{profileName}</strong>
          <span>{profileRole}</span>
        </div>
        <div className="profile-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path d="M5 21a7 7 0 0 1 14 0v1H5v-1Z" />
          </svg>
        </div>
      </div>
    </header>
  )
}
