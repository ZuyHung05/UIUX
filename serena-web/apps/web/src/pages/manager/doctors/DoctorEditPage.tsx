import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '../../../components/layout/header/Header'
import { Sidebar } from '../../../components/layout/sidebar/Sidebar'
import '../../../components/layout/DesktopShell.css'
import { PrimaryButton } from '../../../components/ui/ActionButton'
import { useToast } from '../../../components/ui/Toast'
import { managerSidebarConfig } from '../managerSidebarConfig'
import { doctorToFormValues, initialDoctorFormValues } from './doctorMockData'
import { DoctorProfile } from './DoctorProfile'
import { useDoctorsData } from './DoctorsDataContext'
import type { DoctorFormErrors, DoctorFormValues } from './doctorTypes'
import { hasFormErrors, validateDoctorForm } from './doctorValidation'
import './DoctorManagement.css'

function EditNotFound() {
  const navigate = useNavigate()

  return (
    <div className="desktop-shell-page doctor-management-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main className="desktop-shell-main doctor-management-main" aria-label="Không tìm thấy bác sĩ">
        <section className="doctor-page-content">
          <div className="doctor-detail-empty">
            <h1>Không tìm thấy bác sĩ</h1>
            <p>Hồ sơ bạn đang chỉnh sửa không còn tồn tại trong danh sách hiện tại.</p>
            <PrimaryButton onClick={() => navigate('/manager/doctors')}>Quay lại danh sách</PrimaryButton>
          </div>
        </section>
      </main>
    </div>
  )
}

export function DoctorEditPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { doctorId } = useParams()
  const { doctors, getDoctorById, updateDoctor } = useDoctorsData()
  const doctor = doctorId ? getDoctorById(doctorId) : undefined
  const [values, setValues] = useState<DoctorFormValues>(() => (doctor ? doctorToFormValues(doctor) : initialDoctorFormValues))
  const [errors, setErrors] = useState<DoctorFormErrors>({})

  if (!doctor) {
    return <EditNotFound />
  }

  const updateField = <Key extends keyof DoctorFormValues>(field: Key, value: DoctorFormValues[Key]) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = () => {
    const nextErrors = validateDoctorForm(values, doctors, doctor.id)
    setErrors(nextErrors)

    if (hasFormErrors(nextErrors)) {
      showToast('Vui lòng kiểm tra lại các trường còn thiếu hoặc chưa hợp lệ.', 'warning')
      return
    }

    updateDoctor(doctor.id, values)
    showToast(`Đã cập nhật hồ sơ ${values.fullName}.`, 'success')
    navigate(`/manager/doctors/${doctor.id}`)
  }

  return (
    <div className="desktop-shell-page doctor-management-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main className="desktop-shell-main doctor-management-main doctor-detail-main doctor-upsert-main" aria-label="Chỉnh sửa bác sĩ">
        <section className="doctor-page-content">
          <div className="doctor-detail-actions">
            <PrimaryButton variant="secondary" onClick={() => navigate(`/manager/doctors/${doctor.id}`)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Quay lại
            </PrimaryButton>
            <div className="doctor-form-actions">
              <PrimaryButton variant="ghost" onClick={() => navigate(`/manager/doctors/${doctor.id}`)}>
                Hủy
              </PrimaryButton>
              <PrimaryButton onClick={handleSubmit}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12l4 4L19 6" />
                </svg>
                Lưu thay đổi
              </PrimaryButton>
            </div>
          </div>

          <DoctorProfile mode="edit" doctor={doctor} values={values} errors={errors} onChange={updateField} />
        </section>
      </main>
    </div>
  )
}
