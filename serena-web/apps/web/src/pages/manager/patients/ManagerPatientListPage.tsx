import { useEffect, useState } from 'react'
import { Header } from '../../../components/layout/header/Header'
import { Sidebar } from '../../../components/layout/sidebar/Sidebar'
import '../../../components/layout/DesktopShell.css'
import { DataTable, type DataTableColumn } from '../../../components/ui/DataTable'
import { FilterSelect } from '../../../components/ui/FilterSelect'
import { IconButton } from '../../../components/ui/ActionButton'
import { MetricCard } from '../../../components/ui/MetricCard'
import { CheckMetricIcon, ClockMetricIcon, UsersMetricIcon, PulseMetricIcon } from '../../../components/ui/metricIcons'
import { Pagination } from '../../../components/ui/Pagination'
import { SearchInput } from '../../../components/ui/SearchInput'
import { ReturnButton } from '../../../components/ui/ReturnButton'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { managerSidebarConfig } from '../managerSidebarConfig'
import { initialPatients } from '../../doctor/patients/PatientListTab'
import '../../doctor/patients/PatientListTab.css'

const pageSizeOptions = [5, 10, 20]

// Transform initial data for Manager view
const managerPatients = initialPatients.map((p) => {
  let serviceName = p.appointmentType
  if (p.appointmentType === 'Tư vấn') serviceName = 'Tư vấn Chatbot'
  else if (p.appointmentType === 'Cả hai') serviceName = 'Tư vấn Bác sĩ'
  
  let derivedStatus = p.status
  if (p.status === 'Đang khám') {
    if (serviceName === 'Tư vấn Chatbot') derivedStatus = 'Đang tư vấn Chatbot'
    else if (serviceName === 'Tư vấn Bác sĩ') derivedStatus = 'Đang tư vấn Bác sĩ'
    else derivedStatus = 'Đang khám trực tiếp'
  } else if (p.status === 'Đã kết thúc') {
    derivedStatus = 'Đã hoàn thành'
  }
  
  return {
    ...p,
    service: serviceName,
    derivedStatus,
  }
})

