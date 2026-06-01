import { useMemo, useState } from 'react'
import { Header } from '../../../components/layout/header/Header'
import { Sidebar } from '../../../components/layout/sidebar/Sidebar'
import '../../../components/layout/DesktopShell.css'
import { IconButton, PrimaryButton } from '../../../components/ui/ActionButton'
import { FilterSelect } from '../../../components/ui/FilterSelect'
import { SearchInput } from '../../../components/ui/SearchInput'
import { SegmentedTabs } from '../../../components/ui/SegmentedTabs'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { useToast } from '../../../components/ui/Toast'
import { managerSidebarConfig } from '../managerSidebarConfig'
import './ManagerServicesPricingPage.css'

type ClinicTab = 'branches' | 'specialties' | 'services'
type Status = 'active' | 'inactive'

type Branch = {
  id: string
  name: string
  address: string
  phone: string
  manager: string
  hours: string
  doctorCount: number
  roomCount: number
  monthlyRevenue: number
  satisfaction: string
  status: Status
}

type Specialty = {
  id: string
  name: string
  description: string
  leadDoctor: string
  branchCount: number
  serviceCount: number
  status: Status
}

type ClinicService = {
  id: string
  name: string
  description: string
  billing: 'free' | 'paid'
  feeLabel: string
  unit: string
  accent: 'blue' | 'mint' | 'rose'
  status: Status
}

const branches: Branch[] = [
  {
    id: 'CN-01',
    name: 'Chi nhánh Quận 1',
    address: '18 Nguyễn Du, Phường Bến Nghé, Quận 1',
    phone: '028 3822 1901',
    manager: 'Nguyễn Hoài An',
    hours: '07:30 - 20:00',
    doctorCount: 18,
    roomCount: 12,
    monthlyRevenue: 520000000,
    satisfaction: '4.8/5',
    status: 'active',
  },
  {
    id: 'CN-02',
    name: 'Chi nhánh Thủ Đức',
    address: '42 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức',
    phone: '028 3722 4508',
    manager: 'Trần Minh Khoa',
    hours: '08:00 - 19:30',
    doctorCount: 14,
    roomCount: 9,
    monthlyRevenue: 385000000,
    satisfaction: '4.7/5',
    status: 'active',
  },
  {
    id: 'CN-03',
    name: 'Chi nhánh Bình Thạnh',
    address: '96 Nguyễn Gia Trí, Phường 25, Bình Thạnh',
    phone: '028 3512 7780',
    manager: 'Lê Thu Hà',
    hours: '08:00 - 18:00',
    doctorCount: 9,
    roomCount: 6,
    monthlyRevenue: 248000000,
    satisfaction: '4.5/5',
    status: 'inactive',
  },
]

const specialties: Specialty[] = [
  {
    id: 'CK-01',
    name: 'Tim mạch',
    description: 'Khám, theo dõi và tư vấn các bệnh lý tim mạch thường gặp.',
    leadDoctor: 'BS. Trần Văn Nam',
    branchCount: 3,
    serviceCount: 8,
    status: 'active',
  },
  {
    id: 'CK-02',
    name: 'Nhi khoa',
    description: 'Chăm sóc sức khỏe trẻ em, dinh dưỡng và theo dõi phát triển.',
    leadDoctor: 'BS. Hoàng Quốc Việt',
    branchCount: 2,
    serviceCount: 6,
    status: 'active',
  },
  {
    id: 'CK-03',
    name: 'Da liễu',
    description: 'Tư vấn, điều trị và chăm sóc các vấn đề về da.',
    leadDoctor: 'BS. Phạm Thanh Hà',
    branchCount: 2,
    serviceCount: 7,
    status: 'active',
  },
  {
    id: 'CK-04',
    name: 'Tai Mũi Họng',
    description: 'Khám chuyên khoa, nội soi và điều trị bệnh lý hô hấp trên.',
    leadDoctor: 'BS. Đỗ Minh Quân',
    branchCount: 1,
    serviceCount: 5,
    status: 'inactive',
  },
]

const services: ClinicService[] = [
  {
    id: 'DV-01',
    name: 'Tư vấn Chatbot',
    description: 'Tư vấn ban đầu tự động, sàng lọc triệu chứng và gợi ý bước xử lý tiếp theo.',
    billing: 'free',
    feeLabel: 'Miễn phí',
    unit: '',
    accent: 'mint',
    status: 'active',
  },
  {
    id: 'DV-02',
    name: 'Tư vấn Bác sĩ',
    description: 'Kết nối bệnh nhân với bác sĩ để tư vấn chuyên môn trực tuyến.',
    billing: 'paid',
    feeLabel: '150.000',
    unit: 'VNĐ/ca',
    accent: 'blue',
    status: 'active',
  },
  {
    id: 'DV-03',
    name: 'Đặt lịch hẹn khám',
    description: 'Cho phép bệnh nhân chọn chi nhánh, chuyên khoa, bác sĩ và khung giờ khám.',
    billing: 'paid',
    feeLabel: '200.000',
    unit: 'VNĐ/lượt',
    accent: 'rose',
    status: 'active',
  },
]

