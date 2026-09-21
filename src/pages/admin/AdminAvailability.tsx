import React, { useState } from 'react';
import { Calendar, Building2, Check, Clock, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AvailabilityCalendar } from '../../components/common/AvailabilityCalendar';
import { AvailabilityStatus } from '../../types';

export const AdminAvailability: React.FC = () => {
  const { listings, updateListing } = useStore();
  const [selectedListingId, setSelectedListingId] = useState(listings[0]?.id || '');

  const currentListing = listings.find(l => l.id === selectedListingId);

  const handleToggle = (date: string, newStatus: AvailabilityStatus) => {
    if (!currentListing) return;
    const updatedAvailability = {
      ...currentListing.availability,
      [date]: newStatus
    };
    updateListing(currentListing.id, {
      availability: updatedAvailability
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Markaziy Bandlik Taqvimi (Kalendar)
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Har qanday to'yxona yoki xizmatning kunlik bandligini belgilang (Bo'sh ➔ Band ➔ Kutilmoqda)
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">
            Xizmat yoki To'yxonani tanlang:
          </label>
          <select
            value={selectedListingId}
            onChange={(e) => setSelectedListingId(e.target.value)}
            className="w-full sm:w-96 rounded-xl border border-gray-300 p-2.5 text-xs font-bold text-gray-900 bg-gray-50 focus:bg-white focus:outline-hidden"
          >
            {listings.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} ({item.location.district})
              </option>
            ))}
          </select>
        </div>

        {currentListing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentListing.coverImage}
                  alt={currentListing.title}
                  className="h-12 w-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{currentListing.title}</h3>
                  <div className="text-xs text-gray-500">{currentListing.location.district}, {currentListing.location.region}</div>
                </div>
              </div>

              <div className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl">
                Sanalarni bosib holatni o'zgartiring
              </div>
            </div>

            <AvailabilityCalendar
              availability={currentListing.availability}
              isAdmin={true}
              onToggleStatus={handleToggle}
            />

            <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                <strong>Ko'rsatma:</strong> Kalendardagi katakchalarni bosing. Har bir bosish holatni ketma-ket: 
                <strong className="text-emerald-700"> Yashil (Bo'sh)</strong> ➔ 
                <strong className="text-rose-700"> Qizil (Band qilingan)</strong> ➔ 
                <strong className="text-amber-700"> Sariq (Kutilmoqda)</strong> ko'rinishida yangilaydi. 
                O'zgarishlar darhol saqlanadi va saytda aks etadi.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
