import { useState } from 'react'
import { createPortal } from 'react-dom'
import { FilterSelect } from '../../../components/ui/FilterSelect'
import { MetricCard } from '../../../components/ui/MetricCard'
import { ReturnButton } from '../../../components/ui/ReturnButton'
import { initialPatients } from '../patients/PatientListTab'
import '../patients/PatientListTab.css'
import './DashboardTab.css'

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// High-fidelity patient database map for today's dynamic clinical workspace
const clinicalPatientsMap: Record<string, {
  id: string;
  name: string;
  age: number;
  gender: string;
  code: string;
  triage: 'Khẩn cấp' | 'Cần khám' | 'Bình thường';
  reason: string;
  timeSlot: string;
  vitals: { bp: string; hr: number; temp: number; spo2: number };
}> = {
  '2': {
    id: '2',
    name: 'Trần Thu Thảo',
    age: 28,
    gender: 'Nữ',
    code: 'BN-2026-002',
    triage: 'Khẩn cấp',
    reason: 'Đau ngực trái kéo dài, lan ra vai trái',
    timeSlot: '09:00 - 09:30 (Thứ Sáu, 29/05)',
    vitals: { bp: '135/85', hr: 104, temp: 36.8, spo2: 98 }
  },
  '25': {
    id: '25',
    name: 'Dương Thị Hoa',
    age: 51,
    gender: 'Nữ',
    code: 'BN-2026-025',
    triage: 'Khẩn cấp',
    reason: 'Đau quặn dữ dội hố chậu phải kèm sốt nhẹ',
    timeSlot: '08:00 - 08:30 (Thứ Sáu, 29/05)',
    vitals: { bp: '122/78', hr: 82, temp: 37.2, spo2: 98 }
  },
  '15': {
    id: '15',
    name: 'Phan Văn R',
    age: 53,
    gender: 'Nam',
    code: 'BN-2026-015',
    triage: 'Khẩn cấp',
    reason: 'Tê bì châm chích đầu ngón tay ngón chân đối xứng',
    timeSlot: '10:00 - 10:30 (Thứ Sáu, 29/05)',
    vitals: { bp: '135/88', hr: 80, temp: 36.6, spo2: 96 }
  },
  '1': {
    id: '1',
    name: 'Nguyễn Văn A',
    age: 22,
    gender: 'Nam',
    code: 'BN-2026-001',
    triage: 'Cần khám',
    reason: 'Sốt cao co giật nhẹ, đau rát họng',
    timeSlot: '10:30 - 11:00 (Thứ Sáu, 29/05)',
    vitals: { bp: '142/95', hr: 98, temp: 39.2, spo2: 97 }
  },
  '6': {
    id: '6',
    name: 'Nguyễn Hoàng G',
    age: 34,
    gender: 'Nam',
    code: 'BN-2026-006',
    triage: 'Bình thường',
    reason: 'Hắt hơi nhiều, ngứa mũi dị ứng phấn hoa',
    timeSlot: '14:30 - 15:00 (Thứ Sáu, 29/05)',
    vitals: { bp: '120/80', hr: 78, temp: 36.6, spo2: 99 }
  },
  '7': {
    id: '7',
    name: 'Vũ Thị H',
    age: 41,
    gender: 'Nữ',
    code: 'BN-2026-007',
    triage: 'Khẩn cấp',
    reason: 'Đau chói khớp vai phải khi nhấc tay lên cao',
    timeSlot: '15:00 - 15:30 (Thứ Sáu, 29/05)',
    vitals: { bp: '125/82', hr: 80, temp: 37.2, spo2: 98 }
  },
  '8': {
    id: '8',
    name: 'Phạm Bích Vân',
    age: 30,
    gender: 'Nữ',
    code: 'BN-2026-008',
    triage: 'Bình thường',
    reason: 'Đau mỏi cổ vai gáy sau khi làm việc máy tính lâu',
    timeSlot: '16:00 - 16:30 (Thứ Sáu, 29/05)',
    vitals: { bp: '115/75', hr: 72, temp: 36.5, spo2: 99 }
  },
  '9': {
    id: '9',
    name: 'Lê Hoàng Nam',
    age: 45,
    gender: 'Nam',
    code: 'BN-2026-009',
    triage: 'Bình thường',
    reason: 'Tái khám định kỳ tăng huyết áp và đái tháo đường',
    timeSlot: '17:00 - 17:30 (Thứ Sáu, 29/05)',
    vitals: { bp: '130/82', hr: 76, temp: 36.6, spo2: 98 }
  }
}

