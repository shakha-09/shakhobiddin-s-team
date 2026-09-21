import React, { useState } from 'react';
import { Shield, Lock, ArrowRight, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { loginAdmin } = useStore();
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(password.trim());
    if (success) {
      onNavigate('/admin/dashboard');
    } else {
      setError('Parol noto\'g\'ri. Demo parollar: admin123 yoki admin');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-gray-900 to-gray-800 text-white shadow-xl">
            <Shield className="w-7 h-7 text-rose-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Platforma Boshqaruv Paneli
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Faqat vakolatli ma'murlar uchun xavfsiz tizim
          </p>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow-xl border border-gray-100">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Admin Elektron pochtasi
              </label>
              <input
                type="email"
                disabled
                value="admin@toymakoni.uz"
                className="w-full rounded-xl border border-gray-200 bg-gray-100 py-2.5 px-3 text-xs text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Maxfiy Parol
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="Parolni kiriting..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-3 text-sm text-gray-900 focus:border-rose-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Quick credential hint */}
            <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200/80">
              <span className="font-bold">Demo admin paroli:</span>{' '}
              <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono text-amber-900">admin123</code>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-bold text-white hover:bg-black transition-all shadow-md cursor-pointer"
            >
              <span>Tizimga kirish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('/')}
              className="text-xs text-gray-500 hover:text-gray-900 underline"
            >
              Bosh sahifaga qaytish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
