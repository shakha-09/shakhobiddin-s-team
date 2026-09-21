import React from 'react';
import { Heart, ArrowLeft, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ListingCard } from '../components/common/ListingCard';

interface FavoritesPageProps {
  onNavigate: (path: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onNavigate }) => {
  const { favorites, getListingById } = useStore();

  const favoriteListings = favorites
    .map(id => getListingById(id))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-600" />
            <span>Sevimlilar</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Saralangan To'y Xizmatlari ({favoriteListings.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            O'zingizga yoqqan to'yxonalar, avtomashinalar va xonandalarni shu yerda saqlang va solishtiring
          </p>
        </div>

        {favoriteListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteListings.map(item => (
              <ListingCard
                key={item.id}
                listing={item}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Hali hech qanday xizmat saqlanmadi</h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              Katalogdagi yurakcha tugmasini bosish orqali xizmatlarni bu yerda jamlashingiz mumkin.
            </p>
            <div className="mt-6">
              <button
                onClick={() => onNavigate('/wedding-halls')}
                className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-rose-700 transition-colors shadow-sm"
              >
                To'yxonalarni ko'rish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
