import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FilterSelect } from '../../../components/ui/FilterSelect'
import { MetricCard } from '../../../components/ui/MetricCard'
import { ReturnButton } from '../../../components/ui/ReturnButton'
import { PrimaryButton } from '../../../components/ui/ActionButton'
import { ClockMetricIcon, PulseMetricIcon, CalendarMetricIcon } from '../../../components/ui/metricIcons'
import { initialPatients } from '../patients/PatientListTab'
import '../patients/PatientListTab.css'
import './DashboardTab.css'

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const getReasonKeywords = (reason: string): string[] => {
  const trimmed = reason.trim();
  const keywordMap: Record<string, string[]> = {
    'Đau ngực trái kéo dài, lan ra vai trái': ['Đau ngực trái', 'Kéo dài', 'Lan vai trái'],
    'Đau quặn dữ dội hố chậu phải kèm sốt nhẹ': ['Đau quặn', 'Hố chậu phải', 'Sốt nhẹ'],
    'Tê bì châm chích đầu ngón tay ngón chân đối xứng': ['Tê bì', 'Đầu ngón tay', 'Đối xứng'],
    'Sốt cao co giật nhẹ, đau rát họng': ['Sốt cao', 'Co giật nhẹ', 'Đau rát họng'],
    'Hắt hơi nhiều, ngứa mũi dị ứng phấn hoa': ['Hắt hơi nhiều', 'Ngứa mũi', 'Dị ứng phấn hoa'],
    'Đau chói khớp vai phải khi nhấc tay lên cao': ['Đau chói khớp vai', 'Khớp vai phải', 'Nhấc tay lên cao'],
    'Đau mỏi cổ vai gáy sau khi làm việc máy tính lâu': ['Đau mỏi cổ vai gáy', 'Làm việc máy tính'],
    'Tái khám định kỳ tăng huyết áp và đái tháo đường': ['Tái khám định kỳ', 'Tăng huyết áp', 'Đái tháo đường']
  };
  
  if (keywordMap[trimmed]) {
    return keywordMap[trimmed];
  }
  
  // Dynamic fallback
  let parts = [trimmed];
  for (const sep of [',', ' kèm ', ' và ', ' hoặc ']) {
    parts = parts.flatMap(p => p.split(sep));
  }
  const keywords = parts.map(p => p.trim()).filter(p => p.length > 0);
  return keywords.length > 0 ? keywords : [trimmed];
};

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

const todayTimeline = [
  { time: '08:00 - 08:30', patientId: '25', name: 'Dương Thị Hoa', type: 'Khám trực tiếp', status: 'Đã khám' },
  { time: '10:00 - 10:30', patientId: '15', name: 'Phan Văn R', type: 'Khám trực tiếp', status: 'Đang khám' },
  { time: '11:00 - 11:30', patientId: '1', name: 'Nguyễn Văn A', type: 'Khám trực tiếp', status: 'Đang chờ' },
  { time: '14:00 - 14:30', patientId: '9', name: 'Lê Hoàng Nam', type: 'Khám trực tiếp', status: 'Đang chờ' },
  { time: '15:00 - 15:30', patientId: '7', name: 'Vũ Thị H', type: 'Khám trực tiếp', status: 'Đang chờ' },
  { time: '16:00 - 16:30', patientId: '8', name: 'Phạm Bích Vân', type: 'Khám trực tiếp', status: 'Đang chờ' }
]

const patientContextTagsMap: Record<string, string[]> = {
  '25': ['Khẩn cấp', 'Đau ruột thừa'],
  '15': ['ĐTĐ type 2', 'Tái khám', 'THA', 'Dị ứng thuốc'],
  '1': ['Sốt cao', 'Cần khám'],
  '9': ['Tăng huyết áp', 'Tái khám'],
  '7': ['Khớp vai', 'Khẩn cấp', 'Đau cấp'],
  '8': ['Đau mỏi cổ', 'Lao động lâu']
};



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
    unread: true,
    severity: 'low',
    waitingTime: '45 phút',
    aiExtract: {
      symptoms: 'Có nhu cầu đăng ký và tư vấn gói khám sức khỏe tổng quát định kỳ.',
      history: 'Chưa ghi nhận bệnh lý mãn tính',
      diagnosis: 'Tư vấn y khoa / Khám sức khỏe định kỳ'
    }
  }
]

