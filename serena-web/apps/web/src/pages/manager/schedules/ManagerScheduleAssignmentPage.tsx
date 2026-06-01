import { useMemo, useState } from 'react'
import { Header } from '../../../components/layout/header/Header'
import { Sidebar } from '../../../components/layout/sidebar/Sidebar'
import '../../../components/layout/DesktopShell.css'
import { IconButton, PrimaryButton } from '../../../components/ui/ActionButton'
import { MetricCard } from '../../../components/ui/MetricCard'
import { CalendarMetricIcon, CheckMetricIcon, ClockMetricIcon, PulseMetricIcon } from '../../../components/ui/metricIcons'
import { FilterSelect } from '../../../components/ui/FilterSelect'
import { Pagination } from '../../../components/ui/Pagination'
import { SearchInput } from '../../../components/ui/SearchInput'
import { SegmentedTabs } from '../../../components/ui/SegmentedTabs'
import { useToast } from '../../../components/ui/Toast'
import { branchMockData, type BranchId } from '../../../data/branchMockData'
import { managerSidebarConfig } from '../managerSidebarConfig'
import { useDoctorsData } from '../doctors/DoctorsDataContext'
import type { Doctor } from '../doctors/doctorTypes'
import './ManagerScheduleAssignmentPage.css'

type ViewMode = 'week' | 'month'
type ShiftType = 'morning' | 'afternoon'

type ScheduleSummary = {
  assigned: number
  total: number
  coverage: string
  openShifts: number
  underQuota: number
}

const pageSizeOptions = [5, 10, 15]

const monthOptions = [
  { value: '2026-06', label: 'Tháng 6/2026' },
  { value: '2026-07', label: 'Tháng 7/2026' },
  { value: '2026-09', label: 'Tháng 9/2026' },
]

const viewOptions = [
  { value: 'week', label: 'Theo tuần' },
  { value: 'month', label: 'Theo tháng' },
] satisfies Array<{ value: ViewMode; label: string }>

const shiftOptions: Array<{ type: ShiftType; label: string; time: string }> = [
  { type: 'morning', label: 'Ca sáng', time: '07:00-11:30' },
  { type: 'afternoon', label: 'Ca chiều', time: '13:00-17:00' },
]

const branchSummaries: Record<BranchId, ScheduleSummary> = {
  hanoi: { assigned: 45, total: 57, coverage: '92%', openShifts: 12, underQuota: 8 },
  danang: { assigned: 38, total: 44, coverage: '88%', openShifts: 9, underQuota: 6 },
  hochiminh: { assigned: 52, total: 63, coverage: '95%', openShifts: 7, underQuota: 5 },
}

