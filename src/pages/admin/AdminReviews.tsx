import React from 'react';
import { MessageSquare, Star, CheckCircle, Trash2, XCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminReviews: React.FC = () => {
  const { reviews, approveReview, deleteReview, listings } = useStore();

  const getListingTitle = (id: string) => {
    const item = listings.find(l => l.id === id);
    return item ? item.title : id;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Mijozlar Sharhlari va Fikrlari Moderatsiyasi
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Foydalanuvchilar qoldirgan sharhlarni tasdiqlash yoki o'chirish
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-gray-200 shadow-xs overflow-hidden">
        {reviews.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 hover:bg-gray-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">{rev.userName}</span>
                    <span className="text-xs text-gray-400">({rev.userCity || 'Toshkent'})</span>
                    <span className="text-xs text-rose-600 font-semibold">• {getListingTitle(rev.listingId)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400">{rev.date}</span>
                    {rev.approved ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        Tasdiqlangan
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        Kutilmoqda
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed max-w-2xl">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!rev.approved && (
                    <button
                      onClick={() => approveReview(rev.id)}
                      className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Tasdiqlash</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (window.confirm("Ushbu fikrni o'chirmoqchimisiz?")) {
                        deleteReview(rev.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 text-xs">
            Hozircha hech qanday fikr qoldirilmagan.
          </div>
        )}
      </div>
    </div>
  );
};
