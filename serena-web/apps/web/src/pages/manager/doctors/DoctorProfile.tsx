import type { ReactNode } from 'react'
import { MetricCard } from '../../../components/ui/MetricCard'
import {
  CalendarMetricIcon,
  CheckMetricIcon,
  StarMetricIcon,
  UsersMetricIcon,
} from '../../../components/ui/metricIcons'
import { StatusBadge } from '../../../components/ui/StatusBadge'
import type { StatusBadgeTone } from '../../../components/ui/StatusBadge'
import { branches, specialties } from './doctorMockData'
import type { Doctor, DoctorFormErrors, DoctorFormValues } from './doctorTypes'
import './DoctorProfile.css'

export type DoctorProfileMode = 'view' | 'edit' | 'create'

type DoctorProfileProps = {
  mode: DoctorProfileMode
  values: DoctorFormValues
  errors?: DoctorFormErrors
  doctor?: Doctor
  onChange?: <Key extends keyof DoctorFormValues>(field: Key, value: DoctorFormValues[Key]) => void
  onOpenReviews?: () => void
}

const genderOptions = ['Nam', 'Nữ', 'Khác']

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 5.5h11A1.5 1.5 0 0 1 19 7v10a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17V7a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="m6 8 6 4.5L18 8" />
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

function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8" cy="14" r="4" />
      <path d="M11 11 20 2M17 5l2 2M14 8l2 2" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg className="doctor-star-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function AvatarMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0v1H5v-1Z" />
    </svg>
  )
}

function statusToBadgeTone(values: DoctorFormValues): StatusBadgeTone {
  if (!values.hasCurrentShift) {
    return 'offline'
  }
  return values.hasActiveAppointment ? 'busy' : 'online'
}

type FieldKind = 'text' | 'email' | 'tel' | 'date' | 'number' | 'password' | 'select' | 'textarea'

type FieldProps = {
  mode: DoctorProfileMode
  label: string
  field: keyof DoctorFormValues
  values: DoctorFormValues
  errors?: DoctorFormErrors
  onChange?: <Key extends keyof DoctorFormValues>(field: Key, value: DoctorFormValues[Key]) => void
  kind?: FieldKind
  options?: string[]
  placeholder?: string
  display?: ReactNode
  wide?: boolean
}

