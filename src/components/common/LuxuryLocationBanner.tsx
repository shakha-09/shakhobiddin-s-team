import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Copy, 
  Check, 
  Compass, 
  Car, 
  Building2, 
  Sparkles,
  ShieldCheck,
  Share2
} from 'lucide-react';

interface LuxuryLocationBannerProps {
  title: string;
  address?: string;
  region?: string;
  district?: string;
  coordinates?: { lat: number; lng: number };
  coverImage?: string;
}

export const LuxuryLocationBanner: React.FC<LuxuryLocationBannerProps> = ({
  title,
  address,
  region = 'Toshkent shahri',
  district = 'Chilonzor tumani',
  coordinates = { lat: 41.2750, lng: 69.2080 },
  coverImage
}) => {
  const [copied, setCopied] = useState(false);

  const formattedAddress = address || `${district}, ${region}, Bunyodkor shox ko'chasi`;
  const lat = coordinates.lat || 41.2750;
  const lng = coordinates.lng || 69.2080;

  // Direct official map navigation URLs
  const yandexUrl = `https://yandex.com/maps/?rtext=~${lat},${lng}`;
  const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-[#0c1427] via-[#101b33] to-[#070c18] text-white shadow-xl">
      {/* Decorative luxury background glow & radial light leaks */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />

      <div className="relative p-6 sm:p-8 lg:p-10">
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/15 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-transparent p-0.5 shadow-md shadow-amber-500/10">
              <img 
                src="/images/wedding_rings_logo.jpg" 
                alt="To'y Makoni" 
                className="h-full w-full rounded-2xl object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <Sparkles className="absolute w-5 h-5 text-amber-300 pointer-events-none opacity-80" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-widest text-amber-300 uppercase">
                  Rasmiy Manzil & Joylashuv
                </span>
                <span className="inline-block h-1 w-1 rounded-full bg-amber-400" />
                <span className="text-[11px] font-medium text-slate-300">
                  {region}
                </span>
              </div>
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold text-amber-200">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{district}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Address Details & Coordinates */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                To'liq va Aniq Manzil
              </span>
              <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                {formattedAddress}
              </p>
            </div>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-xs">
                <Car className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block leading-tight">Avtoturargoh</span>
                  <span className="text-xs font-semibold text-white">Katta sig'imli</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-xs">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block leading-tight">Mo'ljal</span>
                  <span className="text-xs font-semibold text-white">Asosiy shoh ko'cha</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block leading-tight">Kirish yo'li</span>
                  <span className="text-xs font-semibold text-white">Kortej uchun qulay</span>
                </div>
              </div>
            </div>

            {/* Coordinates Box with 1-click Copy */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/20 bg-black/30 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    GPS Koordinatalar (Chilonzor / Toshkent)
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-amber-200">
                    {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyCoords}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/20 hover:text-white transition-all cursor-pointer active:scale-95"
                title="Koordinatalardan nusxa olish"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">Nusxa olindi!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                    <span>Nusxa olish</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Decorative Vector Visual & Action Buttons */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Elegant Vector Venue Card with stylized Pin & Radar */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-400/25 bg-gradient-to-b from-[#132247] to-[#0d162d] p-5 text-center shadow-inner">
              {/* Decorative Concentric Radar Waves */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-amber-400/15 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-amber-400/20 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-amber-400/10 blur-xs pointer-events-none" />

              {/* Pulsing Pin Center */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-red-600 to-amber-500 text-white shadow-lg shadow-red-500/30">
                  <MapPin className="w-7 h-7 drop-shadow-md" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border border-white"></span>
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-xs font-bold text-white block">
                    {district}, {region}
                  </span>
                  <span className="text-[11px] text-amber-200/90 font-medium mt-0.5 block">
                    Avtomobil va piyoda navigatsiyasi tayyor
                  </span>
                </div>
              </div>
            </div>

            {/* The Two Sleek Action Buttons (Requested explicitly) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Yandex Maps Button */}
              <a
                href={yandexUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 p-3.5 text-xs font-bold text-white shadow-lg shadow-red-600/30 hover:shadow-red-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-red-600 font-black text-xs shadow-xs">
                  Я
                </span>
                <span>Yandex Maps'da ochish</span>
                <ExternalLink className="w-3.5 h-3.5 text-red-200 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* 2. Google Maps Button */}
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 p-3.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-blue-600 font-bold text-xs shadow-xs">
                  <Navigation className="w-3 h-3 fill-current" />
                </div>
                <span>Google Maps'da ochish</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            <p className="text-center text-[11px] text-slate-400">
              * Tugmani bosish orqali xaritani ochib, navigator orqali to'g'ridan-to'g'ri yetib borishingiz mumkin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
