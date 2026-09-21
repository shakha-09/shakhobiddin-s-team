import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  Filter, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Trash2,
  Users,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BookingStatus } from '../../types';

interface AdminBookingsProps {
  onNavigate: (path: string) => void;
}

export const AdminBookings: React.FC<AdminBookingsProps> = () => {
  const { bookings, updateBookingStatus, deleteBookingRequest } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.listingTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'new':
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">Yangi</span>;
      case 'contacted':
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">Bog'lanildi</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">Tasdiqlandi</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700">Bekor qilindi</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700">Bajarildi</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Band Qilish So'rovlari (Bronlar)
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Mijozlardan kelib tushgan to'y sanasi va xizmat so'rovlarini ko'rib chiqish va holatini boshqarish
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-300 bg-gray-50 py-2 px-3 text-xs font-semibold text-gray-800 focus:outline-hidden"
          >
            <option value="all">Barcha so'rovlar ({bookings.length})</option>
            <option value="new">Yangi so'rovlar</option>
            <option value="contacted">Bog'lanilganlar</option>
            <option value="confirmed">Tasdiqlanganlar</option>
            <option value="completed">Bajarilganlar</option>
            <option value="cancelled">Bekor qilinganlar</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Mijoz ismi yoki telefoni..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-xs text-gray-800 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Bookings List / Table */}
      <div className="rounded-3xl bg-white border border-gray-200 shadow-xs overflow-hidden">
        {filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4">Mijoz ma'lumotlari</th>
                  <th className="py-3.5 px-4">Xizmat</th>
                  <th className="py-3.5 px-4">To'y Sanasi</th>
                  <th className="py-3.5 px-4">Izoh / Mehmonlar</th>
                  <th className="py-3.5 px-4">Holat</th>
                  <th className="py-3.5 px-4 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredBookings.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900 text-sm">{req.customerName}</div>
                      <a
                        href={`tel:${req.customerPhone.replace(/\s+/g, '')}`}
                        className="text-xs text-rose-600 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{req.customerPhone}</span>
                      </a>
                      <div className="text-[10px] text-gray-400 mt-1">Yuborilgan: {req.createdAt}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900">{req.listingTitle}</div>
                      <div className="text-[11px] text-gray-400">ID: {req.listingId}</div>
                    </td>

                    <td className="py-4 px-4 font-bold text-gray-900">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        <span>{req.requestedDate}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      {req.guestCount && (
                        <div className="text-xs text-gray-800 font-semibold mb-1 flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-500" />
                          <span>{req.guestCount} kishi</span>
                        </div>
                      )}
                      {req.message ? (
                        <p className="text-xs text-gray-600 italic line-clamp-2">"{req.message}"</p>
                      ) : (
                        <span className="text-[11px] text-gray-400">Qo'shimcha izoh yo'q</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1.5">
                        <div>{getStatusBadge(req.status)}</div>
                        <select
                          value={req.status}
                          onChange={(e) => updateBookingStatus(req.id, e.target.value as any)}
                          className="rounded-lg border border-gray-300 py-1 px-2 text-[11px] font-semibold bg-white text-gray-800"
                        >
                          <option value="new">Yangi</option>
                          <option value="contacted">Bog'lanildi</option>
                          <option value="confirmed">Tasdiqlandi</option>
                          <option value="completed">Bajarildi</option>
                          <option value="cancelled">Bekor qilindi</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Rostdan ham ushbu so'rovni o'chirmoqchimisiz?")) {
                            deleteBookingRequest(req.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 text-xs">
            Hech qanday so'rov topilmadi.
          </div>
        )}
      </div>
    </div>
  );
};
