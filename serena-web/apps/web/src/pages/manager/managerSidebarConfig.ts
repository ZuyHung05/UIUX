import type { SidebarConfig } from '../../components/layout/sidebar/types'

export const managerSidebarConfig: SidebarConfig = {
  profileRole: 'Quản lý phòng khám',
  groups: [
    {
      title: 'Tổng quan',
      items: [{ label: 'Dashboard', icon: 'home', href: '/manager/dashboard' }],
    },
    {
      title: 'Vận hành phòng khám',
      items: [
        { label: 'Điều phối Lịch làm việc', icon: 'clock', href: '/manager/schedules' },
        { label: 'Giám sát Chatbot', icon: 'bot', href: '/manager/chatbot-monitor' },
      ],
    },
    {
      title: 'Quản trị',
      items: [
        { label: 'Danh sách Chi nhánh', icon: 'building', href: '/manager/branches' },
        { label: 'Danh sách Bác sĩ', icon: 'users', href: '/manager/doctors' },
        { label: 'Dịch vụ & Bảng giá', icon: 'list', href: '/manager/services' },
      ],
    },
    {
      title: 'Báo cáo',
      items: [{ label: 'Báo cáo - Thống kê', icon: 'chart', href: '/manager/report' }],
    },
  ],
}
