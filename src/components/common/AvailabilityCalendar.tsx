import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
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

  // Quick stats for current visible month
  let monthBookedCount = 0;
  let monthAvailableCount = 0;
  daysArray.forEach(day => {
    const dStr = getDateString(day);
    const st = availability[dStr] || 'available';
    if (st === 'booked') monthBookedCount++;
    else if (st === 'available') monthAvailableCount++;
  });

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
    <div id="availability-calendar-card" className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-xs">
      {/* Month Navigation & Availability Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-950 text-base sm:text-lg">
              {monthNamesUz[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                {monthBookedCount} kun band
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                {monthAvailableCount} kun bo'sh
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
            title="Oldingi oy"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
            title="Keyingi oy"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-gray-500 mb-2">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {paddingDays.map(i => (
          <div key={`pad-${i}`} className="h-14 rounded-xl bg-gray-50/60 border border-transparent" />
        ))}

        {daysArray.map(day => {
          const dateStr = getDateString(day);
          const status = availability[dateStr] || 'available';
          const isSelected = selectedDate === dateStr;

          if (status === 'booked') {
            // PROMINENT BOLD RED PRESENTATION FOR BOOKED DATES
            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => handleDayClick(dateStr, status)}
                className={`h-14 rounded-xl border text-xs flex flex-col items-center justify-between p-1.5 relative transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-700 text-white border-red-900 ring-3 ring-gray-950 ring-offset-2 scale-102 z-10 shadow-md'
                    : 'bg-red-600 hover:bg-red-700 text-white border-red-700 shadow-xs hover:scale-101'
                }`}
                title={`${dateStr}: BAND QILINGAN (Bu sana to'la)`}
              >
                <span className="font-extrabold text-sm sm:text-base leading-none text-white drop-shadow-xs">
                  {day}
                </span>
                <span className="w-full inline-flex items-center justify-center gap-0.5 rounded bg-red-950/80 text-white px-1 py-0.5 text-[9px] font-black tracking-wider uppercase">
                  <XCircle className="w-2.5 h-2.5 shrink-0 text-red-200" />
                  <span>Band</span>
                </span>
              </button>
            );
          }

          if (status === 'pending') {
            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => handleDayClick(dateStr, status)}
                className={`h-14 rounded-xl border text-xs flex flex-col items-center justify-between p-1.5 relative transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 ring-3 ring-gray-950 ring-offset-2 scale-102 z-10 shadow-md'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 hover:border-amber-300'
                }`}
                title={`${dateStr}: So'rov kutilmoqda`}
              >
                <span className={`font-bold text-sm sm:text-base leading-none ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {day}
                </span>
                <span className={`w-full inline-flex items-center justify-center gap-0.5 rounded px-1 py-0.5 text-[9px] font-bold ${
                  isSelected ? 'bg-amber-600 text-white' : 'bg-amber-200/80 text-amber-900'
                }`}>
                  <Clock className="w-2.5 h-2.5 shrink-0" />
                  <span>Kutilmoqda</span>
                </span>
              </button>
            );
          }

          // Available (Bo'sh)
          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => handleDayClick(dateStr, status)}
              className={`h-14 rounded-xl border text-xs flex flex-col items-center justify-between p-1.5 relative transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-700 ring-3 ring-gray-950 ring-offset-2 scale-102 z-10 shadow-md'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200 hover:border-emerald-300'
              }`}
              title={`${dateStr}: Bo'sh (Buyurtma qilsa bo'ladi)`}
            >
              <span className={`font-bold text-sm sm:text-base leading-none ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                {day}
              </span>
              <span className={`w-full inline-flex items-center justify-center gap-0.5 rounded px-1 py-0.5 text-[9px] font-semibold ${
                isSelected ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                <CheckCircle2 className="w-2.5 h-2.5 shrink-0 text-emerald-600" />
                <span>Bo'sh</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend & Instructions */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 text-white font-extrabold text-[11px] shadow-xs">
            <XCircle className="w-3.5 h-3.5 text-white" />
            <span>BAND</span>
          </div>
          <span className="text-gray-800 font-semibold">Band qilingan (Sana band)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>BO'SH</span>
          </div>
          <span className="text-gray-700 font-medium">Bo'sh (Buyurtma qilsa bo'ladi)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold text-[11px] border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>KUTILMOQDA</span>
          </div>
          <span className="text-gray-700 font-medium">Tasdiqlash kutilmoqda</span>
        </div>
      </div>

      {isAdmin && (
        <p className="mt-3 text-[11px] text-gray-500 text-center bg-gray-50 p-2 rounded-lg border border-gray-200">
          * Admin: Sanani bosish orqali bandlik holatini o'zgartirishingiz mumkin (Bo'sh ➔ Band ➔ Kutilmoqda)
        </p>
      )}
    </div>
  );
};
