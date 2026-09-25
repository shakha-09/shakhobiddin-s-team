import React, { useState } from 'react';
import { Heart, Star, MapPin, Users, Car, Music, Mic, Check, Sparkles, Phone, ArrowUpRight, Video } from 'lucide-react';
import { ListingItem } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatUZS, getCategoryMeta } from '../../utils/formatters';
import { AvailabilityBadge } from './AvailabilityBadge';
import { BookingModal } from './BookingModal';

interface ListingCardProps {
  listing: ListingItem;
  onNavigate?: (path: string) => void;
  selectedDate?: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  onNavigate,
  selectedDate 
}) => {
  const { toggleFavorite, isFavorite } = useStore();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const favorited = isFavorite(listing.id);
  const catMeta = getCategoryMeta(listing.category);

  const detailPath = `/${listing.category === 'wedding-hall' ? 'wedding-halls' : 
    listing.category === 'car' ? 'cars' : 
    listing.category === 'artist' ? 'artists' : 
    listing.category === 'famous-artist' ? 'famous-artists' : 
    listing.category === 'host' ? 'hosts' : 
    listing.category === 'entertainer' ? 'entertainers' : 
    listing.category === 'videographer' ? 'videochilar' : 'detail'}/${listing.id}`;

  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate(detailPath);
    } else {
      window.location.hash = detailPath;
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(listing.id);
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookingOpen(true);
  };

  // Status for selected date if provided, otherwise general status
  const currentStatus = selectedDate ? (listing.availability[selectedDate] || 'available') : undefined;

  return (
    <>
      <div 
        id={`listing-card-${listing.id}`}
        onClick={handleCardClick}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl cursor-pointer"
      >
        {/* Cover Image Container */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
          <img
            src={listing.coverImage}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback wedding placeholder image
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Top badges bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
              {listing.isFamous ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] px-2.5 py-1 text-[11px] font-bold text-gray-950 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-900" />
                  Yulduz (VIP)
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-xs">
                  {catMeta.singular}
                </span>
              )}

              {listing.isDemo && (
                <span className="inline-flex items-center rounded-full bg-gray-900/80 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-xs" title="Namuna sifatida joylashtirilgan profil">
                  Namuna
                </span>
              )}
            </div>

            {/* Favorite button */}
            <button
              type="button"
              id={`fav-btn-${listing.id}`}
              onClick={handleFavoriteClick}
              className={`pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-xs transition-all cursor-pointer ${
                favorited 
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30' 
                  : 'bg-white/90 text-gray-700 hover:bg-white hover:text-rose-500 shadow-xs'
              }`}
              title={favorited ? "Saralangandan o'chirish" : "Saralanganlarga saqlash"}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Bottom image overlay: Availability status */}
          <div className="absolute bottom-2 left-3 pointer-events-none">
            <AvailabilityBadge status={currentStatus} date={selectedDate} />
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {/* Rating and Reviews */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-gray-900">{listing.rating.toFixed(1)}</span>
              <span className="text-gray-500">({listing.reviewCount})</span>
            </div>

            {listing.isVerified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Tasdiqlangan
              </span>
            )}
          </div>

          {/* Title - clean black font with relaxed letter tracking */}
          <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-amber-600 transition-colors tracking-normal">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-600 tracking-normal">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{listing.location.district}, {listing.location.region}</span>
          </div>

          {/* Specific Meta Attributes */}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-700 bg-gray-50 rounded-xl p-2.5 border border-gray-100">
            {listing.category === 'wedding-hall' && listing.capacity && (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gray-500" />
                <span>Sig'im: <strong className="text-gray-900">{listing.capacity.min} - {listing.capacity.max}</strong> kishi</span>
              </div>
            )}

            {listing.category === 'car' && listing.carDetails && (
              <div className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-gray-500" />
                <span className="truncate">{listing.carDetails.brand} {listing.carDetails.model} ({listing.carDetails.withDriver ? 'Haydovchi bilan' : 'Haydovchisiz'})</span>
              </div>
            )}

            {(listing.category === 'artist' || listing.category === 'famous-artist') && listing.artistDetails && (
              <div className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-gray-500" />
                <span className="truncate">{listing.artistDetails.genre}</span>
              </div>
            )}

            {listing.category === 'host' && listing.hostDetails && (
              <div className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-gray-500" />
                <span className="truncate">{listing.hostDetails.experienceYears} yil tajriba • {listing.hostDetails.style}</span>
              </div>
            )}

            {listing.category === 'entertainer' && listing.artistDetails && (
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gray-500" />
                <span className="truncate">{listing.artistDetails.genre}</span>
              </div>
            )}

            {listing.category === 'videographer' && (
              <div className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-gray-500" />
                <span className="truncate">4K Cinema • Multikam • Dron</span>
              </div>
            )}
          </div>

          {/* Price & Action */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
            <div>
              <span className="block text-[11px] text-gray-500">Narxi:</span>
              <span className="text-base font-bold text-gray-950 block leading-tight tracking-normal">
                {listing.priceLabel || formatUZS(listing.price)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleBookClick}
                className="rounded-full bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition-all cursor-pointer shadow-xs"
              >
                Bron qilish
              </button>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        listing={listing}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        prefilledDate={selectedDate}
      />
    </>
  );
};
