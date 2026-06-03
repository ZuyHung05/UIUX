import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { Header } from '../../../components/layout/header/Header'
import { Sidebar } from '../../../components/layout/sidebar/Sidebar'
import '../../../components/layout/DesktopShell.css'
import { IconButton, PrimaryButton } from '../../../components/ui/ActionButton'
import { DetailModal } from '../../../components/ui/DetailModal'
import { FilterSelect } from '../../../components/ui/FilterSelect'
import { SearchInput } from '../../../components/ui/SearchInput'
import { SegmentedTabs } from '../../../components/ui/SegmentedTabs'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { useToast } from '../../../components/ui/Toast'
import { branchDashboardMetrics, branchMockData } from '../../../data/branchMockData'
import { managerSidebarConfig } from '../managerSidebarConfig'
import './ManagerServicesPricingPage.css'

type ClinicTab = 'branches' | 'specialties' | 'services'
type Status = 'active' | 'inactive'
type BranchFormField = keyof BranchFormState
type SpecialtyFormField = keyof SpecialtyFormState
type ServiceFormField = keyof ServiceFormState

type Branch = {
  id: string
  sourceId: string
  name: string
  address: string
  phone: string
  manager: string
  hours: string
  doctorCount: number
  roomCount: number
  monthlyRevenue: number
  satisfaction: string
  timezone: string
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

type BranchFormState = Omit<Branch, 'id' | 'sourceId' | 'doctorCount' | 'roomCount' | 'monthlyRevenue'>
type SpecialtyFormState = Omit<Specialty, 'id' | 'branchCount' | 'serviceCount'>
type ServiceFormState = Omit<ClinicService, 'id' | 'accent'>

type ModalState =
  | { mode: 'closed' }
  | { mode: 'view-branch'; branch: Branch }
  | { mode: 'add-branch'; values: BranchFormState }
  | { mode: 'edit-branch'; branchId: string; values: BranchFormState }
  | { mode: 'add-specialty'; values: SpecialtyFormState }
  | { mode: 'edit-specialty'; specialtyId: string; values: SpecialtyFormState }
  | { mode: 'add-service'; values: ServiceFormState }
  | { mode: 'edit-service'; serviceId: string; values: ServiceFormState }

const operationalByBranchId: Record<string, Pick<Branch, 'hours' | 'doctorCount' | 'roomCount' | 'satisfaction' | 'status'>> = {
  hanoi: {
    hours: '07:30 - 20:00',
    doctorCount: 18,
    roomCount: 12,
    satisfaction: '4.8/5',
    status: 'active',
  },
  danang: {
    hours: '08:00 - 19:30',
    doctorCount: 14,
    roomCount: 9,
    satisfaction: '4.7/5',
    status: 'active',
  },
  hochiminh: {
    hours: '08:00 - 18:00',
    doctorCount: 16,
    roomCount: 11,
    satisfaction: '4.6/5',
    status: 'active',
  },
}

const initialBranches: Branch[] = branchMockData.map((branch, index) => {
  const operations = operationalByBranchId[branch.id]

  return {
    id: `CN-${String(index + 1).padStart(2, '0')}`,
    sourceId: branch.id,
    name: branch.name,
    address: branch.address,
    phone: branch.phone,
    manager: branch.manager,
    timezone: branch.timezone,
    hours: operations.hours,
    doctorCount: operations.doctorCount,
    roomCount: operations.roomCount,
    monthlyRevenue: branchDashboardMetrics.month[branch.id].revenue * 1000000,
    satisfaction: operations.satisfaction,
    status: operations.status,
  }
})

const initialSpecialties: Specialty[] = [
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

const initialServices: ClinicService[] = [
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

const emptyBranchForm: BranchFormState = {
  name: '',
  address: '',
  phone: '',
  manager: '',
  hours: '08:00 - 18:00',
  satisfaction: '4.5/5',
  timezone: 'Asia/Bangkok',
  status: 'active',
}

const emptySpecialtyForm: SpecialtyFormState = {
  name: '',
  description: '',
  leadDoctor: '',
  status: 'active',
}

const emptyServiceForm: ServiceFormState = {
  name: '',
  description: '',
  billing: 'paid',
  feeLabel: '',
  unit: 'VNĐ/lượt',
  status: 'active',
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function getNextId(prefix: string, count: number) {
  return `${prefix}-${String(count + 1).padStart(2, '0')}`
}

function toBranchForm(branch: Branch): BranchFormState {
  return {
    name: branch.name,
    address: branch.address,
    phone: branch.phone,
    manager: branch.manager,
    hours: branch.hours,
    satisfaction: branch.satisfaction,
    timezone: branch.timezone,
    status: branch.status,
  }
}

function toSpecialtyForm(specialty: Specialty): SpecialtyFormState {
  return {
    name: specialty.name,
    description: specialty.description,
    leadDoctor: specialty.leadDoctor,
    status: specialty.status,
  }
}

function toServiceForm(service: ClinicService): ServiceFormState {
  return {
    name: service.name,
    description: service.description,
    billing: service.billing,
    feeLabel: service.feeLabel,
    unit: service.unit,
    status: service.status,
  }
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20Z" />
      <path d="m13.5 6 4.5 4.5" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="3" />
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

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="clinic-detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function ManagerServicesPricingPage() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<ClinicTab>('branches')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [branches, setBranches] = useState<Branch[]>(initialBranches)
  const [specialties, setSpecialties] = useState<Specialty[]>(initialSpecialties)
  const [services, setServices] = useState<ClinicService[]>(initialServices)
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' })

  const normalizedQuery = query.trim().toLowerCase()

  const filteredBranches = useMemo(
    () =>
      branches.filter((branch) => {
        const matchesStatus = status === 'all' || branch.status === status
        const matchesQuery =
          !normalizedQuery ||
          branch.id.toLowerCase().includes(normalizedQuery) ||
          branch.name.toLowerCase().includes(normalizedQuery) ||
          branch.address.toLowerCase().includes(normalizedQuery) ||
          branch.manager.toLowerCase().includes(normalizedQuery)

        return matchesStatus && matchesQuery
      }),
    [branches, normalizedQuery, status],
  )

  const filteredSpecialties = useMemo(
    () =>
      specialties.filter((specialty) => {
        const matchesStatus = status === 'all' || specialty.status === status
        const matchesQuery =
          !normalizedQuery ||
          specialty.id.toLowerCase().includes(normalizedQuery) ||
          specialty.name.toLowerCase().includes(normalizedQuery) ||
          specialty.leadDoctor.toLowerCase().includes(normalizedQuery)

        return matchesStatus && matchesQuery
      }),
    [normalizedQuery, specialties, status],
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
    [normalizedQuery, services, status],
  )

  const tabCount =
    activeTab === 'branches'
      ? filteredBranches.length
      : activeTab === 'specialties'
        ? filteredSpecialties.length
        : filteredServices.length

  const modalTitle = getModalTitle(modal)
  const modalSubtitle = getModalSubtitle(modal)

  const closeModal = () => setModal({ mode: 'closed' })

  const openAddModal = () => {
    if (activeTab === 'branches') {
      setModal({ mode: 'add-branch', values: emptyBranchForm })
      return
    }

    if (activeTab === 'specialties') {
      setModal({ mode: 'add-specialty', values: emptySpecialtyForm })
      return
    }

    setModal({ mode: 'add-service', values: emptyServiceForm })
  }

  const updateBranchForm = (field: BranchFormField, value: string) => {
    setModal((current) => {
      if (current.mode !== 'add-branch' && current.mode !== 'edit-branch') {
        return current
      }

      return { ...current, values: { ...current.values, [field]: value } }
    })
  }

  const updateSpecialtyForm = (field: SpecialtyFormField, value: string) => {
    setModal((current) => {
      if (current.mode !== 'add-specialty' && current.mode !== 'edit-specialty') {
        return current
      }

      return { ...current, values: { ...current.values, [field]: value } }
    })
  }

  const updateServiceForm = (field: ServiceFormField, value: string) => {
    setModal((current) => {
      if (current.mode !== 'add-service' && current.mode !== 'edit-service') {
        return current
      }

      return { ...current, values: { ...current.values, [field]: value } }
    })
  }

  const submitBranchForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (modal.mode === 'add-branch') {
      const newBranch: Branch = {
        ...modal.values,
        id: getNextId('CN', branches.length),
        sourceId: `custom-${branches.length + 1}`,
        doctorCount: 0,
        roomCount: 0,
        monthlyRevenue: 0,
      }

      setBranches((current) => [...current, newBranch])
      closeModal()
      showToast('Đã thêm chi nhánh mới.', 'success')
      return
    }

    if (modal.mode === 'edit-branch') {
      setBranches((current) =>
        current.map((branch) => (branch.id === modal.branchId ? { ...branch, ...modal.values } : branch)),
      )
      closeModal()
      showToast('Đã cập nhật thông tin chi nhánh.', 'success')
    }
  }

  const submitSpecialtyForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (modal.mode === 'add-specialty') {
      setSpecialties((current) => [
        ...current,
        {
          ...modal.values,
          id: getNextId('CK', current.length),
          branchCount: 0,
          serviceCount: 0,
        },
      ])
      closeModal()
      showToast('Đã thêm chuyên khoa mới.', 'success')
      return
    }

    if (modal.mode === 'edit-specialty') {
      setSpecialties((current) =>
        current.map((specialty) => (specialty.id === modal.specialtyId ? { ...specialty, ...modal.values } : specialty)),
      )
      closeModal()
      showToast('Đã cập nhật chuyên khoa.', 'success')
    }
  }

  const submitServiceForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (modal.mode === 'add-service') {
      setServices((current) => [
        ...current,
        {
          ...modal.values,
          id: getNextId('DV', current.length),
          accent: current.length % 3 === 0 ? 'mint' : current.length % 3 === 1 ? 'blue' : 'rose',
        },
      ])
      closeModal()
      showToast('Đã thêm dịch vụ mới.', 'success')
      return
    }

    if (modal.mode === 'edit-service') {
      setServices((current) =>
        current.map((service) => (service.id === modal.serviceId ? { ...service, ...modal.values } : service)),
      )
      closeModal()
      showToast('Đã cập nhật dịch vụ.', 'success')
    }
  }

  return (
    <div className="desktop-shell-page services-pricing-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main className="desktop-shell-main services-pricing-main" aria-label="Thiết lập phòng khám">
        <section className="clinic-settings-content">
          <div className="clinic-settings-heading">
            <div>
              <h1>Thiết lập phòng khám</h1>
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
              closeModal()
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
                <SearchInput value={query} onChange={setQuery} placeholder="Tìm theo tên, mã hoặc người phụ trách" />
                <FilterSelect
                  value={status}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => setStatus(event.target.value)}
                  options={branchFilters}
                />
              </div>
              <div className="clinic-toolbar-actions">
                <PrimaryButton onClick={openAddModal}>
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
                      <span className="clinic-action-hint">Thao tác</span>
                      <div className="clinic-icon-actions">
                        <IconButton label={`Xem chi tiết ${branch.name}`} onClick={() => setModal({ mode: 'view-branch', branch })}>
                          <EyeIcon />
                        </IconButton>
                        <IconButton
                          label={`Chỉnh sửa ${branch.name}`}
                          onClick={() => setModal({ mode: 'edit-branch', branchId: branch.id, values: toBranchForm(branch) })}
                        >
                          <EditIcon />
                        </IconButton>
                      </div>
                    </div>
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
                    <IconButton
                      label={`Chỉnh sửa ${specialty.name}`}
                      onClick={() =>
                        setModal({ mode: 'edit-specialty', specialtyId: specialty.id, values: toSpecialtyForm(specialty) })
                      }
                    >
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
                      <IconButton
                        label={`Chỉnh sửa ${service.name}`}
                        onClick={() => setModal({ mode: 'edit-service', serviceId: service.id, values: toServiceForm(service) })}
                      >
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

      <DetailModal title={modalTitle} subtitle={modalSubtitle} open={modal.mode !== 'closed'} onClose={closeModal}>
        {modal.mode === 'view-branch' ? <BranchDetailView branch={modal.branch} /> : null}
        {(modal.mode === 'add-branch' || modal.mode === 'edit-branch') ? (
          <BranchForm values={modal.values} onChange={updateBranchForm} onSubmit={submitBranchForm} onCancel={closeModal} />
        ) : null}
        {(modal.mode === 'add-specialty' || modal.mode === 'edit-specialty') ? (
          <SpecialtyForm
            values={modal.values}
            onChange={updateSpecialtyForm}
            onSubmit={submitSpecialtyForm}
            onCancel={closeModal}
          />
        ) : null}
        {(modal.mode === 'add-service' || modal.mode === 'edit-service') ? (
          <ServiceForm values={modal.values} onChange={updateServiceForm} onSubmit={submitServiceForm} onCancel={closeModal} />
        ) : null}
      </DetailModal>
    </div>
  )
}

