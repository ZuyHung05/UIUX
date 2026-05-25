export interface Patient {
  name: string
  id: string
  time: string
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
      { name: 'Trần Văn C', id: '#12346', time: '09:00' },
      { name: 'Lê Thị D', id: '#12347', time: '09:30' },
      { name: 'Phạm Văn E', id: '#12348', time: '10:00' },
    ],
  },
  {
    id: 'afternoon',
    title: 'Ca chiều',
    time: '14:00 - 18:00',
    count: 6,
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
  '2026-06-06': [{ id: 'm1', title: 'Ca sáng', time: '08:00 - 12:00', count: 5, patients: [] }],
  '2026-06-10': [
    {
      id: 'm2',
      title: 'Ca sáng',
      time: '08:00 - 12:00',
      count: 8,
      status: 'Đang diễn ra',
      patients: [
        /* list patients */
      ],
    },
    {
      id: 'a2',
      title: 'Ca chiều',
      time: '14:00 - 18:00',
      count: 6,
      patients: [
        /* list patients */
      ],
    },
  ],
  '2026-06-15': [{ id: 'a3', title: 'Ca chiều', time: '14:00 - 18:00', count: 3, patients: [] }],
  '2026-05-06': [{ id: 'm1', title: 'Ca sáng', time: '08:00 - 12:00', count: 5, patients: [] }],

  '2026-05-10': [
    {
      id: 'm2',
      title: 'Ca sáng',
      time: '08:00 - 12:00',
      count: 8,
      status: 'Đang diễn ra',
      patients: [
        /* list patients */
      ],
    },
    {
      id: 'a2',
      title: 'Ca chiều',
      time: '14:00 - 18:00',
      count: 6,
      patients: [
        /* list patients */
      ],
    },
  ],

  '2026-05-15': [
    {
      id: 'a3',
      title: 'Ca chiều',
      time: '14:00 - 18:00',
      count: 3,
      patients: [],
    },
  ],
}
