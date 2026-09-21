import React, { useState } from 'react';
import { 
  Building2, 
  Car, 
  Music, 
  Mic, 
  Sparkles, 
  Smile, 
  Filter, 
  MapPin, 
  Users, 
  Calendar, 
  ArrowUpDown,
  CheckCircle2,
  Phone,
  LayoutGrid,
  Map as MapIcon
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ListingCard } from '../components/common/ListingCard';
import { CategoryType } from '../types';
import { getCategoryMeta } from '../utils/formatters';
import { UZBEKISTAN_REGIONS, getDistrictsByRegion, getCoordinatesForLocation } from '../data/locations';
import { LeafletMap } from '../components/common/LeafletMap';

interface CategoryListingPageProps {
  category: CategoryType;
  onNavigate: (path: string) => void;
}

export const CategoryListingPage: React.FC<CategoryListingPageProps> = ({ 
  category, 
  onNavigate 
}) => {
  const { filterListings } = useStore();
  const catMeta = getCategoryMeta(category);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [minGuests, setMinGuests] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating' | 'popular'>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const availableDistricts = selectedRegion ? getDistrictsByRegion(selectedRegion) : [];

  const results = filterListings({
    category,
    region: selectedRegion || undefined,
    district: selectedDistrict || undefined,
    date: selectedDate,
    minCapacity: minGuests ? Number(minGuests) : undefined,
    sortBy
  });

  const mapMarkers = results.map(item => {
    const coords = item.location?.coordinates && item.location.coordinates.lat && item.location.coordinates.lng
      ? item.location.coordinates
      : getCoordinatesForLocation(item.location?.region, item.location?.district);

    return {
      id: item.id,
      title: item.title,
      lat: coords.lat,
      lng: coords.lng,
      address: item.location?.address || `${item.location?.district}, ${item.location?.region}`,
      coverImage: item.coverImage,
      priceLabel: item.priceLabel,
      onClick: () => onNavigate(`/detail/${item.id}`)
    };
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 text-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Hero Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-semibold text-gray-800 border border-gray-200 mb-2 shadow-xs">
            <span>Katalog</span>
            <span>•</span>
            <span>{catMeta.label}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight">
            {catMeta.label}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 max-w-2xl font-normal tracking-normal">
            {catMeta.description}. O'zbekiston bo'ylab eng sara takliflar va aniq narxlar.
          </p>

          {category === 'famous-artist' && (
            <div className="mt-4 rounded-2xl bg-white p-3.5 border border-amber-200 text-xs text-gray-800 flex items-start gap-2 max-w-2xl shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-800">DIQQAT:</strong> Mashhur san'atkorlarning to'y chiqishlari narxlari va bo'sh sanalari
                ma'muriyat bilan shaxsan muvofiqlashtiriladi. Saytdagi ma'lumotlar ko'rgazmali demo profildir.
              </div>
            </div>
          )}
        </div>

        {/* Filter bar */}
        <div className="mb-8 rounded-2xl bg-white p-4 shadow-xs border border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Region select */}
            <div>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedDistrict('');
                }}
                className="rounded-xl border border-gray-300 bg-gray-50 py-2 px-3 text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-hidden transition-colors"
              >
                <option value="">Barcha hududlar (O'zbekiston)</option>
                {UZBEKISTAN_REGIONS.map((r) => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* District select */}
            <div>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedRegion}
                className="rounded-xl border border-gray-300 bg-gray-50 py-2 px-3 text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <option value="">Barcha tumanlar</option>
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Date select */}
            <div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-xl border border-gray-300 bg-gray-50 py-2 px-3 text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-hidden transition-colors"
                title="Sanani tekshirish"
              />
            </div>

            {/* Capacity filter if wedding hall */}
            {category === 'wedding-hall' && (
              <div>
                <input
                  type="number"
                  placeholder="Min sig'im: 300 kishi"
                  value={minGuests}
                  onChange={(e) => setMinGuests(e.target.value ? Number(e.target.value) : '')}
                  className="w-36 rounded-xl border border-gray-300 bg-gray-50 py-2 px-3 text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:border-gray-900 focus:outline-hidden transition-colors"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle (Grid vs Map) */}
            <div className="flex items-center rounded-xl bg-gray-100 p-1 border border-gray-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-950 shadow-xs'
                    : 'text-gray-600 hover:text-gray-950'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Ro'yxat</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-950'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Xaritada ko'rish</span>
              </button>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium hidden sm:inline">Saralash:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-gray-300 bg-gray-50 py-2 px-3 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-hidden transition-colors"
              >
                <option value="recommended">Tavsiya etilgan</option>
                <option value="price_asc">Narxi: Arzondan qimmatga</option>
                <option value="price_desc">Narxi: Qimmatdan arzonga</option>
                <option value="rating">Reytingi eng yuqori</option>
                <option value="popular">Eng ko'p ko'rilgan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count & Status */}
        <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
          <span>
            Jami: <strong className="text-gray-900">{results.length} ta taklif</strong>
          </span>
          {selectedDistrict && (
            <span>Tuman: {selectedDistrict}</span>
          )}
        </div>

        {results.length > 0 ? (
          viewMode === 'map' ? (
            /* Interactive Full Catalog Map View */
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5 text-xs text-rose-900">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <strong>Xarita rejimi:</strong> Xaritadagi pinlar ustiga bosib manzil, narx va rasmlarni ko'rishingiz mumkin.
                </span>
                <span className="font-semibold">{results.length} ta nuqta</span>
              </div>
              <LeafletMap
                height="620px"
                zoom={12}
                markers={mapMarkers}
              />
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((item) => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  onNavigate={onNavigate}
                  selectedDate={selectedDate || undefined}
                />
              ))}
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Ushbu parametrlar bo'yicha takliflar topilmadi</h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              Iltimos, boshqa hududni tanlang yoki qidiruv filtrlari parametrlarini o'zgartiring.
            </p>
            <button
              onClick={() => {
                setSelectedRegion('');
                setSelectedDistrict('');
                setSelectedDate('');
                setMinGuests('');
              }}
              className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-rose-700 cursor-pointer"
            >
              Barcha hududlarni ko'rish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