export function ManagerPatientListPage() {
  const [query, setQuery] = useState('')
  const [serviceFilter, setServiceFilter] = useState<'Tất cả' | 'Tư vấn Chatbot' | 'Tư vấn Bác sĩ' | 'Khám trực tiếp'>('Tất cả')
  const [statusFilter, setStatusFilter] = useState<'Tất cả' | 'Đang chờ' | 'Đang khám' | 'Đã kết thúc'>('Tất cả')
  const [currentPage, setCurrentPage] = useState(1)
  const [patientsPerPage, setPatientsPerPage] = useState(pageSizeOptions[0])

  const [activePatientId, setActivePatientId] = useState<string | null>(null)
  const [selectedEncounterIdx, setSelectedEncounterIdx] = useState<number>(0)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  const activePatient = managerPatients.find(p => p.id === activePatientId)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const filteredPatients = managerPatients.filter((p) => {
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.code.toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query)

    const matchesService = serviceFilter === 'Tất cả' || p.service === serviceFilter
    const matchesStatus = statusFilter === 'Tất cả' || p.status === statusFilter

    return matchesSearch && matchesService && matchesStatus
  })

  const pageCount = Math.max(1, Math.ceil(filteredPatients.length / patientsPerPage))
  const pagedPatients = filteredPatients.slice((currentPage - 1) * patientsPerPage, currentPage * patientsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [query, serviceFilter, statusFilter, patientsPerPage])

  const totalPatients = managerPatients.length
  const waitingPatients = managerPatients.filter((p) => p.status === 'Đang chờ').length
  const processingPatients = managerPatients.filter((p) => p.status === 'Đang khám').length
  const completedPatients = managerPatients.filter((p) => p.status === 'Đã kết thúc').length

  const columns: Array<DataTableColumn<typeof managerPatients[0]>> = [
    {
      key: 'index',
      header: 'STT',
      width: '60px',
      align: 'center',
      render: (_item, index) => (currentPage - 1) * patientsPerPage + index + 1,
    },
    {
      key: 'patient',
      header: 'Bệnh nhân',
      width: '240px',
      render: (item) => (
        <div className="doctor-cell">
          <div className="doctor-avatar" aria-hidden="true" style={{ background: '#E6EFFE' }}>
            <svg viewBox="0 0 24 24" style={{ fill: '#244a6b', stroke: 'none' }}>
              <circle cx="12" cy="8" r="4" />
              <path d="M5 21a7 7 0 0 1 14 0v1H5v-1Z" />
            </svg>
          </div>
          <div>
            <strong>{item.name}</strong>
            <span style={{ display: 'block', fontSize: '13px', color: '#6c8197' }}>
              {item.gender} • {item.age} tuổi
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'code',
      header: 'Mã bệnh nhân',
      width: '130px',
      align: 'center',
      render: (item) => <strong>{item.code}</strong>,
    },
    {
      key: 'phone',
      header: 'Liên hệ',
      width: '120px',
      align: 'center',
      render: (item) => item.phone,
    },
    {
      key: 'service',
      header: 'Dịch vụ',
      width: '160px',
      align: 'center',
      render: (item) => item.service,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '180px',
      align: 'center',
      render: (item) => (
        <span className={`status-pill ${item.status === 'Đang chờ' ? 'waiting' : item.status === 'Đang khám' ? 'processing' : 'done'}`}>
          {item.derivedStatus}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Hành động',
      width: '100px',
      align: 'center',
      render: (item) => (
        <div className="table-actions">
          <IconButton
            label="Xem chi tiết"
            onClick={() => {
              setActivePatientId(item.id)
              setSelectedEncounterIdx(0)
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '16px', height: '16px', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }}>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </IconButton>
        </div>
      ),
    },
  ]

  if (activePatientId && activePatient) {
    const p = activePatient
    const enc = p.pastEncounters[selectedEncounterIdx] || p.pastEncounters[0]

    return (
      <div className="desktop-shell-page doctor-management-page">
        <Sidebar config={managerSidebarConfig} />
        <Header profileRole={managerSidebarConfig.profileRole} />
        <main className="desktop-shell-main doctor-management-main" aria-label="Chi tiết bệnh án">
          <div className="emr-view-container" style={{ margin: 'clamp(12px, 1.8vh, 18px) clamp(14px, 1.6vw, 24px)' }}>
            {toastMessage && <div className="emr-toast">{toastMessage}</div>}

            <ReturnButton
              onClick={() => {
                setActivePatientId(null)
                setSelectedEncounterIdx(0)
              }}
              title="Quay lại danh sách bệnh nhân"
              style={{ marginBottom: '16px' }}
            />

            <div className="emr-view-header-block">
              <h1 className="emr-view-title">HỒ SƠ BỆNH ÁN CHI TIẾT</h1>
            </div>

            <section className="emr-profile-section">
              <div className="emr-avatar-circle">
                {p.name.split(' ').pop()?.[0]}
              </div>

              <div className="emr-profile-box">
                <div className="profile-detail-item">
                  <span className="detail-label">Mã bệnh nhân:</span>
                  <strong className="detail-value">{p.code}</strong>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label">Họ tên & Tuổi:</span>
                  <strong className="detail-value">{p.name} ({p.age} tuổi)</strong>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label">Giới tính & Nhóm máu:</span>
                  <strong className="detail-value">{p.gender} • Nhóm máu {p.bloodType}</strong>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label">Số điện thoại:</span>
                  <strong className="detail-value">{p.phone}</strong>
                </div>
              </div>
            </section>

            <hr className="emr-divider" />

            <div className="emr-two-columns">
              <div className="emr-col-left">
                <article className="emr-column-card" style={{ height: '100%' }}>
                  <h3 className="emr-column-title">Lịch sử lượt khám gần đây</h3>
                  <div className="encounter-history-list">
                    {p.pastEncounters.map((item, idx) => (
                      <div
                        key={idx}
                        className={`encounter-history-item ${selectedEncounterIdx === idx ? 'active' : ''}`}
                        onClick={() => setSelectedEncounterIdx(idx)}
                      >
                        <div className="history-item-meta">
                          <span className="visit-meta">{item.date} • {item.doctor}</span>
                          {selectedEncounterIdx === idx && <span className="active-badge">Đang chọn</span>}
                        </div>
                        <div className="history-item-diag">{item.diagnosis}</div>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <div className="emr-col-right">
                <article className="emr-column-card" style={{ height: '100%' }}>
                  <h3 className="emr-column-title">Tiền sử & Cảnh báo dị ứng</h3>
                  <div className="emr-history-allergy-content">
                    <div className="allergy-warn-box">
                      <span className="warn-label">Dị ứng ghi nhận:</span>
                      <strong className={`warn-val ${p.allergies.length > 0 ? 'alert-red' : ''}`}>
                        {p.allergies.length > 0 ? p.allergies.join(', ') : 'Chưa ghi nhận dị ứng'}
                      </strong>
                    </div>

                    <div className="history-box-section">
                      <span className="warn-label">Tiền sử bệnh lý:</span>
                      <ul className="history-bullets">
                        {p.history.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            {enc && (
              <section className="emr-records-section">
                <div className="emr-encounter-block">
                  <div className="emr-records-row">
                    <span className="emr-records-label">Bác sĩ phụ trách</span>
                    <div className="emr-records-value-box" style={{ background: '#F0F6FF', borderColor: '#BFDBFE', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#fff', border: '1px solid #BFDBFE', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        <svg viewBox="0 0 24 24" style={{ width: '22px', height: '22px', fill: '#2563EB' }}>
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                      <div>
                        <strong style={{ display: 'block', color: '#1D4ED8', fontSize: '15px' }}>{enc.doctor}</strong>
                        <span style={{ fontSize: '13px', color: '#3B82F6', fontWeight: 600 }}>Chuyên trách bệnh án</span>
                      </div>
                    </div>
                  </div>

                  <div className="emr-records-row">
                    <span className="emr-records-label">Triệu chứng & Lâm sàng</span>
                    <div className="emr-records-value-box">
                      <strong style={{ display: 'block', marginBottom: '6px' }}>Khám ngày: {enc.date}</strong>
                      <p style={{ margin: 0 }}>{enc.symptoms}</p>
                    </div>
                  </div>

                  <div className="emr-records-row">
                    <span className="emr-records-label">Chẩn đoán y khoa</span>
                    <div className="emr-records-value-box">
                      <strong style={{ color: '#2563EB', fontWeight: 700 }}>{enc.diagnosis}</strong>
                    </div>
                  </div>

                  <div className="emr-records-row">
                    <span className="emr-records-label">Đơn thuốc kê chi tiết</span>
                    <div className="emr-records-value-box">
                      {enc.prescription.length > 0 ? (
                        <ul style={{ margin: 0, paddingLeft: '18px' }}>
                          {enc.prescription.map((drug, dIdx) => (
                            <li key={dIdx} style={{ fontWeight: 600 }}>{drug}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="emr-no-notes">Không kê đơn thuốc</span>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="desktop-shell-page doctor-management-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main className="desktop-shell-main doctor-management-main" aria-label="Quản lý bệnh nhân">
        <section className="doctor-page-content">
          <div className="doctor-heading-row">
            <div>
              <h1>Quản lý Bệnh nhân</h1>
              <p>Trang quản lý danh sách bệnh nhân và các dịch vụ khám chữa bệnh.</p>
            </div>
          </div>

          <div className="metrics-grid doctor-metrics-grid">
            <MetricCard
              label="Tổng bệnh nhân"
              value={totalPatients}
              icon={<UsersMetricIcon />}
              iconClassName="metric-icon-blue"
            />
            <MetricCard
              label="Đang chờ khám"
              value={waitingPatients}
              icon={<ClockMetricIcon />}
              iconClassName="metric-icon-yellow"
            />
            <MetricCard
              label="Đang khám"
              value={processingPatients}
              icon={<PulseMetricIcon />}
              iconClassName="metric-icon-green"
            />
            <MetricCard
              label="Đã hoàn thành"
              value={completedPatients}
              icon={<CheckMetricIcon />}
              iconClassName="metric-icon-gray"
            />
          </div>

          <div className="doctor-toolbar">
            <div className="doctor-toolbar-filters">
              <SearchInput value={query} onChange={setQuery} placeholder="Tìm kiếm bệnh nhân..." />
              <FilterSelect
                value={serviceFilter}
                onChange={(event) => setServiceFilter(event.target.value as any)}
                options={[
                  { value: 'Tất cả', label: 'Tất cả dịch vụ' },
                  { value: 'Tư vấn Chatbot', label: 'Tư vấn Chatbot' },
                  { value: 'Tư vấn Bác sĩ', label: 'Tư vấn Bác sĩ' },
                  { value: 'Khám trực tiếp', label: 'Khám trực tiếp' },
                ]}
              />
              <FilterSelect
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as any)}
                options={[
                  { value: 'Tất cả', label: 'Tất cả trạng thái' },
                  { value: 'Đang chờ', label: 'Đang chờ' },
                  { value: 'Đang khám', label: 'Đang khám' },
                  { value: 'Đã kết thúc', label: 'Đã kết thúc' },
                ]}
              />
            </div>
          </div>

          <div className="doctor-table-controls">
            <label className="doctor-page-size">
              <span>Hiển thị</span>
              <select
                value={patientsPerPage}
                onChange={(event) => setPatientsPerPage(Number(event.target.value))}
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span>dòng</span>
            </label>

            <Pagination
              currentPage={currentPage}
              pageCount={pageCount}
              onPageChange={setCurrentPage}
            />
          </div>

          <DataTable
            rows={pagedPatients}
            columns={columns}
            getRowKey={(p) => p.id}
            emptyState="Không tìm thấy bệnh nhân phù hợp."
          />
        </section>
      </main>
    </div>
  )
}
