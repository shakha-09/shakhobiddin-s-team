import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Star, 
  Check, 
  Calendar as CalendarIcon, 
  Phone, 
  Send, 
  Instagram, 
  Users, 
  Car, 
  Music, 
  Mic, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  ArrowLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatUZS, getCategoryMeta } from '../utils/formatters';
import { AvailabilityCalendar } from '../components/common/AvailabilityCalendar';
import { AvailabilityBadge } from '../components/common/AvailabilityBadge';
import { BookingModal } from '../components/common/BookingModal';
import { LeafletMap } from '../components/common/LeafletMap';
import { getCoordinatesForLocation } from '../data/locations';

interface ListingDetailPageProps {
  id: string;
  onNavigate: (path: string) => void;
}

export const ListingDetailPage: React.FC<ListingDetailPageProps> = ({ id, onNavigate }) => {
  const { 
    getListingById, 
    toggleFavorite, 
    isFavorite, 
    reviews, 
    addReview,
    selectServiceForWedding,
    myWedding,
    incrementListingViews 
  } = useStore();

  const listing = getListingById(id);

  // Track page view
  useEffect(() => {
    if (listing) {
      incrementListingViews(listing.id);
    }
  }, [listing?.id]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-09-28');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [addedToWeddingPlan, setAddedToWeddingPlan] = useState(false);

  // Review submission form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerCity, setReviewerCity] = useState('Toshkent');
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!listing) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Xizmat topilmadi</h2>
        <p className="mt-2 text-sm text-gray-500">Ushbu e'lon mavjud emas yoki o'chirilgan bo'lishi mumkin.</p>
        <button
          onClick={() => onNavigate('/')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bosh sahifaga qaytish</span>
        </button>
      </div>
    );
  }

  const favorited = isFavorite(listing.id);
  const catMeta = getCategoryMeta(listing.category);
  const galleryImages = listing.images && listing.images.length > 0 ? listing.images : [listing.coverImage];
  const listingReviews = reviews.filter(r => r.listingId === listing.id && r.approved);

  const isSavedInWeddingPlan = myWedding.savedServices[listing.category as keyof typeof myWedding.savedServices] === listing.id;

  const handleToggleWeddingPlan = () => {
    if (isSavedInWeddingPlan) {
      selectServiceForWedding(listing.category as any, null);
    } else {
      selectServiceForWedding(listing.category as any, listing.id);
      setAddedToWeddingPlan(true);
      setTimeout(() => setAddedToWeddingPlan(false), 3000);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    addReview({
      listingId: listing.id,
      userName: reviewerName.trim(),
      userCity: reviewerCity.trim(),
      rating: reviewerRating,
      comment: reviewerComment.trim()
    });

    setReviewerName('');
    setReviewerComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <button onClick={() => onNavigate('/')} className="hover:text-gray-900">
              Bosh sahifa
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => onNavigate(catMeta.path)} className="hover:text-gray-900">
              {catMeta.label}
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium truncate max-w-xs">{listing.title}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                {catMeta.singular}
              </span>
              {listing.isFamous && (
                <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-amber-500 to-rose-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  VIP Yulduz
                </span>
              )}
              {listing.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  <Check className="w-3.5 h-3.5" />
                  Tasdiqlangan xizmat
                </span>
              )}
              {listing.isDemo && (
                <span className="text-[11px] bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full border border-blue-200">
                  Ko'rgazmali profil (Demo)
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
              {listing.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-gray-900">{listing.rating.toFixed(1)}</span>
                <span className="text-gray-400 font-normal">({listing.reviewCount} ta sharh)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>{listing.location.address || `${listing.location.district}, ${listing.location.region}`}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => toggleFavorite(listing.id)}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                favorited
                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{favorited ? 'Saqlangan' : 'Saqlash'}</span>
            </button>

            <button
              onClick={handleToggleWeddingPlan}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                isSavedInWeddingPlan
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isSavedInWeddingPlan ? 'text-emerald-600' : 'text-gray-400'}`} />
              <span>{isSavedInWeddingPlan ? "To'y rejasiga qo'shildi" : "To'y rejasiga qo'shish"}</span>
            </button>
          </div>
        </div>

        {/* 1. LARGE IMAGE GALLERY (SECTION 7 REQUIREMENT) */}
        <div className="mb-8 space-y-3">
          {/* Main big display */}
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden rounded-3xl bg-gray-900 shadow-lg">
            <img
              src={galleryImages[activeImageIndex] || listing.coverImage}
              alt={listing.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            <div className="absolute bottom-4 right-4 rounded-xl bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              {activeImageIndex + 1} / {galleryImages.length} fotosurat
            </div>
          </div>

          {/* Thumbnails list */}
          {galleryImages.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-18 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    activeImageIndex === idx ? 'border-rose-600 scale-102 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. MAIN CONTENT GRID: Details + Sticky Contact/Booking Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Description, Amenities, Calendar, Reviews */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Specs Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {listing.category === 'wedding-hall' && listing.capacity && (
                <div className="rounded-2xl bg-white p-4 border border-gray-200 text-center">
                  <Users className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                  <div className="text-[11px] text-gray-500">Mehmonlar sig'imi</div>
                  <div className="text-sm font-bold text-gray-900">{listing.capacity.min} - {listing.capacity.max} kishi</div>
                </div>
              )}

              {listing.category === 'car' && listing.carDetails && (
                <div className="rounded-2xl bg-white p-4 border border-gray-200 text-center">
                  <Car className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-[11px] text-gray-500">Mashina toifasi</div>
                  <div className="text-sm font-bold text-gray-900 uppercase">{listing.carDetails.vehicleClass}</div>
                </div>
              )}

              <div className="rounded-2xl bg-white p-4 border border-gray-200 text-center">
                <MapPin className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                <div className="text-[11px] text-gray-500">Tuman</div>
                <div className="text-sm font-bold text-gray-900">{listing.location.district}</div>
              </div>

              <div className="rounded-2xl bg-white p-4 border border-gray-200 text-center">
                <Star className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <div className="text-[11px] text-gray-500">Reyting</div>
                <div className="text-sm font-bold text-gray-900">{listing.rating.toFixed(1)} / 5.0</div>
              </div>

              <div className="rounded-2xl bg-white p-4 border border-gray-200 text-center">
                <Clock className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <div className="text-[11px] text-gray-500">Buyurtma holati</div>
                <div className="text-sm font-bold text-emerald-600">Qabul qilinmoqda</div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl bg-white p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Tavsif va ma'lumotlar</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Facilities & Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="rounded-2xl bg-white p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Qulayliklar va jihozlar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {listing.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-800">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Calendar Card (Section 13) */}
            <div className="rounded-2xl bg-white p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Bandlik taqvimi (Kalendar)</h2>
                  <p className="text-xs text-gray-500">
                    O'zingizga qulay sanani tanlang va ushbu kunga xizmat bo'shligini tekshiring
                  </p>
                </div>
                {selectedCalendarDate && (
                  <AvailabilityBadge
                    status={listing.availability[selectedCalendarDate] || 'available'}
                    date={selectedCalendarDate}
                  />
                )}
              </div>

              <AvailabilityCalendar
                availability={listing.availability}
                selectedDate={selectedCalendarDate}
                onSelectDate={(d) => setSelectedCalendarDate(d)}
              />

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-gray-500">
                  Tanlangan sana: <strong className="text-gray-900">{selectedCalendarDate}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors"
                >
                  Ushbu sanaga so'rov yuborish
                </button>
              </div>
            </div>

            {/* Address & Interactive OpenStreetMap */}
            <div className="rounded-2xl bg-white p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Manzil va joylashuv</h2>
                  <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
                    {listing.location.address || `${listing.location.district}, ${listing.location.region}`}
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 self-start sm:self-auto">
                  {listing.location.region} • {listing.location.district}
                </div>
              </div>

              {/* Real Interactive Leaflet OpenStreetMap */}
              {(() => {
                const targetCoords = listing.location?.coordinates && listing.location.coordinates.lat && listing.location.coordinates.lng
                  ? listing.location.coordinates
                  : getCoordinatesForLocation(listing.location?.region, listing.location?.district);

                return (
                  <LeafletMap
                    center={targetCoords}
                    zoom={15}
                    height="380px"
                    markers={[
                      {
                        id: listing.id,
                        title: listing.title,
                        lat: targetCoords.lat,
                        lng: targetCoords.lng,
                        address: listing.location.address || `${listing.location.district}, ${listing.location.region}`,
                        coverImage: listing.coverImage,
                        priceLabel: listing.priceLabel
                      }
                    ]}
                  />
                );
              })()}
            </div>

            {/* Reviews Section */}
            <div className="rounded-2xl bg-white p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Mijozlar fikrlari ({listingReviews.length})</h2>
                  <p className="text-xs text-gray-500">Haqiqiy to'y o'tkazgan mijozlar taassurotlari</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-amber-700 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{listing.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Reviews list */}
              <div className="space-y-4">
                {listingReviews.map((rev) => (
                  <div key={rev.id} className="rounded-xl bg-gray-50 p-4 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900">{rev.userName}</div>
                          <div className="text-[10px] text-gray-500">{rev.userCity || 'Toshkent'} • {rev.date}</div>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Add review form */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-3">O'z fikringizni qoldiring</h3>
                {reviewSubmitted && (
                  <div className="mb-3 rounded-lg bg-emerald-50 p-2.5 text-xs font-medium text-emerald-700">
                    Fikringiz uchun rahmat! Sharhingiz tasdiqlandi va e'lon qilindi.
                  </div>
                )}
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Ismingiz"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="rounded-xl border border-gray-300 p-2.5 text-xs"
                    />
                    <select
                      value={reviewerRating}
                      onChange={(e) => setReviewerRating(Number(e.target.value))}
                      className="rounded-xl border border-gray-300 p-2.5 text-xs"
                    >
                      <option value={5}>5 yulduz (A'lo darajada)</option>
                      <option value={4}>4 yulduz (Juda yaxshi)</option>
                      <option value={3}>3 yulduz (Qoniqarli)</option>
                    </select>
                  </div>
                  <textarea
                    required
                    rows={2}
                    placeholder="Xizmat darajasi, sifat va taassurotlaringiz haqida yozing..."
                    value={reviewerComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 transition-colors"
                  >
                    Fikrni yuborish
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Contact, Pricing & Booking Request Box */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-5">
            <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-xl space-y-6">
              <div>
                <span className="text-xs text-gray-400 font-medium block">Xizmat narxi:</span>
                <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-0.5">
                  {listing.priceLabel || formatUZS(listing.price)}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>To'g'ridan-to'g'ri xizmat ko'rsatuvchi narxi</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3.5 text-sm font-bold text-white hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all cursor-pointer"
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>Band qilish so'rovini yuborish</span>
                </button>

                <p className="text-[11px] text-gray-400 text-center">
                  * Oldindan to'lov talab qilinmaydi. So'rov yuborilgach, ma'mur siz bilan bog'lanadi.
                </p>
              </div>

              {/* Direct Contact Actions (Section 14) */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <span className="text-xs font-bold text-gray-900 block">
                  To'g'ridan-to'g'ri bog'lanish:
                </span>

                {listing.contact.phone && (
                  <a
                    href={`tel:${listing.contact.phone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-center gap-2 w-full rounded-xl border border-gray-300 py-2.5 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>Qo'ng'iroq qilish: {listing.contact.phone}</span>
                  </a>
                )}

                {listing.contact.telegram && (
                  <a
                    href={`https://t.me/${listing.contact.telegram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-sky-50 text-sky-700 border border-sky-200 py-2.5 text-xs font-bold hover:bg-sky-100 transition-colors"
                  >
                    <Send className="w-4 h-4 text-sky-500" />
                    <span>Telegram orqali yozish</span>
                  </a>
                )}

                {listing.contact.instagram && (
                  <a
                    href={`https://instagram.com/${listing.contact.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-pink-50 text-pink-700 border border-pink-200 py-2.5 text-xs font-bold hover:bg-pink-100 transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-pink-500" />
                    <span>Instagram sahifasi</span>
                  </a>
                )}
              </div>

              {/* Platform Guarantee */}
              <div className="rounded-2xl bg-gray-50 p-3.5 text-xs text-gray-600 space-y-1 border border-gray-100">
                <div className="font-bold text-gray-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>To'y Makoni kafolati</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Barcha ma'lumotlar platforma ma'murlari tomonidan nazorat qilinadi va mijozlar xavfsizligi ta'minlanadi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Request Modal */}
      <BookingModal
        listing={listing}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        prefilledDate={selectedCalendarDate}
      />
    </div>
  );
};
