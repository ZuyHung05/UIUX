import { useEffect, useMemo, useState } from 'react';
import AppointmentList from '../../../components/doctor-schedule/AppointmentList';
import CalendarMonth from '../../../components/doctor-schedule/CalendarMonth';
import ShiftCard from '../../../components/doctor-schedule/ShiftCard';
import { SCHEDULE_DATA, Shift } from '../../../data/scheduleData';
import '../patients/PatientListTab.css';
import './DoctorSchedulePage.css';

const SchedulePage = ({ onBackToDashboard }: { onBackToDashboard?: () => void }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const shiftsOfDay = useMemo(() => {
    return SCHEDULE_DATA[selectedDate] || [];
  }, [selectedDate]);

  const selectedDateLabel = useMemo(() => {
    const [year, month, day] = selectedDate.split('-');
    return `${day}/${month}/${year}`;
  }, [selectedDate]);

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

  return (
    <div className="schedule-page">

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

      <main className="schedule-content">
        <div className="left-column">
          <CalendarMonth
            selectedDate={selectedDate}
            onDateSelect={handleDateChange}
          />
        </div>

        <div className="right-column">
          <div className="section-card">
            <div className="schedule-section-heading">
              <h3>Ca làm việc trong ngày</h3>
              <span>{shiftsOfDay.reduce((total, shift) => total + shift.count, 0)} lịch khám</span>
            </div>
            {shiftsOfDay.length > 0 ? (
              shiftsOfDay.map((shift) => (
                <ShiftCard
                  key={shift.id}
                  title={shift.title}
                  time={shift.time}
                  count={shift.count}
                  status={shift.status || (shift.title === 'Ca sáng' ? 'Đang diễn ra' : undefined)}
                  onViewDetail={() => setSelectedShift(shift)}
                  isSelected={selectedShift?.id === shift.id}
                />
              ))
            ) : (
              <div className="schedule-empty-inline">
                Không có ca làm việc
              </div>
            )}
          </div>

          {selectedShift && (
            <AppointmentList
              shiftTitle={selectedShift.title}
              timeRange={selectedShift.time}
              count={selectedShift.count}
              patients={selectedShift.patients}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default SchedulePage;
