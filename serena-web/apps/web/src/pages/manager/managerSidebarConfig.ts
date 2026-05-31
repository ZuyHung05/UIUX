import type { SidebarConfig } from '../../components/layout/sidebar/types'

export const managerSidebarConfig: SidebarConfig = {
  profileRole: 'Quản lý phòng khám',
  groups: [
    {
      title: 'Tổng quan',
      items: [
        { label: 'Dashboard', icon: 'home', href: '/manager/dashboard' },
        { label: 'Báo cáo - Thống kê', icon: 'chart', href: '/manager/report' },
      ],
    },
    {
      title: 'Vận hành',
      items: [
        { label: 'Điều phối Lịch làm việc', icon: 'clock', href: '/manager/schedules' },
        { label: 'Giám sát Chatbot', icon: 'bot', href: '/manager/chatbot-monitor' },
        { label: 'Đánh giá & Phản hồi', icon: 'message', href: '/manager/feedback' },
      ],
    },
    {
      title: 'Quản trị',
      items: [
        { label: 'Quản lý Bác sĩ', icon: 'users', href: '/manager/doctors' },
        { label: 'Thiết lập Phòng khám', icon: 'building', href: '/manager/clinic-settings' },
      ],
    },
  ],
}