function PatientAvatar() {
  return (
    <div className="doctor-avatar doctor-detail-default-avatar" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0v1H5v-1Z" />
      </svg>
    </div>
  )
}

function IdCardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M7 15c.6-1.4 1.6-2.1 3-2.1S12.4 13.6 13 15" />
      <path d="M14.5 10h3M14.5 14h3" />
    </svg>
  )
}

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h3 className="doctor-detail-section-heading">
      <span className="doctor-detail-section-icon" aria-hidden="true">
        {icon}
      </span>
      {title}
    </h3>
  )
}

function InfoItem({ label, value, icon, className }: { label: string; value: React.ReactNode; icon?: React.ReactNode; className?: string }) {
  return (
    <div className={`doctor-info-item ${className || ''}`}>
      {icon ? (
        <span className="doctor-info-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  )
}

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
  const [showEncounterHistory, setShowEncounterHistory] = useState(false)

  const [reviewedPatientIds, setReviewedPatientIds] = useState<string[]>(['25'])
  const [consultationSeconds, setConsultationSeconds] = useState<number>(1080) // Starts at 18 mins (1080 seconds)

  useEffect(() => {
    const interval = setInterval(() => {
      setConsultationSeconds(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const markAsReviewed = (patientId: string) => {
    if (!reviewedPatientIds.includes(patientId)) {
      setReviewedPatientIds(prev => [...prev, patientId])
    }
  }

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

  const getNextTimelinePatient = (currentPatientId: string) => {
    const currentIndex = todayTimeline.findIndex(item => item.patientId === currentPatientId)
    if (currentIndex === -1) {
      return todayTimeline.find(item => item.status === 'Đang chờ') || todayTimeline[0]
    }

    const nextItem = todayTimeline.slice(currentIndex + 1).find(item => item.status !== 'Đã khám')
    if (nextItem) return nextItem

    return todayTimeline.find(item => item.status === 'Đang chờ') || todayTimeline[0]
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  const handleSaveExamination = () => {
    if (!symptoms.trim() || !diagnosis.trim()) {
      triggerToast('⚠️ Vui lòng nhập mô tả bệnh và chẩn đoán cuối cùng trước khi lưu!')
      return
    }
    const nextPatient = getNextTimelinePatient(activePatient.id)
    triggerToast(`✓ Đã hoàn thành ca khám của ${activePatient.name}. Chuyển sang bệnh nhân tiếp theo: ${nextPatient.name}.`)
    setShowExamModal(false)
    setExamModalMode('record')
    setSymptoms('')
    setDiagnosis('')
    setPrescription('')
    setActivePatientId(nextPatient.patientId)
  }

  const handleApplyAiSuggestion = () => {
    setSymptoms(symptoms.trim() || activePatient.reason)
    setDiagnosis('Theo dõi bệnh lý thần kinh ngoại biên; cần loại trừ thiếu vitamin nhóm B, rối loạn chuyển hóa hoặc chèn ép thần kinh do tư thế/lao động lặp lại.')
    setPrescription('Hỏi thêm về yếu cơ, mất cảm giác nhanh hoặc đau tăng dần. Có thể cân nhắc vitamin nhóm B sau ăn, thuốc giảm đau phù hợp nếu đau nhiều; hẹn tái khám hoặc làm xét nghiệm theo đánh giá của bác sĩ.')
    setExamModalMode('record')
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
        <div className="doctor-detail-main doctor-patient-detail-main" style={{ minHeight: '100%', overflow: 'visible', display: 'flex', flexDirection: 'column', padding: '0px' }}>
          {toastMessage && <div className="dashboard-action-toast">{toastMessage}</div>}
          <section className="doctor-page-content" style={{ minHeight: '100%', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'visible' }}>
            <div className="doctor-detail-actions" style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <PrimaryButton variant="secondary" onClick={() => {
                setViewingPatientId(null)
                setSelectedEncounterIdx(0)
              }}>
                <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '16px', height: '16px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', marginRight: '6px' }}>
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Quay lại
              </PrimaryButton>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="emr-btn-filled"
                  type="button"
                  onClick={() => {
                    markAsReviewed(p.id)
                    setActivePatientId(p.id)
                    const patientDetails = clinicalPatientsMap[p.id] || p
                    setSymptoms(patientDetails.reason || '')
                    setDiagnosis('')
                    setPrescription('')
                    setExamModalMode('record')
                    setViewingPatientId(null)
                    setShowExamModal(true)
                  }}
                  style={{ background: '#10B981', borderColor: '#10B981', color: '#FFFFFF', padding: '0 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}
                >
                  Kê đơn thuốc
                </button>
                <PrimaryButton
                  variant="secondary"
                  onClick={() => triggerToast(`Đang kết nối máy in để in đơn thuốc của bệnh nhân ${p.name}...`)}
                >
                  In đơn thuốc
                </PrimaryButton>
                <PrimaryButton
                  variant="primary"
                  onClick={() => triggerToast(`Đang xuất file bệnh án EMR (PDF) của bệnh nhân ${p.name}...`)}
                >
                  Xuất file bệnh án (PDF)
                </PrimaryButton>
              </div>
            </div>

            <section className="doctor-detail-dashboard" style={{ flex: '1 1 auto', minHeight: 0, overflow: 'visible', display: 'grid', gridTemplateColumns: 'minmax(282px, 0.74fr) minmax(0, 1.26fr)', gap: '12px' }}>
              <aside className="doctor-detail-left-column" style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>
                <article className="doctor-detail-panel doctor-detail-profile-panel" style={{ flex: '0 0 auto' }}>
                  <div className="doctor-detail-profile-head">
                    <PatientAvatar />
                    <div className="doctor-detail-profile-copy">
                      <h1>{p.name}</h1>
                    </div>
                  </div>
                  <div className="doctor-detail-info-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                    <InfoItem label="Mã bệnh nhân" value={p.code} icon={<IdCardIcon />} />
                    <InfoItem label="Giới tính" value={p.gender} />
                    <InfoItem label="Tuổi" value={`${p.age} tuổi`} />
                    <InfoItem label="Số điện thoại" value={p.phone} />
                    <InfoItem label="Nhóm máu" value={p.bloodType} />
                  </div>
                </article>

                {/* Tiền sử & Cảnh báo dị ứng */}
                <article className="doctor-detail-panel doctor-detail-history-panel" style={{ flex: '0 0 auto', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
                  <SectionHeading icon={<PulseMetricIcon />} title="Tiền sử & Cảnh báo dị ứng" />
                  <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '2px' }}>
                    <div style={{ padding: '10px 14px', borderRadius: '12px', background: p.allergies.length > 0 ? '#FEF2F2' : '#F0FDF4', border: '1px solid', borderColor: p.allergies.length > 0 ? '#FCA5A5' : '#86EFAC' }}>
                      <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: p.allergies.length > 0 ? '#DC2626' : '#16A34A', marginBottom: '4px' }}>Dị ứng ghi nhận</span>
                      <strong style={{ fontSize: '14px', color: p.allergies.length > 0 ? '#991B1B' : '#14532D' }}>
                        {p.allergies.length > 0 ? p.allergies.join(', ') : 'Chưa ghi nhận dị ứng'}
                      </strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#7f91a4', marginBottom: '6px' }}>Tiền sử bệnh lý</span>
                      <ul className="history-bullets" style={{ margin: 0, paddingLeft: '18px', color: '#244a6b', fontSize: '14px', lineHeight: 1.5 }}>
                        {p.history.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </aside>

              <section className="doctor-detail-right-column" style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>
                {/* Vitals Stats Grid */}
                <div className="metrics-grid doctor-detail-stats-grid" style={{ flex: '0 0 auto' }}>
                  <MetricCard
                    label="Huyết áp (BP)"
                    value={p.vitals.bp}
                    icon={<PulseMetricIcon />}
                    iconClassName="metric-icon-blue"
                  />
                  <MetricCard
                    label="Nhịp tim"
                    value={`${p.vitals.hr} bpm`}
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    }
                    iconClassName="metric-icon-yellow"
                  />
                  <MetricCard
                    label="Nhiệt độ"
                    value={`${p.vitals.temp} °C`}
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                        <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
                      </svg>
                    }
                    iconClassName="metric-icon-green"
                  />
                  <MetricCard
                    label="Chỉ số SpO2"
                    value={`${p.vitals.spo2}%`}
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                        <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7Z" />
                      </svg>
                    }
                    iconClassName="metric-icon-purple"
                  />
                </div>

                {/* Lịch sử lượt khám gần đây */}
                <article className="doctor-detail-panel doctor-detail-review-panel" style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column' }}>
                  <div className="doctor-detail-panel-title-row" style={{ flex: '0 0 auto', marginBottom: '8px' }}>
                    <SectionHeading icon={<CalendarMetricIcon />} title="Lịch sử lượt khám gần đây" />
                    <div className="patient-history-summary">
                      <span>{p.pastEncounters.length} lần đã khám</span>
                      <button type="button" onClick={() => setShowEncounterHistory(true)}>
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '180px', paddingRight: '4px' }}>
                    {p.pastEncounters.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className={`doctor-detail-review-item ${selectedEncounterIdx === idx ? 'active' : ''}`}
                        style={{
                          cursor: 'pointer',
                          borderColor: selectedEncounterIdx === idx ? '#3B82F6' : undefined,
                          background: selectedEncounterIdx === idx ? '#E6EFFE' : undefined,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          padding: '10px 14px',
                          borderRadius: '16px',
                          border: '1px solid #e4f0ff',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => setSelectedEncounterIdx(idx)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifySpace: 'between', justifyContent: 'space-between', width: '100%' }}>
                          <strong style={{ fontSize: '14px', color: '#1a365d', fontWeight: 800 }}>{item.doctor}</strong>
                          <span style={{ color: selectedEncounterIdx === idx ? '#3B82F6' : '#718096', fontSize: '12px', fontWeight: 800 }}>
                            {item.date} {selectedEncounterIdx === idx && ' • ĐANG CHỌN'}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#4a5568', lineHeight: 1.45 }}>{item.diagnosis}</p>
                      </div>
                    ))}
                  </div>
                </article>

                {/* Chi tiết lượt khám được chọn */}
                <article className="doctor-detail-panel doctor-detail-activity-panel" style={{ flex: '0 0 auto', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
                  <div style={{ flex: '0 0 auto' }}>
                    <SectionHeading icon={<ClockMetricIcon />} title="Chi tiết lượt khám được chọn" />
                  </div>
                  <div style={{ flex: '0 1 auto', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0, paddingRight: '4px' }}>
                    {enc ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '16px', background: '#E6EFFE', border: '1px solid #DCEBFF' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff', border: '1px solid #DCEBFF', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                            <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: '#3B82F6' }}>
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                          <div>
                            <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase' }}>Bác sĩ phụ trách</span>
                            <strong style={{ display: 'block', color: '#244a6b', fontSize: '14px', fontWeight: 800 }}>{enc.doctor}</strong>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div style={{ padding: '10px 12px', borderRadius: '16px', background: '#E6EFFE', border: '1px solid #DCEBFF' }}>
                            <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase', marginBottom: '2px' }}>Khám ngày</span>
                            <strong style={{ color: '#244a6b', fontSize: '14px', fontWeight: 700 }}>{enc.date}</strong>
                          </div>
                          <div style={{ padding: '10px 12px', borderRadius: '16px', background: '#FFF8E1', border: '1px solid #FFE0B2' }}>
                            <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#E65100', textTransform: 'uppercase', marginBottom: '2px' }}>Chẩn đoán y khoa</span>
                            <strong style={{ color: '#E65100', fontSize: '14px', fontWeight: 800 }}>{enc.diagnosis}</strong>
                          </div>
                        </div>

                        <div style={{ padding: '10px 12px', borderRadius: '16px', background: '#fcfdff', border: '1px solid #dcecff' }}>
                          <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#7f91a4', textTransform: 'uppercase', marginBottom: '4px' }}>Triệu chứng & Lâm sàng</span>
                          <p style={{ margin: 0, color: '#4a5568', fontSize: '13px', lineHeight: 1.5 }}>{enc.symptoms}</p>
                        </div>

                        <div style={{ padding: '10px 12px', borderRadius: '16px', background: '#fcfdff', border: '1px solid #dcecff' }}>
                          <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#7f91a4', textTransform: 'uppercase', marginBottom: '4px' }}>Đơn thuốc kê chi tiết</span>
                          {enc.prescription.length > 0 ? (
                            <ul style={{ margin: 0, paddingLeft: '16px', color: '#244a6b', fontSize: '13px', lineHeight: 1.5 }}>
                              {enc.prescription.map((drug, dIdx) => (
                                <li key={dIdx} style={{ fontWeight: 600, marginBottom: '2px' }}>{drug}</li>
                              ))}
                            </ul>
                          ) : (
                            <span style={{ color: '#a0aec0', fontSize: '13px', fontStyle: 'italic' }}>Không kê đơn thuốc</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="doctor-detail-empty-note">Không có chi tiết lượt khám được chọn.</p>
                    )}
                  </div>
                </article>
              </section>
            </section>
          </section>

          {showEncounterHistory ? (
            <div className="confirm-overlay patient-history-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="patient-history-title">
              <div className="confirm-dialog patient-history-modal">
                <div className="detail-modal-header">
                  <h2 id="patient-history-title">Lịch sử lượt khám</h2>
                  <PrimaryButton variant="ghost" onClick={() => setShowEncounterHistory(false)}>
                    Đóng
                  </PrimaryButton>
                </div>
                <div className="doctor-review-modal-list patient-history-modal-list">
                  {p.pastEncounters.map((item, idx) => (
                    <button
                      type="button"
                      key={`${item.date}-${idx}`}
                      className={`doctor-detail-review-item ${selectedEncounterIdx === idx ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedEncounterIdx(idx)
                        setShowEncounterHistory(false)
                      }}
                    >
                      <span>{item.date} · {item.doctor}</span>
                      <strong>{item.diagnosis}</strong>
                      <p>{item.symptoms}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
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
        <MetricCard label="Ca tư vấn hôm nay" value={stats.todayConsultations} delta="Tư vấn từ xa qua chat" icon={icons.clock} iconClassName="metric-icon-gray" />
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

                // Find active index
                const activeIndex = todayTimeline.findIndex(t => t.status === 'Đang khám');
                // Find next soon index (first waiting node after active)
                const nextSoonIndex = todayTimeline.findIndex((t, tIdx) => tIdx > activeIndex && t.status === 'Đang chờ');
                const isNextSoon = idx === nextSoonIndex;

                return (
                  <div
                    className={`timeline-time-node ${isExamining ? 'active' : isCompleted ? 'completed' : ''} ${isNextSoon ? 'next-soon-node' : ''} ${isActiveAdmitted ? 'admitted-node' : ''}`}
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
                      {isActiveAdmitted && itemPatient ? (
                        /* Active Consultation Card (Visually Dominant) */
                        (() => {
                          const isReviewed = reviewedPatientIds.includes(itemPatient.id);
                          const minutes = Math.floor(consultationSeconds / 60);

                          return (
                            <div 
                              className="node-details-card active-consult-card" 
                              onClick={(event) => event.stopPropagation()}
                            >
                              <div className="active-card-header">
                                <div className="active-patient-header-info">
                                  <h3 className="active-patient-name">{itemPatient.name}</h3>
                                  <span className="active-patient-meta">{itemPatient.gender} • {itemPatient.age} tuổi</span>
                                </div>
                                {item.status === 'Đang khám' ? (
                                  <span className={`active-status-badge examining ${minutes >= 30 ? 'overtime' : ''}`}>
                                    <span className="status-dot">●</span> 
                                    ĐANG KHÁM • {minutes} phút
                                    {minutes >= 30 && <span className="overtime-warning-icon">⚠</span>}
                                  </span>
                                ) : item.status === 'Đang chờ' ? (
                                  <span className="active-status-badge upcoming">
                                    <span className="status-dot">●</span> 
                                    ĐANG CHỜ
                                  </span>
                                ) : (
                                  <span className="active-status-badge completed-status">
                                    <span className="status-dot">●</span> 
                                    ĐÃ KHÁM
                                  </span>
                                )}
                              </div>

                              <div className="active-card-body">
                                <div className="active-chief-complaint">
                                  <span className="complaint-label">Lý do khám:</span>
                                  <span className="complaint-text">{itemPatient.reason}</span>
                                </div>
                              </div>

                              <div className="active-card-actions">
                                {item.status === 'Đã khám' ? (
                                  <button
                                    className="btn-active-primary review-action"
                                    onClick={() => {
                                      setActivePatientId(itemPatient.id)
                                      setViewingPatientId(itemPatient.id)
                                      setSelectedEncounterIdx(0)
                                    }}
                                  >
                                    Xem hồ sơ bệnh án
                                  </button>
                                ) : isReviewed ? (
                                  <div className="active-card-actions-group">
                                    <button
                                      className="btn-active-primary progress-action"
                                      onClick={() => {
                                        setActivePatientId(itemPatient.id)
                                        setViewingPatientId(itemPatient.id)
                                        setSelectedEncounterIdx(0)
                                      }}
                                    >
                                      Tiếp tục khám
                                    </button>
                                    <button
                                      className="btn-active-secondary"
                                      onClick={() => {
                                        setActivePatientId(itemPatient.id)
                                        resetExamDraft()
                                        setShowExamModal(true)
                                      }}
                                    >
                                      Kết luận & kê đơn
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    className="btn-active-primary review-action"
                                    onClick={() => {
                                      setActivePatientId(itemPatient.id)
                                      setViewingPatientId(itemPatient.id)
                                      setSelectedEncounterIdx(0)
                                      markAsReviewed(itemPatient.id)
                                    }}
                                  >
                                    Xem hồ sơ bệnh án
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        /* Compact Waiting/Completed Card */
                        <div className={`node-details-card compact-appointment-card ${isCompleted ? 'completed-card' : ''}`}>
                          <div className="card-top-row">
                            <h4 className="patient-name">{item.name}</h4>
                            <div className="status-tag-group">


                              <span className={`status-tag ${isCompleted ? 'done' : isExamining ? 'processing' : 'waiting'}`}>
                                {isCompleted ? 'Đã kết thúc' : isExamining ? 'Đang khám' : 'Đang chờ'}
                              </span>
                            </div>
                          </div>
                          <div className="card-bottom-row">
                            <span className="service-desc">{item.type}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Waiting messages */}
        <div className="grid-column-right">
          <section className="figma-section-card processing-center-card">
            <div className="section-header">
              <h2>Trung tâm xử lý</h2>
            </div>

            <div className="processing-sections-wrapper">
              
              {/* SECTION 1: Khẩn cấp */}
              <div className="processing-section alert-danger-section">
                <div className="processing-section-header">
                  <span className="section-title text-danger">
                    Khẩn cấp
                  </span>
                </div>
                
                <div className="processing-card danger-card">
                  <div className="card-header-row">
                    <div className="patient-avatar-info">
                      <div className="avatar-placeholder-mini danger-avatar">T</div>
                      <div className="patient-info-text">
                        <strong>Trần Thu Thảo</strong> <span className="unread-dot"></span>
                        <div className="sub-text">Nữ • 28 tuổi</div>
                      </div>
                    </div>
                    <span className="time-history-text">
                      <span className="time">09:00</span>
                      <div className="history-desc">Hội chứng vành cấp</div>
                    </span>
                  </div>
                  
                  <p className="message-content-text">
                    <strong>Chatbot chuyển tuyến:</strong> Phát hiện triệu chứng nguy cơ cao (đau ngực trái dữ dội lan vai, khó thở nhẹ). Đã bàn giao bác sĩ xử lý khẩn cấp.
                  </p>
                  
                  <div className="danger-card-actions">
                    <button className="btn-action-filled danger" onClick={() => onViewChatMessage?.('2')}>Trả lời ngay</button>
                    <button className="btn-action-outline danger" onClick={() => onViewChatMessage?.('2')}>Video call</button>
                    <button className="btn-action-outline danger" onClick={() => {
                      setActivePatientId('2');
                      setViewingPatientId('2');
                      setSelectedEncounterIdx(0);
                    }}>Xem hồ sơ</button>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Chờ phản hồi */}
              <div className="processing-section">
                <div className="processing-section-header">
                  <span className="section-title">
                    Chờ phản hồi
                  </span>
                </div>
                
                <div className="cards-list-stacked">
                  {/* Nguyễn Văn A */}
                  <div className="processing-card normal-card">
                    <div className="card-header-row">
                      <div className="patient-avatar-info">
                        <div className="avatar-placeholder-mini">A</div>
                        <div className="patient-info-text">
                          <strong>Nguyễn Văn A</strong> <span className="unread-dot"></span>
                          <div className="sub-text">Nam • 22 tuổi</div>
                        </div>
                      </div>
                      <span className="time">10:30</span>
                    </div>
                    <p className="message-content-text compact">
                      <strong>Chatbot chuyển tiếp:</strong> Ghi nhận sốt cao co giật nhẹ, đau rát họng. Bàn giao bác sĩ kiểm tra lâm sàng.
                    </p>
                    <div className="normal-card-actions">
                      <button className="btn-action-outline primary" onClick={() => onViewChatMessage?.('1')}>Trả lời</button>
                    </div>
                  </div>

                  {/* Nguyễn Thị N */}
                  <div className="processing-card normal-card">
                    <div className="card-header-row">
                      <div className="patient-avatar-info">
                        <div className="avatar-placeholder-mini">N</div>
                        <div className="patient-info-text">
                          <strong>Nguyễn Thị N</strong> <span className="unread-dot"></span>
                          <div className="sub-text">Nữ • 29 tuổi</div>
                        </div>
                      </div>
                      <span className="time">09:36</span>
                    </div>
                    <p className="message-content-text compact">
                      <strong>Chatbot chuyển tiếp:</strong> Ghi nhận đau đầu kéo dài và mất ngủ 3 ngày. Bàn giao bác sĩ tư vấn chuyên khoa.
                    </p>
                    <div className="normal-card-actions">
                      <button className="btn-action-outline primary" onClick={() => onViewChatMessage?.('4')}>Trả lời</button>
                    </div>
                  </div>
                </div>
              </div>

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
                <>
                  <button className="emr-btn-outline" onClick={() => setExamModalMode('record')}>
                    Quay lại nhập bệnh án
                  </button>
                  <button className="emr-btn-filled" onClick={handleApplyAiSuggestion}>
                    Áp dụng gợi ý AI
                  </button>
                </>
              ) : (
                <>
                  <button className="emr-btn-outline" onClick={() => setShowExamModal(false)}>Hủy</button>
                  <button className="emr-btn-filled" onClick={handleSaveExamination}>Lưu kết luận & đơn thuốc</button>
                </>
              )}
            </div>
          </div>
        </div>
      ), document.body)}
    </div>
  );
}
