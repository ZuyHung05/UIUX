import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '../../../components/layout/header/Header'
import { Sidebar } from '../../../components/layout/sidebar/Sidebar'
import '../../../components/layout/DesktopShell.css'
import { PrimaryButton } from '../../../components/ui/ActionButton'
import { DetailModal } from '../../../components/ui/DetailModal'
import { managerSidebarConfig } from '../managerSidebarConfig'
import { doctorToFormValues } from './doctorMockData'
import { DoctorProfile } from './DoctorProfile'
import { useDoctorsData } from './DoctorsDataContext'
import './DoctorManagement.css'

function StarIcon() {
  return (
    <svg className="doctor-star-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
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
  const { getDoctorById } = useDoctorsData()
  const doctor = doctorId ? getDoctorById(doctorId) : undefined
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  if (!doctor) {
    return <DetailNotFound />
  }

  const displayValues = doctorToFormValues(doctor)

  return (
    <div className="desktop-shell-page doctor-management-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main className="desktop-shell-main doctor-management-main doctor-detail-main" aria-label="Chi tiết bác sĩ">
        <section className="doctor-page-content">
          <div className="doctor-detail-actions">
            <PrimaryButton variant="secondary" onClick={() => navigate('/manager/doctors')}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Quay lại
            </PrimaryButton>
            <div className="doctor-form-actions">
              <PrimaryButton onClick={() => navigate(`/manager/doctors/${doctor.id}/edit`)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
                </svg>
                Chỉnh sửa thông tin
              </PrimaryButton>
            </div>
          </div>

          <DoctorProfile
            mode="view"
            doctor={doctor}
            values={displayValues}
            onOpenReviews={() => setIsReviewModalOpen(true)}
          />
        </section>

        <DetailModal
          open={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          title="Đánh giá từ bệnh nhân"
          subtitle={doctor.fullName}
        >
          <div className="doctor-review-modal-list">
            {doctor.reviews.map((review) => (
              <div className="dp-review-item" key={review.id}>
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
      </main>
    </div>
  )
}
