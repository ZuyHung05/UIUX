import type { SidebarConfig } from '../../components/layout/sidebar/types'

export const doctorSidebarConfig: SidebarConfig = {
  profileRole: 'Bác sĩ',
  activeLabel: 'Tư vấn trực tiếp',
  groups: [
    {
      title: 'Tổng quan',
      items: [{ label: 'Dashboard', icon: 'home', href: '/doctor/dashboard?tab=Dashboard' }],
    },
    {
      title: 'Khám & tư vấn',
      items: [
        { label: 'Tư vấn trực tiếp', icon: 'message', href: '/doctor/dashboard?tab=Tư vấn trực tiếp' },
        { label: 'Danh sách bệnh nhân', icon: 'users', href: '/doctor/dashboard?tab=Danh sách bệnh nhân' },
      ],
    },
    {
      title: 'Lịch trình',
      items: [
        { label: 'Lịch làm việc', icon: 'calendar', href: '/doctor/dashboard?tab=Lịch làm việc' },
      ],
    },
  ],
}