function InfoField({
  mode,
  label,
  field,
  values,
  errors,
  onChange,
  kind = 'text',
  options = [],
  placeholder,
  display,
  wide = false,
}: FieldProps) {
  const editable = mode !== 'view'
  const rawValue = String(values[field] ?? '')
  const error = errors?.[field]
  const className = ['dp-field', wide ? 'dp-field-wide' : '', editable ? 'dp-field-editable' : ''].filter(Boolean).join(' ')

  if (!editable) {
    return (
      <div className={className}>
        <span className="dp-field-label">{label}</span>
        <strong className="dp-field-value">{display ?? (rawValue || 'Chưa cập nhật')}</strong>
      </div>
    )
  }

  return (
    <label className={className}>
      <span className="dp-field-label">{label}</span>
      {kind === 'select' ? (
        <select
          className="dp-input"
          value={rawValue}
          onChange={(event) => onChange?.(field, event.target.value as DoctorFormValues[typeof field])}
        >
          <option value="">{`Chọn ${label.toLowerCase()}`}</option>
          {options.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      ) : kind === 'textarea' ? (
        <textarea
          className="dp-input dp-textarea"
          value={rawValue}
          placeholder={placeholder}
          onChange={(event) => onChange?.(field, event.target.value as DoctorFormValues[typeof field])}
        />
      ) : (
        <input
          className="dp-input"
          type={kind}
          value={rawValue}
          placeholder={placeholder}
          onChange={(event) => {
            const next = kind === 'tel' ? event.target.value.replace(/\D/g, '').slice(0, 10) : event.target.value
            onChange?.(field, next as DoctorFormValues[typeof field])
          }}
        />
      )}
      {error ? <span className="dp-field-error">{error}</span> : null}
    </label>
  )
}

function PanelHeading({ icon, title, tone, action }: { icon: ReactNode; title: string; tone: string; action?: ReactNode }) {
  return (
    <div className="dp-panel-head">
      <h3 className="dp-panel-title">
        <span className={`dp-panel-icon dp-panel-icon-${tone}`} aria-hidden="true">
          {icon}
        </span>
        {title}
      </h3>
      {action}
    </div>
  )
}

export function DoctorProfile({ mode, values, errors, doctor, onChange, onOpenReviews }: DoctorProfileProps) {
  const editable = mode !== 'view'
  const showAnalytics = mode === 'view' && Boolean(doctor)
  const reviewPreview = doctor?.reviews.slice(0, 4) ?? []

  const completedAppointments = doctor ? Math.round(doctor.totalConsultations * (doctor.completionRate / 100)) : 0

  return (
    <div className="dp-shell">
      {!editable ? (
        <section className="dp-hero">
          <div className="dp-hero-identity">
            <div className="dp-avatar" style={{ background: values.avatarColor || '#dcebff' }} aria-hidden="true">
              <AvatarMark />
            </div>
            <div className="dp-hero-copy">
              <h1 className="dp-hero-name">{values.fullName || 'Bác sĩ mới'}</h1>
              {doctor ? <span className="dp-hero-code">Mã bác sĩ: {doctor.id}</span> : null}

              <div className="dp-hero-tags">
                {values.specialty ? <span className="dp-chip dp-chip-specialty">{values.specialty}</span> : null}
                {values.branch ? <span className="dp-chip dp-chip-branch">{values.branch}</span> : null}
                <StatusBadge status={statusToBadgeTone(values)} />
              </div>
            </div>
          </div>

          {showAnalytics ? (
            <div className="dp-hero-kpis">
              <MetricCard
                label="Lịch hẹn hoàn thành"
                value={completedAppointments.toLocaleString('vi-VN')}
                icon={<CalendarMetricIcon />}
                iconClassName="metric-icon-blue"
              />
              <MetricCard
                label="Ca tư vấn hoàn thành"
                value={doctor!.totalConsultations.toLocaleString('vi-VN')}
                icon={<UsersMetricIcon />}
                iconClassName="metric-icon-green"
              />
              <MetricCard
                label="Tỉ lệ hoàn thành"
                value={`${doctor!.completionRate}%`}
                icon={<CheckMetricIcon />}
                iconClassName="metric-icon-purple"
              />
              <MetricCard
                label="CSAT"
                value={`${doctor!.csat}/5`}
                icon={<StarMetricIcon />}
                iconClassName="metric-icon-yellow"
              />
            </div>
          ) : (
            <div className="dp-hero-hint">
              <p className="dp-hero-hint-title">Thông tin tổng quan</p>
              <p className="dp-hero-hint-text">
                Các chỉ số hiệu suất (lịch hẹn, ca tư vấn, CSAT) sẽ hiển thị tại đây sau khi bác sĩ bắt đầu hoạt động.
              </p>
            </div>
          )}
        </section>
      ) : null}

      <div className={`dp-body${editable ? ' dp-upsert-body' : ' dp-view-body'}`}>
        <div className="dp-col dp-profile-col">
          <article className={`dp-panel${editable ? ' dp-personal-panel' : ''}`}>
            <PanelHeading icon={<ContactIcon />} title="Thông tin cá nhân" tone="blue" />
            {editable ? (
              <div className="dp-inline-identity">
                <div className="dp-avatar" style={{ background: values.avatarColor || '#dcebff' }} aria-hidden="true">
                  <AvatarMark />
                </div>
                <label className="dp-inline-name-field">
                  <span className="dp-field-label">Họ và tên</span>
                  <input
                    className="dp-input dp-hero-name-input"
                    type="text"
                    value={values.fullName}
                    placeholder="Họ và tên bác sĩ"
                    onChange={(event) => onChange?.('fullName', event.target.value)}
                  />
                  {errors?.fullName ? <span className="dp-field-error">{errors.fullName}</span> : null}
                </label>
              </div>
            ) : null}
            <div className="dp-field-grid">
              <InfoField mode={mode} label="Giới tính" field="gender" values={values} errors={errors} onChange={onChange} kind="select" options={genderOptions} />
              <InfoField mode={mode} label="Ngày sinh" field="birthday" values={values} errors={errors} onChange={onChange} kind="date" />
              <InfoField mode={mode} label="Số điện thoại" field="phone" values={values} errors={errors} onChange={onChange} kind="tel" placeholder="0xxxxxxxxx" />
              <InfoField mode={mode} label="Email" field="email" values={values} errors={errors} onChange={onChange} kind="email" placeholder="vidu@phongkham.vn" />
              <InfoField mode={mode} label="Địa chỉ" field="address" values={values} errors={errors} onChange={onChange} wide placeholder="Số nhà, đường, quận/huyện, tỉnh/thành" />
            </div>
          </article>
        </div>

        <div className="dp-col dp-specialty-col">
          <article className="dp-panel dp-panel-grow">
            <PanelHeading icon={<BriefcaseIcon />} title="Chuyên môn" tone="green" />
            <div className="dp-field-grid">
              <InfoField mode={mode} label="Chuyên khoa" field="specialty" values={values} errors={errors} onChange={onChange} kind="select" options={specialties} />
              <InfoField mode={mode} label="Chi nhánh" field="branch" values={values} errors={errors} onChange={onChange} kind="select" options={branches} />
              <InfoField mode={mode} label="Bằng cấp" field="degree" values={values} errors={errors} onChange={onChange} placeholder="VD: Thạc sĩ - Bác sĩ" />
              <InfoField
                mode={mode}
                label="Số năm kinh nghiệm"
                field="yearsExperience"
                values={values}
                errors={errors}
                onChange={onChange}
                kind="number"
                display={values.yearsExperience ? `${values.yearsExperience} năm` : undefined}
              />
              <InfoField
                mode={mode}
                label="Mô tả ngắn"
                field="shortBio"
                values={values}
                errors={errors}
                onChange={onChange}
                kind="textarea"
                wide
                placeholder="Vài dòng giới thiệu về thế mạnh chuyên môn của bác sĩ"
              />
            </div>
          </article>
        </div>

        <div className="dp-col dp-review-col">
          {editable ? (
            <article className="dp-panel dp-panel-grow">
              <PanelHeading icon={<KeyIcon />} title="Tài khoản hệ thống" tone="pink" />
              <div className="dp-field-grid">
                <InfoField mode={mode} label="Tên đăng nhập" field="username" values={values} errors={errors} onChange={onChange} wide placeholder="vd: bs.nguyenvana" />
                <InfoField mode={mode} label={mode === 'create' ? 'Mật khẩu khởi tạo' : 'Mật khẩu mới'} field="password" values={values} errors={errors} onChange={onChange} kind="password" />
                <InfoField mode={mode} label="Xác nhận mật khẩu" field="confirmPassword" values={values} errors={errors} onChange={onChange} kind="password" />
              </div>
            </article>
          ) : (
            <article className="dp-panel dp-panel-grow dp-review-panel">
              <PanelHeading
                icon={<StarMetricIcon />}
                title="Đánh giá từ bệnh nhân"
                tone="amber"
                action={
                  doctor && doctor.reviews.length > 0 ? (
                    <button type="button" className="dp-link-button" onClick={onOpenReviews}>
                      Xem tất cả
                    </button>
                  ) : null
                }
              />
              {reviewPreview.length > 0 ? (
                <div className="dp-review-list">
                  {reviewPreview.map((review) => (
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
              ) : (
                <p className="dp-empty-note">Chưa có đánh giá nào từ bệnh nhân.</p>
              )}
            </article>
          )}
        </div>
      </div>
    </div>
  )
}
