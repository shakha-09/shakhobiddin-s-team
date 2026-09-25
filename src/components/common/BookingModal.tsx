import React, { useState } from 'react';
import { X, Calendar, User, Phone, Users, MessageSquare, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { ListingItem } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatUZS, formatUzbekPhoneNumber, isValidUzbekPhone, sanitizeInput } from '../../utils/formatters';

interface BookingModalProps {
  listing: ListingItem;
  isOpen: boolean;
  onClose: () => void;
  prefilledDate?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  listing,
  isOpen,
  onClose,
  prefilledDate
}) => {
  const { addBookingRequest } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+998 ');
  const [requestedDate, setRequestedDate] = useState(prefilledDate || '2026-09-28');
  const [guestCount, setGuestCount] = useState(listing.capacity ? listing.capacity.min : 300);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePhoneChange = (val: string) => {
    setCustomerPhone(formatUzbekPhoneNumber(val));
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = sanitizeInput(customerName);
    if (!trimmedName || trimmedName.length < 2) {
      setError('Iltimos, to\'liq ism-familiyangizni kiriting');
      return;
    }

    const cleanDigits = customerPhone.replace(/\D/g, '');
    if (cleanDigits.length < 12) {
      setError('Iltimos, to\'liq telefon raqamingizni kiriting (+998 XX XXX XX XX)');
      return;
    }

    if (!requestedDate) {
      setError('Iltimos, to\'y sanasini tanlang');
      return;
    }

    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      addBookingRequest({
        listingId: listing.id,
        listingTitle: listing.title,
        category: listing.category,
        customerName: trimmedName,
        customerPhone: customerPhone.trim(),
        requestedDate,
        guestCount: listing.category === 'wedding-hall' ? Number(guestCount) : undefined,
        message: sanitizeInput(message)
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setIsSubmitting(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
      <div 
        id="booking-request-modal"
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all border border-gray-100"
      >
        {/* Close button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">So'rovingiz qabul qilindi!</h3>
            <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
              Hurmatli <span className="font-semibold text-gray-800">{customerName}</span>, sizning so'rovingiz platforma ma'murlari va 
              <span className="font-semibold text-gray-800"> "{listing.title}"</span> xizmat ko'rsatuvchisiga yuborildi.
            </p>
            <div className="mt-6 rounded-xl bg-gray-50 p-4 text-left text-xs text-gray-600 space-y-1.5 border border-gray-200">
              <div className="flex justify-between">
                <span>Xizmat:</span>
                <span className="font-medium text-gray-900">{listing.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Belgilangan sana:</span>
                <span className="font-medium text-gray-900">{requestedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Telefon raqamingiz:</span>
                <span className="font-medium text-gray-900">{customerPhone}</span>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full rounded-xl bg-rose-600 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors shadow-sm"
              >
                Tushunarli, yopish
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>To'y xizmatini band qilish so'rovi</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{listing.title}</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {listing.location.district}, {listing.location.region} • {listing.priceLabel || formatUZS(listing.price)}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  To'y / Tadbir sanasi *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 focus:border-rose-500 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {listing.category === 'wedding-hall' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Taxminiy mehmonlar soni (kishi)
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min={50}
                      max={1500}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 focus:border-rose-500 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Ismingiz va familiyangiz *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Sardorbek Alimov"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 focus:border-rose-500 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Bog'lanish uchun telefon raqamingiz *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+998 90 123 45 67"
                    value={customerPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 focus:border-rose-500 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Qo'shimcha istaklar yoki savollar (ixtiyoriy)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    rows={2}
                    placeholder="Masalan: ZAGS vaqti, qo'shimcha bezaklar yoki menyu bo'yicha..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 focus:border-rose-500 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <p className="text-[11px] text-gray-500">
                * So'rov yuborish bepul. Mutaxassislarimiz tez orada siz bilan bog'lanib, sanani tasdiqlashadi.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleResetAndClose}
                  className="w-1/3 rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Yuborilmoqda...</span>
                    </>
                  ) : (
                    <span>So'rov yuborish</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