// Today's dynamic timeline entries (extended to 17:30 per feedback)
const todayTimeline = [
  { time: '08:00 - 08:30', patientId: '25', name: 'Dương Thị Hoa', type: 'Khám trực tiếp', status: 'Đã khám', priority: 'Khẩn cấp' },
  { time: '10:00 - 10:30', patientId: '15', name: 'Phan Văn R', type: 'Khám trực tiếp', status: 'Đang khám' },
  { time: '15:00 - 15:30', patientId: '7', name: 'Vũ Thị H', type: 'Khám trực tiếp', status: 'Đang chờ' },
  { time: '16:00 - 16:30', patientId: '8', name: 'Phạm Bích Vân', type: 'Khám trực tiếp', status: 'Đang chờ' }
]



// Slim-down unread messages list (Tin nhắn đang chờ)
const messages = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    text: 'Bác sĩ ơi, tôi bị sốt cao 39.5°C kèm khó thở và tức ngực nhiều, nằm ngửa là không thở được...',
    sentAt: '09:36',
    unread: true,
    severity: 'high',
    waitingTime: '3 phút',
    aiExtract: {
      symptoms: 'Sốt 39.5°C, khó thở, tức ngực khi nằm ngửa.',
      history: 'Hen phế quản mạn tính',
      diagnosis: 'Cơn hen phế quản cấp kịch phát / Theo dõi hội chứng vành cấp'
    }
  },
  {
    id: '4',
    name: 'Nguyễn Thị N',
    text: 'Xin chào bác sĩ, tôi đang gặp tình trạng đau đầu kéo dài và mất ngủ khoảng 3 ngày nay...',
    sentAt: '08:15',
    unread: true,
    severity: 'medium',
    waitingTime: '15 phút',
    aiExtract: {
      symptoms: 'Đau đầu âm ỉ kéo dài 3 ngày, mất ngủ, chóng mặt nhẹ.',
      history: 'Tăng huyết áp vô căn',
      diagnosis: 'Cơn tăng huyết áp kịch phát / Đau đầu vận mạch'
    }
  },
  {
    id: '5',
    name: 'Lê Văn Khang',
    text: 'Bác sĩ cho tôi hỏi lịch khám sức khỏe tổng quát tuần này với ạ, tôi muốn đăng ký...',
    sentAt: '07:30',
    unread: false,
    severity: 'low',
    waitingTime: '45 phút',
    aiExtract: {
      symptoms: 'Có nhu cầu đăng ký và tư vấn gói khám sức khỏe tổng quát định kỳ.',
      history: 'Chưa ghi nhận bệnh lý mãn tính',
      diagnosis: 'Tư vấn y khoa / Khám sức khỏe định kỳ'
    }
  }
]

