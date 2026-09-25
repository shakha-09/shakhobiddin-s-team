import React, { useState } from 'react';
import { 
  Phone, 
  Lock, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Building2, 
  Clock, 
  XCircle, 
  Shield,
  Mail,
  UserCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { VendorStatus } from '../../types';

interface VendorLoginPageProps {
  onNavigate: (path: string) => void;
  initialTab?: 'vendor' | 'admin';
}

export const VendorLoginPage: React.FC<VendorLoginPageProps> = ({ onNavigate, initialTab = 'vendor' }) => {
  const { loginVendor, loginAdmin } = useStore();

  // Tab State: 'vendor' vs 'admin'
  const [activeTab, setActiveTab] = useState<'vendor' | 'admin'>(initialTab);

  // Vendor Login Form State
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorStatus, setErrorStatus] = useState<VendorStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | undefined>(undefined);

  // Admin Login Form State
  const [adminEmail, setAdminEmail] = useState('admin@toymakoni.uz');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorStatus(null);
    setRejectionReason(undefined);

    if (!phone.trim()) {
      setErrorMessage("Iltimos, telefon raqamingizni kiriting.");
      return;
    }

    if (!password) {
      setErrorMessage("Iltimos, parolingizni kiriting.");
      return;
    }

    const res = loginVendor(phone, password);

    if (!res.success) {
      if (res.status === 'kutilmoqda') {
        setErrorStatus('kutilmoqda');
        setErrorMessage("Hisobingiz hali tasdiqlanmagan. Iltimos kuting.");
      } else if (res.status === 'rad etilgan') {
        setErrorStatus('rad etilgan');
        setRejectionReason(res.rejectionReason);
        setErrorMessage(
          res.rejectionReason
            ? `Arizangiz ma'muriyat tomonidan rad etilgan. Sabab: ${res.rejectionReason}`
            : "Arizangiz ma'muriyat tomonidan rad etilgan."
        );
      } else {
        setErrorMessage(res.error || "Telefon raqam yoki parol noto'g'ri.");
      }
      return;
    }

    // Successfully logged in! Navigate to Vendor Dashboard (/kabinet)
    onNavigate('/kabinet');
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    if (!adminPassword) {
      setAdminError("Iltimos, admin parolini kiriting.");
      return;
    }

    const success = loginAdmin(adminPassword, adminEmail);
    if (success) {
      onNavigate('/admin/dashboard');
    } else {
      setAdminError("Elektron pochta yoki parol noto'g'ri. Iltimos, tekshirib qaytadan urinib ko'ring.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-gray-900 to-slate-950 text-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-amber-200 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bosh sahifaga qaytish</span>
        </button>

        {/* Card Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] text-gray-950 shadow-lg mb-4">
            {activeTab === 'vendor' ? (
              <Building2 className="w-7 h-7" />
            ) : (
              <Shield className="w-7 h-7 text-gray-950" />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white tracking-tight">
            {activeTab === 'vendor' ? "Vendor Kabinetiga Kirish" : "Admin Boshqaruv Tizimi"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-400">
            {activeTab === 'vendor' 
              ? "Xizmatlaringiz, narxlar va kalendaringizni boshqarish uchun kiring"
              : "Platformani to'liq boshqarish va yangi vendorlarni tasdiqlash"}
          </p>
        </div>

        {/* Tab Switcher: Vendor vs Admin */}
        <div className="flex rounded-2xl bg-white/10 p-1 mb-6 border border-white/15 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              setActiveTab('vendor');
              setErrorMessage(null);
              setAdminError(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vendor'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-gray-950 shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Vendor sifatida kirish</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setErrorMessage(null);
              setAdminError(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-gray-950 shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin sifatida kirish</span>
          </button>
        </div>

        {/* Login Box */}
        <div className="bg-gray-800/85 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {activeTab === 'vendor' ? (
            /* =================== VENDOR LOGIN FORM =================== */
            <>
              {/* Specific Status Alerts */}
              {errorStatus === 'kutilmoqda' && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
                  <Clock className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-300 mb-0.5">Tasdiqlash jarayonida</p>
                    <p>Hisobingiz hali tasdiqlanmagan. Iltimos kuting.</p>
                    <p className="text-[11px] text-amber-300/80 mt-1">Admin ko'rib chiqqach avtomatik faollashadi.</p>
                  </div>
                </div>
              )}

              {errorStatus === 'rad etilgan' && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-400/40 text-rose-200 text-xs sm:text-sm flex items-start gap-3">
                  <XCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <p className="font-bold text-rose-300 mb-0.5">Arizangiz rad etilgan</p>
                    {rejectionReason ? (
                      <p className="text-rose-100">
                        <span className="font-semibold">Sabab:</span> {rejectionReason}
                      </p>
                    ) : (
                      <p>Arizangiz ma'muriyat tomonidan rad etilgan.</p>
                    )}
                    <p className="text-[11px] text-rose-300/80 mt-1">Qayta ariza topshirish uchun admin bilan bog'laning.</p>
                  </div>
                </div>
              )}

              {errorMessage && !errorStatus && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-400/40 text-rose-200 text-xs sm:text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleVendorSubmit} className="space-y-4">
                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Telefon raqam (Login)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full rounded-xl bg-white/5 border border-white/20 pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Parol
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
                      placeholder="Parolingizni kiriting"
                      className="w-full rounded-xl bg-white/5 border border-white/20 pl-10 pr-10 py-3 text-sm text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-gray-950 font-bold text-sm tracking-wide shadow-lg hover:shadow-amber-500/25 hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    Kabinetga kirish
                  </button>
                </div>
              </form>

              {/* Registration link */}
              <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-gray-400">
                <span>Hali hisobingiz yo'qmi? </span>
                <button
                  onClick={() => onNavigate('/vendor-register')}
                  className="text-amber-300 font-bold hover:underline cursor-pointer ml-1"
                >
                  Xizmat ko'rsatuvchi bo'ling
                </button>
              </div>
            </>
          ) : (
            /* =================== ADMIN LOGIN FORM =================== */
            <>
              {adminError && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-400/40 text-rose-200 text-xs sm:text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                {/* Admin Email / Username */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Admin Elektron Pochtasi / Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@toymakoni.uz"
                      className="w-full rounded-xl bg-white/5 border border-white/20 pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* Admin Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Admin Maxfiy Paroli
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Maxfiy parolni kiriting"
                      className="w-full rounded-xl bg-white/5 border border-white/20 pl-10 pr-10 py-3 text-sm text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white cursor-pointer"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-900/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Paneliga Kirish</span>
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-gray-400">
                <span>To'y Makoni Markaziy Administrator Tizimi</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
