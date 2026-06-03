import { useEffect, useMemo, useState } from 'react';
import CalendarMonth from '../../../components/doctor-schedule/CalendarMonth';
import { PrimaryButton } from '../../../components/ui/ActionButton';
import { DetailModal } from '../../../components/ui/DetailModal';
import { Patient, SCHEDULE_DATA, Shift } from '../../../data/scheduleData';
import { initialPatients } from '../patients/PatientListTab';
import '../patients/PatientListTab.css';
import './DoctorSchedulePage.css';

const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const weekDayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const getPatientStartTime = (time: string) => time.split(' - ')[0];
const getPatientEndTime = (time: string) => time.split(' - ')[1] || '';

const getShiftTone = (title: string) => title === 'Ca sáng' ? 'morning' : 'afternoon';

const isCollapsedSlot = (slot: string) => ['11:00', '12:00', '13:00'].includes(slot);


const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDateKey = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const getWeekStart = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  return start;
};

const getHourSlot = (time: string) => {
  const [hour] = getPatientStartTime(time).split(':');
  return `${hour}:00`;
};

const getAppointmentOffset = (time: string) => {
  const minute = Number(getPatientStartTime(time).split(':')[1] || 0);
  return minute >= 30 ? 50 : 0;
};

const getAppointmentDuration = (time: string) => {
  const start = getPatientStartTime(time);
  const end = getPatientEndTime(time);

  if (!end) {
    return 30;
  }

  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  return Math.max(30, Math.min(duration, 60));
};

