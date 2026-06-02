export type BranchId = 'hanoi' | 'danang' | 'hochiminh'

export type BranchInfo = {
  id: BranchId
  name: string
  shortName: string
  address: string
  phone: string
  manager: string
  timezone: string
}

export type BranchDashboardPeriod = 'today' | 'week' | 'month'

export type BranchDashboardMetric = {
  aiConsults: number
  doctorConsults: number
  appointments: number
  revenue: number
  conversion: number
}

export const branchMockData: BranchInfo[] = [
  {
    id: 'hanoi',
    name: 'Chi nhánh Hà Nội',
    shortName: 'Hà Nội',
    address: '24 Trần Duy Hưng, Cầu Giấy, Hà Nội',
    phone: '024 3824 2026',
    manager: 'Nguyễn Minh Châu',
    timezone: 'Asia/Bangkok',
  },
  {
    id: 'danang',
    name: 'Chi nhánh Đà Nẵng',
    shortName: 'Đà Nẵng',
    address: '18 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
    phone: '0236 365 2026',
    manager: 'Lê Quốc Bảo',
    timezone: 'Asia/Bangkok',
  },
  {
    id: 'hochiminh',
    name: 'Chi nhánh Hồ Chí Minh',
    shortName: 'Hồ Chí Minh',
    address: '102 Nguyễn Đình Chiểu, Quận 3, TP.HCM',
    phone: '028 3930 2026',
    manager: 'Trần Thu Hà',
    timezone: 'Asia/Bangkok',
  },
]

export type Branch = (typeof branchMockData)[number]['name']

export const branchNames = branchMockData.map((branch) => branch.name) as Branch[]

export const branchDashboardMetrics: Record<BranchDashboardPeriod, Record<BranchId, BranchDashboardMetric>> = {
  today: {
    hanoi: { aiConsults: 156, doctorConsults: 58, appointments: 42, revenue: 54, conversion: 26.9 },
    danang: { aiConsults: 128, doctorConsults: 44, appointments: 31, revenue: 39, conversion: 23.8 },
    hochiminh: { aiConsults: 202, doctorConsults: 78, appointments: 65, revenue: 71, conversion: 31.4 },
  },
  week: {
    hanoi: { aiConsults: 1120, doctorConsults: 512, appointments: 438, revenue: 542, conversion: 27.8 },
    danang: { aiConsults: 920, doctorConsults: 398, appointments: 318, revenue: 382, conversion: 23.4 },
    hochiminh: { aiConsults: 1412, doctorConsults: 648, appointments: 561, revenue: 688, conversion: 30.6 },
  },
  month: {
    hanoi: { aiConsults: 4860, doctorConsults: 2148, appointments: 1812, revenue: 2180, conversion: 27.2 },
    danang: { aiConsults: 3820, doctorConsults: 1586, appointments: 1325, revenue: 1620, conversion: 22.9 },
    hochiminh: { aiConsults: 6140, doctorConsults: 2762, appointments: 2268, revenue: 2790, conversion: 29.8 },
  },
}
