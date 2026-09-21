import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { AvailabilityStatus } from '../../types';

interface AvailabilityCalendarProps {
  availability: Record<string, AvailabilityStatus>;
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  isAdmin?: boolean;
  onToggleStatus?: (date: string, newStatus: AvailabilityStatus) => void;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  availability,
  selectedDate,
  onSelectDate,
  isAdmin = false,
  onToggleStatus
}) => {
  // Current view month (default: September 2026 / current date context)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 = September (0-indexed)

  const monthNamesUz = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];

  const daysOfWeek = ['Du', 'Se', 'Chor', 'Pay', 'Ju', 'Sha', 'Yak'];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Days in month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday = 0

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  const getDateString = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  const handleDayClick = (dateStr: string, currentStatus: AvailabilityStatus) => {
    if (isAdmin && onToggleStatus) {
      // Cycle status: available -> booked -> pending -> available
      const nextStatus: AvailabilityStatus = 
        currentStatus === 'available' ? 'booked' :
        currentStatus === 'booked' ? 'pending' : 'available';
      onToggleStatus(dateStr, nextStatus);
    } else if (onSelectDate) {
      onSelectDate(dateStr);
    }
  };

  return (
    <div id="availability-calendar-card" className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-rose-600" />
          <h3 className="font-semibold text-gray-900 text-base">
            {monthNamesUz[currentMonth]} {currentYear}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
            title="Oldingi oy"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
            title="Keyingi oy"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {paddingDays.map(i => (
          <div key={`pad-${i}`} className="h-10 rounded-lg bg-gray-50/50" />
        ))}

        {daysArray.map(day => {
          const dateStr = getDateString(day);
          const status = availability[dateStr] || 'available';
          const isSelected = selectedDate === dateStr;

          let statusClass = 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100';
          let statusDot = 'bg-emerald-500';

          if (status === 'booked') {
            statusClass = 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100';
            statusDot = 'bg-rose-500';
          } else if (status === 'pending') {
            statusClass = 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100';
            statusDot = 'bg-amber-500';
          }

          if (isSelected) {
            statusClass = 'ring-2 ring-rose-500 bg-rose-600 text-white font-bold';
            statusDot = 'bg-white';
          }

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => handleDayClick(dateStr, status)}
              className={`h-11 rounded-lg border text-xs flex flex-col items-center justify-center relative transition-all cursor-pointer ${statusClass}`}
              title={`${dateStr}: ${status === 'booked' ? 'Band' : status === 'pending' ? 'Kutilmoqda' : 'Bo\'sh'}`}
            >
              <span className="font-medium text-xs">{day}</span>
              <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${statusDot}`} />
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Bo'sh (Buyurtma qilsa bo'ladi)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Band qilingan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Kutilmoqda</span>
        </div>
      </div>

      {isAdmin && (
        <p className="mt-2 text-[11px] text-gray-500 text-center">
          * Sanani bosish orqali holatni o'zgartirishingiz mumkin (Bo'sh ➔ Band ➔ Kutilmoqda)
        </p>
      )}
    </div>
  );
};
