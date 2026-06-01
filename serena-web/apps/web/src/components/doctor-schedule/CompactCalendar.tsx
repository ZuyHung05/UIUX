import { useState, useEffect } from 'react';
import { SCHEDULE_DATA } from '../../data/scheduleData';
import './CompactCalendar.css';

interface CompactCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  className?: string;
}

export function CompactCalendar({ selectedDate, onDateSelect, className }: CompactCalendarProps) {
  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Default to May 2026
  const [viewDate, setViewDate] = useState(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
      }
    }
    return new Date(2026, 4, 1); // May 2026
  });

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Synchronize viewDate when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        if (!isNaN(year) && !isNaN(month)) {
          setViewDate(new Date(year, month, 1));
        }
      }
    }
  }, [selectedDate]);

  return (
    <div className={`compact-calendar ${className || ''}`}>
      <div className="cc-header">
        <h3>Lịch tháng</h3>
        <select
          value={currentMonth.toString()}
          onChange={(e) => setViewDate(new Date(currentYear, parseInt(e.target.value), 1))}
          className="cc-month-select"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
            <option key={m} value={(m - 1).toString()}>
              Tháng {m}
            </option>
          ))}
        </select>
      </div>

      <div className="cc-grid-header">
        {daysOfWeek.map((d) => (
          <div key={d} className="cc-weekday">
            {d}
          </div>
        ))}
      </div>

      <div className="cc-grid">
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="cc-empty-cell"></div>
        ))}

        {daysArray.map((day) => {
          const dateObj = new Date(currentYear, currentMonth, day);
          const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

          const dayShifts = SCHEDULE_DATA[dateStr] || [];
          const totalAppts = dayShifts.reduce((sum, s) => sum + (s.count || 0), 0);
          const hasWork = dayShifts.length > 0;
          const isSelected = selectedDate === dateStr;
          const dayOfWeek = dateObj.getDay();

          const todayObj = new Date();
          const isToday =
            todayObj.getFullYear() === currentYear &&
            todayObj.getMonth() === currentMonth &&
            todayObj.getDate() === day;

          return (
            <div
              key={day}
              className={`cc-day 
                ${isSelected ? 'selected' : ''} 
                ${isToday ? 'today' : ''} 
                ${hasWork ? 'has-work' : ''} 
                ${dayOfWeek === 0 || dayOfWeek === 6 ? 'weekend' : ''}`}
              onClick={() => onDateSelect(dateStr)}
            >
              <span className="cc-day-num">{day}</span>
              {totalAppts > 0 && (
                <span className="cc-appt-badge">
                  <span className="cc-dot">●</span>
                  {totalAppts}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
