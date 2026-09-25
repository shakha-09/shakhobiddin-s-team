import React, { useState } from 'react';
import { 
  Building2, 
  Car, 
  Music, 
  Mic, 
  Smile, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  ExternalLink, 
  AlertCircle,
  Eye,
  ShieldCheck,
  Ban,
  RotateCcw,
  Sparkles,
  Video
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryType, VendorAccount, VendorStatus } from '../../types';

interface AdminVendorsProps {
  onNavigate: (path: string) => void;
}

export const AdminVendors: React.FC<AdminVendorsProps> = ({ onNavigate }) => {
  const { vendors, approveVendor, rejectVendor, updateVendorStatus, listings } = useStore();

  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VendorStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | CategoryType>('all');

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedVendorForReject, setSelectedVendorForReject] = useState<VendorAccount | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingVendors = vendors.filter(v => v.status === 'kutilmoqda');

  const getCategoryLabel = (cat: CategoryType) => {
    switch (cat) {
      case 'wedding-hall': return "To'yxona";
      case 'car': return "ZAGS Mashinasi";
      case 'artist': return "Xonanda";
      case 'famous-artist': return "VIP Yulduz";
      case 'host': return "Boshlovchi";
      case 'entertainer': return "Qiziqchi";
      case 'videographer': return "Videochi";
      default: return cat;
    }
  };

  const getCategoryIcon = (cat: CategoryType) => {
    switch (cat) {
      case 'wedding-hall': return Building2;
      case 'car': return Car;
      case 'artist': return Music;
      case 'famous-artist': return Sparkles;
      case 'host': return Mic;
      case 'entertainer': return Smile;
      case 'videographer': return Video;
      default: return Building2;
    }
  };

  const handleOpenRejectModal = (vendor: VendorAccount) => {
    setSelectedVendorForReject(vendor);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedVendorForReject) return;
    rejectVendor(selectedVendorForReject.id, rejectReason.trim() || "Ma'lumotlar talabga javob bermadi");
    setRejectModalOpen(false);
    setSelectedVendorForReject(null);
  };

  // Filtered all vendors
  const filteredVendors = vendors.filter(v => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = v.businessName.toLowerCase().includes(q);
      const matchPhone = v.phone.toLowerCase().includes(q);
      const matchDistrict = v.district.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchDistrict) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && v.status !== statusFilter) {
      return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && v.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-8 h-8 text-rose-600" />
            <span>Vendorlar & Arizalar Boshqaruvi</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Xizmat ko'rsatuvchilar ro'yxatdan o'tish arizalarini ko'rib chiqish va tasdiqlash
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Yangi Arizalar</span>
            {pendingVendors.length > 0 && (
              <span className="rounded-full bg-white text-rose-600 px-2 py-0.5 text-[10px] font-black">
                {pendingVendors.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span>Barcha Vendorlar ({vendors.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PENDING APPLICATIONS (YANGI ARIZALAR) */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                {pendingVendors.length}
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  Tasdiqlashni kutayotgan yangi arizalar
                </h3>
                <p className="text-xs text-amber-700">
                  Ushbu vendorlar admin tasdiqlaguncha umumiy saytda (katalogda) ko'rinmaydi.
                </p>
              </div>
            </div>
          </div>

          {pendingVendors.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Kutilayotgan arizalar yo'q
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Barcha yangi vendor arizalari ko'rib chiqilgan. Yangi xizmat ko'rsatuvchi ro'yxatdan o'tganda bu yerda paydo bo'ladi.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingVendors.map((vendor) => {
                const CatIcon = getCategoryIcon(vendor.category);

                return (
                  <div
                    key={vendor.id}
                    className="bg-white rounded-2xl border-2 border-amber-300 p-5 sm:p-6 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      {/* Left: Info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Kutilmoqda</span>
                          </span>

                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold border border-gray-200">
                            <CatIcon className="w-3.5 h-3.5 text-gray-600" />
                            <span>{getCategoryLabel(vendor.category)}</span>
                          </span>

                          <span className="text-xs text-gray-400">
                            Ariza topshirilgan sana: {vendor.createdAt}
                          </span>
                        </div>

                        <div>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                            {vendor.businessName}
                          </h2>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-1.5">
                            <span className="flex items-center gap-1.5 font-bold text-gray-800">
                              <Phone className="w-3.5 h-3.5 text-rose-600" />
                              <span>{vendor.phone}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-500" />
                              <span>{vendor.district}, {vendor.region}</span>
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 text-xs text-gray-700 leading-relaxed">
                          <span className="font-bold text-gray-900 block mb-1">Xizmat tavsifi:</span>
                          <p>{vendor.description}</p>
                        </div>
                      </div>

                      {/* Right: Action Buttons */}
                      <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
                        <button
                          type="button"
                          onClick={() => approveVendor(vendor.id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>✅ Tasdiqlash</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenRejectModal(vendor)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>❌ Rad etish</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL VENDORS TABLE & CONTROLS */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Vendor nomi, telefon yoki tuman..."
                className="w-full rounded-xl bg-gray-50 border border-gray-200 pl-9 pr-4 py-2 text-xs text-gray-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-rose-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-hidden"
              >
                <option value="all">Barcha holatlar</option>
                <option value="kutilmoqda">Kutilmoqda</option>
                <option value="tasdiqlangan">Tasdiqlangan (Faol)</option>
                <option value="rad etilgan">Rad etilgan</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-hidden"
              >
                <option value="all">Barcha toifalar</option>
                <option value="wedding-hall">To'yxonalar</option>
                <option value="car">ZAGS Mashinalari</option>
                <option value="artist">Xonandalar</option>
                <option value="videographer">Videochilar</option>
                <option value="host">Boshlovchilar</option>
                <option value="entertainer">Qiziqchilar</option>
              </select>
            </div>
          </div>

          {/* Vendors Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Vendor / Korxona</th>
                    <th className="px-4 py-3.5">Toifa</th>
                    <th className="px-4 py-3.5">Telefon</th>
                    <th className="px-4 py-3.5">Hudud</th>
                    <th className="px-4 py-3.5">Holati</th>
                    <th className="px-4 py-3.5">Ro'yxatdan o'tgan</th>
                    <th className="px-5 py-3.5 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        Vendorlar topilmadi
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((vendor) => {
                      const CatIcon = getCategoryIcon(vendor.category);
                      const matchingListing = listings.find(l => l.id === vendor.listingId || l.vendorId === vendor.id);

                      return (
                        <tr key={vendor.id} className="hover:bg-gray-50/80 transition-colors">
                          {/* Name */}
                          <td className="px-5 py-4">
                            <div className="font-bold text-gray-900 text-sm">
                              {vendor.businessName}
                            </div>
                            <div className="text-[11px] text-gray-500 truncate max-w-xs">
                              {vendor.description}
                            </div>
                            {vendor.rejectionReason && vendor.status === 'rad etilgan' && (
                              <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
                                Sabab: {vendor.rejectionReason}
                              </div>
                            )}
                          </td>

                          {/* Category */}
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 font-semibold text-gray-700">
                              <CatIcon className="w-3.5 h-3.5 text-gray-500" />
                              <span>{getCategoryLabel(vendor.category)}</span>
                            </span>
                          </td>

                          {/* Phone */}
                          <td className="px-4 py-4 font-semibold text-gray-900">
                            {vendor.phone}
                          </td>

                          {/* Region */}
                          <td className="px-4 py-4 text-gray-600">
                            <div>{vendor.district}</div>
                            <div className="text-[10px] text-gray-400">{vendor.region}</div>
                          </td>

                          {/* Status Badge */}
                          <td className="px-4 py-4">
                            {vendor.status === 'tasdiqlangan' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Tasdiqlangan</span>
                              </span>
                            )}
                            {vendor.status === 'kutilmoqda' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>Kutilmoqda</span>
                              </span>
                            )}
                            {vendor.status === 'rad etilgan' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
                                <XCircle className="w-3 h-3 text-rose-600" />
                                <span>Rad etilgan</span>
                              </span>
                            )}
                          </td>

                          {/* Registered Date */}
                          <td className="px-4 py-4 text-gray-500">
                            {vendor.createdAt}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* If Pending: Approve / Reject */}
                              {vendor.status === 'kutilmoqda' && (
                                <>
                                  <button
                                    onClick={() => approveVendor(vendor.id)}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                                    title="Tasdiqlash"
                                  >
                                    Tasdiqlash
                                  </button>
                                  <button
                                    onClick={() => handleOpenRejectModal(vendor)}
                                    className="px-2.5 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-[11px] transition-colors cursor-pointer"
                                    title="Rad etish"
                                  >
                                    Rad etish
                                  </button>
                                </>
                              )}

                              {/* If Approved: Suspend / Deactivate button */}
                              {vendor.status === 'tasdiqlangan' && (
                                <>
                                  {matchingListing && (
                                    <button
                                      onClick={() => onNavigate(`/detail/${matchingListing.id}`)}
                                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                      title="Saytda ko'rish"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleOpenRejectModal(vendor)}
                                    className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                                    title="Faoliyatini to'xtatish"
                                  >
                                    <Ban className="w-3 h-3" />
                                    <span>To'xtatish</span>
                                  </button>
                                </>
                              )}

                              {/* If Rejected: Re-approve */}
                              {vendor.status === 'rad etilgan' && (
                                <button
                                  onClick={() => approveVendor(vendor.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                                  title="Qayta tasdiqlash"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Qayta tasdiqlash</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModalOpen && selectedVendorForReject && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Arizani rad etish / To'xtatish
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedVendorForReject.businessName}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Rad etish sababi (Ixtiyoriy)
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Masalan: Ma'lumotlar to'liq emas, fotosuratlar sifatsiz, telefon raqamga ulanib bo'lmadi..."
                className="w-full rounded-xl border border-gray-300 p-3 text-xs text-gray-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Ushbu sabab vendor o'z hisobiga kirishga uringanda ekranda ko'rsatiladi.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
              >
                Rad etishni tasdiqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
