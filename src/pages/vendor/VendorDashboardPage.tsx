import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  Phone, 
  Instagram, 
  Send, 
  Image as ImageIcon, 
  DollarSign, 
  Eye, 
  LogOut, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Save, 
  AlertCircle,
  BarChart3,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AvailabilityStatus, CategoryType, ListingItem } from '../../types';
import { formatUZS } from '../../utils/formatters';

interface VendorDashboardPageProps {
  onNavigate: (path: string) => void;
}

type TabType = 'profile' | 'calendar' | 'bookings' | 'stats';

export const VendorDashboardPage: React.FC<VendorDashboardPageProps> = ({ onNavigate }) => {
  const { 
    activeVendor, 
    logoutVendor, 
    getVendorListing, 
    getVendorBookings,
    updateActiveVendorProfile,
    updateActiveVendorAvailability,
    acceptVendorBookingRequest,
    rejectVendorBookingRequest
  } = useStore();

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // If vendor is not logged in, show redirect or fallback
  if (!activeVendor) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 border border-white/10 rounded-2xl p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 mb-4">
            <LogOut className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Tizimga kirmagansiz</h2>
          <p className="text-sm text-gray-300 mb-6">
            Vendor kabinetidan foydalanish uchun telefon raqam va parolingiz bilan kiring.
          </p>
          <button
            onClick={() => onNavigate('/vendor-login')}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-gray-950 font-bold text-sm cursor-pointer shadow-md"
          >
            Kirish sahifasiga o'tish
          </button>
        </div>
      </div>
    );
  }

  const listing = getVendorListing(activeVendor.id);
  const bookings = getVendorBookings(activeVendor.id);

  // Profile form state (initialized from listing / vendor)
  const [businessName, setBusinessName] = useState(listing?.title || activeVendor.businessName);
  const [description, setDescription] = useState(listing?.description || activeVendor.description);
  const [price, setPrice] = useState<number>(listing?.price || 0);
  const [priceLabel, setPriceLabel] = useState(listing?.priceLabel || 'Kelishilgan narxda');
  const [phone, setPhone] = useState(listing?.contact?.phone || activeVendor.phone);
  const [secondaryPhone, setSecondaryPhone] = useState(listing?.contact?.secondaryPhone || '');
  const [telegram, setTelegram] = useState(listing?.contact?.telegram || '');
  const [instagram, setInstagram] = useState(listing?.contact?.instagram || '');
  const [images, setImages] = useState<string[]>(listing?.images || (listing?.coverImage ? [listing.coverImage] : []));
  const [newImageUrl, setNewImageUrl] = useState('');

  // Calendar month state
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 = September 2026

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

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  const getDateString = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  // Availability toggle for vendor calendar
  const handleToggleDay = (day: number) => {
    const dateStr = getDateString(day);
    const currentStatus = listing?.availability?.[dateStr] || 'available';
    // Toggle: if available -> booked; if booked -> available
    const newStatus: AvailabilityStatus = currentStatus === 'booked' ? 'available' : 'booked';
    updateActiveVendorAvailability(dateStr, newStatus);
  };

  // Profile save handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateActiveVendorProfile({
      businessName,
      description,
      price: Number(price),
      priceLabel: priceLabel.trim() || `${Number(price).toLocaleString('uz-UZ')} so'm`,
      contact: {
        phone,
        secondaryPhone,
        telegram,
        instagram
      },
      images,
      coverImage: images[0] || listing?.coverImage
    });

    setSaveSuccessMessage("Ma'lumotlar muvaffaqiyatli saqlandi!");
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  // Add photo handler
  const handleAddPhoto = () => {
    if (!newImageUrl.trim()) return;
    setImages(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleDeletePhoto = (index: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSetCoverPhoto = (index: number) => {
    setImages(prev => {
      const selected = prev[index];
      const rest = prev.filter((_, idx) => idx !== index);
      return [selected, ...rest];
    });
  };

  // Quick preset wedding photos for easy image uploads
  const presetPhotos = [
    { title: 'Hashamatli zal', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Guldasta va bezak', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Katta qandillar', url: 'https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Tadbir dasturxoni', url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80' }
  ];

  // Calendar stats for month
  let monthBooked = 0;
  let monthAvailable = 0;
  daysArray.forEach(day => {
    const dStr = getDateString(day);
    const st = listing?.availability?.[dStr] || 'available';
    if (st === 'booked') monthBooked++;
    else monthAvailable++;
  });

  // Statistics
  const totalViews = listing?.viewsCount || 0;
  const totalRequests = bookings.length;
  const confirmedRequests = bookings.filter(b => b.status === 'confirmed').length;
  const pendingRequests = bookings.filter(b => b.status === 'new').length;

  const handleLogout = () => {
    logoutVendor();
    onNavigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 font-sans">
      {/* Top Bar / Header */}
      <header className="sticky top-0 z-30 bg-gray-900/90 border-b border-white/15 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] text-gray-950 font-bold shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury font-bold text-white text-base sm:text-lg">
                  {listing?.title || activeVendor.businessName}
                </span>
                {/* Approval Status Badge */}
                {activeVendor.status === 'tasdiqlangan' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Faol / Tasdiqlangan</span>
                  </span>
                )}
                {activeVendor.status === 'kutilmoqda' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 border border-amber-500/30">
                    <Clock className="w-3 h-3" />
                    <span>Kutilmoqda</span>
                  </span>
                )}
                {activeVendor.status === 'rad etilgan' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[11px] font-bold text-rose-300 border border-rose-500/30">
                    <XCircle className="w-3 h-3" />
                    <span>Rad etilgan</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400">
                {activeVendor.phone} • {activeVendor.district}, {activeVendor.region}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View on Public Site button */}
            {listing && activeVendor.status === 'tasdiqlangan' && (
              <button
                onClick={() => onNavigate(`/detail/${listing.id}`)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-all cursor-pointer"
                title="Mijozlar sahifasida ko'rish"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                <span>Saytda ko'rish</span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 sm:space-x-4 border-t border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil & Ma'lumotlar</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bandlik Kalendari</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap relative ${
              activeTab === 'bookings'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>So'rovlar</span>
            {pendingRequests > 0 && (
              <span className="flex h-4.5 px-1.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {pendingRequests}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'stats'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistika</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notice for Pending or Rejected Status */}
        {activeVendor.status === 'kutilmoqda' && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300 mb-1">Arizangiz ko'rib chiqilmoqda</p>
              <p>
                Sizning xizmatingiz hozirda admin tomonidan tekshirilmoqda. Tasdiqlangandan so'ng u avtomatik ravishda umumiy katalogda paydo bo'ladi.
              </p>
            </div>
          </div>
        )}

        {activeVendor.status === 'rad etilgan' && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-400/40 text-rose-200 text-xs sm:text-sm flex items-start gap-3">
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-300 mb-1">Arizangiz rad etilgan</p>
              {activeVendor.rejectionReason && (
                <p className="mb-1">
                  <span className="font-semibold">Sabab:</span> {activeVendor.rejectionReason}
                </p>
              )}
              <p className="text-xs text-rose-300/80">
                Qayta tasdiqlash uchun ma'lumotlaringizni to'g'rilang yoki ma'muriyat bilan bog'laning.
              </p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {saveSuccessMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {/* TAB 1: PROFIL */}
        {activeTab === 'profile' && (
          <div className="bg-gray-800/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-serif-luxury font-bold text-white">
                  Xizmat Profili & Narxlar
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Bu yerdagi ma'lumotlar mijozlar ko'radigan sahifangizda darhol yangilanadi.
                </p>
              </div>

              {listing && activeVendor.status === 'tasdiqlangan' && (
                <button
                  type="button"
                  onClick={() => onNavigate(`/detail/${listing.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Sahifani ochish</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Business Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Xizmat / To'yxona Nomi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Price and Price Label */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Asosiy Narx (So'mda) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      required
                      min={0}
                      step={100000}
                      value={price}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPrice(val);
                        setPriceLabel(`${val.toLocaleString('uz-UZ')} so'mdan`);
                      }}
                      className="w-full rounded-xl bg-white/5 border border-white/20 pl-10 pr-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Format: {Number(price).toLocaleString('uz-UZ')} so'm
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Ko'rinadigan narx matni (Price Label)
                  </label>
                  <input
                    type="text"
                    value={priceLabel}
                    onChange={(e) => setPriceLabel(e.target.value)}
                    placeholder="Masalan: 25 000 000 so'mdan yoki 220 000 so'm/kishi"
                    className="w-full rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Kartochkalarda va tafsilot sahifasida aynan shu matn ko'rinadi.
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Tavsif (Xizmatlar, zal imkoniyatlari, maxsus takliflar)
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/20 p-4 text-sm text-white focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Asosiy telefon raqam
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl bg-white/5 border border-white/20 pl-10 pr-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Qo'shimcha telefon raqam
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={secondaryPhone}
                      onChange={(e) => setSecondaryPhone(e.target.value)}
                      placeholder="+998 90 999 88 77"
                      className="w-full rounded-xl bg-white/5 border border-white/20 pl-10 pr-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Telegram (@username)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Send className="w-4 h-4 text-sky-400" />
                    </div>
                    <input
                      type="text"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="@toyxona_admin"
                      className="w-full rounded-xl bg-white/5 border border-white/20 pl-10 pr-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Instagram (@profile)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Instagram className="w-4 h-4 text-pink-400" />
                    </div>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@toyxona_official"
                      className="w-full rounded-xl bg-white/5 border border-white/20 pl-10 pr-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Photos Management */}
              <div className="pt-4 border-t border-white/10">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">
                  Fotosuratlar galereyasi ({images.length} ta)
                </label>

                {/* Add new photo input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Rasm havolasini (URL) kiriting..."
                    className="flex-1 rounded-xl bg-white/5 border border-white/20 px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Qo'shish</span>
                  </button>
                </div>

                {/* Preset quick photos helper */}
                <div className="mb-4">
                  <span className="text-[11px] text-gray-400 mr-2">Tezkor namunali rasmlar:</span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {presetPhotos.map((p, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          if (!images.includes(p.url)) {
                            setImages(prev => [...prev, p.url]);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-amber-200 border border-white/10 transition-colors cursor-pointer"
                      >
                        + {p.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Images Grid with Delete and Set Cover */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((imgUrl, idx) => (
                    <div key={idx} className="relative group rounded-2xl overflow-hidden border border-white/20 bg-gray-900 aspect-4/3">
                      <img 
                        src={imgUrl} 
                        alt={`Photo ${idx + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-gray-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                          Asosiy (Cover)
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetCoverPhoto(idx)}
                            className="px-2.5 py-1 bg-amber-400 text-gray-950 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-amber-300"
                          >
                            Asosiy qilish
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(idx)}
                          className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Save Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-gray-950 font-bold text-sm tracking-wide shadow-lg hover:shadow-amber-500/20 hover:scale-[1.01] transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>O'zgarishlarni Saqlash</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: BANDLIK KALENDARI */}
        {activeTab === 'calendar' && (
          <div className="bg-gray-800/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-serif-luxury font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-300" />
                  <span>Bandlik Kalendari (Interactive Availability)</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Har qanday sanani bosing: u darhol <span className="text-emerald-400 font-bold">"Bo'sh"</span> (yashil) va <span className="text-rose-400 font-bold">"Band"</span> (qizil) o'rtasida almashadi va mijozlar sahifasida aks etadi.
                </p>
              </div>

              {/* Summary counters */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Bo'sh kunlar: {monthAvailable} ta</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>Band kunlar: {monthBooked} ta</span>
                </div>
              </div>
            </div>

            {/* Calendar Controls */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6 bg-white/5 border border-white/10 rounded-2xl p-4">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Oldingi oy</span>
                </button>

                <div className="text-center">
                  <span className="font-serif-luxury font-bold text-lg text-white">
                    {monthNamesUz[currentMonth]} {currentYear}
                  </span>
                  <p className="text-[11px] text-amber-300">Sanani bosib bandlikni o'zgartiring</p>
                </div>

                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  <span>Keyingi oy</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                {daysOfWeek.map((dayName, idx) => (
                  <div key={idx} className="text-xs font-bold uppercase tracking-wider text-gray-400 py-1">
                    {dayName}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-2">
                {paddingDays.map((_, idx) => (
                  <div key={`pad-${idx}`} className="h-16 sm:h-20 rounded-2xl bg-white/5 opacity-20" />
                ))}

                {daysArray.map((day) => {
                  const dateStr = getDateString(day);
                  const isBooked = listing?.availability?.[dateStr] === 'booked';

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleToggleDay(day)}
                      className={`h-16 sm:h-20 rounded-2xl p-2 flex flex-col justify-between items-center transition-all cursor-pointer border shadow-sm ${
                        isBooked
                          ? 'bg-rose-600/30 hover:bg-rose-600/40 border-rose-500/60 text-white'
                          : 'bg-emerald-600/20 hover:bg-emerald-600/30 border-emerald-500/40 text-emerald-100'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold">{day}</span>
                      <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                        isBooked ? 'bg-rose-500 text-white' : 'bg-emerald-500/30 text-emerald-300'
                      }`}>
                        {isBooked ? 'Band' : "Bo'sh"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-md bg-emerald-600/40 border border-emerald-500" />
                  <span>Bo'sh (Buyurtma qabul qilinadi)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-md bg-rose-600/40 border border-rose-500" />
                  <span>Band (To'y yoki tadbir belgilangan)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SO'ROVLAR (BOOKINGS) */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="bg-gray-800/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-serif-luxury font-bold text-white flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-amber-300" />
                    <span>Mijozlar So'rovlari ({bookings.length})</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Saytingiz sahifasidan mijozlar yuborgan to'y buyurtmalari. So'rov qabul qilinganda o'sha sana avtomatik kalendarda "Band" qilib belgilanadi.
                  </p>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-gray-400 mb-3">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Hozircha yangi so'rovlar yo'q</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                    Mijozlar sizning sahifangiz orqali buyurtma qoldirganda, bu yerda barcha tafsilotlar ko'rinadi.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-amber-400/40 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-white text-base">
                              {req.customerName}
                            </span>
                            {/* Status badge */}
                            {req.status === 'new' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                                Yangi So'rov
                              </span>
                            )}
                            {req.status === 'confirmed' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                                Qabul qilingan
                              </span>
                            )}
                            {req.status === 'cancelled' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-rose-500/30">
                                Rad etilgan
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 text-xs text-gray-300">
                            <span className="flex items-center gap-1.5 text-amber-200">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{req.customerPhone}</span>
                            </span>
                            <span className="flex items-center gap-1.5 text-gray-300">
                              <Calendar className="w-3.5 h-3.5 text-amber-300" />
                              <span>Tadbir sanasi: <strong>{req.requestedDate}</strong></span>
                            </span>
                            {req.guestCount && (
                              <span className="flex items-center gap-1.5 text-gray-300">
                                <Users className="w-3.5 h-3.5 text-amber-300" />
                                <span>Mehmonlar soni: <strong>{req.guestCount} kishi</strong></span>
                              </span>
                            )}
                          </div>

                          {req.message && (
                            <div className="text-xs text-gray-300 bg-black/30 p-3 rounded-xl border border-white/5 mt-2">
                              <span className="text-gray-400 block text-[10px] uppercase font-bold mb-0.5">Xabar:</span>
                              "{req.message}"
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          {req.status !== 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => acceptVendorBookingRequest(req.id)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Qabul qilish</span>
                            </button>
                          )}

                          {req.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => rejectVendorBookingRequest(req.id)}
                              className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs tracking-wide transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Rad etish</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: STATISTIKA */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1 */}
              <div className="bg-gray-800/70 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Ko'rishlar</span>
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {totalViews}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Sahifangizga kirgan jami foydalanuvchilar
                </p>
              </div>

              {/* Metric 2 */}
              <div className="bg-gray-800/70 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-400/20 text-blue-300 flex items-center justify-center">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Jami So'rovlar</span>
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {totalRequests}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Mijozlar tomonidan yuborilgan buyurtmalar
                </p>
              </div>

              {/* Metric 3 */}
              <div className="bg-gray-800/70 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Qabul qilingan</span>
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {confirmedRequests}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Siz tasdiqlagan va band qilingan to'ylar
                </p>
              </div>

              {/* Metric 4 */}
              <div className="bg-gray-800/70 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Konversiya</span>
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {totalRequests > 0 ? Math.round((confirmedRequests / totalRequests) * 100) : 0}%
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  So'rovlarni to'yga aylantirish darajasi
                </p>
              </div>
            </div>

            {/* Vendor Tips & Growth */}
            <div className="bg-linear-to-r from-gray-800/80 to-gray-800/40 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Mijozlar sonini oshirish bo'yicha tavsiyalar</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span><strong>Fotosuratlarni ko'paytiring:</strong> 4 tadan ortiq yuqori sifatli fotosuratlar profilga bo'lgan qiziqishni 3 barobarga oshiradi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span><strong>Bandlik kalendarini doimiy yangilab boring:</strong> Bo'sh kunlarni aniq ko'rgan mijozlar to'g'ridan-to'g'ri so'rov qoldiradi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span><strong>So'rovlarga tezkor javob bering:</strong> Mijozlar tezkor aloqaga chiquvchi xizmatlarni tanlash ehtimoli ancha yuqori.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