const SchedulePage = ({
  onBackToDashboard,
  onViewPatientProfile,
}: {
  onBackToDashboard?: () => void
  onViewPatientProfile?: (patientId: string) => void
}) => {
  type CalendarAppointment = Patient & { shiftTitle: string; dateKey: string };
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<CalendarAppointment | null>(null);
  const shiftsOfDay = useMemo(() => {
    return SCHEDULE_DATA[selectedDate] || [];
  }, [selectedDate]);

  const selectedDateLabel = useMemo(() => {
    const [year, month, day] = selectedDate.split('-');
    return `${day}/${month}/${year}`;
  }, [selectedDate]);

  const weekDays = useMemo(() => {
    const weekStart = getWeekStart(parseDateKey(selectedDate));
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      const dateKey = formatDateKey(date);
      const shifts = SCHEDULE_DATA[dateKey] || [];
      const appointmentCount = shifts.reduce((total, shift) => total + shift.count, 0);

      return {
        date,
        dateKey,
        dayNumber: date.getDate(),
        label: weekDayLabels[index],
        shifts,
        appointmentCount,
      };
    });
  }, [selectedDate]);

  const weekRangeLabel = useMemo(() => {
    const firstDay = weekDays[0].date;
    const lastDay = weekDays[6].date;
    const sameMonth = firstDay.getMonth() === lastDay.getMonth();
    const monthPart = sameMonth
      ? `Tháng ${firstDay.getMonth() + 1}/${firstDay.getFullYear()}`
      : `${firstDay.getMonth() + 1}/${firstDay.getFullYear()} - ${lastDay.getMonth() + 1}/${lastDay.getFullYear()}`;

    return `${String(firstDay.getDate()).padStart(2, '0')} - ${String(lastDay.getDate()).padStart(2, '0')} ${monthPart}`;
  }, [weekDays]);

  const weeklyAppointments = useMemo(() => {
    return weekDays.reduce<Record<string, Record<string, CalendarAppointment[]>>>((acc, day) => {
      acc[day.dateKey] = {};
      day.shifts.forEach((shift) => {
        shift.patients.forEach((patient) => {
          const hourSlot = getHourSlot(patient.time);
          acc[day.dateKey][hourSlot] = acc[day.dateKey][hourSlot] || [];
          acc[day.dateKey][hourSlot].push({ ...patient, shiftTitle: shift.title, dateKey: day.dateKey });
        });
      });
      return acc;
    }, {});
  }, [weekDays]);

  const totalAppointments = useMemo(() => {
    return shiftsOfDay.reduce((total, shift) => total + shift.count, 0);
  }, [shiftsOfDay]);

  useEffect(() => {
    if (shiftsOfDay.length === 0) {
      setSelectedShift(null);
      return;
    }

    setSelectedShift((currentShift) => {
      const stillAvailable = currentShift && shiftsOfDay.some((shift) => shift.id === currentShift.id);
      return stillAvailable ? currentShift : shiftsOfDay[0];
    });
  }, [shiftsOfDay]);

  const handleDateChange = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  const findPatientProfileId = (patient: Patient) => {
    const normalizedScheduleCode = patient.id.replace(/^#/, '').trim().toLowerCase();
    const matchedPatient = initialPatients.find((item) => {
      const normalizedPatientCode = item.code.trim().toLowerCase();
      const normalizedPatientCodeNumber = normalizedPatientCode.replace('bn-2026-', '');
      return (
        item.name === patient.name ||
        normalizedPatientCode === normalizedScheduleCode ||
        normalizedPatientCodeNumber === normalizedScheduleCode
      );
    });

    return matchedPatient?.id || '15';
  };

  const handleAppointmentOpen = (patient: CalendarAppointment) => {
    setSelectedDate(patient.dateKey);
    setSelectedAppointment(patient);
  };

  const renderShiftSummary = (shift: Shift) => {
    const isSelected = selectedShift?.id === shift.id;
    const tone = getShiftTone(shift.title);

    return (
      <button
        key={shift.id}
        type="button"
        className={`shift-summary-card ${tone} ${isSelected ? 'selected' : ''}`}
        onClick={() => setSelectedShift(shift)}
      >
        <div>
          <strong>{shift.title}</strong>
          <span>{shift.time}</span>
        </div>
        <div className="shift-summary-count">
          <strong>{shift.count}</strong>
          <span>lịch khám</span>
        </div>
      </button>
    );
  };

  return (
    <div className="schedule-page doctor-schedule-page">

      <header className="patient-tab-header schedule-header">
        <div className="tab-titles">
          <h1>Lịch làm việc</h1>
          <p>Theo dõi ca làm việc, số lịch khám và danh sách bệnh nhân theo từng ngày.</p>
        </div>
        <div className="schedule-day-summary" aria-label={`Ngày đang chọn ${selectedDateLabel}`}>
          <span>{selectedDateLabel}</span>
          <strong>{shiftsOfDay.length} ca</strong>
        </div>
      </header>

      <main className="schedule-content calendar-style-layout">
        <aside className="schedule-sidebar">
          <CalendarMonth
            selectedDate={selectedDate}
            onDateSelect={handleDateChange}
            className="schedule-mini-calendar"
          />

          <section className="section-card shift-summary-section">
            <div className="schedule-section-heading">
              <h3>Ca làm việc</h3>
              <span>{totalAppointments} lịch khám</span>
            </div>
            {shiftsOfDay.length > 0 ? (
              <div className="shift-summary-list">
                {shiftsOfDay.map(renderShiftSummary)}
              </div>
            ) : (
              <div className="schedule-empty-inline">
                Không có ca làm việc
              </div>
            )}
          </section>
        </aside>

        <section className="week-calendar-board">
          <div className="week-calendar-header">
            <div>
              <h2>Lịch khám theo tuần</h2>
            </div>
            <span>{weekRangeLabel}</span>
          </div>

          <div className="week-calendar-grid">
            <div className="week-time-corner">Giờ</div>
            {weekDays.map((day) => {
              const isSelected = day.dateKey === selectedDate;
              return (
                <button
                  key={day.dateKey}
                  type="button"
                  className={`week-day-header ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(day.dateKey)}
                >
                  <span>{day.label}</span>
                  <strong>{day.dayNumber}</strong>
                </button>
              );
            })}

            {timeSlots.map((slot) => {
              const isCollapsed = isCollapsedSlot(slot);
              return (
                <div className="week-row-fragment" key={slot}>
                  {isCollapsed ? (
                    <div className="week-day-cell collapsed-span-cell" style={{ gridColumn: '1 / -1' }}>
                      {slot === '12:00' ? 'KHUNG GIỜ NGHỈ TRƯA' : ''}
                    </div>
                  ) : (
                    <>
                      <div className="week-time-label">{slot}</div>
                      {weekDays.map((day) => {
                        const appointments = weeklyAppointments[day.dateKey]?.[slot] || [];
                        const isSelected = day.dateKey === selectedDate;

                        return (
                          <div className={`week-day-cell ${isSelected ? 'selected' : ''}`} key={`${day.dateKey}-${slot}`}>
                            {appointments.map((patient) => (
                              <button
                                type="button"
                                className={`week-appointment ${getShiftTone(patient.shiftTitle)}`}
                                key={`${patient.id}-${patient.time}`}
                                onClick={() => handleAppointmentOpen(patient)}
                                style={{
                                  top: `${getAppointmentOffset(patient.time)}%`,
                                  height: `${(getAppointmentDuration(patient.time) / 60) * 100}%`,
                                }}
                            >
                              <strong>{patient.name} - {patient.id}</strong>
                              <span>{patient.time}</span>
                            </button>
                            ))}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <DetailModal
        open={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
        title="Chi tiết lịch hẹn"
        subtitle={selectedAppointment ? `${selectedAppointment.time} · ${selectedAppointment.shiftTitle}` : undefined}
      >
        {selectedAppointment ? (
          <>
            <div className="doctor-appointment-detail-grid">
              <div className="doctor-appointment-detail-item doctor-appointment-detail-wide">
                <span>Bệnh nhân</span>
                <strong>{selectedAppointment.name}</strong>
              </div>
              <div className="doctor-appointment-detail-item">
                <span>Mã lịch hẹn</span>
                <strong>{selectedAppointment.id}</strong>
              </div>
              <div className="doctor-appointment-detail-item">
                <span>Ngày khám</span>
                <strong>{selectedDateLabel}</strong>
              </div>
              <div className="doctor-appointment-detail-item">
                <span>Loại hình</span>
                <strong>{selectedAppointment.examType || 'Khám trực tiếp'}</strong>
              </div>
              <div className="doctor-appointment-detail-item">
                <span>Số điện thoại</span>
                <strong>{selectedAppointment.phone || 'Chưa cập nhật'}</strong>
              </div>
            </div>

            <div className="doctor-appointment-modal-actions">
              <PrimaryButton variant="ghost" onClick={() => setSelectedAppointment(null)}>
                Đóng
              </PrimaryButton>
              <PrimaryButton
                onClick={() => {
                  const patientProfileId = findPatientProfileId(selectedAppointment);
                  setSelectedAppointment(null);
                  onViewPatientProfile?.(patientProfileId);
                }}
              >
                Xem hồ sơ bệnh nhân
              </PrimaryButton>
            </div>
          </>
        ) : null}
      </DetailModal>
    </div>
  );
};

export default SchedulePage;