function parseMonth(value: string) {
  const [year, month] = value.split('-').map(Number)
  return { year, monthIndex: month - 1 }
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function formatDayMonth(date: Date) {
  return `${date.getDate()}/${date.getMonth() + 1}`
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function getMonday(date: Date) {
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  return addDays(date, diff)
}

function getWeeksForMonth(monthValue: string) {
  const { year, monthIndex } = parseMonth(monthValue)
  const firstDay = new Date(year, monthIndex, 1)
  const lastDay = new Date(year, monthIndex + 1, 0)
  const weeks: Date[][] = []
  let cursor = getMonday(firstDay)

  while (cursor <= lastDay || weeks.length === 0) {
    weeks.push(Array.from({ length: 7 }, (_item, index) => addDays(cursor, index)))
    cursor = addDays(cursor, 7)
  }

  return weeks
}

function getSeededShifts(doctor: Doctor, date: Date): ShiftType[] {
  const seed = Number(doctor.id.slice(-2))
  const daySeed = date.getDate() + date.getMonth() * 3
  const shifts: ShiftType[] = []

  if ((seed + daySeed) % 2 === 0) {
    shifts.push('morning')
  }

  if ((seed + daySeed) % 3 === 0) {
    shifts.push('afternoon')
  }

  return shifts.slice(0, 2)
}

function getInitials(name: string) {
  return name
    .replace(/^BS\.\s*/, '')
    .split(' ')
    .slice(-2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

function getAssignmentKey(branchId: BranchId, doctorId: string, date: Date) {
  return `${branchId}:${doctorId}:${formatDateKey(date)}`
}

function getShiftMeta(type: ShiftType) {
  return shiftOptions.find((shift) => shift.type === type) ?? shiftOptions[0]
}

function sortShifts(shifts: ShiftType[]) {
  return [...shifts].sort(
    (first, second) =>
      shiftOptions.findIndex((shift) => shift.type === first) -
      shiftOptions.findIndex((shift) => shift.type === second),
  )
}

export function ManagerScheduleAssignmentPage() {
  const { showToast } = useToast()
  const { doctors } = useDoctorsData()
  const [activeBranchId, setActiveBranchId] = useState<BranchId>('hanoi')
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [selectedMonth, setSelectedMonth] = useState('2026-06')
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0)
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(pageSizeOptions[0])
  const [overrides, setOverrides] = useState<Record<string, ShiftType[]>>({})
  const [openShiftPicker, setOpenShiftPicker] = useState<string | null>(null)
  const [expandedDate, setExpandedDate] = useState<Date | null>(null)

  const activeBranch = branchMockData.find((branch) => branch.id === activeBranchId) ?? branchMockData[0]
  const weeks = useMemo(() => getWeeksForMonth(selectedMonth), [selectedMonth])
  const safeWeekIndex = Math.min(selectedWeekIndex, Math.max(weeks.length - 1, 0))
  const selectedWeek = weeks[safeWeekIndex] ?? weeks[0]
  const { monthIndex } = parseMonth(selectedMonth)
  const branchSummary = branchSummaries[activeBranch.id]

  const branchDoctors = useMemo(
    () => doctors.filter((doctor) => doctor.branch === activeBranch.name),
    [activeBranch.name, doctors],
  )

  const filteredDoctors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return branchDoctors
    }

    return branchDoctors.filter(
      (doctor) =>
        doctor.fullName.toLowerCase().includes(normalizedQuery) ||
        doctor.id.includes(normalizedQuery),
    )
  }, [branchDoctors, query])

  const pageCount = Math.max(1, Math.ceil(filteredDoctors.length / rowsPerPage))
  const safeCurrentPage = Math.min(currentPage, pageCount)
  const pagedDoctors = filteredDoctors.slice((safeCurrentPage - 1) * rowsPerPage, safeCurrentPage * rowsPerPage)

  const getShiftsForCell = (doctor: Doctor, date: Date) => {
    const key = getAssignmentKey(activeBranch.id, doctor.id, date)
    return sortShifts(overrides[key] ?? getSeededShifts(doctor, date))
  }

  const handleSelectShift = (doctor: Doctor, date: Date, shiftType: ShiftType) => {
    const key = getAssignmentKey(activeBranch.id, doctor.id, date)
    const currentShifts = getShiftsForCell(doctor, date)

    if (currentShifts.includes(shiftType) || currentShifts.length >= 2) {
      showToast('Mỗi ngày chỉ có tối đa 2 ca: sáng và chiều.', 'info')
      return
    }

    setOverrides((current) => ({
      ...current,
      [key]: sortShifts([...currentShifts, shiftType]),
    }))
    setOpenShiftPicker(null)
  }

  const handleRemoveShift = (doctor: Doctor, date: Date, shiftType: ShiftType) => {
    const key = getAssignmentKey(activeBranch.id, doctor.id, date)
    const nextShifts = getShiftsForCell(doctor, date).filter((shift) => shift !== shiftType)

    setOverrides((current) => ({
      ...current,
      [key]: nextShifts,
    }))
    setOpenShiftPicker(null)
  }

  const weekOptions = weeks.map((week, index) => ({
    value: String(index),
    label: `${formatDayMonth(week[0])} - ${formatDayMonth(week[6])}`,
  }))

  const monthGridDays = weeks.flat()

  const getDoctorsForDate = (date: Date) =>
    branchDoctors.filter((doctor) => getShiftsForCell(doctor, date).length > 0)

  const expandedDoctors = expandedDate ? getDoctorsForDate(expandedDate) : []

  return (
    <div className="desktop-shell-page manager-schedule-page">
      <Sidebar config={managerSidebarConfig} />
      <Header profileRole={managerSidebarConfig.profileRole} />
      <main className="desktop-shell-main manager-schedule-main" aria-label="Phân công lịch làm việc">
        <section className="schedule-assignment-content">
          <div className="schedule-heading-row">
            <div>
              <h1>Phân công lịch làm việc</h1>
              <p>Điều phối ca trực theo chi nhánh, tuần và tháng trong cùng một không gian thao tác.</p>
            </div>
          </div>

          <SegmentedTabs
            className="branch-segmented-tabs"
            ariaLabel="Chọn chi nhánh"
            value={activeBranchId}
            options={branchMockData.map((branch) => ({ value: branch.id, label: branch.name }))}
            onChange={(branchId) => {
              setActiveBranchId(branchId)
              setCurrentPage(1)
              setOpenShiftPicker(null)
            }}
          />

          <div className="metrics-grid schedule-metrics-grid">
            <MetricCard
              label="Bác sĩ đã phân công"
              value={`${branchSummary.assigned}/${branchSummary.total}`}
              icon={<CheckMetricIcon />}
              iconClassName="metric-icon-blue"
            />
            <MetricCard
              label="Tỉ lệ phủ ca trực"
              value={branchSummary.coverage}
              icon={<PulseMetricIcon />}
              iconClassName="metric-icon-green"
            />
            <MetricCard
              label="Ca trực còn trống"
              value={branchSummary.openShifts}
              icon={<ClockMetricIcon />}
              iconClassName="metric-icon-yellow"
            />
            <MetricCard
              label="Bác sĩ chưa đủ định mức"
              value={branchSummary.underQuota}
              icon={<CalendarMetricIcon />}
              iconClassName="metric-icon-pink"
            />
          </div>

          <div className="schedule-filter-row">
            <SegmentedTabs
              className="view-mode-tabs"
              ariaLabel="Chọn chế độ xem"
              value={viewMode}
              options={viewOptions}
              onChange={(mode) => {
                setViewMode(mode)
                setCurrentPage(1)
                setOpenShiftPicker(null)
              }}
            />
            <FilterSelect
              className="schedule-filter-select"
              value={selectedMonth}
              options={monthOptions}
              onChange={(event) => {
                setSelectedMonth(event.target.value)
                setSelectedWeekIndex(0)
                setOpenShiftPicker(null)
              }}
            />
            {viewMode === 'week' ? (
              <FilterSelect
                className="schedule-filter-select schedule-week-select"
                value={String(selectedWeekIndex)}
                options={weekOptions}
                onChange={(event) => {
                  setSelectedWeekIndex(Number(event.target.value))
                  setOpenShiftPicker(null)
                }}
              />
            ) : null}
          </div>

          <div className="schedule-toolbar">
            <SearchInput
              value={query}
              onChange={(value) => {
                setQuery(value)
                setCurrentPage(1)
              }}
              placeholder="Tìm theo tên hoặc mã bác sĩ"
              ariaLabel="Tìm kiếm bác sĩ"
            />
            <div className="schedule-toolbar-actions">
              <PrimaryButton variant="ghost" onClick={() => showToast('Đã tải file mẫu phân công lịch.', 'info')}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 4v11" />
                  <path d="m8 11 4 4 4-4" />
                  <path d="M5 19h14" />
                </svg>
                Tải file mẫu
              </PrimaryButton>
              <PrimaryButton onClick={() => showToast('Đã nhận file Excel. Dữ liệu sẽ được kiểm tra trước khi nhập.', 'info')}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 4v11" />
                  <path d="m8 8 4-4 4 4" />
                  <path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
                </svg>
                Nhập từ Excel
              </PrimaryButton>
            </div>
          </div>

          <div className="schedule-table-controls">
            <label className="schedule-page-size">
              <span>Hiển thị</span>
              <select
                value={rowsPerPage}
                onChange={(event) => {
                  setRowsPerPage(Number(event.target.value))
                  setCurrentPage(1)
                }}
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span>dòng / trang</span>
            </label>
            <Pagination currentPage={safeCurrentPage} pageCount={pageCount} onPageChange={setCurrentPage} />
          </div>

          {viewMode === 'week' ? (
            <section className="schedule-board-panel" aria-label="Bảng ma trận phân công lịch theo tuần">
              <div className="schedule-board-header">
                <div>
                  <h2>Bảng ma trận phân công lịch</h2>
                  <span>{weekOptions[safeWeekIndex]?.label}</span>
                </div>
                <div className="schedule-board-actions">
                  <PrimaryButton variant="ghost" onClick={() => showToast('Đã sao chép lịch tuần trước vào bản nháp.', 'info')}>
                    Sao chép lịch tuần trước
                  </PrimaryButton>
                  <PrimaryButton variant="secondary" onClick={() => showToast('Đã lưu nháp lịch làm việc.', 'info')}>
                    Lưu nháp
                  </PrimaryButton>
                  <PrimaryButton onClick={() => showToast('Đã chốt và phát hành lịch làm việc.', 'info')}>
                    Chốt & Phát hành lịch
                  </PrimaryButton>
                </div>
              </div>

              <div className="weekly-matrix" role="table" aria-label="Ma trận ca trực theo bác sĩ và ngày">
                <div className="matrix-row matrix-head-row" role="row">
                  <div className="matrix-doctor-head" role="columnheader">
                    Bác sĩ
                  </div>
                  {selectedWeek.map((date, index) => (
                    <div className="matrix-day-head" role="columnheader" key={formatDateKey(date)}>
                      <strong>{index === 6 ? 'Chủ nhật' : `Thứ ${index + 2}`}</strong>
                      <span>{formatDayMonth(date)}</span>
                    </div>
                  ))}
                </div>

                {pagedDoctors.map((doctor) => (
                  <div className="matrix-row" role="row" key={doctor.id}>
                    <div className="matrix-doctor-cell" role="rowheader">
                      <div>
                        <strong>{doctor.fullName}</strong>
                        <span>ID: {doctor.id}</span>
                      </div>
                    </div>
                    {selectedWeek.map((date) => {
                      const shifts = getShiftsForCell(doctor, date)
                      const assignmentKey = getAssignmentKey(activeBranch.id, doctor.id, date)
                      const remainingShifts = shiftOptions.filter((shift) => !shifts.includes(shift.type))

                      return (
                        <div className="matrix-shift-cell" role="cell" key={formatDateKey(date)}>
                          <div className="shift-stack">
                            {shifts.map((shiftType) => {
                              const shift = getShiftMeta(shiftType)
                              return (
                                <div className={`shift-chip shift-chip-${shift.type}`} key={shift.type}>
                                  <div>
                                    <strong>{shift.label}</strong>
                                    <small>{shift.time}</small>
                                  </div>
                                  <button
                                    type="button"
                                    aria-label={`Xóa ${shift.label}`}
                                    onClick={() => handleRemoveShift(doctor, date, shift.type)}
                                  >
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                      <path d="M6 6l12 12M18 6 6 18" />
                                    </svg>
                                  </button>
                                </div>
                              )
                            })}
                            {shifts.length < 2 ? (
                              <div className="shift-add-wrapper">
                                <button
                                  className="shift-add-card"
                                  type="button"
                                  aria-expanded={openShiftPicker === assignmentKey}
                                  onClick={() =>
                                    setOpenShiftPicker((current) => (current === assignmentKey ? null : assignmentKey))
                                  }
                                >
                                  <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 5v14M5 12h14" />
                                  </svg>
                                  <span>Thêm ca</span>
                                </button>
                                {openShiftPicker === assignmentKey ? (
                                  <div className="shift-picker-menu" role="listbox">
                                    {remainingShifts.map((shift) => (
                                      <button
                                        type="button"
                                        key={shift.type}
                                        role="option"
                                        onClick={() => handleSelectShift(doctor, date, shift.type)}
                                      >
                                        <strong>{shift.label}</strong>
                                        <span>{shift.time}</span>
                                      </button>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="schedule-board-panel month-board-panel" aria-label="Lịch phân công theo tháng">
              <div className="schedule-board-header">
                <div>
                  <h2>Lịch tháng</h2>
                  <span>{monthOptions.find((option) => option.value === selectedMonth)?.label}</span>
                </div>
              </div>

              <div className="month-calendar-grid">
                {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((day) => (
                  <div className="month-weekday" key={day}>
                    {day}
                  </div>
                ))}
                {monthGridDays.map((date) => {
                  const assignedDoctors = getDoctorsForDate(date)
                  const visibleDoctors = assignedDoctors.slice(0, 3)
                  const hiddenCount = Math.max(0, assignedDoctors.length - visibleDoctors.length)
                  const isMuted = date.getMonth() !== monthIndex

                  return (
                    <button
                      className={isMuted ? 'month-day-cell is-muted' : 'month-day-cell'}
                      type="button"
                      key={formatDateKey(date)}
                      onClick={() => setExpandedDate(date)}
                    >
                      <span className="month-day-number">{formatDayMonth(date)}</span>
                      <span className="month-doctor-list">
                        {visibleDoctors.map((doctor) => (
                          <span className="month-doctor-chip" key={doctor.id}>
                            {doctor.fullName.replace(/^BS\.\s*/, '')}
                          </span>
                        ))}
                        {hiddenCount > 0 ? <span className="month-more-chip">+ {hiddenCount} bác sĩ khác</span> : null}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          )}
        </section>

        {expandedDate ? (
          <div className="schedule-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="schedule-modal-title">
            <div className="schedule-modal">
              <div className="schedule-modal-header">
                <div>
                  <h2 id="schedule-modal-title">Danh sách bác sĩ ngày {formatDayMonth(expandedDate)}</h2>
                  <p>{activeBranch.name}</p>
                </div>
                <IconButton label="Đóng" onClick={() => setExpandedDate(null)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </IconButton>
              </div>
              <div className="schedule-modal-list">
                {expandedDoctors.map((doctor) => (
                  <div className="schedule-modal-doctor" key={doctor.id}>
                    <span className="doctor-initials">{getInitials(doctor.fullName)}</span>
                    <div>
                      <strong>{doctor.fullName}</strong>
                      <span>{getShiftsForCell(doctor, expandedDate).map((shift) => getShiftMeta(shift).label).join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
