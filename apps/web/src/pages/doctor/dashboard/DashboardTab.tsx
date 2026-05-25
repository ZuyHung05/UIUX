import { useState } from 'react'
import './DashboardTab.css'

type MetricCardProps = {
  title: string
  value: string | number
  color: string
  iconType: 'calendar' | 'clock' | 'message' | 'check'
}

function MetricCard({ title, value, color, iconType }: MetricCardProps) {
  const iconPaths = {
    calendar: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    message: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  }

  return (
    <article className="figma-metric-card">
      <div className="card-icon-container" style={{ borderColor: `${color}40`, backgroundColor: `${color}0A`, color }}>
        {iconPaths[iconType]}
      </div>
      <div className="card-info">
        <span className="card-label">{title}</span>
        <strong className="card-number">{value}</strong>
      </div>
    </article>
  )
}

export function DashboardTab({ onNavigateTab }: { onNavigateTab?: (tab: string) => void }) {
  const [selectedMonth, setSelectedMonth] = useState<number>(5)
  const [selectedDay, setSelectedDay] = useState<number>(10)
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState<boolean>(false)
  
  // States for Date Filter (Hôm nay, Ngày mai, ...)
  const [selectedFilter, setSelectedFilter] = useState<string>('Hôm nay')
  const [isFilterPickerOpen, setIsFilterPickerOpen] = useState<boolean>(false)

  const filterOptions = ['Hôm nay', 'Ngày mai', 'Tuần này', 'Tháng này']

  const patients = [
    { name: 'Nguyễn Văn A', age: 45, time: '2 giờ trước', symptoms: 'Sốt, đau đầu, ho' },
    { name: 'Trần Thị B', age: 36, time: '5 giờ trước', symptoms: 'Đau bụng, buồn nôn' },
    { name: 'Lê Văn C', age: 58, time: '1 ngày trước', symptoms: 'Đau ngực, khó thở' },
  ]

  const messages = [
    { name: 'Nguyễn Văn A', text: 'Bác sĩ ơi, dạo này tôi hay thấy chóng mặt và suy ...', time: '09:36' },
    { name: 'Nguyễn Thị N', text: 'Xin chào bác sĩ, tôi đang gặp tình trạng đau đầu...', time: '09:36' },
  ]

  // Programmatically generate calendar rows for selectedMonth in 2024 (so May starts on Wed)
  const getCalendarRows = (month: number) => {
    const year = 2024
    const firstDayIndex = new Date(year, month - 1, 1).getDay() // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const totalDays = new Date(year, month, 0).getDate()

    const rows: Array<Array<{ day: number; dot: boolean; active: boolean; workday: boolean } | null>> = []
    let currentRow: Array<{ day: number; dot: boolean; active: boolean; workday: boolean } | null> = []

    // Fill initial empty cells
    for (let i = 0; i < firstDayIndex; i++) {
      currentRow.push(null)
    }

    const activeDay = Math.min(selectedDay, totalDays)
    const dotDays = [6, 8, 9, 10, 13, 15, 16, 20, 22, 23, 27, 29, 30]

    for (let day = 1; day <= totalDays; day++) {
      const dateObj = new Date(year, month - 1, day)
      const dayOfWeek = dateObj.getDay()

      // Workday: Mon to Fri (1 to 5)
      const isWorkday = dayOfWeek >= 1 && dayOfWeek <= 5

      // Appointments dot matches mockup exactly for May (month 5)
      const hasAppointment = month === 5 ? dotDays.includes(day) : isWorkday && ((day * month) % 7 !== 0)

      currentRow.push({
        day,
        dot: hasAppointment,
        active: day === activeDay,
        workday: isWorkday,
      })

      if (currentRow.length === 7) {
        rows.push(currentRow)
        currentRow = []
      }
    }

    // Fill trailing empty cells
    if (currentRow.length > 0) {
      while (currentRow.length < 7) {
        currentRow.push(null)
      }
      rows.push(currentRow)
    }

    return rows
  }

  const calendarRows = getCalendarRows(selectedMonth)

  // Dynamic metrics computed based on the selected month AND the filter
  const filterMultiplier = selectedFilter === 'Ngày mai' ? 1.5 : selectedFilter === 'Tuần này' ? 5 : selectedFilter === 'Tháng này' ? 20 : 1
  const appointmentsCount = Math.floor((12 + (selectedMonth - 5) * 2) * filterMultiplier)
  const pendingCount = Math.floor((8 + (selectedMonth - 5)) * filterMultiplier)
  const processingCount = Math.floor((5 + Math.floor((selectedMonth - 5) / 2)) * filterMultiplier)
  const completedCount = Math.floor((5 + Math.floor((selectedMonth - 5) / 3)) * filterMultiplier)

  return (
    <div className="figma-dashboard-tab">
      {/* Header Row */}
      <header className="figma-dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Trang xem thống kê của bác sĩ</p>
        </div>
        
        <div style={{ position: 'relative' }}>
          <button 
            className="filter-dropdown"
            onClick={() => setIsFilterPickerOpen(!isFilterPickerOpen)}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-filter-icon">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            <span>{selectedFilter}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-arrow-icon">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          
          {isFilterPickerOpen && (
            <div className="filter-dropdown-popup">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  className={`filter-popup-item ${selectedFilter === opt ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedFilter(opt)
                    setIsFilterPickerOpen(false)
                  }}
                  type="button"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Metrics Cards Row */}
      <section className="figma-metrics-row">
        <MetricCard title="Tổng số lịch hẹn" value={appointmentsCount} color="#3B82F6" iconType="calendar" />
        <MetricCard title="Ca chờ tư vấn" value={pendingCount} color="#F59E0B" iconType="clock" />
        <MetricCard title="Ca đang xử lý" value={processingCount} color="#A855F7" iconType="message" />
        <MetricCard title="Ca hoàn thành" value={completedCount} color="#10B981" iconType="check" />
      </section>

      {/* Main Grid */}
      <div className="figma-dashboard-grid">
        {/* Left Column */}
        <div className="grid-column-left">
          {/* Recent Patients */}
          <section className="figma-section-card">
            <div className="section-header">
              <h2>Các bệnh nhân gần đây</h2>
              <button className="view-all-btn" type="button" onClick={() => onNavigateTab?.('Danh sách bệnh nhân')}>
                Xem tất cả
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div className="list-container">
              {patients.map((p, idx) => (
                <div className="patient-list-row" key={idx}>
                  <div className="row-left">
                    <div className="avatar-placeholder" />
                    <div className="meta-details">
                      <h3>{p.name} • {p.age} tuổi</h3>
                      <span className="time-sub">{p.time}</span>
                    </div>
                  </div>
                  <div className="row-middle">
                    <span className="symptom-text">{p.symptoms}</span>
                  </div>
                  <button className="action-btn" type="button" onClick={() => onNavigateTab?.('Tư vấn trực tiếp')}>
                    Xem ca
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* New Messages */}
          <section className="figma-section-card">
            <div className="section-header">
              <h2>Tin nhắn mới</h2>
              <button className="view-all-btn" type="button" onClick={() => onNavigateTab?.('Tư vấn trực tiếp')}>
                Xem tất cả
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div className="list-container">
              {messages.map((m, idx) => (
                <div className="message-list-row" key={idx}>
                  <div className="row-left">
                    <div className="avatar-placeholder" />
                    <div className="meta-details">
                      <h3>{m.name}</h3>
                      <p className="message-preview-text">{m.text}</p>
                    </div>
                  </div>
                  <span className="message-time-text">{m.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="grid-column-right">
          {/* Monthly Schedule */}
          <section className="figma-section-card calendar-card">
            <div className="section-header">
              <h2>Lịch làm việc tháng</h2>
              <div className="month-picker-container" style={{ position: 'relative' }}>
                <button
                  className="month-picker"
                  onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
                  type="button"
                >
                  <span>Tháng {selectedMonth}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isMonthPickerOpen && (
                  <div className="month-picker-popup">
                    {Array.from({ length: 12 }, (_, i) => {
                      const mVal = i + 1
                      return (
                        <button
                          className={`month-popup-item ${selectedMonth === mVal ? 'active' : ''}`}
                          key={mVal}
                          onClick={() => {
                            setSelectedMonth(mVal)
                            setIsMonthPickerOpen(false)
                          }}
                          type="button"
                        >
                          Tháng {mVal}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="dashboard-calendar-grid">
              <div className="dashboard-calendar-headers">
                <span>CN</span>
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
              </div>
              <div className="dashboard-calendar-days">
                {calendarRows.map((row, rIdx) => (
                  <div className="dashboard-calendar-row" key={rIdx}>
                    {row.map((cell, cIdx) => {
                      if (!cell) return <span className="day-cell empty" key={cIdx} />
                      
                      const cellClass = [
                        'day-cell',
                        cell.active ? 'active' : '',
                        cell.workday && !cell.active ? 'workday' : '',
                      ].filter(Boolean).join(' ')

                      return (
                        <button
                          className={cellClass}
                          key={cIdx}
                          onClick={() => setSelectedDay(cell.day)}
                          type="button"
                        >
                          <span className="day-number">{cell.day}</span>
                          {cell.dot && <span className="day-dot" />}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Upcoming Appointment */}
          <section className="figma-section-card">
            <div className="section-header">
              <h2>Lịch hẹn sắp tới</h2>
              <button className="view-all-btn" type="button" onClick={() => onNavigateTab?.('Lịch hẹn khám')}>
                Xem tất cả
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div className="list-container">
              <div className="appointment-list-row">
                <div className="row-left">
                  <div className="avatar-placeholder" />
                  <div className="meta-details">
                    <h3>Phạm Văn X</h3>
                    <span className="code-sub">Mã BN: #12346</span>
                  </div>
                </div>
                <span className="appointment-time-text">09:00</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
