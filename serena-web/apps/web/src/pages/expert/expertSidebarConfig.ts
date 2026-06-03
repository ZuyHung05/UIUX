import type { SidebarConfig } from '../../components/layout/sidebar/types'

export function getExpertSidebarConfig(activeLabel: string): SidebarConfig {
  return {
    profileRole: 'Chuyên gia',
    activeLabel,
    groups: [
      {
        title: 'Tổng quan',
        items: [{ label: 'Dashboard', icon: 'home', href: '/dashboard' }],
      },
      {
        title: 'Kiểm tra & Xử lý lỗi',
        items: [
          { label: 'Rà soát hội thoại', icon: 'message', href: '/conversations' },
          { label: 'Lỗi đã đánh dấu', icon: 'list', href: '/errors' },
          { label: 'Lịch sử xử lý', icon: 'clock', href: '/processing-history' },
        ],
      },
      {
        title: 'Dữ liệu chatbot',
        items: [
          { label: 'Kho tri thức y khoa', icon: 'building', href: '/knowledge' },
          { label: 'Dữ liệu train chatbot', icon: 'bot', href: '/training-data' },
        ],
      },
    ],
  }
}
