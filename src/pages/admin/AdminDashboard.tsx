import React from 'react';
import { 
  Building2, 
  Car, 
  Music, 
  Sparkles, 
  Mic, 
  Smile, 
  Inbox, 
  Clock, 
  CheckCircle2, 
  Star, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Eye,
  Calendar,
  UserCheck,
  Video
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatUZS } from '../../utils/formatters';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { listings, bookings, reviews, updateBookingStatus, vendors } = useStore();

  const weddingHallsCount = listings.filter(l => l.category === 'wedding-hall').length;
  const carsCount = listings.filter(l => l.category === 'car').length;
  const artistsCount = listings.filter(l => l.category === 'artist').length;
  const famousStarsCount = listings.filter(l => l.category === 'famous-artist').length;
  const hostsCount = listings.filter(l => l.category === 'host').length;
  const entertainersCount = listings.filter(l => l.category === 'entertainer').length;
  const videographersCount = listings.filter(l => l.category === 'videographer').length;

  const newRequestsCount = bookings.filter(b => b.status === 'new').length;
  const confirmedRequestsCount = bookings.filter(b => b.status === 'confirmed').length;
  const pendingVendorsCount = vendors.filter(v => v.status === 'kutilmoqda').length;

  const totalListingViews = listings.reduce((sum, item) => sum + (item.viewsCount || 0), 0);

  const stats = [
    { label: 'Yangi Vendorlar', count: pendingVendorsCount, icon: UserCheck, color: 'text-amber-600 bg-amber-50', path: '/admin/vendors' },
    { label: 'To\'yxonalar', count: weddingHallsCount, icon: Building2, color: 'text-rose-600 bg-rose-50', path: '/admin/wedding-halls' },
    { label: 'ZAGS Mashinalari', count: carsCount, icon: Car, color: 'text-blue-600 bg-blue-50', path: '/admin/cars' },
    { label: 'Xonandalar', count: artistsCount, icon: Music, color: 'text-emerald-600 bg-emerald-50', path: '/admin/artists' },
    { label: 'Yulduzlar (VIP)', count: famousStarsCount, icon: Sparkles, color: 'text-amber-600 bg-amber-50', path: '/admin/famous-artists' },
    { label: 'Videochilar', count: videographersCount, icon: Video, color: 'text-cyan-600 bg-cyan-50', path: '/admin/videographers' },
    { label: 'Boshlovchilar', count: hostsCount, icon: Mic, color: 'text-purple-600 bg-purple-50', path: '/admin/hosts' },
    { label: 'Qiziqchilar', count: entertainersCount, icon: Smile, color: 'text-indigo-600 bg-indigo-50', path: '/admin/entertainers' },
    { label: 'Yangi So\'rovlar', count: newRequestsCount, icon: Inbox, color: 'text-rose-600 bg-rose-100', path: '/admin/bookings' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300 border border-rose-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>To'y Makoni Markaziy Boshqaruv Tizimi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Xush kelibsiz, Bosh Administrator!
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
            Platformadagi barcha to'yxonalar, narxlar, fotosuratlar va yangi vendor arizalarini bir joydan boshqaring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('/admin/vendors')}
            className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-gray-950 transition-colors shadow-md cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Vendor Arizalari ({pendingVendorsCount})</span>
          </button>
          <button
            onClick={() => onNavigate('/admin/wedding-halls?action=add')}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi To'yxona qo'shish</span>
          </button>
          <button
            onClick={() => onNavigate('/admin/bookings')}
            className="flex items-center gap-2 rounded-xl bg-gray-800 border border-gray-700 px-4 py-2.5 text-xs font-bold text-gray-200 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <Inbox className="w-4 h-4 text-rose-400" />
            <span>So'rovlarni ko'rish ({newRequestsCount})</span>
          </button>
        </div>
      </div>

      {/* Stats Metric Cards (Section 18) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(s.path)}
              className="rounded-2xl bg-white p-5 border border-gray-200 shadow-xs hover:border-rose-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-rose-600 transition-colors" />
              </div>
              <div className="text-2xl font-black text-gray-900">{s.count}</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Secondary Metrics: Views, Reviews, Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Platforma ko'rishlar soni</div>
            <div className="text-xl font-extrabold text-gray-900">{totalListingViews.toLocaleString()} marta</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Jami tasdiqlangan fikrlar</div>
            <div className="text-xl font-extrabold text-gray-900">{reviews.length} ta sharh</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Faol to'y mavsumi</div>
            <div className="text-xl font-extrabold text-gray-900">Kuz 2026</div>
          </div>
        </div>
      </div>

      {/* Recent Booking Requests Table (Section 15 & 18) */}
      <div className="rounded-3xl bg-white border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">So'nggi kelib tushgan so'rovlar</h2>
            <p className="text-xs text-gray-500">Mijozlar tomonidan qoldirilgan to'y buyurtma arizalari</p>
          </div>
          <button
            onClick={() => onNavigate('/admin/bookings')}
            className="text-xs font-bold text-rose-600 hover:underline"
          >
            Barchasini ko'rish →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Mijoz</th>
                <th className="py-3 px-4">Telefon</th>
                <th className="py-3 px-4">Xizmat</th>
                <th className="py-3 px-4">To'y Sanasi</th>
                <th className="py-3 px-4">Holati</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {bookings.slice(0, 5).map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-900">{req.customerName}</td>
                  <td className="py-3.5 px-4">{req.customerPhone}</td>
                  <td className="py-3.5 px-4 font-medium text-rose-700">{req.listingTitle}</td>
                  <td className="py-3.5 px-4 font-bold">{req.requestedDate}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={req.status}
                      onChange={(e) => updateBookingStatus(req.id, e.target.value as any)}
                      className="rounded-lg border border-gray-300 py-1 px-2 text-xs font-semibold focus:outline-hidden bg-white"
                    >
                      <option value="new">Yangi</option>
                      <option value="contacted">Bog'lanildi</option>
                      <option value="confirmed">Tasdiqlandi</option>
                      <option value="cancelled">Bekor qilindi</option>
                      <option value="completed">Bajarildi</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onNavigate('/admin/bookings')}
                      className="text-xs text-rose-600 hover:underline font-bold"
                    >
                      Batafsil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
