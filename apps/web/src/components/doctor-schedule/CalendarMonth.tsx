import { useState } from 'react';
import { SCHEDULE_DATA } from '../../data/scheduleData';
import { FilterSelect } from '../ui/FilterSelect';
import './CalendarMonth.css';

interface CalendarMonthProps {
    selectedDate: string;
    onDateSelect: (date: string) => void;
    className?: string;
}

const CalendarMonth = ({ selectedDate, onDateSelect, className }: CalendarMonthProps) => {
    const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    const [viewDate, setViewDate] = useState(new Date(2026, 4, 1));

    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className={`calendar-container ${className || ''}`}>

            <div className="calendar-header">
                <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Lịch làm việc tháng</h2>
                <FilterSelect
                    value={currentMonth.toString()}
                    options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => ({
                        label: `Tháng ${m}`,
                        value: m.toString()
                    }))}
                    onChange={(e) => setViewDate(new Date(currentYear, parseInt(e.target.value), 1))}
                />
            </div>

            <div className="calendar-grid-header">
                {daysOfWeek.map(d => <div key={d} className="day-name">{d}</div>)}
            </div>

            <div className="calendar-grid">
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="empty-cell"></div>
                ))}

                {daysArray.map(day => {
                    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

                    const dayShifts = SCHEDULE_DATA[dateStr] || [];
                    const hasEvent = dayShifts.length > 0;
                    const isSelected = selectedDate === dateStr;
                    const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();

                    return (
                        <div
                            key={day}
                            className={`calendar-day 
                                ${isSelected ? 'selected' : ''} 
                                ${hasEvent ? 'has-event' : ''} 
                                ${(dayOfWeek === 0 || dayOfWeek === 6) ? 'weekend' : ''}`
                            }
                            onClick={() => onDateSelect(dateStr)}
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