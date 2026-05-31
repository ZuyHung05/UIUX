import { useMemo, useState } from 'react'
import { Header } from '../../../components/layout/header/Header'
import { Sidebar } from '../../../components/layout/sidebar/Sidebar'
import '../../../components/layout/DesktopShell.css'
import { IconButton } from '../../../components/ui/ActionButton'
import { FilterSelect } from '../../../components/ui/FilterSelect'
import { SearchInput } from '../../../components/ui/SearchInput'
import { managerSidebarConfig } from '../managerSidebarConfig'
import './ManagerServicesPricingPage.css'

type CoreService = {
  id: string
  name: string
  billing: 'free' | 'paid'
  status: 'active' | 'inactive'
  feeLabel: string
  unit: string
  accent: 'mint' | 'blue' | 'rose'
}

type MedicalService = {
  id: string
  name: string
  specialty: string
  branch: string
  price: number
  status: 'active' | 'inactive'
}

type SpecialtyGroup = {
  id: string
  name: string
  branch: string
  services: MedicalService[]
}

const branches = ['Tất cả chi nhánh', 'Chi nhánh Quận 1', 'Chi nhánh Thủ Đức', 'Chi nhánh Bình Thạnh']

const initialCoreServices: CoreService[] = [
  {
    id: 'chatbot',
    name: 'Tư vấn Chatbot',
    billing: 'free',
    status: 'active',
    feeLabel: 'Miễn phí',
    unit: '',
    accent: 'mint',
  },
  {
    id: 'doctor-online',
    name: 'Tư vấn Bác sĩ (Trực tuyến)',
    billing: 'paid',
    status: 'active',
    feeLabel: '150.000',
    unit: 'VNĐ/ca',
    accent: 'blue',
  },
  {
    id: 'appointment',
    name: 'Đặt lịch hẹn khám',
    billing: 'paid',
    status: 'active',
    feeLabel: '200.000',
    unit: 'VNĐ/lượt',
    accent: 'rose',
  },
]

const initialSpecialtyCatalog: SpecialtyGroup[] = [
  {
    id: 'cardiology',
    name: 'Tim mạch',
    branch: 'Chi nhánh Quận 1',
    services: [
      { id: 'TM-101', name: 'Khám chuyên khoa Tim mạch', specialty: 'Tim mạch', branch: 'Chi nhánh Quận 1', price: 320000, status: 'active' },
      { id: 'TM-204', name: 'Siêu âm tim Doppler màu', specialty: 'Tim mạch', branch: 'Chi nhánh Quận 1', price: 480000, status: 'active' },
      { id: 'TM-310', name: 'Điện tâm đồ nghỉ', specialty: 'Tim mạch', branch: 'Chi nhánh Thủ Đức', price: 180000, status: 'inactive' },
    ],
  },
  {
    id: 'dermatology',
    name: 'Da liễu',
    branch: 'Chi nhánh Bình Thạnh',
    services: [
      { id: 'DL-115', name: 'Soi da và tư vấn điều trị', specialty: 'Da liễu', branch: 'Chi nhánh Bình Thạnh', price: 260000, status: 'active' },
      { id: 'DL-220', name: 'Điều trị mụn chuyên sâu', specialty: 'Da liễu', branch: 'Chi nhánh Bình Thạnh', price: 650000, status: 'active' },
      { id: 'DL-318', name: 'Liệu trình phục hồi da', specialty: 'Da liễu', branch: 'Chi nhánh Quận 1', price: 720000, status: 'active' },
    ],
  },
  {
    id: 'pediatrics',
    name: 'Nhi khoa',
    branch: 'Chi nhánh Thủ Đức',
    services: [
      { id: 'NK-102', name: 'Khám tổng quát Nhi', specialty: 'Nhi khoa', branch: 'Chi nhánh Thủ Đức', price: 280000, status: 'active' },
      { id: 'NK-206', name: 'Tư vấn dinh dưỡng trẻ em', specialty: 'Nhi khoa', branch: 'Chi nhánh Thủ Đức', price: 350000, status: 'active' },
      { id: 'NK-411', name: 'Gói theo dõi tăng trưởng', specialty: 'Nhi khoa', branch: 'Chi nhánh Bình Thạnh', price: 890000, status: 'inactive' },
    ],
  },
  {
    id: 'obgyn',
    name: 'Sản phụ khoa',
    branch: 'Chi nhánh Quận 1',
    services: [
      { id: 'SPK-109', name: 'Khám phụ khoa định kỳ', specialty: 'Sản phụ khoa', branch: 'Chi nhánh Quận 1', price: 300000, status: 'active' },
      { id: 'SPK-240', name: 'Siêu âm thai 4D', specialty: 'Sản phụ khoa', branch: 'Chi nhánh Bình Thạnh', price: 520000, status: 'active' },
      { id: 'SPK-515', name: 'Gói tầm soát sức khỏe nữ', specialty: 'Sản phụ khoa', branch: 'Chi nhánh Quận 1', price: 1250000, status: 'active' },
    ],
  },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function parseFee(value: string) {
  return value.replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function Badge({ tone, children }: { tone: 'free' | 'paid' | 'active' | 'inactive'; children: string }) {
  return <span className={`services-badge services-badge-${tone}`}>{children}</span>
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m8 10 4 4 4-4" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4.5L19 9.5 14.5 5 4 15.5V20Z" />
      <path d="m13.5 6 4.5 4.5" />
    </svg>
  )
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4.5h11l3 3v12H5v-15Z" />
      <path d="M8 4.5v5h7v-5M8 19.5v-6h8v6" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14M16 5v14" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5v13l10-6.5-10-6.5Z" />
    </svg>
  )
}

function ServiceIcon({ type }: { type: CoreService['id'] }) {
  if (type === 'chatbot') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="8" width="14" height="10" rx="3" />
        <path d="M12 8V5M9.2 13h.01M14.8 13h.01M8.5 18l-1.5 2M15.5 18l1.5 2" />
      </svg>
    )
  }

  if (type === 'doctor-online') {
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
  const [coreServices, setCoreServices] = useState(initialCoreServices)
  const [medicalCatalog, setMedicalCatalog] = useState(initialSpecialtyCatalog)
  const [editingCoreServiceId, setEditingCoreServiceId] = useState<string | null>(null)
  const [editingMedicalServiceId, setEditingMedicalServiceId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [branch, setBranch] = useState(branches[0])
  const [openSpecialties, setOpenSpecialties] = useState<Record<string, boolean>>({})

  const filteredCatalog = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return medicalCatalog
      .map((group) => {
        const services = group.services.filter((service) => {
          const matchesBranch = branch === branches[0] || service.branch === branch
          const matchesQuery =
            !normalizedQuery ||
            service.id.toLowerCase().includes(normalizedQuery) ||
            service.name.toLowerCase().includes(normalizedQuery) ||
            service.specialty.toLowerCase().includes(normalizedQuery)

          return matchesBranch && matchesQuery
        })

        return { ...group, services }
      })
      .filter((group) => group.services.length > 0)
  }, [branch, medicalCatalog, query])

  const handleCoreFeeChange = (serviceId: string, value: string) => {
    setCoreServices((services) =>
      services.map((service) => (service.id === serviceId ? { ...service, feeLabel: parseFee(value) } : service)),
    )
  }

  const handleMedicalPriceChange = (serviceId: string, value: string) => {
    const nextPrice = Number(value.replace(/[^\d]/g, ''))

    setMedicalCatalog((groups) =>
      groups.map((group) => ({
        ...group,
        services: group.services.map((service) =>
          service.id === serviceId ? { ...service, price: Number.isNaN(nextPrice) ? 0 : nextPrice } : service,
        ),
      })),
    )
  }

  const toggleMedicalServiceStatus = (serviceId: string) => {
    setMedicalCatalog((groups) =>
      groups.map((group) => ({
        ...group,
        services: group.services.map((service) =>
          service.id === serviceId
            ? { ...service, status: service.status === 'active' ? 'inactive' : 'active' }
            : service,
        ),
      })),
    )
  }

  const toggleSpecialty = (specialtyId: string) => {
    setOpenSpecialties((current) => ({ ...current, [specialtyId]: !current[specialtyId] }))
  }

  return (
    <div className="desktop-shell-page services-pricing-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main className="desktop-shell-main services-pricing-main" aria-label="Dịch vụ và bảng giá">
        <section className="services-pricing-content">
          <div className="services-heading">
            <div>
              <h1>Dịch vụ & Bảng giá</h1>
              <p>Quản lý phí nền tảng và danh mục giá y khoa theo chuyên khoa.</p>
            </div>
          </div>

          <section className="service-card-grid" aria-label="Dịch vụ nền tảng">
            {coreServices.map((service) => {
              const isEditing = editingCoreServiceId === service.id
              const canEdit = service.billing === 'paid'

              return (
                <article className="service-card" key={service.id}>
                  <div className="service-card-topline">
                    <span className={`service-card-icon icon-${service.accent}`}>
                      <ServiceIcon type={service.id} />
                    </span>
                    <Badge tone={service.status}>
                      {service.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </Badge>
                  </div>
                  <div className="service-card-body">
                    <div className="service-card-copy">
                      <h2>{service.name}</h2>
                      <div className="service-fee-info">
                        <span className="service-fee-label">
                          {service.id === 'appointment' ? 'Phí đặt lịch' : 'Phí cơ bản'}
                        </span>
                        <span className={`billing-text billing-${service.billing}`}>
                          • {service.billing === 'free' ? 'Miễn phí' : 'Trả phí'}
                        </span>
                      </div>
                      <div className={isEditing ? 'service-fee-value is-editing' : 'service-fee-value'}>
                        {isEditing ? (
                          <div className="fee-input-wrapper">
                            <input
                              value={service.feeLabel}
                              onChange={(event) => handleCoreFeeChange(service.id, event.target.value)}
                              aria-label={`Chỉnh phí ${service.name}`}
                              autoFocus
                            />
                            {service.unit ? <span className="fee-unit">{service.unit}</span> : null}
                          </div>
                        ) : (
                          <div className="fee-display">
                            <strong>{service.feeLabel}</strong>
                            {service.unit ? <span>{service.unit}</span> : null}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="service-card-actions">
                    <IconButton
                      label={isEditing ? `Lưu phí ${service.name}` : `Sửa phí ${service.name}`}
                      disabled={!canEdit}
                      onClick={() => setEditingCoreServiceId((current) => (current === service.id ? null : service.id))}
                    >
                      {isEditing ? <SaveIcon /> : <EditIcon />}
                    </IconButton>
                  </div>
                </article>
              )
            })}
          </section>

          <section className="medical-price-panel" aria-label="Danh mục Giá Y khoa theo Chuyên khoa">
            <div className="medical-price-toolbar">
              <div>
                <h2>Danh mục Giá Y khoa theo Chuyên khoa</h2>
                <span>{filteredCatalog.reduce((total, group) => total + group.services.length, 0)} dịch vụ</span>
              </div>
              <div className="medical-price-filters">
                <SearchInput value={query} onChange={setQuery} placeholder="Tìm nhanh dịch vụ..." />
                <FilterSelect
                  value={branch}
                  onChange={(event) => setBranch(event.target.value)}
                  options={branches.map((item) => ({ value: item, label: item }))}
                />
              </div>
            </div>

            <div className="specialty-catalog-grid" aria-label="Danh sách chuyên khoa">
              {filteredCatalog.map((group) => {
                const isOpen = Boolean(openSpecialties[group.id])
                const activeCount = group.services.filter((service) => service.status === 'active').length

                return (
                  <section className="specialty-card" key={group.id}>
                    <button
                      className="specialty-row"
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggleSpecialty(group.id)}
                    >
                      <span className="specialty-toggle">
                        <ChevronIcon />
                      </span>
                      <span className="specialty-name">
                        <strong>{group.name}</strong>
                        <small>
                          {group.services.length} dịch vụ · {activeCount} đang áp dụng
                        </small>
                      </span>
                      <span className="specialty-branch">{group.branch}</span>
                    </button>

                    <div className={isOpen ? 'service-rows is-open' : 'service-rows'}>
                      <div className="service-table">
                        <div className="service-table-head" role="row">
                          <span>Mã dịch vụ</span>
                          <span>Tên dịch vụ y khoa</span>
                          <span>Chuyên khoa</span>
                          <span>Giá tiền (VNĐ)</span>
                          <span>Trạng thái</span>
                          <span>Hành động</span>
                        </div>
                        {group.services.map((service) => {
                          const isEditing = editingMedicalServiceId === service.id

                          return (
                            <div className="service-price-row" role="row" key={service.id}>
                              <span className="service-code">{service.id}</span>
                              <span className="service-name">{service.name}</span>
                              <span>{service.specialty}</span>
                              <span className="service-price">
                                {isEditing ? (
                                  <div className="price-input-wrapper">
                                    <input
                                      value={formatCurrency(service.price)}
                                      onChange={(event) => handleMedicalPriceChange(service.id, event.target.value)}
                                      aria-label={`Chỉnh giá ${service.name}`}
                                      autoFocus
                                    />
                                    <span className="price-unit">đ</span>
                                  </div>
                                ) : (
                                  <strong>{formatCurrency(service.price)} <span>đ</span></strong>
                                )}
                              </span>
                              <span className="status-cell">
                                <Badge tone={service.status}>
                                  {service.status === 'active' ? 'Đang áp dụng' : 'Ngừng áp dụng'}
                                </Badge>
                              </span>
                              <span className="service-row-actions">
                                <IconButton
                                  label={isEditing ? `Lưu ${service.name}` : `Sửa ${service.name}`}
                                  onClick={() =>
                                    setEditingMedicalServiceId((current) => (current === service.id ? null : service.id))
                                  }
                                >
                                  {isEditing ? <SaveIcon /> : <EditIcon />}
                                </IconButton>
                                <IconButton
                                  label={service.status === 'active' ? `Ngừng ${service.name}` : `Mở lại ${service.name}`}
                                  variant={service.status === 'active' ? 'danger' : 'secondary'}
                                  onClick={() => toggleMedicalServiceStatus(service.id)}
                                >
                                  {service.status === 'active' ? <PauseIcon /> : <PlayIcon />}
                                </IconButton>
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </section>
                )
              })}
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}
