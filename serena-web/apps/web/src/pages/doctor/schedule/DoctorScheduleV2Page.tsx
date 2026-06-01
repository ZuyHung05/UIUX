import { useState, useMemo } from 'react';
import { Sidebar } from '../../../components/layout/sidebar/Sidebar';
import { Header } from '../../../components/layout/header/Header';
import { CompactCalendar } from '../../../components/doctor-schedule/CompactCalendar';
import { SCHEDULE_DATA, Shift } from '../../../data/scheduleData';
import { doctorSidebarConfig } from '../doctorSidebarConfig';
import '../../../components/layout/DesktopShell.css';
import './DoctorScheduleV2Page.css';

// Formatter to convert YYYY-MM-DD to DD/MM/YYYY
const formatDateString = (dateStr: string) => {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

// Formatter to get Day of the Week in Vietnamese
const getDayOfWeekName = (dateStr: string) => {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return days[d.getDay()];
  }
  return '';
};

export function DoctorScheduleV2Page() {
  // Default to today's date formatted as YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  // Create a customized config where activeLabel matches current activeTab state
  const dynamicSidebarConfig = {
    ...doctorSidebarConfig,
    activeLabel: 'Lịch làm việc V2 ✨',
  };

  // Fetch shifts for the selected date
  const shiftsOfDay = useMemo(() => {
    return SCHEDULE_DATA[selectedDate] || [];
  }, [selectedDate]);

  // Aggregate statistics for selected day
  const totalAppointments = useMemo(() => {
    return shiftsOfDay.reduce((sum, s) => sum + (s.count || 0), 0);
  }, [shiftsOfDay]);

  const totalShifts = shiftsOfDay.length;

  // Determine appointment status and matching color code classes
  const getPatientStatusDetails = (p: any, idx: number) => {
    // If the patient has an explicit status other than 'waiting', use it
    if (p.status && p.status !== 'waiting') {
      if (p.status === 'in-progress' || p.status === 'priority') {
        return { label: 'Đang khám', className: 'status-in-progress' };
      }
      if (p.status === 'completed') {
        return { label: 'Đã khám', className: 'status-completed' };
      }
      if (p.status === 'cancelled') {
        return { label: 'Đã hủy', className: 'status-cancelled' };
      }
      return { label: 'Đang chờ', className: 'status-waiting' };
    }

    // Distribute deterministically based on index for visually colorful layout representation
    if (idx === 0) {
      return { label: 'Đang khám', className: 'status-in-progress' };
    }
    if (idx === 1) {
      return { label: 'Đã khám', className: 'status-completed' };
    }
    if (idx === 2) {
      return { label: 'Đã hủy', className: 'status-cancelled' };
    }
    return { label: 'Đang chờ', className: 'status-waiting' };
  };

  return (
    <div className="desktop-shell-page doctor-dashboard-page">
      {/* Navigation Sidebar */}
      <Sidebar
        config={dynamicSidebarConfig}
        onItemClick={() => {
          // Navigating is handled automatically by Router Link hrefs
        }}
      />

      {/* Portal Header */}
      <Header profileRole={dynamicSidebarConfig.profileRole} />

      {/* Main Core View Area */}
      <main className="desktop-shell-main doctor-dashboard-main" aria-label="Nội dung chính">
        <div className="schedule-v2-container">
          
          {/* Main Title Row & Statistics */}
          <header className="v2-heading-row">
            <div>
              <h1 className="v2-title">Lịch làm việc</h1>
              <p className="v2-subtitle">Phiên bản V2 tối ưu mật độ thông tin - Không click, Không cuộn.</p>
            </div>
            
            {/* Statistics Cards */}
            <div className="v2-stats-grid">
              <article className="v2-stat-card">
                <span className="v2-stat-val">{totalAppointments}</span>
                <span className="v2-stat-lbl">Lịch hẹn</span>
              </article>
              <article className="v2-stat-card">
                <span className="v2-stat-val">{totalShifts}</span>
                <span className="v2-stat-lbl">Ca làm việc</span>
              </article>
            </div>
          </header>

          {/* Main Content Workspace: Calendar + Timeline */}
          <section className="v2-workspace">
            
            {/* Left Column (25% Width): Compact Calendar */}
            <div className="v2-column-left">
              <CompactCalendar
                selectedDate={selectedDate}
                onDateSelect={(date) => setSelectedDate(date)}
              />
            </div>

            {/* Right Column (75% Width): Daily Schedule Timeline */}
            <div className="v2-column-right">
              <div className="v2-timeline-panel">
                
                {/* STICKY CONTEXT HEADER */}
                <header className="v2-sticky-context">
                  <div className="v2-context-left">
                    <span className="v2-context-date">
                      {getDayOfWeekName(selectedDate)}, {formatDateString(selectedDate)}
                    </span>
                    <span className="v2-context-sub">
                      {totalAppointments} lịch hẹn • {totalShifts} ca làm việc
                    </span>
                  </div>
                  <div className="v2-context-right">
                    <span className="v2-live-tag">Đang hiển thị</span>
                  </div>
                </header>

                {/* TIMELINE FEED */}
                <div className="v2-timeline-feed">
                  {shiftsOfDay.length > 0 ? (
                    shiftsOfDay.map((shift) => (
                      <section key={shift.id} className="v2-shift-group">
                        
                        {/* Shift Header Indicator */}
                        <div className="v2-shift-indicator">
                          <span className="v2-shift-bullet"></span>
                          <h2 className="v2-shift-title">{shift.title.toUpperCase()}</h2>
                          <span className="v2-shift-time">({shift.time})</span>
                        </div>

                        {/* Shift Appointment Grid */}
                        <div className="v2-appointment-list">
                          {shift.patients && shift.patients.length > 0 ? (
                            shift.patients.map((p, idx) => {
                              const statusDetails = getPatientStatusDetails(p, idx);
                              const initials = p.name ? p.name.split(' ').pop()?.[0] : 'BN';

                              return (
                                <article key={p.id || idx} className="v2-appt-card">
                                  {/* Patient Mini Avatar & Name */}
                                  <div className="v2-appt-left">
                                    <div className="v2-appt-time">{p.time.split(' - ')[0]}</div>
                                    <div className="v2-appt-avatar">{initials}</div>
                                    <div className="v2-appt-meta">
                                      <h4 className="v2-patient-name">{p.name}</h4>
                                      <span className="v2-patient-code">{p.id || 'BN-12345'}</span>
                                    </div>
                                  </div>

                                  {/* Right block: status badge */}
                                  <div className="v2-appt-right">
                                    <span className={`v2-status-badge ${statusDetails.className}`}>
                                      {statusDetails.label}
                                    </span>
                                  </div>
                                </article>
                              );
                            })
                          ) : (
                            <div className="v2-empty-shift">
                              <p>Không có lịch hẹn đăng ký trong ca này.</p>
                            </div>
                          )}
                        </div>
                      </section>
                    ))
                  ) : (
                    <div className="v2-empty-day">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="v2-empty-icon">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <p>Bác sĩ không có ca làm việc nào được đăng ký trong ngày hôm nay.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </section>

        </div>
      </main>
    </div>
  );
}
export default DoctorScheduleV2Page;
