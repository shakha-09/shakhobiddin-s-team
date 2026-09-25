import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowUpDown, 
  RotateCcw, 
  Sparkles,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UZBEKISTAN_REGIONS, getDistrictsByRegion } from '../data/locations';
import { ListingCard } from '../components/common/ListingCard';
import { CategoryType } from '../types';

interface SearchPageProps {
  onNavigate: (path: string) => void;
}

const ITEMS_PER_PAGE = 12;

export const SearchPage: React.FC<SearchPageProps> = ({ onNavigate }) => {
  const { filterListings, listings } = useStore();

  // Read initial query params from URL hash / location
  const parseParams = () => {
    const hash = window.location.hash;
    const queryIdx = hash.indexOf('?');
    if (queryIdx !== -1) {
      return new URLSearchParams(hash.substring(queryIdx));
    }
    return new URLSearchParams(window.location.search);
  };

  const initialParams = parseParams();

  const [query, setQuery] = useState(initialParams.get('q') || '');
  const [category, setCategory] = useState<CategoryType | 'all'>((initialParams.get('category') as any) || 'all');
  const [region, setRegion] = useState(initialParams.get('region') || '');
  const [district, setDistrict] = useState(initialParams.get('district') || '');
  const [date, setDate] = useState(initialParams.get('date') || '');
  const [minGuests, setMinGuests] = useState<number | ''>(
    initialParams.get('guests') ? Number(initialParams.get('guests')) : ''
  );
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minRating, setMinRating] = useState<number | ''>('');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'nearest' | 'price_asc' | 'price_desc' | 'rating' | 'popular'>('recommended');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if hash/params change
  useEffect(() => {
    const handleHashChange = () => {
      const p = parseParams();
      if (p.get('q') !== null) setQuery(p.get('q') || '');
      if (p.get('category')) setCategory(p.get('category') as any);
      if (p.get('region') !== null) setRegion(p.get('region') || '');
      if (p.get('district') !== null) setDistrict(p.get('district') || '');
      if (p.get('date') !== null) setDate(p.get('date') || '');
      if (p.get('guests')) setMinGuests(Number(p.get('guests')));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Reset page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, category, region, district, date, minGuests, maxPrice, minRating, onlyAvailable, sortBy]);

  const availableDistricts = region ? getDistrictsByRegion(region) : [];

  const handleRegionChange = (newReg: string) => {
    setRegion(newReg);
    setDistrict('');
  };

  const handleResetFilters = () => {
    setQuery('');
    setCategory('all');
    setRegion('');
    setDistrict('');
    setDate('');
    setMinGuests('');
    setMaxPrice('');
    setMinRating('');
    setOnlyAvailable(false);
    setSortBy('recommended');
  };

  const results = useMemo(() => {
    return filterListings({
      query,
      category,
      region: region || undefined,
      district: district || undefined,
      date,
      minCapacity: minGuests ? Number(minGuests) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      onlyAvailable,
      sortBy
    });
  }, [query, category, region, district, date, minGuests, maxPrice, minRating, onlyAvailable, sortBy, listings]);

  const totalPages = Math.max(1, Math.ceil(results.length / ITEMS_PER_PAGE));
  const displayedResults = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return results.slice(start, start + ITEMS_PER_PAGE);
  }, [results, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header & Search Input */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                To'y xizmatlari qidiruvi
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                O'zbekiston bo'yicha to'yxonalar, mashinalar va san'atkorlarni solishtiring
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap hidden sm:inline">
                Saralash:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-gray-300 bg-white py-2 px-3 text-xs sm:text-sm text-gray-800 font-medium focus:border-rose-500 focus:outline-hidden"
              >
                <option value="recommended">Tavsiya etilgan</option>
                <option value="nearest">Yaqinroq joylashgan (Hudud)</option>
                <option value="price_asc">Narxi: Arzondan qimmatga</option>
                <option value="price_desc">Narxi: Qimmatdan arzonga</option>
                <option value="rating">Reytingi baland</option>
                <option value="popular">Eng ko'p ko'rilgan</option>
              </select>

              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 rounded-xl bg-white border border-gray-300 py-2 px-3 text-xs font-bold text-gray-800"
              >
                <SlidersHorizontal className="w-4 h-4 text-rose-600" />
                <span>Filtr</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="To'yxona nomi, san'atkor, tuman yoki avtomobil markasini yozing..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-xs focus:border-rose-500 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-3 text-xs text-gray-400 hover:text-gray-600"
              >
                Tozalash
              </button>
            )}
          </div>
        </div>

        {/* Main Grid: Filters Sidebar + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* DESKTOP FILTER SIDEBAR */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                <Filter className="w-4 h-4 text-rose-600" />
                <span>Filtrlar</span>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Tozalash</span>
              </button>
            </div>

            {/* 1. Category */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Xizmat toifasi
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2 px-2.5 text-xs text-gray-800 focus:bg-white focus:border-rose-500 focus:outline-hidden"
              >
                <option value="all">Barcha toifalar</option>
                <option value="wedding-hall">To'yxonalar</option>
                <option value="car">ZAGS Mashinalari</option>
                <option value="artist">Xonandalar</option>
                <option value="famous-artist">Mashhur Yulduzlar (VIP)</option>
                <option value="videographer">Videochilar & Media</option>
                <option value="host">Boshlovchilar</option>
                <option value="entertainer">Qiziqchilar va Shou</option>
              </select>
            </div>

            {/* 2. Region */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Viloyat / Shahar
              </label>
              <select
                value={region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2 px-2.5 text-xs text-gray-800 focus:bg-white focus:border-rose-500 focus:outline-hidden"
              >
                <option value="">Barcha viloyatlar (Butun O'zbekiston)</option>
                {UZBEKISTAN_REGIONS.map((r) => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* 3. District */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Tuman
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2 px-2.5 text-xs text-gray-800 focus:bg-white focus:border-rose-500 focus:outline-hidden"
              >
                <option value="">Barcha tumanlar</option>
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {district && (
                <p className="text-[11px] text-emerald-600 mt-1">
                  ✓ {district} bo'yicha saralash faollashtirildi
                </p>
              )}
            </div>

            {/* 4. Wedding Date */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                To'y sanasi (Bandlikni tekshirish)
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2 px-2.5 text-xs text-gray-800 focus:bg-white focus:border-rose-500 focus:outline-hidden"
              />

              {date && (
                <label className="flex items-center gap-2 mt-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Faqat bo'sh bo'lganlarini ko'rsatish</span>
                </label>
              )}
            </div>

            {/* 5. Guests Count (for halls) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Minimal mehmonlar sig'imi
              </label>
              <input
                type="number"
                min={50}
                max={1500}
                step={50}
                placeholder="Masalan: 300"
                value={minGuests}
                onChange={(e) => setMinGuests(e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2 px-2.5 text-xs text-gray-800 focus:bg-white focus:border-rose-500 focus:outline-hidden"
              />
            </div>

            {/* 6. Max Price */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Maksimal narx (so'm)
              </label>
              <input
                type="number"
                step={1000000}
                placeholder="Cheklovsiz"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2 px-2.5 text-xs text-gray-800 focus:bg-white focus:border-rose-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* RESULTS COLUMN */}
          <div className="lg:col-span-3 space-y-4">
            {/* Results count & active tags */}
            <div className="flex flex-wrap items-center justify-between text-xs text-gray-500">
              <span className="font-semibold text-gray-900">
                Topilgan xizmatlar: <strong className="text-rose-600">{results.length} ta</strong>
              </span>

              {district && (
                <span className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-lg font-medium border border-rose-200">
                  Hudud: {district}, {region}
                </span>
              )}
            </div>

            {/* Listing Cards Grid */}
            {results.length > 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {displayedResults.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onNavigate={onNavigate}
                      selectedDate={date || undefined}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Oldingi</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${
                              currentPage === pageNum
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-1 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
                    >
                      <span>Keyingi</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State (Rule 31) */
              <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-xs">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Ushbu parametrlar bo'yicha xizmatlar topilmadi</h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                  Tanlangan sana, tuman yoki narx filtrlari bo'yicha hozircha natija yo'q. Qidiruv parametrlarini o'zgartirib ko'ring.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="rounded-xl bg-rose-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-rose-700 transition-colors"
                  >
                    Barcha filtrlarni bekor qilish
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDistrict('');
                      setDate('');
                    }}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Boshqa tumanlarni ko'rish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs">
          <div className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                <Filter className="w-5 h-5 text-rose-600" />
                <span>Filtrlar</span>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile filter controls */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Toifa</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-gray-300 p-2 text-xs"
              >
                <option value="all">Barcha toifalar</option>
                <option value="wedding-hall">To'yxonalar</option>
                <option value="car">ZAGS Mashinalari</option>
                <option value="artist">Xonandalar</option>
                <option value="famous-artist">Mashhur Yulduzlar</option>
                <option value="videographer">Videochilar & Media</option>
                <option value="host">Boshlovchilar</option>
                <option value="entertainer">Qiziqchilar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Viloyat</label>
              <select
                value={region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-2 text-xs"
              >
                <option value="">Barcha viloyatlar (Butun O'zbekiston)</option>
                {UZBEKISTAN_REGIONS.map((r) => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tuman</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-2 text-xs"
              >
                <option value="">Barcha tumanlar</option>
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Sana</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-2 text-xs"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-1/2 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
              >
                Tozalash
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 text-xs font-bold text-white shadow-md"
              >
                Natijalarni ko'rish ({results.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
