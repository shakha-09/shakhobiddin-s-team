import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  Image as ImageIcon, 
  Calendar, 
  Check, 
  X, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ListingItem, CategoryType, AvailabilityStatus, PriceType } from '../../types';
import { formatUZS, getCategoryMeta } from '../../utils/formatters';
import { UZBEKISTAN_REGIONS, getDistrictsByRegion, getCoordinatesForLocation } from '../../data/locations';
import { AvailabilityCalendar } from '../../components/common/AvailabilityCalendar';
import { LeafletMap } from '../../components/common/LeafletMap';

interface AdminListingsProps {
  initialCategory?: CategoryType;
  onNavigate: (path: string) => void;
}

export const AdminListings: React.FC<AdminListingsProps> = ({ 
  initialCategory, 
  onNavigate 
}) => {
  const { listings, addListing, updateListing, deleteListing } = useStore();

  const [categoryFilter, setCategoryFilter] = useState<CategoryType | 'all'>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<CategoryType>(initialCategory || 'wedding-hall');
  const [formTitle, setFormTitle] = useState('');
  const [formRegion, setFormRegion] = useState('Toshkent shahri');
  const [formDistrict, setFormDistrict] = useState('Chilonzor tumani');
  const [formAddress, setFormAddress] = useState('');
  const [formLat, setFormLat] = useState<number>(41.2750);
  const [formLng, setFormLng] = useState<number>(69.2080);
  const [formPrice, setFormPrice] = useState<number>(15000000);
  const [formPriceLabel, setFormPriceLabel] = useState('');
  const [formPriceType, setFormPriceType] = useState<PriceType>('per_day');
  const [formMinCapacity, setFormMinCapacity] = useState<number>(200);
  const [formMaxCapacity, setFormMaxCapacity] = useState<number>(600);
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formGalleryImages, setFormGalleryImages] = useState<string[]>([]);
  const [formNewImageUrl, setFormNewImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAmenities, setFormAmenities] = useState<string>('Konditsioner, LED ekran, Zamonaviy yoritish, Avtoturargoh');
  const [formPhone, setFormPhone] = useState('+998 90 123 45 67');
  const [formTelegram, setFormTelegram] = useState('');
  const [formInstagram, setFormInstagram] = useState('');
  const [formIsVerified, setFormIsVerified] = useState(true);
  const [formIsFamous, setFormIsFamous] = useState(false);
  const [formAvailability, setFormAvailability] = useState<Record<string, AvailabilityStatus>>({});

  // Active districts for form region
  const availableDistricts = getDistrictsByRegion(formRegion);

  // Open modal in create mode
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormCategory(categoryFilter !== 'all' ? categoryFilter : 'wedding-hall');
    setFormTitle('');
    setFormRegion('Toshkent shahri');
    setFormDistrict('Chilonzor');
    setFormAddress('');
    const defaultCoords = getCoordinatesForLocation('Toshkent shahri', 'Chilonzor');
    setFormLat(defaultCoords.lat);
    setFormLng(defaultCoords.lng);
    setFormPrice(15000000);
    setFormPriceLabel('');
    setFormPriceType('per_day');
    setFormMinCapacity(200);
    setFormMaxCapacity(600);
    setFormCoverImage('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80');
    setFormGalleryImages([
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'
    ]);
    setFormDescription("Eng zamonaviy to'y tantanalari uchun barcha sharoitlarga ega shinam xizmat.");
    setFormAmenities('Konditsioner, LED ekran, Zamonaviy yoritish, Avtoturargoh');
    setFormPhone('+998 90 123 45 67');
    setFormTelegram('toymakoni_uz');
    setFormInstagram('toymakoni.uz');
    setFormIsVerified(true);
    setFormIsFamous(false);
    setFormAvailability({});
    setIsModalOpen(true);
  };

  // Open modal in edit mode
  const handleOpenEdit = (item: ListingItem) => {
    setEditingId(item.id);
    setFormCategory(item.category);
    setFormTitle(item.title);
    setFormRegion(item.location.region);
    setFormDistrict(item.location.district);
    setFormAddress(item.location.address || '');
    const itemCoords = item.location.coordinates && item.location.coordinates.lat && item.location.coordinates.lng
      ? item.location.coordinates
      : getCoordinatesForLocation(item.location.region, item.location.district);
    setFormLat(itemCoords.lat);
    setFormLng(itemCoords.lng);
    setFormPrice(item.price);
    setFormPriceLabel(item.priceLabel || '');
    setFormPriceType(item.priceType);
    setFormMinCapacity(item.capacity?.min || 200);
    setFormMaxCapacity(item.capacity?.max || 600);
    setFormCoverImage(item.coverImage);
    setFormGalleryImages(item.images || [item.coverImage]);
    setFormDescription(item.description);
    setFormAmenities((item.amenities || []).join(', '));
    setFormPhone(item.contact.phone);
    setFormTelegram(item.contact.telegram || '');
    setFormInstagram(item.contact.instagram || '');
    setFormIsVerified(item.isVerified);
    setFormIsFamous(item.isFamous || false);
    setFormAvailability(item.availability || {});
    setIsModalOpen(true);
  };

  // Handle local image file upload (FileReader)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (!formCoverImage) {
          setFormCoverImage(result);
        }
        setFormGalleryImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    if (formNewImageUrl.trim()) {
      if (!formCoverImage) {
        setFormCoverImage(formNewImageUrl.trim());
      }
      setFormGalleryImages(prev => [...prev, formNewImageUrl.trim()]);
      setFormNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const removed = formGalleryImages[index];
    const updated = formGalleryImages.filter((_, i) => i !== index);
    setFormGalleryImages(updated);
    if (formCoverImage === removed && updated.length > 0) {
      setFormCoverImage(updated[0]);
    }
  };

  // Save changes
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amenitiesArray = formAmenities
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const isFamousVendor = formCategory === 'famous-artist' || formIsFamous;

    const payload: Partial<ListingItem> = {
      title: formTitle,
      category: formCategory,
      status: 'published',
      location: {
        region: formRegion,
        district: formDistrict,
        address: formAddress,
        coordinates: {
          lat: Number(formLat),
          lng: Number(formLng)
        }
      },
      price: Number(formPrice),
      priceLabel: formPriceLabel || formatUZS(Number(formPrice)),
      priceType: formPriceType,
      capacity: formCategory === 'wedding-hall' ? {
        min: Number(formMinCapacity),
        max: Number(formMaxCapacity)
      } : undefined,
      carDetails: formCategory === 'car' ? {
        brand: formTitle.split(' ')[0] || 'Avto',
        model: formTitle,
        year: 2024,
        vehicleClass: 'luxury',
        withDriver: true,
        durationHours: 8
      } : undefined,
      artistDetails: (formCategory === 'artist' || formCategory === 'famous-artist') ? {
        genre: 'Estrada / Milliy',
        performanceDuration: '1 to\'liq to\'y dasturi',
      } : undefined,
      hostDetails: formCategory === 'host' ? {
        languages: ["O'zbek", "Rus"],
        style: 'Klassik va zamonaviy',
        experienceYears: 7
      } : undefined,
      coverImage: formCoverImage || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      images: formGalleryImages.length > 0 ? formGalleryImages : [formCoverImage],
      description: formDescription,
      amenities: amenitiesArray,
      contact: {
        phone: formPhone,
        telegram: formTelegram || undefined,
        instagram: formInstagram || undefined
      },
      isVerified: formIsVerified,
      isFamous: isFamousVendor,
      availability: formAvailability
    };

    if (editingId) {
      updateListing(editingId, payload);
    } else {
      addListing({
        ...payload,
        status: 'published',
        rating: 5.0,
        reviewCount: 0,
        viewsCount: 1
      } as any);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Rostdan ham "${title}" xizmatini o'chirmoqchimisiz?`)) {
      deleteListing(id);
    }
  };

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Xizmatlarni Boshqarish (Katalog)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            To'yxonalar, avtomobillar va san'atkorlarni tahrirlash, qo'shish va o'chirish
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-rose-700 transition-colors shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi xizmat qo'shish</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="rounded-xl border border-gray-300 bg-gray-50 py-2 px-3 text-xs font-semibold text-gray-800"
          >
            <option value="all">Barcha toifalar ({listings.length})</option>
            <option value="wedding-hall">To'yxonalar</option>
            <option value="car">ZAGS Mashinalari</option>
            <option value="artist">Xonandalar</option>
            <option value="famous-artist">Mashhur Yulduzlar</option>
            <option value="host">Boshlovchilar</option>
            <option value="entertainer">Qiziqchilar</option>
          </select>

          <span className="text-xs text-gray-500">
            Ko'rsatilmoqda: <strong>{filteredListings.length} ta</strong>
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Nomi yoki hudud bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-xs text-gray-800 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Listings Table */}
      <div className="rounded-3xl bg-white border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">Xizmat</th>
                <th className="py-3.5 px-4">Toifa</th>
                <th className="py-3.5 px-4">Hudud</th>
                <th className="py-3.5 px-4">Narxi</th>
                <th className="py-3.5 px-4">Holat</th>
                <th className="py-3.5 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {filteredListings.map((item) => {
                const catMeta = getCategoryMeta(item.category);
                return (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="h-10 w-14 rounded-lg object-cover shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 truncate max-w-xs">{item.title}</div>
                          <div className="text-[11px] text-gray-400">ID: {item.id} • {item.rating} ★</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700">
                        {catMeta.singular}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div>{item.location.district}</div>
                      <div className="text-[10px] text-gray-400">{item.location.region}</div>
                    </td>

                    <td className="py-3 px-4 font-bold text-gray-900">
                      {item.priceLabel || formatUZS(item.price)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-[11px]">
                        {item.isVerified && (
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                            Tasdiqlangan
                          </span>
                        )}
                        {item.isFamous && (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                            VIP
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/${item.category === 'wedding-hall' ? 'wedding-halls' : item.category === 'car' ? 'cars' : 'artists'}/${item.id}`)}
                          className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                          title="Saytda ko'rish"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                          title="Tahrirlash"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT LISTING MODAL WITH IMAGE UPLOAD & AVAILABILITY CALENDAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? "Xizmatni tahrirlash" : "Yangi xizmat qo'shish"}
                </h2>
                <p className="text-xs text-gray-500">
                  Kiritilgan o'zgarishlar darhol saytning ommaviy sahifalarida aks etadi
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Xizmat yoki To'yxona Nomi *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Versal Grand Hall"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Toifasi *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-800"
                  >
                    <option value="wedding-hall">To'yxona</option>
                    <option value="car">ZAGS Mashinasi</option>
                    <option value="artist">Xonanda</option>
                    <option value="famous-artist">Mashhur Yulduz (VIP)</option>
                    <option value="host">Boshlovchi</option>
                    <option value="entertainer">Qiziqchi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Narx (so'm) *</label>
                  <input
                    type="number"
                    required
                    step={500000}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Maxsus narx yozuvi (ixtiyoriy)</label>
                  <input
                    type="text"
                    placeholder="Masalan: 30,000,000 so'm / kun"
                    value={formPriceLabel}
                    onChange={(e) => setFormPriceLabel(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Narx turi</label>
                  <select
                    value={formPriceType}
                    onChange={(e) => setFormPriceType(e.target.value as PriceType)}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-800"
                  >
                    <option value="per_day">Kunlik (per_day)</option>
                    <option value="per_seat">Kishi boshiga (per_seat)</option>
                    <option value="per_table">Stol boshiga (per_table)</option>
                    <option value="per_event">To'liq to'y dasturi (per_event)</option>
                    <option value="per_hour">Soatbay (per_hour)</option>
                  </select>
                </div>

                {/* Capacity if wedding hall */}
                {formCategory === 'wedding-hall' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Min sig'im (kishi)</label>
                      <input
                        type="number"
                        value={formMinCapacity}
                        onChange={(e) => setFormMinCapacity(Number(e.target.value))}
                        className="w-full rounded-xl border border-gray-300 p-2.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Max sig'im (kishi)</label>
                      <input
                        type="number"
                        value={formMaxCapacity}
                        onChange={(e) => setFormMaxCapacity(Number(e.target.value))}
                        className="w-full rounded-xl border border-gray-300 p-2.5 text-xs"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Location selection */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">Hudud va Manzil</span>
                  <button
                    type="button"
                    onClick={() => {
                      const c = getCoordinatesForLocation(formRegion, formDistrict);
                      setFormLat(c.lat);
                      setFormLng(c.lng);
                    }}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors border border-rose-200"
                  >
                    Hudud markaziga o'rnatish
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Viloyat *</label>
                    <select
                      value={formRegion}
                      onChange={(e) => {
                        const newReg = e.target.value;
                        setFormRegion(newReg);
                        const dists = getDistrictsByRegion(newReg);
                        const firstDist = dists[0] || '';
                        setFormDistrict(firstDist);
                        const c = getCoordinatesForLocation(newReg, firstDist);
                        setFormLat(c.lat);
                        setFormLng(c.lng);
                      }}
                      className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs font-medium"
                    >
                      {UZBEKISTAN_REGIONS.map((r) => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tuman *</label>
                    <select
                      value={formDistrict}
                      onChange={(e) => {
                        const newDist = e.target.value;
                        setFormDistrict(newDist);
                        const c = getCoordinatesForLocation(formRegion, newDist);
                        setFormLat(c.lat);
                        setFormLng(c.lng);
                      }}
                      className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs font-medium"
                    >
                      {availableDistricts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Aniq manzil (Ko'cha, mo'ljal)</label>
                    <input
                      type="text"
                      placeholder="Masalan: Chilonzor ko'chasi 45-uy"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs"
                    />
                  </div>
                </div>

                {/* Latitude & Longitude inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Kenglik (Latitude)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formLat}
                      onChange={(e) => setFormLat(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-300 bg-white p-2 text-xs font-mono text-gray-800"
                      placeholder="41.2995"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Uzunlik (Longitude)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formLng}
                      onChange={(e) => setFormLng(Number(e.target.value))}
                      className="w-full rounded-xl border border-gray-300 bg-white p-2 text-xs font-mono text-gray-800"
                      placeholder="69.2401"
                    />
                  </div>
                </div>

                {/* Interactive OpenStreetMap Pin Dropper */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>Xaritadagi joylashuv (Pinni torting yoki xarita ustiga bosing):</span>
                    <span className="font-mono font-semibold text-rose-600">lat: {formLat.toFixed(4)}, lng: {formLng.toFixed(4)}</span>
                  </div>
                  <LeafletMap
                    center={{ lat: formLat, lng: formLng }}
                    zoom={14}
                    height="240px"
                    editable={true}
                    onLocationSelect={(coords) => {
                      setFormLat(coords.lat);
                      setFormLng(coords.lng);
                    }}
                  />
                </div>
              </div>

              {/* Image Manager & Upload Section (Section 21) */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-bold text-gray-900">Fotosuratlar galereyasi</span>
                  </div>
                  <span className="text-[11px] text-gray-500">
                    Jami: {formGalleryImages.length} ta rasm
                  </span>
                </div>

                {/* Upload or enter URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Kompyuterdan / Qurilmadan rasm yuklash:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Yoki Internetdan rasm URL manzilini qo'shish:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={formNewImageUrl}
                        onChange={(e) => setFormNewImageUrl(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-white p-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="rounded-xl bg-gray-900 px-3 text-xs font-bold text-white hover:bg-black"
                      >
                        Qo'shish
                      </button>
                    </div>
                  </div>
                </div>

                {/* Thumbnails list */}
                {formGalleryImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formGalleryImages.map((img, idx) => (
                      <div key={idx} className="relative h-20 w-28 rounded-xl overflow-hidden border border-gray-300 group">
                        <img src={img} alt={`Thumb ${idx}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600"
                          title="O'chirish"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {formCoverImage === img && (
                          <div className="absolute bottom-1 left-1 rounded bg-rose-600 px-1 py-0.5 text-[9px] font-bold text-white">
                            Asosiy
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description & Amenities */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tavsif va imkoniyatlar *</label>
                  <textarea
                    rows={3}
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Qulayliklar (vergul bilan ajratib yozing)
                  </label>
                  <input
                    type="text"
                    value={formAmenities}
                    onChange={(e) => setFormAmenities(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-900"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Telefon raqam *</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Telegram (username)</label>
                  <input
                    type="text"
                    placeholder="toymakoni_uz"
                    value={formTelegram}
                    onChange={(e) => setFormTelegram(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Instagram (username)</label>
                  <input
                    type="text"
                    placeholder="toymakoni.uz"
                    value={formInstagram}
                    onChange={(e) => setFormInstagram(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-2.5 text-xs"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsVerified}
                    onChange={(e) => setFormIsVerified(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Tasdiqlangan xizmat (Verified badge)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFamous}
                    onChange={(e) => setFormIsFamous(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>VIP Mashhur Yulduz</span>
                </label>
              </div>

              {/* Interactive Calendar Toggle directly in admin (Section 22) */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">
                    Bandlik kalendari (Sanalarni bosib holatni o'zgartiring: Bo'sh ➔ Band ➔ Kutilmoqda)
                  </span>
                </div>
                <AvailabilityCalendar
                  availability={formAvailability}
                  isAdmin={true}
                  onToggleStatus={(date, newStatus) => {
                    setFormAvailability(prev => ({
                      ...prev,
                      [date]: newStatus
                    }));
                  }}
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-300 px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-md"
                >
                  {editingId ? "O'zgarishlarni saqlash" : "Xizmatni e'lon qilish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
