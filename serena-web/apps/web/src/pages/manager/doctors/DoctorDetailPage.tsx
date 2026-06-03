import { useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '../../../components/layout/header/Header'
import { Sidebar } from '../../../components/layout/sidebar/Sidebar'
import '../../../components/layout/DesktopShell.css'
import { PrimaryButton } from '../../../components/ui/ActionButton'
import { DetailModal } from '../../../components/ui/DetailModal'
import { MetricCard } from '../../../components/ui/MetricCard'
import {
  CalendarMetricIcon,
  CheckMetricIcon,
  ClockMetricIcon,
  StarMetricIcon,
  UsersMetricIcon,
} from '../../../components/ui/metricIcons'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { managerSidebarConfig } from '../managerSidebarConfig'
import { doctorToFormValues, initialDoctorFormValues } from './doctorMockData'
import { DoctorFormSections } from './DoctorFormSections'
import { useDoctorsData } from './DoctorsDataContext'
import type { Doctor, DoctorFormErrors, DoctorFormValues } from './doctorTypes'
import { hasFormErrors, validateDoctorForm } from './doctorValidation'
import './DoctorManagement.css'

function DoctorAvatar({ doctor }: { doctor: Doctor }) {
  void doctor

  return (
    <div className="doctor-avatar doctor-detail-default-avatar" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0v1H5v-1Z" />
      </svg>
    </div>
  )
}

function StarIcon() {
  return (
    <svg className="doctor-star-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 7V5.8c0-.7.6-1.3 1.3-1.3h3.4c.7 0 1.3.6 1.3 1.3V7" />
      <path d="M5 7.5h14A2.5 2.5 0 0 1 21.5 10v8A2.5 2.5 0 0 1 19 20.5H5A2.5 2.5 0 0 1 2.5 18v-8A2.5 2.5 0 0 1 5 7.5Z" />
      <path d="M9 13h6" />
    </svg>
  )
}

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 5.5h11A1.5 1.5 0 0 1 19 7v10a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17V7a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="m6 8 6 4.5L18 8" />
    </svg>
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

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-5.3 7-12a7 7 0 0 0-14 0c0 6.7 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function SectionHeading({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <h3 className="doctor-detail-section-heading">
      <span className="doctor-detail-section-icon" aria-hidden="true">
        {icon}
      </span>
      {title}
    </h3>
  )
}

function InfoItem({ label, value, icon }: { label: string; value: ReactNode; icon?: ReactNode }) {
  return (
    <div className="doctor-info-item">
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

function buildTodayShiftCards(doctor: Doctor) {
  if (!doctor.hasCurrentShift || doctor.schedule.length === 0) {
    return []
  }

  const firstSchedule = doctor.schedule[0]
  const normalizedTime = firstSchedule.time.toLowerCase()
  const hasMorning = /0?7|0?8|0?9|10|11|12/.test(normalizedTime)
  const hasAfternoon = /13|14|15|16|17|18|19/.test(normalizedTime)
  const baseAppointments = Math.max(doctor.appointmentsToday, 0)
  const morningAppointments = Math.ceil(baseAppointments / (hasMorning && hasAfternoon ? 2 : 1))
  const afternoonAppointments = Math.max(baseAppointments - morningAppointments, 0)

  if (hasMorning && hasAfternoon) {
    return [
      {
        id: 'morning',
        title: 'Ca sáng',
        time: '08:00 - 12:00',
        appointments: morningAppointments,
        pendingConsults: Math.max(1, Math.floor(morningAppointments / 2)),
      },
      {
        id: 'afternoon',
        title: 'Ca chiều',
        time: '13:00 - 17:00',
        appointments: afternoonAppointments,
        pendingConsults: Math.max(0, Math.floor(afternoonAppointments / 2)),
      },
    ]
  }

  return [
    {
      id: hasAfternoon ? 'afternoon' : 'morning',
      title: hasAfternoon ? 'Ca chiều' : 'Ca sáng',
      time: firstSchedule.time,
      appointments: baseAppointments,
      pendingConsults: Math.max(0, Math.floor(baseAppointments / 2)),
    },
  ]
}

function DetailNotFound() {
  const navigate = useNavigate()

  return (
    <div className="desktop-shell-page doctor-management-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main className="desktop-shell-main doctor-management-main" aria-label="Không tìm thấy bác sĩ">
        <section className="doctor-page-content">
          <div className="doctor-detail-empty">
            <h1>Không tìm thấy bác sĩ</h1>
            <p>Hồ sơ bạn đang mở không còn tồn tại trong danh sách hiện tại.</p>
            <PrimaryButton onClick={() => navigate('/manager/doctors')}>Quay lại danh sách</PrimaryButton>
          </div>
        </section>
      </main>
    </div>
  )
}

export function DoctorDetailPage() {
  const navigate = useNavigate()
  const { doctorId } = useParams()
  const { doctors, getDoctorById, updateDoctor } = useDoctorsData()
  const doctor = doctorId ? getDoctorById(doctorId) : undefined
  const [isEditing, setIsEditing] = useState(false)
  const [values, setValues] = useState<DoctorFormValues>(() => (doctor ? doctorToFormValues(doctor) : initialDoctorFormValues))
  const [errors, setErrors] = useState<DoctorFormErrors>({})
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  if (!doctor) {
    return <DetailNotFound />
  }

  const updateField = <Key extends keyof DoctorFormValues>(field: Key, value: DoctorFormValues[Key]) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const cancelEdit = () => {
    setValues(doctorToFormValues(doctor))
    setErrors({})
    setIsEditing(false)
  }

  const saveEdit = () => {
    const nextErrors = validateDoctorForm(values, doctors, doctor.id)
    setErrors(nextErrors)

    if (hasFormErrors(nextErrors)) {
      return
    }

    updateDoctor(doctor.id, values)
    setIsEditing(false)
  }

  const completedAppointments = Math.round(doctor.totalConsultations * (doctor.completionRate / 100))
  const reviewPreview = doctor.reviews.slice(0, 3)
  const todayShiftCards = buildTodayShiftCards(doctor)

  return (
    <div className="desktop-shell-page doctor-management-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main
        className={`desktop-shell-main doctor-management-main ${isEditing ? 'doctor-edit-main' : 'doctor-detail-main'}`}
        aria-label="Chi tiết bác sĩ"
      >
        <section className="doctor-page-content">
          <div className="doctor-detail-actions">
            <PrimaryButton variant="secondary" onClick={() => navigate('/manager/doctors')}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Quay lại
            </PrimaryButton>
            <div className="doctor-form-actions">
              {isEditing ? (
                <>
                  <PrimaryButton variant="ghost" onClick={cancelEdit}>
                    Hủy
                  </PrimaryButton>
                  <PrimaryButton onClick={saveEdit}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12l4 4L19 6" />
                    </svg>
                    Lưu
                  </PrimaryButton>
                </>
              ) : (
                <PrimaryButton onClick={() => setIsEditing(true)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 20h9M16.5 3.5l4 4L8 20H4v-4L16.5 3.5Z" />
                  </svg>
                  Chỉnh sửa thông tin
                </PrimaryButton>
              )}
            </div>
          </div>

          {isEditing ? (
            <section className="doctor-edit-shell">
              <div className="doctor-detail-title">
                <h1>Chỉnh sửa hồ sơ bác sĩ</h1>
                <p>Cập nhật thông tin hành chính, chuyên môn, lịch làm việc và chi phí khám.</p>
              </div>
              <DoctorFormSections values={values} errors={errors} includeAccountSection={false} onChange={updateField} />
            </section>
          ) : (
            <>
              <section className="doctor-detail-dashboard">
                <aside className="doctor-detail-left-column">
                  <article className="doctor-detail-panel doctor-detail-profile-panel">
                    <div className="doctor-detail-profile-head">
                      <DoctorAvatar doctor={doctor} />
                      <div className="doctor-detail-profile-copy">
                        <h1>{doctor.fullName}</h1>
                      </div>
                    </div>
                    <div className="doctor-detail-info-list">
                      <InfoItem label="Mã bác sĩ" value={doctor.id} icon={<IdCardIcon />} />
                      <InfoItem label="Chuyên khoa" value={doctor.specialty} icon={<BriefcaseIcon />} />
                      <InfoItem label="Chi nhánh" value={doctor.branch} icon={<LocationIcon />} />
                      <div className="doctor-info-item doctor-profile-status-item">
                        <span className="doctor-info-icon" aria-hidden="true">
                          <ClockMetricIcon />
                        </span>
                        <div>
                          <span>Trạng thái hoạt động</span>
                          <StatusBadge status={doctor.status} />
                        </div>
                      </div>
                    </div>
                  </article>

                  <article className="doctor-detail-panel">
                    <SectionHeading icon={<ContactIcon />} title="Thông tin cá nhân" />
                    <div className="doctor-detail-info-list">
                      <InfoItem label="Giới tính" value={doctor.gender} />
                      <InfoItem label="Ngày sinh" value={doctor.birthday} />
                      <InfoItem label="Email" value={doctor.email} />
                      <InfoItem label="Số điện thoại" value={doctor.phone} />
                    </div>
                  </article>

                  <article className="doctor-detail-panel">
                    <SectionHeading icon={<BriefcaseIcon />} title="Thông tin chuyên môn" />
                    <div className="doctor-detail-info-list">
                      <InfoItem label="Bằng cấp" value={doctor.degree} />
                      <InfoItem label="Số năm kinh nghiệm" value={`${doctor.yearsExperience} năm`} />
                    </div>
                  </article>
                </aside>

                <section className="doctor-detail-right-column">
                  <div className="metrics-grid doctor-detail-stats-grid">
                    <MetricCard
                      label="Lịch hẹn hoàn thành"
                      value={completedAppointments.toLocaleString('vi-VN')}
                      icon={<CalendarMetricIcon />}
                      iconClassName="metric-icon-blue"
                    />
                    <MetricCard
                      label="Ca tư vấn hoàn thành"
                      value={doctor.totalConsultations.toLocaleString('vi-VN')}
                      icon={<UsersMetricIcon />}
                      iconClassName="metric-icon-green"
                    />
                    <MetricCard
                      label="Tỉ lệ hoàn thành lịch"
                      value={`${doctor.completionRate}%`}
                      icon={<CheckMetricIcon />}
                      iconClassName="metric-icon-purple"
                    />
                    <MetricCard
                      label="CSAT"
                      value={`${doctor.csat}/5`}
                      icon={<StarMetricIcon />}
                      iconClassName="metric-icon-yellow"
                    />
                  </div>

                  <article className="doctor-detail-panel doctor-detail-review-panel">
                    <div className="doctor-detail-panel-title-row">
                      <SectionHeading icon={<StarMetricIcon />} title="Đánh giá từ bệnh nhân" />
                      <button type="button" className="doctor-detail-link-button" onClick={() => setIsReviewModalOpen(true)}>
                        Xem tất cả
                      </button>
                    </div>
                    <div className="doctor-detail-review-grid">
                      {reviewPreview.map((review) => (
                        <div className="doctor-detail-review-item" key={review.id}>
                          <div>
                            <strong>{review.patientName}</strong>
                            <span>
                              <StarIcon />
                              {review.rating.toFixed(1)}
                            </span>
                          </div>
                          <p>{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="doctor-detail-panel doctor-detail-activity-panel">
                    <SectionHeading icon={<ClockMetricIcon />} title="Hoạt động hôm nay" />
                    {todayShiftCards.length > 0 ? (
                      <div className="doctor-detail-shift-grid">
                        {todayShiftCards.map((shift) => (
                          <div className="doctor-detail-shift-card" key={shift.id}>
                            <div>
                              <span>{shift.title}</span>
                              <strong>{shift.time}</strong>
                            </div>
                            <dl>
                              <div>
                                <dt>Lịch hẹn</dt>
                                <dd>{shift.appointments}</dd>
                              </div>
                              <div>
                                <dt>Tư vấn chờ</dt>
                                <dd>{shift.pendingConsults}</dd>
                              </div>
                            </dl>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="doctor-detail-empty-note">Hôm nay bác sĩ không có lịch làm việc.</p>
                    )}
                  </article>
                </section>
              </section>

              <DetailModal
                open={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                title="Đánh giá từ bệnh nhân"
                subtitle={doctor.fullName}
              >
                <div className="doctor-review-modal-list">
                  {doctor.reviews.map((review) => (
                    <div className="doctor-detail-review-item" key={review.id}>
                      <div>
                        <strong>{review.patientName}</strong>
                        <span>
                          <StarIcon />
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                      <p>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </DetailModal>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
