import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '../../../components/layout/header/Header'
import { Sidebar } from '../../../components/layout/sidebar/Sidebar'
import '../../../components/layout/DesktopShell.css'
import { PrimaryButton } from '../../../components/ui/ActionButton'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import { managerSidebarConfig } from '../managerSidebarConfig'
import { doctorToFormValues, formatCurrency, initialDoctorFormValues } from './doctorMockData'
import { DoctorFormSections } from './DoctorFormSections'
import { useDoctorsData } from './DoctorsDataContext'
import type { Doctor, DoctorFormErrors, DoctorFormValues } from './doctorTypes'
import { hasFormErrors, validateDoctorForm } from './doctorValidation'
import './DoctorManagement.css'

function DoctorAvatar({ doctor }: { doctor: Doctor }) {
  return (
    <div className="doctor-detail-avatar" style={{ backgroundColor: doctor.avatarColor }} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
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

function InfoItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="doctor-info-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function ProfileDetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="doctor-profile-detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function DoctorRecordRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="doctor-emr-record-row">
      <span className="doctor-emr-record-label">{label}</span>
      <div className="doctor-emr-record-value">{children}</div>
    </div>
  )
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

  useEffect(() => {
    if (doctor) {
      setValues(doctorToFormValues(doctor))
      setErrors({})
    }
  }, [doctor])

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

  return (
    <div className="desktop-shell-page doctor-management-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main className="desktop-shell-main doctor-management-main" aria-label="Chi tiết bác sĩ">
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
            <section className="doctor-emr-view-container">
              <div className="doctor-emr-view-header-block">
                <h1 className="doctor-emr-view-title">Hồ sơ bác sĩ chi tiết</h1>
              </div>

              <section className="doctor-emr-profile-section">
                <DoctorAvatar doctor={doctor} />
                <div className="doctor-emr-profile-box">
                  <ProfileDetailItem label="Mã bác sĩ" value={doctor.id} />
                  <ProfileDetailItem label="Họ tên" value={doctor.fullName} />
                  <ProfileDetailItem label="Liên hệ" value={`${doctor.phone} · ${doctor.email}`} />
                  <ProfileDetailItem label="Trạng thái" value={<StatusBadge status={doctor.status} />} />
                </div>
              </section>

              <hr className="doctor-emr-divider" />

              <div className="doctor-emr-two-columns">
                <article className="doctor-emr-column-card">
                  <h3 className="doctor-emr-column-title">Thông tin chuyên môn</h3>
                  <div className="doctor-tab-grid">
                    <InfoItem label="Chuyên khoa" value={doctor.specialty} />
                    <InfoItem label="Bằng cấp" value={doctor.degree} />
                    <InfoItem label="Kinh nghiệm" value={`${doctor.yearsExperience} năm`} />
                    <InfoItem label="Chi nhánh" value={doctor.branch} />
                    <InfoItem label="Giá tư vấn" value={formatCurrency(doctor.consultationFee)} />
                    <InfoItem label="Giá khám" value={formatCurrency(doctor.examinationFee)} />
                  </div>
                </article>

                <article className="doctor-emr-column-card">
                  <h3 className="doctor-emr-column-title">Lịch làm việc cơ bản</h3>
                  <div className="doctor-emr-history-list">
                    {doctor.schedule.map((item, index) => (
                      <div className={index === 0 ? 'doctor-emr-history-item active' : 'doctor-emr-history-item'} key={`${item.day}-${item.time}`}>
                        <div className="doctor-emr-history-meta">
                          <span>{item.day}</span>
                          {index === 0 ? <span className="doctor-emr-active-badge">Đang áp dụng</span> : null}
                        </div>
                        <strong>{item.time}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <section className="doctor-emr-records-section">
                <DoctorRecordRow label="Tổng quan chuyên môn">
                  <p>{doctor.shortBio}</p>
                  <span className="doctor-rating-pill">
                    <StarIcon />
                    Đánh giá trung bình {doctor.rating.toFixed(1)}/5
                  </span>
                </DoctorRecordRow>

                <DoctorRecordRow label="Lịch hẹn hôm nay">
                  <div className="doctor-list-panel">
                    <div className="doctor-list-item">
                      <strong>{doctor.appointmentsToday} lịch hẹn được ghi nhận trong ngày</strong>
                      <span>08:30 - Tư vấn trực tuyến · Đã xác nhận</span>
                    </div>
                    <div className="doctor-list-item">
                      <strong>10:15 - Khám tại chi nhánh</strong>
                      <span>Trạng thái: Chờ tiếp nhận</span>
                    </div>
                  </div>
                </DoctorRecordRow>

                <DoctorRecordRow label="Đánh giá bệnh nhân">
                  <div className="doctor-list-panel">
                    {doctor.reviews.map((review) => (
                      <div className="doctor-list-item" key={review.id}>
                        <strong>
                          {review.patientName} · {review.rating.toFixed(1)}/5
                        </strong>
                        <p>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </DoctorRecordRow>

                <DoctorRecordRow label="Thống kê hiệu suất">
                  <div className="doctor-tab-grid">
                    <InfoItem label="Tổng ca tư vấn" value={doctor.totalConsultations.toLocaleString('vi-VN')} />
                    <InfoItem label="Tỉ lệ hoàn thành lịch" value={`${doctor.completionRate}%`} />
                    <InfoItem label="Điểm CSAT" value={`${doctor.csat}/5`} />
                    <InfoItem label="Đánh giá trung bình" value={`${doctor.rating.toFixed(1)}/5`} />
                  </div>
                </DoctorRecordRow>
              </section>
            </section>
          )}
        </section>
      </main>
    </div>
  )
}
