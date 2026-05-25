import { useState } from 'react';
import './CalendarMonth.css';

const CalendarMonth = () => {
    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    const [viewDate, setViewDate] = useState(new Date(2024, 4, 1));
    const [selectedDay, setSelectedDay] = useState<number | null>(10);

    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <h3>Lịch làm việc tháng</h3>
                <select
                    className="month-select"
                    value={currentMonth}
                    onChange={(e) => setViewDate(new Date(currentYear, parseInt(e.target.value), 1))}
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>Tháng {i + 1}</option>
                    ))}
                </select>
            </div>

            <div className="calendar-grid-header">
                {daysOfWeek.map(d => <div key={d} className="day-name">{d}</div>)}
            </div>

            <div className="calendar-grid">
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="empty-cell"></div>
                ))}

                {daysArray.map(day => {
                    const dateObj = new Date(currentYear, currentMonth, day);
                    const dayOfWeek = dateObj.getDay();
                    const hasEvent = dayOfWeek !== 0 && dayOfWeek !== 6;
                    const isSelected = selectedDay === day;

                    return (
                        <div
                            key={day}
                            className={`calendar-day 
                                ${isSelected ? 'selected' : ''} 
                                ${hasEvent ? 'has-event' : ''} 
                                ${(dayOfWeek === 0 || dayOfWeek === 6) ? 'weekend' : ''}`
                            }
                            onClick={() => setSelectedDay(day)}
                        >
                            <span className="day-number">{day}</span>
                            {hasEvent && <div className="event-dot"></div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarMonth;