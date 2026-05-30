import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../../components/layout/header/Header'
import { Sidebar } from '../../../components/layout/sidebar/Sidebar'
import '../../../components/layout/DesktopShell.css'
import { PrimaryButton } from '../../../components/ui/ActionButton'
import { managerSidebarConfig } from '../managerSidebarConfig'
import { initialDoctorFormValues } from './doctorMockData'
import { DoctorFormSections } from './DoctorFormSections'
import { useDoctorsData } from './DoctorsDataContext'
import type { DoctorFormErrors, DoctorFormValues } from './doctorTypes'
import { hasFormErrors, validateDoctorForm } from './doctorValidation'
import './DoctorManagement.css'



export function DoctorNewPage() {
  const navigate = useNavigate()
  const { doctors, addDoctor } = useDoctorsData()
  const [values, setValues] = useState<DoctorFormValues>(initialDoctorFormValues)
  const [errors, setErrors] = useState<DoctorFormErrors>({})

  const updateField = <Key extends keyof DoctorFormValues>(field: Key, value: DoctorFormValues[Key]) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = () => {
    const nextErrors = validateDoctorForm(values, doctors)
    setErrors(nextErrors)

    if (hasFormErrors(nextErrors)) {
      return
    }

    addDoctor(values)
    navigate('/manager/doctors')
  }

  return (
    <div className="desktop-shell-page doctor-management-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main className="desktop-shell-main doctor-management-main" aria-label="Thêm bác sĩ">
        <section className="doctor-page-content">
          <div className="doctor-detail-actions">
            <PrimaryButton variant="secondary" onClick={() => navigate('/manager/doctors')}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Quay lại
            </PrimaryButton>
            <div className="doctor-form-actions">
              <PrimaryButton variant="ghost" onClick={() => navigate('/manager/doctors')}>
                Hủy
              </PrimaryButton>
              <PrimaryButton onClick={handleSubmit}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12l4 4L19 6" />
                </svg>
                Lưu
              </PrimaryButton>
            </div>
          </div>

          <section className="doctor-edit-shell">
            <div className="doctor-detail-title">
              <h1>Thêm bác sĩ mới</h1>
              <p>Tạo hồ sơ bác sĩ, thông tin chuyên môn và tài khoản hệ thống.</p>
            </div>
            <DoctorFormSections values={values} errors={errors} includeAccountSection onChange={updateField} />
          </section>
        </section>
      </main>
    </div>
  )
}
