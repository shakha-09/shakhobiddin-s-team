import React from 'react';
import { AvailabilityStatus } from '../../types';

interface AvailabilityBadgeProps {
  status?: AvailabilityStatus;
  date?: string;
  className?: string;
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ 
  status = 'available', 
  date,
  className = '' 
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'available':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: date ? `${date}: Bo'sh` : "Bo'sh (Buyurtma ochiq)"
        };
      case 'booked':
        return {
          bg: 'bg-red-600 text-white border-red-700 font-bold shadow-xs',
          dot: 'bg-white',
          label: date ? `${date}: BAND QILINGAN` : 'BAND (To\'la)'
        };
      case 'pending':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          label: date ? `${date}: Kutilmoqda` : 'So\'rov kutilmoqda'
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span 
      id={`avail-badge-${status}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full animate-pulse ${config.dot}`} />
      <span className="truncate">{config.label}</span>
    </span>
  );
};
