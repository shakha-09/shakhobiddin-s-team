import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Car, 
  Music, 
  Sparkles, 
  Mic, 
  Smile, 
  Inbox, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  ShieldAlert,
  UserCheck,
  Video
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPath,
  onNavigate,
  children
}) => {
  const { logoutAdmin, bookings, reviews, vendors } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingBookingsCount = bookings.filter(b => b.status === 'new').length;
  const pendingVendorsCount = vendors.filter(v => v.status === 'kutilmoqda').length;

  const menuItems = [
    { label: 'Boshqaruv Paneli', path: '/admin/dashboard', icon: LayoutDashboard },
    { 
      label: 'Yangi Vendorlar', 
      path: '/admin/vendors', 
      icon: UserCheck,
      badge: pendingVendorsCount > 0 ? pendingVendorsCount : undefined 
    },
    { label: 'To\'yxonalar', path: '/admin/wedding-halls', icon: Building2 },
    { label: 'ZAGS Mashinalari', path: '/admin/cars', icon: Car },
    { label: 'Xonandalar', path: '/admin/artists', icon: Music },
    { label: 'Mashhur Yulduzlar', path: '/admin/famous-artists', icon: Sparkles },
    { label: 'Boshlovchilar', path: '/admin/hosts', icon: Mic },
    { label: 'Qiziqchilar', path: '/admin/entertainers', icon: Smile },
    { label: 'Videochilar', path: '/admin/videographers', icon: Video },
    { 
      label: 'So\'rovlar & Bronlar', 
      path: '/admin/bookings', 
      icon: Inbox,
      badge: pendingBookingsCount > 0 ? pendingBookingsCount : undefined 
    },
    { label: 'Bandlik Taqvimi', path: '/admin/availability', icon: Calendar },
    { label: 'Mijozlar Fikrlari', path: '/admin/reviews', icon: MessageSquare },
    { label: 'Sozlamalar & Baza', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logoutAdmin();
    onNavigate('/admin');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 text-gray-300 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white font-black text-sm">
              TM
            </div>
            <span className="font-extrabold text-white text-base tracking-tight">
              To'yMakoni <span className="text-xs text-rose-400 font-normal">Admin</span>
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-rose-600 text-white font-bold'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom logout and public link */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900/90 space-y-2">
          <button
            onClick={() => onNavigate('/')}
            className="flex w-full items-center gap-2 rounded-xl bg-gray-800 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Saytni ko'rish (Bosh sahifa)</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Tizimdan chiqish</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs text-gray-500 hidden sm:block">
              To'y Makoni O'zbekiston • Boshqaruv Tizimi v1.0
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tizim faol (Administrator)</span>
            </div>

            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline">Saytga o'tish</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
