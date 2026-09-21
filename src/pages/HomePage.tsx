import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Building2, 
  Car, 
  Music, 
  Mic, 
  Smile, 
  Star,
  Calculator,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UZBEKISTAN_REGIONS, getDistrictsByRegion } from '../data/locations';
import { ListingCard } from '../components/common/ListingCard';
import { CategoryType } from '../types';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { listings } = useStore();

  // Search Bar State
  const [selectedRegion, setSelectedRegion] = useState('Toshkent shahri');
  const [selectedDistrict, setSelectedDistrict] = useState('Chilonzor');
  const [weddingDate, setWeddingDate] = useState('2026-09-28');
  const [guestCount, setGuestCount] = useState<number | ''>(300);
  const [selectedCategory, setSelectedCategory] = useState<string>('wedding-hall');

  const availableDistricts = getDistrictsByRegion(selectedRegion);

  const handleRegionChange = (reg: string) => {
    setSelectedRegion(reg);
    const dists = getDistrictsByRegion(reg);
    setSelectedDistrict(dists.length > 0 ? dists[0] : '');
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedRegion) params.set('region', selectedRegion);
    if (selectedDistrict) params.set('district', selectedDistrict);
    if (weddingDate) params.set('date', weddingDate);
    if (guestCount) params.set('guests', String(guestCount));

    onNavigate(`/search?${params.toString()}`);
  };

  // Filtered showcases
  const featuredHalls = listings
    .filter(l => l.category === 'wedding-hall' && l.status === 'published')
    .slice(0, 3);

  const popularCars = listings
    .filter(l => l.category === 'car' && l.status === 'published')
    .slice(0, 3);

  const popularArtists = listings
    .filter(l => l.category === 'artist' && l.status === 'published')
    .slice(0, 2);

  const famousStars = listings
    .filter(l => l.category === 'famous-artist' && l.status === 'published')
    .slice(0, 2);

  const popularHosts = listings
    .filter(l => l.category === 'host' && l.status === 'published')
    .slice(0, 2);

  const categoryCards: { type: CategoryType; title: string; count: number; image: string; desc: string; path: string }[] = [
    {
      type: 'wedding-hall',
      title: "To'yxonalar",
      count: listings.filter(l => l.category === 'wedding-hall').length,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      desc: 'Hashamatli saroylar va tantanalar zallari',
      path: '/wedding-halls'
    },
    {
      type: 'car',
      title: 'Mashinalar korteji',
      count: listings.filter(l => l.category === 'car').length,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      desc: 'Rolls-Royce, Maybach va kortejlar',
      path: '/cars'
    },
    {
      type: 'artist',
      title: 'Xonandalar',
      count: listings.filter(l => l.category === 'artist').length,
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      desc: 'Jonli ijro va estrada yulduzlari',
      path: '/artists'
    },
    {
      type: 'famous-artist',
      title: 'Mashhur Yulduzlar',
      count: listings.filter(l => l.category === 'famous-artist').length,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      desc: 'O\'zbekistonning eng taniqli yulduzlari (VIP)',
      path: '/famous-artists'
    },
    {
      type: 'host',
      title: 'Boshlovchilar',
      count: listings.filter(l => l.category === 'host').length,
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
      desc: 'Professional davra raislari va boshlovchilar',
      path: '/hosts'
    },
    {
      type: 'entertainer',
      title: 'Qiziqchilar va Shou',
      count: listings.filter(l => l.category === 'entertainer').length,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      desc: 'Kulgi, parodiya va sahnaviy shoular',
      path: '/entertainers'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-gray-900">
      {/* 1. FULL-SCREEN BACKGROUND IMAGE HERO SECTION - Clean with unobstructed photo */}
      <section 
        className="relative overflow-hidden min-h-[75vh] sm:min-h-[80vh] flex flex-col justify-center items-center py-20 sm:py-28 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('/images/romantic_wedding_hero.jpg')`,
          backgroundPosition: 'center 40%'
        }}
      >
        {/* Subtle cinematic gradient overlay allowing the photo to shine through */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/75 pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          {/* Centered Hero Content - Strictly ONLY the requested headline */}
          <h1 className="font-['Times_New_Roman',Times,serif] italic font-normal text-[36px] sm:text-[50px] lg:text-[58px] leading-[44px] sm:leading-[62px] text-white tracking-tight drop-shadow-2xl max-w-4xl mx-auto">
            To'yingiz uchun barcha xizmatlar — <span className="text-[#F3E5AB]">bitta joyda</span>
          </h1>

          {/* Single clear intuitive action button as requested */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('qidiruv-bolimi');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  onNavigate('/wedding-halls');
                }
              }}
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-gray-950 font-bold px-8 py-3.5 text-base sm:text-lg shadow-[0_8px_30px_rgba(212,175,55,0.45)] hover:shadow-[0_12px_36px_rgba(212,175,55,0.65)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-gray-950" />
              <span>Bron qilish</span>
              <ArrowRight className="w-4 h-4 text-gray-950" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER INTERFACE - Cleanly placed right below the hero photo */}
      <section id="qidiruv-bolimi" className="relative z-20 -mt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-white p-5 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-200">
          <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 tracking-normal">
                Nimani qidiryapsiz?
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 py-2.5 px-3 text-sm text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-hidden transition-all"
              >
                <option value="all">Barcha xizmatlar</option>
                <option value="wedding-hall">To'yxonalar (Zallar)</option>
                <option value="car">Mashinalar korteji</option>
                <option value="artist">Xonandalar</option>
                <option value="famous-artist">Mashhur Yulduzlar (VIP)</option>
                <option value="host">Boshlovchilar</option>
                <option value="entertainer">Qiziqchilar va Shou</option>
              </select>
            </div>

            {/* Region & District */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 tracking-normal">
                Qayerda? (Hudud)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 py-2.5 px-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-hidden transition-all"
                >
                  {UZBEKISTAN_REGIONS.map((r) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 py-2.5 px-2 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-hidden transition-all"
                >
                  <option value="">Barcha tumanlar</option>
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Wedding Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 tracking-normal">
                To'y sanasi
              </label>
              <input
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 py-2.5 px-3 text-sm text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-hidden transition-all"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 tracking-normal">
                Mehmonlar soni
              </label>
              <input
                type="number"
                step={50}
                min={50}
                max={1500}
                placeholder="300 kishi"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 py-2.5 px-3 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-900 focus:outline-hidden transition-all"
              />
            </div>

            {/* Submit */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gray-950 text-white font-semibold py-3 px-4 text-sm hover:bg-gray-800 transition-all cursor-pointer shadow-md"
              >
                <Search className="w-4 h-4" />
                <span>Qidirish</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. WEDDING-SERVICE CATEGORIES GRID - Clean Photo Cards without icons/stickers */}
      <section className="py-14 sm:py-16 bg-white border-b border-gray-200 mt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Yo'nalishlar</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-normal mt-1">
                To'y xizmatlari toifalari
              </h2>
            </div>
            <p className="text-sm text-gray-600 mt-2 sm:mt-0 tracking-normal">
              O'zingizga kerakli bo'limni tanlang va xizmatlarni qulay ko'ring
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryCards.map((cat) => (
              <div
                key={cat.type}
                onClick={() => onNavigate(cat.path)}
                className="group relative h-56 sm:h-64 rounded-2xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Real Category Background Image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                {/* Content over image */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-xl font-bold text-white tracking-normal group-hover:text-amber-200 transition-colors">
                      {cat.title}
                    </h3>
                    <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-0.5 text-xs font-medium text-white border border-white/30">
                      {cat.count} ta taklif
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-1 tracking-normal font-light">
                    {cat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED WEDDING HALLS */}
      <section className="py-14 bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
                <Building2 className="w-4 h-4" />
                <span>Eng mashhur zallar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-normal mt-1">
                Tavsiya etilgan To'yxonalar
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/wedding-halls')}
              className="flex items-center gap-1 text-sm font-semibold text-gray-900 hover:text-amber-700 transition-colors cursor-pointer tracking-normal"
            >
              <span>Barchasini ko'rish</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHalls.map((hall) => (
              <ListingCard
                key={hall.id}
                listing={hall}
                onNavigate={onNavigate}
                selectedDate={weddingDate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. POPULAR CARS - MASHINALAR KORTEJI */}
      <section className="py-14 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
                <Car className="w-4 h-4" />
                <span>To'y kortejlari</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-normal mt-1">
                Mashinalar Korteji
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/cars')}
              className="flex items-center gap-1 text-sm font-semibold text-gray-900 hover:text-amber-700 transition-colors cursor-pointer tracking-normal"
            >
              <span>Barchasini ko'rish</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCars.map((car) => (
              <ListingCard
                key={car.id}
                listing={car}
                onNavigate={onNavigate}
                selectedDate={weddingDate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAMOUS ARTISTS (SECTION 12: VISUALLY SPECIAL PREMIUM VIP) */}
      <section className="py-16 bg-gray-950 text-white relative overflow-hidden border-y border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-amber-300 border border-white/15 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Eksklyuziv VIP Takliflar
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-normal mt-2">
                Mashhur Estrada Yulduzlari
              </h2>
              <p className="text-sm text-gray-400 mt-1 max-w-xl font-normal tracking-normal">
                O'zbek xalqining eng suyukli estrada yulduzlari. To'y tantanalari uchun maxsus shou dasturlar.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/famous-artists')}
              className="mt-4 sm:mt-0 flex items-center gap-2 rounded-full bg-white text-gray-950 font-bold px-6 py-2.5 text-xs sm:text-sm transition-all hover:bg-amber-300 cursor-pointer"
            >
              <span>Barcha Yulduzlarni ko'rish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {famousStars.map((star) => (
              <ListingCard
                key={star.id}
                listing={star}
                onNavigate={onNavigate}
                selectedDate={weddingDate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. ARTISTS & HOSTS COMBINED SHOWCASE */}
      <section className="py-14 bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Artists Col */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Jonli ovoz</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-normal mt-0.5">Xonandalar</h3>
                </div>
                <button
                  onClick={() => onNavigate('/artists')}
                  className="text-xs font-bold text-gray-900 hover:text-amber-700 hover:underline cursor-pointer tracking-normal"
                >
                  Ko'proq xonandalar →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {popularArtists.map((artist) => (
                  <ListingCard
                    key={artist.id}
                    listing={artist}
                    onNavigate={onNavigate}
                    selectedDate={weddingDate}
                  />
                ))}
              </div>
            </div>

            {/* Hosts Col */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Davra raisi</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-normal mt-0.5">To'y Boshlovchilari</h3>
                </div>
                <button
                  onClick={() => onNavigate('/hosts')}
                  className="text-xs font-bold text-gray-900 hover:text-amber-700 hover:underline cursor-pointer tracking-normal"
                >
                  Ko'proq boshlovchilar →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {popularHosts.map((host) => (
                  <ListingCard
                    key={host.id}
                    listing={host}
                    onNavigate={onNavigate}
                    selectedDate={weddingDate}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. WEDDING BUDGET CALCULATOR TEASER BANNER */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gray-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-gray-800">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-xs text-amber-300 border border-white/10">
                <Calculator className="w-3.5 h-3.5 text-amber-300" />
                <span>To'y Budjeti Kalkulyatori</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                To'yingiz qanchaga tushishini oldindan hisoblang
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal tracking-normal">
                To'yxona, avtomobil, san'atkor, boshlovchi va boshqa barcha xizmatlarni tanlang va to'liq taxminiy budjetni bir daqiqada oling.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/budget-calculator')}
                  className="flex items-center gap-2 rounded-full bg-white text-gray-950 font-bold px-7 py-3 text-sm shadow-md hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-gray-950" />
                  <span>Budjetni hisoblash</span>
                  <ArrowRight className="w-4 h-4 text-gray-950" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. HOW PLATFORM WORKS */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Qulaylik</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-normal mt-1">
              Platforma qanday ishlaydi?
            </h2>
            <p className="text-sm text-gray-600 mt-2 tracking-normal">
              To'y tashkillashtirish jarayoni 3 ta oddiy qadamda:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-white p-6 border border-gray-200 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white font-bold text-lg mb-4 shadow-xs">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-950 tracking-normal mb-2">Qidiring va solishtiring</h3>
              <p className="text-sm text-gray-600 leading-relaxed tracking-normal">
                Shahringiz va tumaningizdagi to'yxona va xizmatlarni sig'imi, narxi va fotolari bilan qulay taqqoslang.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-gray-200 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white font-bold text-lg mb-4 shadow-xs">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-950 tracking-normal mb-2">Bo'sh sanani tanlang</h3>
              <p className="text-sm text-gray-600 leading-relaxed tracking-normal">
                Real vaqt rejimida kalendardan bo'sh kunlarni ko'ring. Boshqa to'ylar bilan to'qnash kelishining oldini oling.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-gray-200 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white font-bold text-lg mb-4 shadow-xs">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-950 tracking-normal mb-2">Bir tugma bilan bron qiling</h3>
              <p className="text-sm text-gray-600 leading-relaxed tracking-normal">
                So'rov qoldiring yoki to'g'ridan-to'g'ri telefon va Telegram orqali bog'lanib, xizmatlarni rasmiylashtiring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CALL TO ACTION SECTION */}
      <section className="py-16 bg-white text-center border-t border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-950 tracking-normal">
            To'yingizni rejalashtirishni hoziroq boshlang
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto tracking-normal">
            "Mening to'yim" bo'limida shaxsiy to'y rejangizni tuzing, xizmatlarni saqlang va do'stlaringiz bilan bo'lishing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/wedding-halls')}
              className="rounded-full bg-gray-950 text-white font-semibold px-8 py-3 text-sm shadow-md hover:bg-gray-800 transition-all cursor-pointer tracking-normal"
            >
              To'yxonalarni ko'rish
            </button>
            <button
              onClick={() => onNavigate('/my-wedding')}
              className="rounded-full border border-gray-300 bg-white text-gray-900 font-semibold px-8 py-3 text-sm hover:bg-gray-50 transition-colors cursor-pointer tracking-normal"
            >
              Mening to'y rejam
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
