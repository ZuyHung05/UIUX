export interface Patient {
  name: string
  id: string
  time: string
  fullName?: string
  gender?: 'Nam' | 'Nữ'
  age?: number
  phone?: string
  examType?: 'Tư vấn' | 'Khám trực tiếp' | 'Cả hai'
  status?: 'waiting' | 'completed' | 'in-progress' | 'priority'
  avatarColor?: string
}

export interface Shift {
  id: string
  title: string
  time: string
  count: number
  status?: string
  patients: Patient[]
}

export const MOCK_SHIFTS: Shift[] = [
  {
    id: 'morning',
    title: 'Ca sáng',
    time: '08:00 - 12:00',
    count: 8,
    status: 'Đang diễn ra',
    patients: [
      { name: 'Nguyễn Thị B', id: '#12345', time: '08:00' },
      { name: 'Lê Mạnh T', id: '#12344', time: '08:30' },
      { name: 'Trần Văn C', id: '#12346', time: '09:00' },
      { name: 'Lê Thị D', id: '#12347', time: '09:30' },
      { name: 'Phạm Văn E', id: '#12348', time: '10:00' },
      { name: 'Vũ Văn X', id: '#12399', time: '14:30' },
      { name: 'Đặng Thị Y', id: '#12400', time: '15:00' },
      { name: 'Trần Diệu N', id: '#12341', time: '15:30' },
    ],
  },
  {
    id: 'afternoon',
    title: 'Ca chiều',
    time: '14:00 - 18:00',
    count: 2,
    patients: [
      { name: 'Hoàng Văn A', id: '#12350', time: '14:00' },
      { name: 'Lý Thị K', id: '#12351', time: '15:00' },
    ],
  },
]

export const MOCK_EVENT_DATES = [
  '2024-05-06',
  '2024-05-07',
  '2024-05-08',
  '2024-05-10',
  '2024-05-13',
  '2024-05-15',
  '2024-05-20',
  '2024-05-27',
]

export const SCHEDULE_DATA: Record<string, Shift[]> = {
  '2026-05-06': [
    {
      id: 'm06_1',
      title: 'Ca sáng',
      time: '08:00 - 12:00',
      count: 3,
      patients: [{ name: 'Lê Văn C', id: '#12347', time: '09:00' }],
    },
  ],

  // Thứ 2 - Ngày 11/05/2026 (Thay cho ngày 10 cũ)
  '2026-05-11': [
    {
      id: 'm11_morning',
      title: 'Ca sáng',
      time: '08:00 - 12:00',
      count: 8,
      status: 'Đang diễn ra',
      patients: [
        { name: 'Nguyễn Thị B', id: '#12345', time: '08:00' },
        { name: 'Trần Văn C', id: '#12346', time: '09:00' },
      ],
    },
    {
      id: 'm11_afternoon',
      title: 'Ca chiều',
      time: '14:00 - 18:00',
      count: 6,
      patients: [{ name: 'Phạm Văn E', id: '#12348', time: '14:30' }],
    },
  ],

  // Thứ 6 - Ngày 15/05/2026
  '2026-05-15': [
    {
      id: 'a15_1',
      title: 'Ca chiều',
      time: '14:00 - 18:00',
      count: 2,
      patients: [{ name: 'Hoàng Văn A', id: '#12350', time: '15:00' }],
    },
  ],

  // Thứ 4 - Ngày 20/05/2026
  '2026-05-20': [{ id: 'm20_1', title: 'Ca sáng', time: '08:00 - 12:00', count: 1, patients: [] }],

  // Thứ 4 - Ngày 27/05/2026
  '2026-05-27': [{ id: 'm27_1', title: 'Ca sáng', time: '08:00 - 12:00', count: 4, patients: [] }],
}