function getModalTitle(modal: ModalState) {
  switch (modal.mode) {
    case 'view-branch':
      return 'Chi tiết chi nhánh'
    case 'add-branch':
      return 'Thêm chi nhánh'
    case 'edit-branch':
      return 'Chỉnh sửa chi nhánh'
    case 'add-specialty':
      return 'Thêm chuyên khoa'
    case 'edit-specialty':
      return 'Chỉnh sửa chuyên khoa'
    case 'add-service':
      return 'Thêm dịch vụ'
    case 'edit-service':
      return 'Chỉnh sửa dịch vụ'
    default:
      return ''
  }
}

function getModalSubtitle(modal: ModalState) {
  switch (modal.mode) {
    case 'view-branch':
      return modal.branch.name
    case 'edit-branch':
      return modal.branchId
    case 'edit-specialty':
      return modal.specialtyId
    case 'edit-service':
      return modal.serviceId
    case 'add-branch':
      return 'Tạo chi nhánh mới trong hệ thống mock'
    case 'add-specialty':
      return 'Tạo chuyên khoa mới trong hệ thống mock'
    case 'add-service':
      return 'Tạo dịch vụ mới trong hệ thống mock'
    default:
      return undefined
  }
}

function BranchDetailView({ branch }: { branch: Branch }) {
  return (
    <div className="clinic-modal-section">
      <div className="clinic-detail-grid">
        <DetailItem label="Mã chi nhánh" value={branch.id} />
        <DetailItem label="Tên chi nhánh" value={branch.name} />
        <DetailItem label="Địa chỉ" value={branch.address} />
        <DetailItem label="Điện thoại" value={branch.phone} />
        <DetailItem label="Quản lý" value={branch.manager} />
        <DetailItem label="Giờ mở cửa" value={branch.hours} />
        <DetailItem label="Bác sĩ" value={branch.doctorCount} />
        <DetailItem label="Phòng chức năng" value={branch.roomCount} />
        <DetailItem label="Doanh thu tháng" value={`${formatCurrency(branch.monthlyRevenue)} đ`} />
        <DetailItem label="Hài lòng" value={branch.satisfaction} />
        <DetailItem label="Múi giờ" value={branch.timezone} />
        <DetailItem label="Trạng thái" value={branch.status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'} />
      </div>
    </div>
  )
}

function BranchForm({
  values,
  onChange,
  onSubmit,
  onCancel,
}: {
  values: BranchFormState
  onChange: (field: BranchFormField, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}) {
  return (
    <form className="clinic-modal-form" onSubmit={onSubmit}>
      <TextField label="Tên chi nhánh" value={values.name} required onChange={(value) => onChange('name', value)} />
      <TextAreaField label="Địa chỉ" value={values.address} required onChange={(value) => onChange('address', value)} />
      <TextField label="Điện thoại" value={values.phone} required onChange={(value) => onChange('phone', value)} />
      <TextField label="Quản lý" value={values.manager} required onChange={(value) => onChange('manager', value)} />
      <TextField label="Giờ mở cửa" value={values.hours} required onChange={(value) => onChange('hours', value)} />
      <TextField label="Mức hài lòng" value={values.satisfaction} required onChange={(value) => onChange('satisfaction', value)} />
      <TextField label="Múi giờ" value={values.timezone} required onChange={(value) => onChange('timezone', value)} />
      <SelectField label="Trạng thái" value={values.status} onChange={(value) => onChange('status', value)} />
      <ModalActions onCancel={onCancel} />
    </form>
  )
}

function SpecialtyForm({
  values,
  onChange,
  onSubmit,
  onCancel,
}: {
  values: SpecialtyFormState
  onChange: (field: SpecialtyFormField, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}) {
  return (
    <form className="clinic-modal-form" onSubmit={onSubmit}>
      <TextField label="Tên chuyên khoa" value={values.name} required onChange={(value) => onChange('name', value)} />
      <TextAreaField label="Mô tả" value={values.description} required onChange={(value) => onChange('description', value)} />
      <TextField label="Bác sĩ phụ trách" value={values.leadDoctor} required onChange={(value) => onChange('leadDoctor', value)} />
      <SelectField label="Trạng thái" value={values.status} onChange={(value) => onChange('status', value)} />
      <ModalActions onCancel={onCancel} />
    </form>
  )
}

function ServiceForm({
  values,
  onChange,
  onSubmit,
  onCancel,
}: {
  values: ServiceFormState
  onChange: (field: ServiceFormField, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}) {
  return (
    <form className="clinic-modal-form" onSubmit={onSubmit}>
      <TextField label="Tên dịch vụ" value={values.name} required onChange={(value) => onChange('name', value)} />
      <TextAreaField label="Mô tả" value={values.description} required onChange={(value) => onChange('description', value)} />
      <SelectField
        label="Loại tính phí"
        value={values.billing}
        options={[
          { value: 'paid', label: 'Trả phí' },
          { value: 'free', label: 'Miễn phí' },
        ]}
        onChange={(value) => onChange('billing', value)}
      />
      <TextField label="Mức phí" value={values.feeLabel} required onChange={(value) => onChange('feeLabel', value)} />
      <TextField label="Đơn vị" value={values.unit} onChange={(value) => onChange('unit', value)} />
      <SelectField label="Trạng thái" value={values.status} onChange={(value) => onChange('status', value)} />
      <ModalActions onCancel={onCancel} />
    </form>
  )
}

function TextField({
  label,
  value,
  required,
  onChange,
}: {
  label: string
  value: string
  required?: boolean
  onChange: (value: string) => void
}) {
  return (
    <label className="clinic-form-field">
      <span>{label}</span>
      <input value={value} required={required} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function TextAreaField({
  label,
  value,
  required,
  onChange,
}: {
  label: string
  value: string
  required?: boolean
  onChange: (value: string) => void
}) {
  return (
    <label className="clinic-form-field clinic-form-field-wide">
      <span>{label}</span>
      <textarea value={value} required={required} rows={4} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function SelectField({
  label,
  value,
  options = [
    { value: 'active', label: 'Đang hoạt động' },
    { value: 'inactive', label: 'Tạm ngưng' },
  ],
  onChange,
}: {
  label: string
  value: string
  options?: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}) {
  return (
    <label className="clinic-form-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function ModalActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="clinic-modal-actions">
      <PrimaryButton variant="ghost" onClick={onCancel}>
        Hủy
      </PrimaryButton>
      <PrimaryButton type="submit">Lưu thông tin</PrimaryButton>
    </div>
  )
}