export function DashboardTab({
  onNavigateTab,
  onViewPatientProfile,
  onViewChatMessage
}: {
  onNavigateTab?: (tab: string) => void;
  onViewPatientProfile?: (patientId: string) => void;
  onViewChatMessage?: (chatId: string) => void;
}) {
  const [selectedFilter, setSelectedFilter] = useState<string>('Hôm nay')
  const filterOptions = ['Hôm nay', 'Tuần này', 'Tháng này']
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>('1')
 
  // Core state: Admitted Patient in clinic room, dynamically changing
  const [activePatientId, setActivePatientId] = useState<string>('15') // Default is 'Phan Văn R'
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Clinical intake form states (for popup modal)
  const [showExamModal, setShowExamModal] = useState<boolean>(false)
  const [examModalMode, setExamModalMode] = useState<'record' | 'ai'>('record')
  const [symptoms, setSymptoms] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [prescription, setPrescription] = useState('')

  // Detailed EMR viewing states (local tab rendering)
  const [viewingPatientId, setViewingPatientId] = useState<string | null>(null)
  const [selectedEncounterIdx, setSelectedEncounterIdx] = useState<number>(0)

  const activePatient = clinicalPatientsMap[activePatientId] || clinicalPatientsMap['2']

  // Dynamic state: check if the selected patient is 'Đang khám' in the timeline
  const patientTimelineEntry = todayTimeline.find(t => t.patientId === activePatient.id)
  const isCurrentlyExamining = patientTimelineEntry?.status === 'Đang khám'

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  const handleSaveExamination = () => {
    if (!symptoms.trim() || !diagnosis.trim()) {
      triggerToast('⚠️ Vui lòng nhập mô tả bệnh và chẩn đoán cuối cùng trước khi lưu!')
      return
    }
    triggerToast(`✓ Đã lưu hồ sơ khám & kê đơn thuốc cho bệnh nhân ${activePatient.name} thành công!`)
    setShowExamModal(false)
    setExamModalMode('record')
    setSymptoms('')
    setDiagnosis('')
    setPrescription('')
  }

  const resetExamDraft = () => {
    setExamModalMode('record')
    setSymptoms(activePatient.reason)
    setDiagnosis('')
    setPrescription('')
  }

  const icons = {
    pulse: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    message: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  };

  // Metrics multipliers
  const filterMultiplier = selectedFilter === 'Tuần này' ? 5 : selectedFilter === 'Tháng này' ? 20 : 1
  const stats = {
    todayPatients: 12 * filterMultiplier,
    pendingReplies: 2 * filterMultiplier,
    todayConsultations: 2 * filterMultiplier,
    aiUrgentAlerts: 1 * filterMultiplier,
  }

  // Admit patient to room via timeline click
  const handleAdmitPatient = (patientId: string, name: string) => {
    setActivePatientId(patientId)
  }

  // If detailed EMR is being viewed locally, render the high-fidelity EMR container immediately
  if (viewingPatientId) {
    const p = initialPatients.find(pat => pat.id === viewingPatientId)

    if (p) {
      const enc = p.pastEncounters[selectedEncounterIdx] || p.pastEncounters[0]
      const activePatientFromMap = clinicalPatientsMap[viewingPatientId]

      return (
        <div className="emr-view-container">
          {toastMessage && <div className="dashboard-action-toast">{toastMessage}</div>}

          {/* Return Button to Dashboard */}
          <ReturnButton
            onClick={() => {
              setViewingPatientId(null)
              setSelectedEncounterIdx(0)
            }}
            title="Quay lại Dashboard"
            style={{ marginBottom: '16px' }}
          />

          {/* EMR Top Title Header */}
          <div className="emr-view-header-block">
            <h1 className="emr-view-title">HỒ SƠ BỆNH ÁN CHI TIẾT</h1>
          </div>

          {/* Profile Card Section */}
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

          {/* Current Appointment & Intake Prep Info */}
          {activePatientFromMap && (
            <article className="emr-column-card" style={{ marginBottom: '20px' }}>
              <h3 className="emr-column-title" style={{ color: '#2563EB', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Ca khám hiện tại & Lý do khám
              </h3>
              <div className="emr-appointment-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginTop: '16px' }}>
                <div className="appt-info-block" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="appt-detail-row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="appt-detail-label" style={{ color: '#718096', fontSize: '13px', fontWeight: 600, minWidth: '120px' }}>Thời gian khám:</span>
                    <span className="time-highlight" style={{ fontSize: '13px', fontWeight: 700, padding: '4px 12px', background: '#EFF6FF', color: '#2563EB', borderRadius: '100px', border: '1px solid rgba(59, 130, 246, 0.08)', whiteSpace: 'nowrap' }}>
                      {activePatientFromMap.timeSlot}
                    </span>
                  </div>
                  <div className="appt-detail-row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="appt-detail-label" style={{ color: '#718096', fontSize: '13px', fontWeight: 600, minWidth: '120px' }}>Loại hình khám:</span>
                    <strong style={{ color: '#244A6B', fontSize: '14px' }}>Khám lâm sàng</strong>
                  </div>
                  <div className="appt-detail-row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="appt-detail-label" style={{ color: '#718096', fontSize: '13px', fontWeight: 600, minWidth: '120px' }}>Trạng thái:</span>
                    <span className="status-pill processing">Đang chọn khám</span>
                  </div>
                </div>
                <div className="appt-reason-block" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span className="appt-detail-label" style={{ color: '#718096', fontSize: '13px', fontWeight: 600 }}>Lý do khám & Triệu chứng đăng ký:</span>
                  <p className="appt-reason-text" style={{ margin: '4px 0 0', padding: '12px 16px', background: '#FFF7ED', borderLeft: '4px solid #EA580C', borderRadius: '6px', color: '#C2410C', fontWeight: 600, fontSize: '13.5px', lineHeight: '1.5' }}>
                    {activePatientFromMap.reason}
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* Two-Column Info Cards (Visit History in Left Column, Medical History & Allergies in Right Column) */}
          <div className="emr-two-columns">
            {/* Column 1: Lịch sử lượt khám gần đây (Left) */}
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

            {/* Column 2: Tiền sử & Cảnh báo dị ứng (Right) */}
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

          {/* Vertical Records List Section */}
          {enc && (
            <section className="emr-records-section" style={{ marginTop: '20px' }}>
              <div className="emr-encounter-block">
                <div className="emr-records-row">
                  <span className="emr-records-label">Triệu chứng & Lâm sàng</span>
                  <div className="emr-records-value-box">
                    <strong style={{ display: 'block', marginBottom: '6px' }}>Khám ngày: {enc.date} (Đảm nhận: {enc.doctor})</strong>
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

          {/* Action buttons at bottom right */}
          <div className="emr-buttons-group">
            <button className="emr-btn-outline" type="button" onClick={() => triggerToast(`Đang kết nối máy in để in đơn thuốc của bệnh nhân ${p.name}...`)}>
              In đơn thuốc
            </button>
            <button className="emr-btn-filled" type="button" onClick={() => triggerToast(`Đang xuất file bệnh án EMR (PDF) của bệnh nhân ${p.name}...`)}>
              Xuất file bệnh án (PDF)
            </button>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="figma-dashboard-tab">
      {toastMessage && <div className="dashboard-action-toast">{toastMessage}</div>}

      {/* Header section */}
      <header className="patient-tab-header">
        <div className="tab-titles">
          <h1>Dashboard</h1>
          <p>Trang xem thống kê của bác sĩ</p>
        </div>

        <div className="header-right-filter">
          <FilterSelect
            value={selectedFilter}
            options={filterOptions.map(opt => ({ label: opt, value: opt }))}
            onChange={(e) => setSelectedFilter(e.target.value)}
          />
        </div>
      </header>

      {/* Metrics Row */}
      <section className="figma-metrics-row">
        <MetricCard label="Tổng bệnh nhân hôm nay" value={stats.todayPatients} delta="Gồm ca trực tiếp và tư vấn" icon={icons.pulse} iconClassName="metric-icon-blue" />
        <MetricCard label="Tin nhắn cần phản hồi" value={stats.pendingReplies} delta="Đang chờ bác sĩ trả lời" icon={icons.message} iconClassName="metric-icon-green" />
        <MetricCard label="Ca tư vấn hôm nay" value={stats.todayConsultations} delta="Tư vấn từ xa qua chat" icon={icons.clock} iconClassName="metric-icon-yellow" />
        <MetricCard label="Số ca cảnh báo khẩn cấp" value={stats.aiUrgentAlerts} delta="AI phát hiện, cần kiểm tra" icon={icons.star} iconClassName="metric-icon-pink" />
      </section>

      {/* Main Grid */}
      <div className="figma-dashboard-grid">

        {/* Left Column: Direct exam schedule with the active case expanded inline */}
        <div className="grid-column-left">

          <section className="figma-section-card today-timeline-card">
            <div className="section-header">
              <h2>Ca khám trực tiếp hôm nay</h2>
              <span className="timeline-date-stamp">Thứ Sáu, 29/05</span>
            </div>

            <div className="timeline-flow-wrapper">
              {todayTimeline.map((item, idx) => {
                const isExamining = item.status === 'Đang khám';
                const isCompleted = item.status === 'Đã khám';
                const isActiveAdmitted = item.patientId === activePatientId;
                const itemPatient = clinicalPatientsMap[item.patientId];

                return (
                  <div
                    className={`timeline-time-node ${isExamining ? 'active' : isCompleted ? 'completed' : ''} ${isActiveAdmitted ? 'admitted-node' : ''}`}
                    key={idx}
                    onClick={() => handleAdmitPatient(item.patientId, item.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="node-time">{item.time.split(' - ')[0]}</div>

                    <div className="node-connector-block">
                      <div className="node-dot"></div>
                      <div className="node-vertical-line"></div>
                    </div>

                    <div className="timeline-node-content">
                      <div className={`node-details-card ${isActiveAdmitted && itemPatient ? 'expanded-active-card' : ''}`}>
                        <div className="card-top-row">
                          <h4>{item.name}</h4>
                          <div className="status-tag-group">
                            {item.priority === 'Khẩn cấp' && (
                              <span className="status-tag urgent-alert">Khẩn cấp</span>
                            )}
                            <span className={`status-tag ${isCompleted ? 'done' : isExamining ? 'processing' : 'waiting'}`}>
                              {item.status === 'Đã khám' ? 'Đã kết thúc' : item.status}
                            </span>
                          </div>
                        </div>
                        <div className="card-bottom-row">
                          <span className="service-desc">{item.type}</span>
                        </div>

                        {isActiveAdmitted && itemPatient && (
                          <div className="timeline-inline-details" onClick={(event) => event.stopPropagation()}>
                            <div className="inline-patient-meta">
                              <span>{itemPatient.gender} • {itemPatient.age} tuổi</span>
                              <span className="sub-tag code-style">{itemPatient.code}</span>
                            </div>

                            <div className="expanded-exam-clinical">
                              <div className="compact-detail-row">
                                <span className="block-label">Thời gian</span>
                                <strong className="detail-val-time compact-detail-time">
                                  {itemPatient.timeSlot}
                                </strong>
                              </div>
                              <div className="compact-detail-row reason-row">
                                <span className="block-label">Lý do khám</span>
                                <p className="detail-val-reason compact-detail-reason">{itemPatient.reason}</p>
                              </div>
                            </div>

                            <div className="expanded-exam-actions">
                              <button
                              className="btn-exam-action-filled"
                              onClick={() => {
                                resetExamDraft()
                                setShowExamModal(true)
                              }}
                            >
                                Kết luận bệnh & kê đơn
                              </button>
                              <button
                                className="btn-exam-action-outline"
                                onClick={() => {
                                  setViewingPatientId(itemPatient.id)
                                  setSelectedEncounterIdx(0)
                                }}
                              >
                                Xem hồ sơ bệnh án chi tiết
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Waiting messages */}
        <div className="grid-column-right">
          <section className="figma-section-card waiting-messages-card">
            <div className="section-header">
              <div className="title-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <h2>Tin nhắn đang chờ phản hồi</h2>
                <span className="waiting-messages-count" style={{ fontSize: '12px', color: '#718096', fontWeight: 500 }}>
                  Có {messages.length} tin nhắn đang chờ xử lý
                </span>
              </div>
              <button className="view-all-btn" onClick={() => onNavigateTab?.('Tư vấn trực tiếp')}>
                Mở khung chat {ChevronIcon()}
              </button>
            </div>

            <div className="list-container slender-list">
              {messages.slice(0, 3).map((m, idx) => {
                const isExpanded = expandedMessageId === m.id;
                return (
                  <div
                    className={`slender-message-row ${m.unread ? 'unread' : ''} ${isExpanded ? 'expanded' : ''}`}
                    key={idx}
                    onClick={() => setExpandedMessageId(isExpanded ? null : m.id)}
                  >
                    <div className="avatar-placeholder-slender">
                      {m.name.split(' ').pop()?.[0]}
                    </div>
                    <div className="slender-meta">
                      <div className="message-summary-row">
                        <div className="slender-name-row-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                          <div className="slender-name-row">
                            <strong className={m.unread ? 'unread-bold' : ''}>{m.name}</strong>
                            {m.unread && <span className="unread-dot-indicator"></span>}
                          </div>
                          {m.waitingTime && (
                            <span className="waiting-time-label" style={{ fontSize: '11px', color: '#EF4444', fontWeight: 600 }}>
                              | Thời gian chờ phản hồi: {m.waitingTime}
                            </span>
                          )}
                        </div>
                        <span className="message-sent-time">{m.sentAt}</span>
                      </div>
                      <p className={`slender-preview ${m.unread ? 'unread-bold' : ''}`} style={isExpanded ? { whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', marginBottom: '8px' } : undefined}>
                        {m.text}
                      </p>
                      
                      <div className="slender-actions-row" style={{ display: 'flex', alignItems: 'center', marginTop: '6px' }}>
                        <button
                          className="reply-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onViewChatMessage) onViewChatMessage(m.id);
                            else onNavigateTab?.('Tư vấn trực tiếp');
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '3px' }}>
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          Phản hồi
                        </button>
                      </div>

                      {isExpanded && m.aiExtract && (
                        <div className="ai-clinical-extract-box" onClick={(e) => e.stopPropagation()}>
                          <div className="ai-extract-header">CHATBOT AI TRÍCH XUẤT LÂM SÀNG:</div>
                          <ul className="ai-extract-list">
                            <li><span className="bullet-label">• Triệu chứng:</span> {m.aiExtract.symptoms}</li>
                            <li><span className="bullet-label">• Tiền sử:</span> {m.aiExtract.history}</li>
                            <li><span className="bullet-label">• Chẩn đoán sơ bộ:</span> {m.aiExtract.diagnosis}</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

      </div>

      {/* EMR Popup Modal for writing medical record directly on Dashboard */}
      {showExamModal && activePatient && typeof document !== 'undefined' && createPortal((
        <div className="emr-modal-overlay">
          <div className="emr-modal-container">
            <div className="emr-modal-header">
              <div>
                <h3>{examModalMode === 'record' ? 'Kết luận bệnh & kê đơn' : 'Gợi ý AI tham khảo'}</h3>
                <p>{examModalMode === 'record' ? 'Bác sĩ ghi nhận triệu chứng, xác nhận chẩn đoán và kê đơn.' : 'AI chỉ hỗ trợ tham khảo, không thay thế kết luận của bác sĩ.'}</p>
              </div>
              <button className="close-modal-btn" onClick={() => setShowExamModal(false)}>×</button>
            </div>
            <div className="emr-modal-patient-info">
              <span>Bệnh nhân: <strong>{activePatient.name} ({activePatient.gender}, {activePatient.age} tuổi)</strong></span>
              <span>Mã bệnh nhân: <strong>{activePatient.code}</strong></span>
            </div>
            <div className="emr-modal-body">
              {examModalMode === 'record' ? (
                <section className="doctor-final-panel compact-record-flow">
                  <div className="record-section-heading">
                    <h4>Ghi nhận & kết luận</h4>
                    <span>Bác sĩ xác nhận</span>
                  </div>

                  <div className="record-form-grid compact-flow-grid">
                    <div className="form-input-group full-span">
                      <label htmlFor="patient-symptoms">Ghi nhận triệu chứng <span className="required-star">*</span></label>
                      <textarea
                        id="patient-symptoms"
                        value={symptoms}
                        onChange={e => setSymptoms(e.target.value)}
                        placeholder="VD: Tê bì châm chích đầu ngón tay, ngón chân đối xứng; xuất hiện nhiều về đêm..."
                        rows={2}
                      />
                    </div>

                    <div className="form-input-group">
                      <label htmlFor="clinical-diagnosis">Kết luận của bác sĩ <span className="required-star">*</span></label>
                      <textarea
                        id="clinical-diagnosis"
                        value={diagnosis}
                        onChange={e => setDiagnosis(e.target.value)}
                        placeholder="VD: Theo dõi bệnh lý thần kinh ngoại biên mức độ nhẹ..."
                        rows={2}
                      />
                    </div>

                    <div className="form-input-group">
                      <label htmlFor="clinical-prescription">Kê đơn & dặn dò</label>
                      <textarea
                        id="clinical-prescription"
                        value={prescription}
                        onChange={e => setPrescription(e.target.value)}
                        placeholder="VD: Vitamin B1-B6-B12 sau ăn; tái khám sau 7 ngày nếu không giảm..."
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="ai-entry-strip">
                    <div>
                      <strong>Cần tham khảo AI trước khi kết luận?</strong>
                      <p>AI gợi ý bệnh có thể gặp, câu hỏi nên hỏi thêm và hướng đơn thuốc tham khảo.</p>
                    </div>
                    <button className="emr-btn-outline compact-ai-btn" type="button" onClick={() => setExamModalMode('ai')}>
                      Xem gợi ý AI
                    </button>
                  </div>
                </section>
              ) : (
                <section className="clinical-ai-panel ai-full-panel">
                  <div className="ai-support-list ai-support-grid">
                    <div className="ai-support-card">
                      <span>Tóm tắt triệu chứng</span>
                      <p>{symptoms || activePatient.reason}</p>
                    </div>
                    <div className="ai-support-card warning">
                      <span>Dấu hiệu cần hỏi thêm</span>
                      <ul>
                        <li>Có yếu cơ, mất cảm giác nhanh hoặc đau tăng dần không?</li>
                        <li>Có tiền sử đái tháo đường, thiếu vitamin B12 hoặc dùng thuốc mới không?</li>
                      </ul>
                    </div>
                    <div className="ai-support-card">
                      <span>Bệnh có thể gặp</span>
                      <ul>
                        <li>Bệnh lý thần kinh ngoại biên.</li>
                        <li>Thiếu vitamin nhóm B hoặc rối loạn chuyển hóa.</li>
                        <li>Chèn ép thần kinh do tư thế/lao động lặp lại.</li>
                      </ul>
                    </div>
                    <div className="ai-support-card">
                      <span>Đơn thuốc tham khảo</span>
                      <p>Vitamin nhóm B, thuốc giảm đau phù hợp nếu đau nhiều, hẹn tái khám hoặc làm xét nghiệm theo đánh giá của bác sĩ.</p>
                    </div>
                  </div>
                </section>
              )}
            </div>
            <div className="emr-modal-footer">
              {examModalMode === 'ai' ? (
                <button className="emr-btn-outline" onClick={() => setExamModalMode('record')}>Quay lại nhập bệnh án</button>
              ) : (
                <button className="emr-btn-outline" onClick={() => setShowExamModal(false)}>Hủy</button>
              )}
              <button className="emr-btn-filled" onClick={handleSaveExamination}>Lưu kết luận & đơn thuốc</button>
            </div>
          </div>
        </div>
      ), document.body)}
    </div>
  );
}