const tabs: Array<{ id: ClinicTab; label: string }> = [
  { id: 'branches', label: 'Chi nhánh' },
  { id: 'specialties', label: 'Chuyên khoa' },
  { id: 'services', label: 'Dịch vụ' },
]

const branchFilters = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'inactive', label: 'Tạm ngưng' },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20Z" />
      <path d="m13.5 6 4.5 4.5" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg className={open ? 'is-open' : undefined} viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function ClinicIcon({ tone }: { tone: 'blue' | 'mint' | 'rose' }) {
  return (
    <span className={`clinic-item-icon clinic-item-icon-${tone}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5.5" y="4" width="9.5" height="16" rx="1.5" />
        <path d="M15 9h4v11M8.5 8h3.5M8.5 12h3.5M8.5 16h3.5" />
      </svg>
    </span>
  )
}

function ServiceIcon({ serviceId }: { serviceId: string }) {
  if (serviceId === 'DV-01') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="8" width="14" height="10" rx="3" />
        <path d="M12 8V5M9.2 13h.01M14.8 13h.01M8.5 18l-1.5 2M15.5 18l1.5 2" />
      </svg>
    )
  }

  if (serviceId === 'DV-02') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.5" y="5" width="15" height="12" rx="2.5" />
        <path d="M8 20h8M12 17v3M9.5 11h5M12 8.5v5" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.5" y="5.5" width="15" height="14" rx="2" />
      <path d="M8 3.5v4M16 3.5v4M4.5 10h15M9 15l2 2 4-4" />
    </svg>
  )
}

export function ManagerServicesPricingPage() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<ClinicTab>('branches')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [expandedBranchId, setExpandedBranchId] = useState<string | null>(null)

  const normalizedQuery = query.trim().toLowerCase()

  const filteredBranches = useMemo(
    () =>
      branches.filter((branch) => {
        const matchesStatus = status === 'all' || branch.status === status
        const matchesQuery =
          !normalizedQuery ||
          branch.name.toLowerCase().includes(normalizedQuery) ||
          branch.address.toLowerCase().includes(normalizedQuery) ||
          branch.manager.toLowerCase().includes(normalizedQuery)

        return matchesStatus && matchesQuery
      }),
    [normalizedQuery, status],
  )

  const filteredSpecialties = useMemo(
    () =>
      specialties.filter((specialty) => {
        const matchesStatus = status === 'all' || specialty.status === status
        const matchesQuery =
          !normalizedQuery ||
          specialty.name.toLowerCase().includes(normalizedQuery) ||
          specialty.leadDoctor.toLowerCase().includes(normalizedQuery)

        return matchesStatus && matchesQuery
      }),
    [normalizedQuery, status],
  )

  const filteredServices = useMemo(
    () =>
      services.filter((service) => {
        const matchesStatus = status === 'all' || service.status === status
        const matchesQuery =
          !normalizedQuery ||
          service.name.toLowerCase().includes(normalizedQuery) ||
          service.description.toLowerCase().includes(normalizedQuery) ||
          service.id.toLowerCase().includes(normalizedQuery)

        return matchesStatus && matchesQuery
      }),
    [normalizedQuery, status],
  )

  const tabCount =
    activeTab === 'branches'
      ? filteredBranches.length
      : activeTab === 'specialties'
        ? filteredSpecialties.length
        : filteredServices.length

  return (
    <div className="desktop-shell-page services-pricing-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main className="desktop-shell-main services-pricing-main" aria-label="Cấu hình phòng khám">
        <section className="clinic-settings-content">
          <div className="clinic-settings-heading">
            <div>
              <h1>Cấu hình Phòng khám</h1>
              <p>Quản lý thông tin nền tảng của hệ thống: chi nhánh, chuyên khoa và dịch vụ.</p>
            </div>
          </div>

          <SegmentedTabs
            className="clinic-tabs"
            options={tabs.map((tab) => ({ value: tab.id, label: tab.label }))}
            value={activeTab}
            ariaLabel="Nhóm thiết lập phòng khám"
            onChange={(nextTab) => {
              setActiveTab(nextTab)
              setQuery('')
              setStatus('all')
              setExpandedBranchId(null)
            }}
          />

          <section className="clinic-panel">
            <div className="clinic-panel-toolbar">
              <div>
                <h2>{tabs.find((tab) => tab.id === activeTab)?.label}</h2>
                <span>{tabCount} mục đang hiển thị</span>
              </div>
            </div>

            <div className="clinic-toolbar">
              <div className="clinic-panel-filters">
                <SearchInput value={query} onChange={setQuery} placeholder="Tìm nhanh..." />
                <FilterSelect
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  options={branchFilters}
                />
              </div>
              <div className="clinic-toolbar-actions">
                <PrimaryButton
                  onClick={() =>
                    showToast(
                      activeTab === 'branches'
                        ? 'Mở form thêm chi nhánh mới.'
                        : activeTab === 'specialties'
                          ? 'Mở form thêm chuyên khoa mới.'
                          : 'Mở form thêm dịch vụ mới.',
                      'success',
                    )
                  }
                >
                  <PlusIcon />
                  {activeTab === 'branches'
                    ? 'Thêm chi nhánh'
                    : activeTab === 'specialties'
                      ? 'Thêm chuyên khoa'
                      : 'Thêm dịch vụ'}
                </PrimaryButton>
              </div>
            </div>

            {activeTab === 'branches' ? (
              <div className="clinic-branch-grid">
                {filteredBranches.map((branch) => (
                  <article className="clinic-branch-card" key={branch.id}>
                    <div className="clinic-card-head">
                      <ClinicIcon tone="blue" />
                      <StatusBadge status={branch.status} />
                    </div>
                    <div className="clinic-card-title">
                      <span>{branch.id}</span>
                      <h3>{branch.name}</h3>
                    </div>
                    <dl className="clinic-info-list">
                      <div>
                        <dt>Địa chỉ</dt>
                        <dd>{branch.address}</dd>
                      </div>
                      <div>
                        <dt>Điện thoại</dt>
                        <dd>{branch.phone}</dd>
                      </div>
                      <div>
                        <dt>Quản lý</dt>
                        <dd>{branch.manager}</dd>
                      </div>
                      <div>
                        <dt>Giờ mở cửa</dt>
                        <dd>{branch.hours}</dd>
                      </div>
                    </dl>
                    <div className="clinic-card-actions">
                      <button
                        className="clinic-detail-toggle"
                        type="button"
                        aria-expanded={expandedBranchId === branch.id}
                        onClick={() => setExpandedBranchId((current) => (current === branch.id ? null : branch.id))}
                      >
                        {expandedBranchId === branch.id ? 'Thu gọn' : 'Xem chi tiết'}
                        <ChevronIcon open={expandedBranchId === branch.id} />
                      </button>
                      <IconButton label={`Chỉnh sửa ${branch.name}`} onClick={() => showToast(`Mở chỉnh sửa ${branch.name}.`, 'info')}>
                        <EditIcon />
                      </IconButton>
                    </div>
                    {expandedBranchId === branch.id ? (
                      <div className="clinic-branch-details">
                        <div>
                          <span>Bác sĩ</span>
                          <strong>{branch.doctorCount}</strong>
                        </div>
                        <div>
                          <span>Phòng chức năng</span>
                          <strong>{branch.roomCount}</strong>
                        </div>
                        <div>
                          <span>Doanh thu tháng</span>
                          <strong>{formatCurrency(branch.monthlyRevenue)} đ</strong>
                        </div>
                        <div>
                          <span>Hài lòng</span>
                          <strong>{branch.satisfaction}</strong>
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : null}

            {activeTab === 'specialties' ? (
              <div className="clinic-list">
                {filteredSpecialties.map((specialty) => (
                  <article className="clinic-list-row" key={specialty.id}>
                    <ClinicIcon tone="mint" />
                    <div className="clinic-list-main">
                      <span>{specialty.id}</span>
                      <h3>{specialty.name}</h3>
                      <p>{specialty.description}</p>
                    </div>
                    <div className="clinic-row-meta">
                      <span>Phụ trách</span>
                      <strong>{specialty.leadDoctor}</strong>
                    </div>
                    <div className="clinic-row-mini">
                      <span>{specialty.branchCount} chi nhánh</span>
                      <span>{specialty.serviceCount} dịch vụ</span>
                    </div>
                    <StatusBadge status={specialty.status} />
                    <IconButton label={`Chỉnh sửa ${specialty.name}`} onClick={() => showToast(`Mở chỉnh sửa chuyên khoa ${specialty.name}.`, 'info')}>
                      <EditIcon />
                    </IconButton>
                  </article>
                ))}
              </div>
            ) : null}

            {activeTab === 'services' ? (
              <div className="clinic-service-grid">
                {filteredServices.map((service) => (
                  <article className="clinic-service-card" key={service.id}>
                    <div className="clinic-card-head">
                      <span className={`clinic-item-icon clinic-item-icon-${service.accent}`}>
                        <ServiceIcon serviceId={service.id} />
                      </span>
                      <StatusBadge status={service.status} />
                    </div>
                    <div className="clinic-card-title">
                      <span>{service.id}</span>
                      <h3>{service.name}</h3>
                    </div>
                    <p className="clinic-service-description">{service.description}</p>
                    <div className="clinic-service-meta">
                      <span>{service.billing === 'free' ? 'Miễn phí' : 'Trả phí'}</span>
                      <strong>
                        {service.feeLabel}
                        {service.unit ? <small>{service.unit}</small> : null}
                      </strong>
                    </div>
                    <div className="clinic-card-actions">
                      <span className={`clinic-billing-pill clinic-billing-${service.billing}`}>
                        {service.billing === 'free' ? 'Dịch vụ miễn phí' : 'Có thu phí'}
                      </span>
                      <IconButton label={`Chỉnh sửa ${service.name}`} onClick={() => showToast(`Mở chỉnh sửa dịch vụ ${service.name}.`, 'info')}>
                        <EditIcon />
                      </IconButton>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        </section>
      </main>
    </div>
  )
}
