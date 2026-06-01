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
