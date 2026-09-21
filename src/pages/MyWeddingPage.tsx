import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  Wallet, 
  Building2, 
  Car, 
  Music, 
  Mic, 
  Sparkles, 
  Smile, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Trash2, 
  ExternalLink,
  Edit2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatUZS, formatUzbekDate, getCategoryMeta } from '../utils/formatters';
import { UZBEKISTAN_REGIONS, getDistrictsByRegion } from '../data/locations';

interface MyWeddingPageProps {
  onNavigate: (path: string) => void;
}

export const MyWeddingPage: React.FC<MyWeddingPageProps> = ({ onNavigate }) => {
  const { 
    myWedding, 
    updateMyWedding, 
    selectServiceForWedding, 
    getListingById,
    bookings
  } = useStore();

  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [weddingDate, setWeddingDate] = useState(myWedding.weddingDate);
  const [region, setRegion] = useState(myWedding.region);
  const [district, setDistrict] = useState(myWedding.district);
  const [guestCount, setGuestCount] = useState(myWedding.guestCount);
  const [budgetUZS, setBudgetUZS] = useState(myWedding.budgetUZS);

  const availableDistricts = getDistrictsByRegion(region);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateMyWedding({
      weddingDate,
      region,
      district,
      guestCount: Number(guestCount),
      budgetUZS: Number(budgetUZS)
    });
    setIsEditingSettings(false);
  };

  // Categories slots configuration
  const serviceSlots: { key: keyof typeof myWedding.savedServices; label: string; icon: any; path: string }[] = [
    { key: 'wedding-hall', label: "To'yxona", icon: Building2, path: '/wedding-halls' },
    { key: 'car', label: 'ZAGS Mashinasi', icon: Car, path: '/cars' },
    { key: 'artist', label: 'Xonanda', icon: Music, path: '/artists' },
    { key: 'host', label: 'Boshlovchi', icon: Mic, path: '/hosts' },
    { key: 'famous-artist', label: 'Yulduz (VIP)', icon: Sparkles, path: '/famous-artists' },
    { key: 'entertainer', label: 'Qiziqchi', icon: Smile, path: '/entertainers' }
  ];

  // Calculate total allocated
  const allocatedSum = serviceSlots.reduce((sum, slot) => {
    const listingId = myWedding.savedServices[slot.key];
    if (listingId) {
      const item = getListingById(listingId);
      return sum + (item ? item.price : 0);
    }
    return sum;
  }, 0);

  // Customer's booking requests
  const customerRequests = bookings.slice(0, 5); // recent requests

  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 mb-2">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Shaxsiy To'y Rejasi</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Mening To'yim
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              To'y sanasi, tanlangan xizmatlar va yuborilgan bron so'rovlari nazorati
            </p>
          </div>

          <button
            onClick={() => setIsEditingSettings(!isEditingSettings)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
            <span>{isEditingSettings ? 'Yopish' : 'To\'y ma\'lumotlarini o\'zgartirish'}</span>
          </button>
        </div>

        {/* Edit Settings Drawer/Box */}
        {isEditingSettings && (
          <form 
            onSubmit={handleSaveSettings}
            className="rounded-3xl bg-white p-6 shadow-md border border-rose-100 animate-fade-in space-y-4"
          >
            <h3 className="text-sm font-bold text-gray-900 border-b pb-2">
              To'y parametrlarini tahrirlash
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">To'y sanasi</label>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Viloyat</label>
                <select
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    const dists = getDistrictsByRegion(e.target.value);
                    setDistrict(dists[0] || '');
                  }}
                  className="w-full rounded-xl border border-gray-300 p-2 text-xs"
                >
                  {UZBEKISTAN_REGIONS.map((r) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tuman</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2 text-xs"
                >
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mehmonlar soni</label>
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 p-2 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Maksimal rejalashtirilgan budjet (so'm)</label>
                <input
                  type="number"
                  step={1000000}
                  value={budgetUZS}
                  onChange={(e) => setBudgetUZS(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 p-2 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingSettings(false)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                Saqlash
              </button>
            </div>
          </form>
        )}

        {/* 1. Overview Dashboard Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shrink-0">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-gray-500 font-medium">To'y sanasi</div>
              <div className="text-sm sm:text-base font-bold text-gray-900">
                {formatUzbekDate(myWedding.weddingDate)}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-gray-500 font-medium">To'y joylashuvi</div>
              <div className="text-sm sm:text-base font-bold text-gray-900 truncate max-w-[150px]">
                {myWedding.district}, {myWedding.region}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-gray-500 font-medium">Mehmonlar soni</div>
              <div className="text-sm sm:text-base font-bold text-gray-900">
                {myWedding.guestCount} kishi
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-gray-500 font-medium">Reja / Ajratilgan</div>
              <div className="text-sm sm:text-base font-bold text-gray-900">
                {formatUZS(allocatedSum)}
              </div>
            </div>
          </div>
        </div>

        {/* 2. SAVED SERVICES SLOTS (SECTION 17) */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Tanlangan To'y Xizmatlari</h2>
              <p className="text-xs text-gray-500">To'yingiz uchun biriktirilgan asosiy xizmat ko'rsatuvchilar</p>
            </div>
            <button
              onClick={() => onNavigate('/budget-calculator')}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Budjet kalkulyatori →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceSlots.map((slot) => {
              const Icon = slot.icon;
              const listingId = myWedding.savedServices[slot.key];
              const listing = listingId ? getListingById(listingId) : null;

              return (
                <div
                  key={slot.key}
                  className={`rounded-2xl border p-4.5 transition-all ${
                    listing 
                      ? 'border-emerald-200 bg-emerald-50/20' 
                      : 'border-dashed border-gray-300 bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-gray-700 shadow-xs border border-gray-100">
                        <Icon className="w-4 h-4 text-rose-600" />
                      </div>
                      <span className="text-xs font-bold uppercase text-gray-500">{slot.label}</span>
                    </div>

                    {listing ? (
                      <button
                        onClick={() => selectServiceForWedding(slot.key, null)}
                        className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onNavigate(slot.path)}
                        className="text-xs font-bold text-rose-600 hover:underline"
                      >
                        + Tanlash
                      </button>
                    )}
                  </div>

                  {listing ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={listing.coverImage}
                        alt={listing.title}
                        className="h-14 w-18 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{listing.title}</h4>
                        <div className="text-xs text-gray-500">{listing.location.district}</div>
                        <div className="text-xs font-bold text-emerald-700 mt-0.5">
                          {listing.priceLabel || formatUZS(listing.price)}
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigate(`/${listing.category === 'wedding-hall' ? 'wedding-halls' : listing.category === 'car' ? 'cars' : 'artists'}/${listing.id}`)}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-rose-600"
                        title="Batafsil"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-2 text-center text-xs text-gray-400">
                      Hali {slot.label.toLowerCase()} tanlanmadi.{' '}
                      <button
                        onClick={() => onNavigate(slot.path)}
                        className="text-rose-600 underline font-medium"
                      >
                        Katalogdan tanlash
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. MY BOOKING REQUESTS STATUS PIPELINE (SECTION 15 & 17) */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Yuborilgan So'rovlarim</h2>
              <p className="text-xs text-gray-500">Xizmat ko'rsatuvchilarga yuborilgan band qilish so'rovlari holati</p>
            </div>
            <span className="text-xs font-bold text-gray-500">
              Jami: {customerRequests.length} ta
            </span>
          </div>

          {customerRequests.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {customerRequests.map((req) => {
                const getStatusBadge = () => {
                  switch (req.status) {
                    case 'new':
                      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">Yangi</span>;
                    case 'contacted':
                      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">Bog'lanildi</span>;
                    case 'confirmed':
                      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">Tasdiqlandi</span>;
                    case 'cancelled':
                      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">Bekor qilindi</span>;
                    case 'completed':
                      return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">Bajarildi</span>;
                  }
                };

                return (
                  <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{req.listingTitle}</span>
                        {getStatusBadge()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-3">
                        <span>Sana: <strong>{req.requestedDate}</strong></span>
                        {req.guestCount && <span>Mehmonlar: {req.guestCount} kishi</span>}
                        <span>Yuborilgan: {req.createdAt}</span>
                      </div>
                      {req.message && (
                        <p className="text-xs text-gray-600 mt-1 italic">"{req.message}"</p>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      Bog'lanish: <strong>{req.customerPhone}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-gray-400">
              Hozircha hech qanday band qilish so'rovi yuborilmadi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
