import React, { useState } from 'react';
import { 
  Building2, 
  Car, 
  Music, 
  Mic, 
  Smile, 
  CheckCircle2, 
  Phone, 
  Lock, 
  MapPin, 
  Sparkles, 
  ArrowLeft, 
  AlertCircle,
  Eye,
  EyeOff,
  Clock,
  ShieldCheck,
  Video,
  Loader2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryType } from '../../types';
import { UZBEKISTAN_REGIONS } from '../../data/locations';
import { formatUzbekPhoneNumber, sanitizeInput } from '../../utils/formatters';

interface VendorRegisterPageProps {
  onNavigate: (path: string) => void;
}

export const VendorRegisterPage: React.FC<VendorRegisterPageProps> = ({ onNavigate }) => {
  const { registerVendor } = useStore();

  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [category, setCategory] = useState<CategoryType>('wedding-hall');
  const [selectedRegion, setSelectedRegion] = useState(UZBEKISTAN_REGIONS[0].name);
  const [selectedDistrict, setSelectedDistrict] = useState(UZBEKISTAN_REGIONS[0].districts[0]);
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedVendorName, setSubmittedVendorName] = useState('');

  // Handle region change to update available districts
  const handleRegionChange = (regName: string) => {
    setSelectedRegion(regName);
    const regionObj = UZBEKISTAN_REGIONS.find(r => r.name === regName);
    if (regionObj && regionObj.districts.length > 0) {
      setSelectedDistrict(regionObj.districts[0]);
    } else {
      setSelectedDistrict('');
    }
  };

  const handlePhoneChange = (val: string) => {
    setPhone(formatUzbekPhoneNumber(val));
    if (error) setError(null);
  };

  const currentDistricts = UZBEKISTAN_REGIONS.find(r => r.name === selectedRegion)?.districts || [];

  const categoryOptions: { type: CategoryType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { type: 'wedding-hall', label: "To'yxona", icon: Building2 },
    { type: 'car', label: 'ZAGS Mashinasi', icon: Car },
    { type: 'artist', label: 'Xonanda', icon: Music },
    { type: 'host', label: 'Boshlovchi', icon: Mic },
    { type: 'entertainer', label: 'Qiziqchi', icon: Smile },
    { type: 'videographer', label: 'Videochi', icon: Video },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    // Validation
    const cleanName = sanitizeInput(businessName);
    if (!cleanName || cleanName.length < 2) {
      setError("Iltimos, korxona yoki xizmat nomini (masalan, Bahor to'yxonasi) to'liq kiriting.");
      return;
    }

    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 12) {
      setError("Iltimos, to'liq telefon raqamingizni kiriting (+998 XX XXX XX XX).");
      return;
    }

    if (!password || password.length < 4) {
      setError("Parol kamida 4 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Kiritilgan parollar bir-biriga mos kelmadi. Qayta tekshiring.");
      return;
    }

    const cleanDesc = sanitizeInput(description);
    if (!cleanDesc || cleanDesc.length < 5) {
      setError("Iltimos, xizmatlaringiz haqida qisqacha ma'lumot kiriting (kamida 5 ta belgi).");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = registerVendor({
        businessName: cleanName,
        phone: phone.trim(),
        password,
        category,
        region: selectedRegion,
        district: selectedDistrict,
        description: cleanDesc
      });

      setIsSubmitting(false);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSubmittedVendorName(cleanName);
      setIsSubmitted(true);
    }, 400);
  };

  // Confirmation Screen (Part 1, Requirement 4)
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 via-gray-900 to-slate-950 text-white flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl bg-gray-800/90 border border-amber-400/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 text-emerald-400 mb-6 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Ariza holati: Kutilmoqda</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mb-3">
            {submittedVendorName}
          </h1>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-gray-200 text-sm sm:text-base leading-relaxed mb-8">
            <p className="font-semibold text-amber-200 mb-2">
              So'rovingiz muvaffaqiyatli yuborildi!
            </p>
            <p className="text-gray-300">
              Admin tomonidan tasdiqlangandan so'ng kabinetingizga kira olasiz. Odatda 24 soat ichida ko'rib chiqiladi.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onNavigate('/vendor-login')}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-gray-950 font-bold text-sm tracking-wide shadow-lg hover:shadow-amber-500/20 hover:scale-[1.01] transition-all cursor-pointer"
            >
              Vendor Kirish Sahifasiga o'tish
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Bosh sahifaga qaytish
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-400 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Xavfsiz va shaffof to'y xizmatlari platformasi</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-gray-900 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-amber-200 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bosh sahifaga qaytish</span>
        </button>

        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 border border-amber-400/30 px-4 py-1 text-xs font-bold text-amber-300 uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>To'yMakoni Hamkorlik Dasturi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white tracking-tight">
            Xizmat ko'rsatuvchi bo'lish
          </h1>
          <p className="mt-2 text-sm text-gray-300 max-w-lg mx-auto">
            O'z to'y xizmatlaringizni O'zbekistonning eng yirik to'y portalida ro'yxatdan o'tkazing va minglab yangi mijozlarga ega bo'ling.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-gray-800/80 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Business / Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                F.I.SH / Korxona nomi <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Masalan: Bahor to'yxonasi yoki Sanjar Shodiyev"
                  className="w-full rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Portalda mijozlar ko'radigan rasmiy nomingiz.
              </p>
            </div>

            {/* Phone Number (Username) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Telefon raqam (Kirish uchun login) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full rounded-xl bg-white/5 border border-white/20 pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Ushbu telefon raqami orqali kabinetingizga kirasiz va mijozlar siz bilan bog'lanadi.
              </p>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Parol yarating <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kamida 4 ta belgi"
                    className="w-full rounded-xl bg-white/5 border border-white/20 pl-10 pr-10 py-3 text-sm text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Parolni tasdiqlang <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Parolni qayta kiriting"
                    className="w-full rounded-xl bg-white/5 border border-white/20 pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Xizmat toifasi <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {categoryOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = category === opt.type;
                  return (
                    <button
                      type="button"
                      key={opt.type}
                      onClick={() => setCategory(opt.type)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-gray-950 border-amber-300 font-bold shadow-md'
                          : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Region and District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Viloyat / Shahar <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <select
                    value={selectedRegion}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="w-full rounded-xl bg-gray-900 border border-white/20 pl-10 pr-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400 cursor-pointer"
                  >
                    {UZBEKISTAN_REGIONS.map((r) => (
                      <option key={r.id} value={r.name} className="bg-gray-900 text-white">
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Tuman / Shaharcha <span className="text-rose-400">*</span>
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full rounded-xl bg-gray-900 border border-white/20 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  {currentDistricts.map((d) => (
                    <option key={d} value={d} className="bg-gray-900 text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Qisqacha tavsif <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Xizmatingiz, zal sig'imi, maxsus imkoniyatlar yoki tajribangiz haqida yozing..."
                className="w-full rounded-xl bg-white/5 border border-white/20 p-4 text-sm text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-gray-950 font-bold text-sm sm:text-base tracking-wide shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 hover:scale-[1.01] transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-gray-950" />
                    <span>Yuborilmoqda...</span>
                  </>
                ) : (
                  <span>Arizani yuborish (Ro'yxatdan o'tish)</span>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-xs text-gray-400">
            <span>Allaqachon ro'yxatdan o'tganmisiz? </span>
            <button
              onClick={() => onNavigate('/vendor-login')}
              className="text-amber-300 font-bold hover:underline cursor-pointer"
            >
              Vendor kabinetiga kirish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
