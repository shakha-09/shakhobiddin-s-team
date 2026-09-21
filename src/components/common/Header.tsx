import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Search, 
  Menu, 
  X, 
  Shield, 
  Calculator, 
  Sparkles,
  Building2,
  Car,
  Music,
  Mic,
  Smile
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { favorites, isAdminLoggedIn } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "To'yxonalar", path: '/wedding-halls', icon: Building2 },
    { name: 'Kortej', path: '/cars', icon: Car },
    { name: 'Xonandalar', path: '/artists', icon: Music },
    { name: 'Yulduzlar', path: '/famous-artists', icon: Sparkles, badge: 'VIP' },
    { name: 'Boshlovchilar', path: '/hosts', icon: Mic },
    { name: 'Qiziqchilar', path: '/entertainers', icon: Smile },
    { name: 'Budjet hisoblagich', path: '/budget-calculator', icon: Calculator },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/15 bg-black/45 backdrop-blur-md text-white shadow-lg transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          onClick={() => handleLinkClick('/')}
          className="flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#E5C158] to-[#C5A059] text-gray-950 shadow-md shadow-amber-500/20 transition-transform group-hover:scale-105">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif-luxury font-bold text-2xl tracking-tight text-white group-hover:text-amber-200 transition-colors">
              To'y<span className="text-[#F3E5AB] italic font-normal">Makoni</span>
            </span>
            <span className="block font-serif-luxury text-[9.5px] uppercase tracking-widest font-semibold text-white/70 -mt-1">
              TUYXONA PORTAL • UZBEKISTAN
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || currentPath.startsWith(link.path + '/');
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-serif-luxury text-sm font-semibold tracking-wide transition-all relative cursor-pointer ${
                  isActive
                    ? 'bg-white/25 text-white border border-white/35 backdrop-blur-sm shadow-xs'
                    : 'text-white/85 hover:bg-white/15 hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] px-2 py-0.2 text-[9px] font-bold text-gray-950 uppercase shadow-xs">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button */}
          <button
            onClick={() => handleLinkClick('/search')}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all cursor-pointer ${
              currentPath === '/search'
                ? 'border-amber-300/60 bg-white/25 text-amber-200 shadow-xs'
                : 'border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/40'
            }`}
            title="Qidiruv"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Favorites Button */}
          <button
            onClick={() => handleLinkClick('/favorites')}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/40 transition-all cursor-pointer"
            title="Saralanganlar"
          >
            <Heart className="w-4 h-4" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[10px] font-bold text-gray-950 shadow-xs">
                {favorites.length}
              </span>
            )}
          </button>

          {/* My Wedding Plan Button */}
          <button
            onClick={() => handleLinkClick('/my-wedding')}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-serif-luxury font-bold tracking-wide transition-all cursor-pointer ${
              currentPath === '/my-wedding'
                ? 'border-amber-300/50 bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-gray-950 shadow-md shadow-amber-500/20'
                : 'border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/40'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-200" />
            <span>Mening to'yim</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-200" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/15 bg-black/90 backdrop-blur-xl px-4 pt-3 pb-5 space-y-1 shadow-2xl text-white">
          <div className="grid grid-cols-2 gap-2 pb-3 mb-2 border-b border-white/15">
            <button
              onClick={() => handleLinkClick('/my-wedding')}
              className="flex items-center justify-center gap-2 p-2.5 rounded-full bg-white/15 text-amber-200 border border-white/20 text-xs font-serif-luxury font-bold"
            >
              <Calendar className="w-4 h-4" />
              <span>Mening to'yim</span>
            </button>
            <button
              onClick={() => handleLinkClick('/favorites')}
              className="flex items-center justify-center gap-2 p-2.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-serif-luxury font-bold"
            >
              <Heart className="w-4 h-4 text-rose-300" />
              <span>Saralanganlar ({favorites.length})</span>
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 rounded-full font-serif-luxury text-sm font-semibold tracking-wide transition-colors ${
                    isActive ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-gray-950 font-bold' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] px-2 py-0.5 text-[10px] font-bold text-gray-950">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
