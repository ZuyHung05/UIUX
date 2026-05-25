import { useState } from 'react';
import AppointmentList from '../../../components/doctor-schedule/AppointmentList';
import CalendarMonth from '../../../components/doctor-schedule/CalendarMonth';
import ShiftCard from '../../../components/doctor-schedule/ShiftCard';
import { MOCK_SHIFTS, Shift } from '../../../data/scheduleData';
import './DoctorSchedulePage.css';

const SchedulePage = () => {
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  return (
    <div className="schedule-page">
      <header className="page-header">
        <h2>Lịch làm việc</h2>
        <p>Trang xem lịch làm việc của bác sĩ.</p>
      </header>

      <main className="schedule-content">
        <div className="left-column">
          <CalendarMonth />
        </div>

        <div className="right-column">
          <div className="section-card">
            <h3>Ca làm việc trong ngày</h3>
            {MOCK_SHIFTS.map((shift) => (
              <ShiftCard
                key={shift.id}
                title={shift.title}
                time={shift.time}
                count={shift.count}
                status={shift.status}
                onViewDetail={() => setSelectedShift(shift)}
                isSelected={selectedShift?.id === shift.id}
              />
            ))}
          </div>

          {/* <AppointmentList /> */}
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