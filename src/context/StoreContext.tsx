import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ListingItem, 
  BookingRequest, 
  ReviewItem, 
  CategoryType, 
  AvailabilityStatus,
  BookingStatus,
  MyWeddingPlan,
  VendorAccount,
  VendorStatus
} from '../types';
import { INITIAL_LISTINGS, INITIAL_BOOKINGS, INITIAL_REVIEWS, INITIAL_VENDORS } from '../data/seedData';
import { getCoordinatesForLocation } from '../data/locations';

interface FilterOptions {
  query?: string;
  category?: CategoryType | 'all';
  region?: string;
  district?: string;
  date?: string;
  minCapacity?: number;
  maxPrice?: number;
  minRating?: number;
  onlyAvailable?: boolean;
  sortBy?: 'recommended' | 'nearest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
}

interface StoreContextType {
  listings: ListingItem[];
  bookings: BookingRequest[];
  reviews: ReviewItem[];
  favorites: string[];
  myWedding: MyWeddingPlan;
  isAdminLoggedIn: boolean;
  
  // Vendor State & Self-Service
  vendors: VendorAccount[];
  activeVendor: VendorAccount | null;
  registerVendor: (data: {
    businessName: string;
    phone: string;
    password: string;
    category: CategoryType;
    region: string;
    district: string;
    description: string;
  }) => { success: boolean; message: string; vendor?: VendorAccount };
  loginVendor: (phone: string, password: string) => {
    success: boolean;
    status?: VendorStatus;
    rejectionReason?: string;
    vendor?: VendorAccount;
    error?: string;
  };
  logoutVendor: () => void;
  approveVendor: (vendorId: string) => void;
  rejectVendor: (vendorId: string, reason?: string) => void;
  updateVendorStatus: (vendorId: string, status: VendorStatus, reason?: string) => void;
  updateActiveVendorProfile: (updates: {
    businessName?: string;
    description?: string;
    price?: number;
    priceType?: 'per_day' | 'per_seat' | 'per_table' | 'per_hour' | 'per_event';
    priceLabel?: string;
    contact?: {
      phone?: string;
      secondaryPhone?: string;
      telegram?: string;
      instagram?: string;
    };
    images?: string[];
    coverImage?: string;
  }) => void;
  updateActiveVendorAvailability: (date: string, status: AvailabilityStatus) => void;
  acceptVendorBookingRequest: (bookingId: string) => void;
  rejectVendorBookingRequest: (bookingId: string) => void;
  getVendorListing: (vendorId: string) => ListingItem | undefined;
  getVendorBookings: (vendorId: string) => BookingRequest[];
  
  // Listing Actions
  getListingById: (id: string) => ListingItem | undefined;
  getListingBySlug: (slug: string) => ListingItem | undefined;
  addListing: (listing: Omit<ListingItem, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount'>) => ListingItem;
  updateListing: (id: string, updates: Partial<ListingItem>) => void;
  deleteListing: (id: string) => void;
  togglePublishListing: (id: string) => void;
  updateListingAvailability: (id: string, date: string, status: AvailabilityStatus) => void;
  incrementListingViews: (id: string) => void;
  
  // Search & Filter
  filterListings: (options: FilterOptions) => ListingItem[];
  
  // Booking Actions
  addBookingRequest: (booking: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => BookingRequest;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  deleteBookingRequest: (id: string) => void;
  
  // Review Actions
  addReview: (review: Omit<ReviewItem, 'id' | 'date' | 'approved'>) => void;
  approveReview: (id: string) => void;
  deleteReview: (id: string) => void;
  
  // Favorites Actions
  toggleFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
  
  // My Wedding Actions
  updateMyWedding: (updates: Partial<MyWeddingPlan>) => void;
  selectServiceForWedding: (category: keyof MyWeddingPlan['savedServices'], listingId: string | null) => void;
  
  // Admin Auth
  loginAdmin: (password: string, emailOrUsername?: string) => boolean;
  logoutAdmin: () => void;
  
  // Reset demo data
  resetToDemoData: () => void;
}

const STORAGE_KEYS = {
  LISTINGS: 'toymakoni_listings_v1',
  BOOKINGS: 'toymakoni_bookings_v1',
  REVIEWS: 'toymakoni_reviews_v1',
  FAVORITES: 'toymakoni_favorites_v1',
  MY_WEDDING: 'toymakoni_my_wedding_v1',
  ADMIN_AUTH: 'toymakoni_admin_auth_v1',
  VENDORS: 'toymakoni_vendors_v1',
  ACTIVE_VENDOR_ID: 'toymakoni_active_vendor_id_v1',
};

const DEFAULT_MY_WEDDING: MyWeddingPlan = {
  weddingDate: '2026-10-15',
  region: 'Toshkent shahri',
  district: 'Chilonzor',
  guestCount: 300,
  budgetUZS: 75000000,
  savedServices: {
    'wedding-hall': 'hall-1',
    'car': 'car-1',
    'artist': 'artist-1',
    'host': 'host-1',
    'famous-artist': null,
    'entertainer': null,
    'photographer': null,
    'decorator': null
  },
  notes: 'To\'yimiz uchun eng sara xizmatlar rejalashtirilmoqda.'
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Listings State
  const [listings, setListings] = useState<ListingItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LISTINGS);
      const rawList = saved ? JSON.parse(saved) : INITIAL_LISTINGS;
      if (Array.isArray(rawList) && rawList.length > 0) {
        // Ensure any new demo items from INITIAL_LISTINGS (like videographers) are included
        const existingIds = new Set(rawList.map((i: ListingItem) => i.id));
        const missingFromInitial = INITIAL_LISTINGS.filter(i => !existingIds.has(i.id));
        const combined = missingFromInitial.length > 0 ? [...rawList, ...missingFromInitial] : rawList;

        return combined.map(item => ({
          ...item,
          status: item.status || 'published',
          location: {
            ...item.location,
            coordinates: item.location?.coordinates || getCoordinatesForLocation(item.location?.region, item.location?.district)
          }
        }));
      }
      return INITIAL_LISTINGS;
    } catch {
      return INITIAL_LISTINGS;
    }
  });

  // 2. Bookings State
  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  // 3. Reviews State
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // 4. Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : ['hall-1', 'car-1', 'artist-1'];
    } catch {
      return ['hall-1', 'car-1', 'artist-1'];
    }
  });

  // 5. My Wedding Plan State
  const [myWedding, setMyWedding] = useState<MyWeddingPlan>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MY_WEDDING);
      return saved ? JSON.parse(saved) : DEFAULT_MY_WEDDING;
    } catch {
      return DEFAULT_MY_WEDDING;
    }
  });

  // 6. Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // 7. Vendors State
  const [vendors, setVendors] = useState<VendorAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VENDORS);
      return saved ? JSON.parse(saved) : INITIAL_VENDORS;
    } catch {
      return INITIAL_VENDORS;
    }
  });

  // 8. Active Logged-in Vendor Session
  const [activeVendor, setActiveVendor] = useState<VendorAccount | null>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEYS.ACTIVE_VENDOR_ID);
      if (!savedId) return null;
      const savedVendors = localStorage.getItem(STORAGE_KEYS.VENDORS);
      const list: VendorAccount[] = savedVendors ? JSON.parse(savedVendors) : INITIAL_VENDORS;
      return list.find(v => v.id === savedId) || null;
    } catch {
      return null;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
    } catch (e) {
      console.error('Failed to save listings to localStorage', e);
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings to localStorage', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews to localStorage', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MY_WEDDING, JSON.stringify(myWedding));
    } catch (e) {
      console.error('Failed to save myWedding to localStorage', e);
    }
  }, [myWedding]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdminLoggedIn ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to save admin auth to localStorage', e);
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
    } catch (e) {
      console.error('Failed to save vendors to localStorage', e);
    }
  }, [vendors]);

  useEffect(() => {
    try {
      if (activeVendor) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_VENDOR_ID, activeVendor.id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_VENDOR_ID);
      }
    } catch (e) {
      console.error('Failed to save active vendor to localStorage', e);
    }
  }, [activeVendor]);

  // Helper methods
  const getListingById = (id: string) => {
    return listings.find(item => item.id === id || item.slug === id);
  };

  const getListingBySlug = (slug: string) => {
    return listings.find(item => item.slug === slug || item.id === slug);
  };

  const addListing = (data: Omit<ListingItem, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount'>): ListingItem => {
    const newId = `${data.category}-${Date.now()}`;
    const cleanSlug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || newId;
    const resolvedCoords = data.location?.coordinates && data.location.coordinates.lat && data.location.coordinates.lng
      ? data.location.coordinates
      : getCoordinatesForLocation(data.location?.region, data.location?.district);

    const newListing: ListingItem = {
      ...data,
      id: newId,
      slug: cleanSlug,
      status: data.status || 'published',
      featured: data.featured ?? true,
      isDemo: data.isDemo ?? false,
      isVerified: data.isVerified ?? true,
      rating: data.rating ?? 5.0,
      reviewCount: data.reviewCount ?? 0,
      viewsCount: 1,
      amenities: data.amenities || [],
      facilities: data.facilities || [],
      images: (data.images && data.images.length > 0) ? data.images : (data.coverImage ? [data.coverImage] : []),
      availability: data.availability || {},
      location: {
        ...data.location,
        coordinates: resolvedCoords
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setListings(prev => [newListing, ...prev]);
    return newListing;
  };

  const updateListing = (id: string, updates: Partial<ListingItem>) => {
    setListings(prev =>
      prev.map(item => {
        if (item.id !== id && item.slug !== id) return item;
        const updatedLocation = updates.location ? {
          ...item.location,
          ...updates.location,
          coordinates: updates.location.coordinates || item.location.coordinates || getCoordinatesForLocation(updates.location.region || item.location.region, updates.location.district || item.location.district)
        } : item.location;

        return {
          ...item,
          ...updates,
          location: updatedLocation,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      })
    );
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(item => item.id !== id && item.slug !== id));
    setFavorites(prev => prev.filter(favId => favId !== id));
  };

  const togglePublishListing = (id: string) => {
    setListings(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'published' ? 'draft' : 'published' }
          : item
      )
    );
  };

  const updateListingAvailability = (id: string, date: string, status: AvailabilityStatus) => {
    setListings(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        return {
          ...item,
          availability: {
            ...item.availability,
            [date]: status
          }
        };
      })
    );
  };

  const incrementListingViews = (id: string) => {
    setListings(prev =>
      prev.map(item =>
        item.id === id ? { ...item, viewsCount: (item.viewsCount || 0) + 1 } : item
      )
    );
  };

  // Filter & Proximity Ranking Engine
  const filterListings = (opts: FilterOptions): ListingItem[] => {
    const {
      query,
      category,
      region,
      district,
      date,
      minCapacity,
      maxPrice,
      minRating,
      onlyAvailable,
      sortBy = 'recommended'
    } = opts;

    let results = listings.filter(item => item.status === 'published');

    // 1. Category Filter
    if (category && category !== 'all') {
      results = results.filter(item => item.category === category);
    }

    // 2. Real Region filter (only filter when user picked a non-empty region)
    if (region && region.trim() !== '' && region !== 'all') {
      results = results.filter(item => {
        const itemRegion = (item.location?.region || '').toLowerCase();
        const targetRegion = region.toLowerCase().trim();
        return itemRegion.includes(targetRegion) || targetRegion.includes(itemRegion);
      });
    }

    // 3. Real District filter
    if (district && district.trim() !== '' && district !== 'all') {
      results = results.filter(item => {
        const itemDist = (item.location?.district || '').toLowerCase();
        const targetDist = district.toLowerCase().trim();
        return itemDist.includes(targetDist) || targetDist.includes(itemDist);
      });
    }

    // 4. Query Search (title, subtitle, description, address, amenities, brand)
    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      results = results.filter(item => {
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const subMatch = (item.subtitle || '').toLowerCase().includes(q);
        const descMatch = (item.description || '').toLowerCase().includes(q);
        const distMatch = (item.location?.district || '').toLowerCase().includes(q);
        const regMatch = (item.location?.region || '').toLowerCase().includes(q);
        const addrMatch = (item.location?.address || '').toLowerCase().includes(q);
        const amenMatch = (item.amenities || []).some(a => (a || '').toLowerCase().includes(q));
        const carMatch = item.carDetails ? (
          (item.carDetails.brand || '').toLowerCase().includes(q) ||
          (item.carDetails.model || '').toLowerCase().includes(q)
        ) : false;
        const artistMatch = item.artistDetails ? (
          (item.artistDetails.genre || '').toLowerCase().includes(q)
        ) : false;

        return titleMatch || subMatch || descMatch || distMatch || regMatch || addrMatch || amenMatch || carMatch || artistMatch;
      });
    }

    // 5. Date availability check
    if (date) {
      if (onlyAvailable) {
        results = results.filter(item => {
          const st = item.availability?.[date];
          return st !== 'booked';
        });
      }
    }

    // 6. Capacity (Guest count)
    if (minCapacity && minCapacity > 0) {
      results = results.filter(item => {
        if (item.category === 'wedding-hall' && item.capacity) {
          return item.capacity.max >= minCapacity;
        }
        return true;
      });
    }

    // 7. Max Price
    if (maxPrice && maxPrice > 0) {
      results = results.filter(item => item.price <= maxPrice);
    }

    // 8. Min Rating
    if (minRating && minRating > 0) {
      results = results.filter(item => item.rating >= minRating);
    }

    // 9. Location Proximity Scoring & Ranking
    return results.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      const aDist = (a.location?.district || '').toLowerCase();
      const bDist = (b.location?.district || '').toLowerCase();
      const aReg = (a.location?.region || '').toLowerCase();
      const bReg = (b.location?.region || '').toLowerCase();

      if (district) {
        const targetDist = district.toLowerCase();
        if (aDist === targetDist) scoreA += 100;
        if (bDist === targetDist) scoreB += 100;
      }
      if (region) {
        const targetReg = region.toLowerCase();
        if (aReg.includes(targetReg)) scoreA += 40;
        if (bReg.includes(targetReg)) scoreB += 40;
      }

      // If user provided a date, prioritize available over booked
      if (date) {
        const aStatus = a.availability?.[date];
        const bStatus = b.availability?.[date];
        if (aStatus === 'available') scoreA += 30;
        if (bStatus === 'available') scoreB += 30;
        if (aStatus === 'booked') scoreA -= 50;
        if (bStatus === 'booked') scoreB -= 50;
      }

      // Featured bonus
      if (a.featured) scoreA += 15;
      if (b.featured) scoreB += 15;

      // Rating bonus
      scoreA += (a.rating || 4.5) * 5;
      scoreB += (b.rating || 4.5) * 5;

      // Now apply explicit user sorting if selected
      if (sortBy === 'price_asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price_desc') {
        return b.price - a.price;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'popular') {
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      if (sortBy === 'nearest') {
        return scoreB - scoreA;
      }

      // Recommended default: score + rating
      return scoreB - scoreA;
    });
  };

  // Booking actions
  const addBookingRequest = (data: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>): BookingRequest => {
    const newReq: BookingRequest = {
      ...data,
      id: `req-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setBookings(prev => [newReq, ...prev]);
    return newReq;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    const booking = bookings.find(b => b.id === id);
    setBookings(prev =>
      prev.map(item => (item.id === id ? { ...item, status } : item))
    );

    // If confirmed, automatically mark date as 'booked' on listing availability
    if (status === 'confirmed' && booking?.listingId && booking?.requestedDate) {
      updateListingAvailability(booking.listingId, booking.requestedDate, 'booked');
    }
  };

  const deleteBookingRequest = (id: string) => {
    setBookings(prev => prev.filter(item => item.id !== id));
  };

  // Review actions
  const addReview = (data: Omit<ReviewItem, 'id' | 'date' | 'approved'>) => {
    const newRev: ReviewItem = {
      ...data,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      approved: true // default approved for customer satisfaction in demo
    };
    setReviews(prev => [newRev, ...prev]);
  };

  const approveReview = (id: string) => {
    setReviews(prev =>
      prev.map(item => (item.id === id ? { ...item, approved: true } : item))
    );
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(item => item.id !== id));
  };

  // Favorite actions
  const toggleFavorite = (listingId: string) => {
    setFavorites(prev =>
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  const isFavorite = (listingId: string) => {
    return favorites.includes(listingId);
  };

  // My Wedding actions
  const updateMyWedding = (updates: Partial<MyWeddingPlan>) => {
    setMyWedding(prev => ({ ...prev, ...updates }));
  };

  const selectServiceForWedding = (category: keyof MyWeddingPlan['savedServices'], listingId: string | null) => {
    setMyWedding(prev => ({
      ...prev,
      savedServices: {
        ...prev.savedServices,
        [category]: listingId
      }
    }));
  };

  // Admin Auth
  const loginAdmin = (password: string, emailOrUsername?: string): boolean => {
    // If an email/username is provided, verify it
    if (emailOrUsername && emailOrUsername.trim()) {
      const cleanUser = emailOrUsername.toLowerCase().trim();
      const validUsers = ['admin', 'admin@toymakoni.uz', 'owner', 'administrator'];
      if (!validUsers.includes(cleanUser) && !cleanUser.includes('admin')) {
        return false;
      }
    }
    // Demo admin passwords: 'admin' or 'admin123' or 'toy2026'
    const validPasswords = ['admin', 'admin123', 'toy2026', 'admin2026'];
    if (validPasswords.includes(password.trim())) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  // Vendor Methods
  const registerVendor = (data: {
    businessName: string;
    phone: string;
    password: string;
    category: CategoryType;
    region: string;
    district: string;
    description: string;
  }) => {
    const cleanPhone = data.phone.trim();
    const existing = vendors.find(v => v.phone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, ''));
    if (existing) {
      return {
        success: false,
        message: "Ushbu telefon raqami bilan avval ro'yxatdan o'tilgan. Iltimos, tizimga kiring."
      };
    }

    const vendorId = `vendor-${Date.now()}`;
    const listingId = `${data.category}-${Date.now()}`;
    const cleanSlug = data.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || listingId;
    const passwordHash = btoa(encodeURIComponent(`toymakoni_salt_${data.password}`));

    const categoryDefaultImages: Record<CategoryType, string> = {
      'wedding-hall': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'car': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'artist': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
      'famous-artist': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      'host': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80',
      'entertainer': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      'videographer': 'https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?auto=format&fit=crop&w=1200&q=80',
      'photographer': 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
      'decorator': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      'catering': 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80'
    };

    const resolvedCoords = getCoordinatesForLocation(data.region, data.district);

    const newVendor: VendorAccount = {
      id: vendorId,
      phone: cleanPhone,
      passwordHash,
      businessName: data.businessName,
      category: data.category,
      region: data.region,
      district: data.district,
      description: data.description,
      status: 'kutilmoqda', // Status = "kutilmoqda" (pending)
      listingId,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    // Note: status is 'draft', so it does NOT appear on the public site (catalog, search, category)
    const newListing: ListingItem = {
      id: listingId,
      category: data.category,
      title: data.businessName,
      subtitle: `${data.district}, ${data.region}`,
      slug: cleanSlug,
      featured: false,
      isDemo: false,
      isVerified: false,
      rating: 5.0,
      reviewCount: 0,
      price: 0,
      priceType: 'per_day',
      priceLabel: 'Kelishilgan narxda',
      location: {
        region: data.region,
        district: data.district,
        address: `${data.district} tumani, ${data.region}`,
        coordinates: resolvedCoords
      },
      coverImage: categoryDefaultImages[data.category] || categoryDefaultImages['wedding-hall'],
      images: [categoryDefaultImages[data.category] || categoryDefaultImages['wedding-hall']],
      description: data.description,
      amenities: ['Professional xizmat', 'Qulay shartlar'],
      facilities: ['Avtoturargoh'],
      availability: {},
      contact: {
        phone: cleanPhone
      },
      status: 'draft',
      vendorId: vendorId,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      viewsCount: 0
    };

    setVendors(prev => [newVendor, ...prev]);
    setListings(prev => [newListing, ...prev]);

    return {
      success: true,
      message: "So'rovingiz yuborildi. Admin tomonidan tasdiqlangandan so'ng kabinetingizga kira olasiz. Odatda 24 soat ichida ko'rib chiqiladi.",
      vendor: newVendor
    };
  };

  const loginVendor = (phone: string, password: string): {
    success: boolean;
    status?: VendorStatus;
    rejectionReason?: string;
    vendor?: VendorAccount;
    error?: string;
  } => {
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const candidateHash = btoa(encodeURIComponent(`toymakoni_salt_${password}`));

    const vendor = vendors.find(v => v.phone.replace(/\s+/g, '') === cleanPhone);
    if (!vendor) {
      return {
        success: false,
        error: "Bunday telefon raqamli xizmat ko'rsatuvchi topilmadi. Iltimos, avval ro'yxatdan o'ting."
      };
    }

    if (vendor.passwordHash !== candidateHash) {
      return {
        success: false,
        error: "Kiritilgan parol noto'g'ri. Iltimos, tekshirib qaytadan urinib ko'ring."
      };
    }

    if (vendor.status === 'kutilmoqda') {
      return {
        success: false,
        status: 'kutilmoqda' as VendorStatus,
        error: "Hisobingiz hali tasdiqlanmagan. Iltimos kuting."
      };
    }

    if (vendor.status === 'rad etilgan') {
      return {
        success: false,
        status: 'rad etilgan' as VendorStatus,
        rejectionReason: vendor.rejectionReason,
        error: vendor.rejectionReason 
          ? `Arizangiz rad etilgan. Sabab: ${vendor.rejectionReason}`
          : "Arizangiz rad etilgan."
      };
    }

    // Approved: log into dashboard
    setActiveVendor(vendor);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_VENDOR_ID, vendor.id);
    return {
      success: true,
      vendor
    };
  };

  const logoutVendor = () => {
    setActiveVendor(null);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_VENDOR_ID);
  };

  const approveVendor = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    setVendors(prev =>
      prev.map(v =>
        v.id === vendorId
          ? { ...v, status: 'tasdiqlangan', rejectionReason: undefined, updatedAt: new Date().toISOString().split('T')[0] }
          : v
      )
    );

    // Update matching listing to published immediately
    setListings(prev =>
      prev.map(l =>
        (l.id === vendor.listingId || l.vendorId === vendorId)
          ? { ...l, status: 'published', isVerified: true, updatedAt: new Date().toISOString().split('T')[0] }
          : l
      )
    );

    if (activeVendor?.id === vendorId) {
      setActiveVendor(prev => prev ? { ...prev, status: 'tasdiqlangan', rejectionReason: undefined } : null);
    }
  };

  const rejectVendor = (vendorId: string, reason?: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    setVendors(prev =>
      prev.map(v =>
        v.id === vendorId
          ? { ...v, status: 'rad etilgan', rejectionReason: reason || "Ma'lumotlar to'liq emas yoki talabga javob bermadi", updatedAt: new Date().toISOString().split('T')[0] }
          : v
      )
    );

    // Set listing to draft
    setListings(prev =>
      prev.map(l =>
        (l.id === vendor.listingId || l.vendorId === vendorId)
          ? { ...l, status: 'draft', updatedAt: new Date().toISOString().split('T')[0] }
          : l
      )
    );

    if (activeVendor?.id === vendorId) {
      setActiveVendor(prev => prev ? { ...prev, status: 'rad etilgan', rejectionReason: reason } : null);
    }
  };

  const updateVendorStatus = (vendorId: string, status: VendorStatus, reason?: string) => {
    if (status === 'tasdiqlangan') {
      approveVendor(vendorId);
    } else if (status === 'rad etilgan') {
      rejectVendor(vendorId, reason);
    } else {
      setVendors(prev =>
        prev.map(v =>
          v.id === vendorId
            ? { ...v, status: 'kutilmoqda', rejectionReason: undefined, updatedAt: new Date().toISOString().split('T')[0] }
            : v
        )
      );
      setListings(prev =>
        prev.map(l =>
          (l.vendorId === vendorId || l.id === vendors.find(x => x.id === vendorId)?.listingId)
            ? { ...l, status: 'draft', updatedAt: new Date().toISOString().split('T')[0] }
            : l
        )
      );
    }
  };

  const updateActiveVendorProfile = (updates: {
    businessName?: string;
    description?: string;
    price?: number;
    priceType?: 'per_day' | 'per_seat' | 'per_table' | 'per_hour' | 'per_event';
    priceLabel?: string;
    contact?: {
      phone?: string;
      secondaryPhone?: string;
      telegram?: string;
      instagram?: string;
    };
    images?: string[];
    coverImage?: string;
  }) => {
    if (!activeVendor) return;
    const vendorId = activeVendor.id;
    const listingId = activeVendor.listingId;

    if (updates.businessName) {
      setVendors(prev =>
        prev.map(v => v.id === vendorId ? { ...v, businessName: updates.businessName! } : v)
      );
      setActiveVendor(prev => prev ? { ...prev, businessName: updates.businessName! } : null);
    }

    setListings(prev =>
      prev.map(l => {
        if (l.id !== listingId && l.vendorId !== vendorId) return l;

        const updatedPrice = updates.price !== undefined ? updates.price : l.price;
        const updatedPriceType = updates.priceType || l.priceType;
        const updatedPriceLabel = updates.priceLabel || (updates.price !== undefined ? `${updates.price.toLocaleString('uz-UZ')} so'm` : l.priceLabel);

        return {
          ...l,
          title: updates.businessName || l.title,
          description: updates.description !== undefined ? updates.description : l.description,
          price: updatedPrice,
          priceType: updatedPriceType,
          priceLabel: updatedPriceLabel,
          contact: {
            ...l.contact,
            ...(updates.contact || {})
          },
          images: updates.images || l.images,
          coverImage: updates.coverImage || (updates.images && updates.images[0]) || l.coverImage,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      })
    );
  };

  const updateActiveVendorAvailability = (date: string, status: AvailabilityStatus) => {
    if (!activeVendor) return;
    const listingId = activeVendor.listingId;
    updateListingAvailability(listingId, date, status);
  };

  const acceptVendorBookingRequest = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // 1. Update request status to 'confirmed'
    updateBookingStatus(bookingId, 'confirmed');

    // 2. Automatically mark that date as "Band" (booked) on their calendar!
    if (booking.requestedDate && booking.listingId) {
      updateListingAvailability(booking.listingId, booking.requestedDate, 'booked');
    }
  };

  const rejectVendorBookingRequest = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
  };

  const getVendorListing = (vendorId: string) => {
    const v = vendors.find(item => item.id === vendorId);
    if (!v) return undefined;
    return listings.find(l => l.id === v.listingId || l.vendorId === vendorId);
  };

  const getVendorBookings = (vendorId: string) => {
    const v = vendors.find(item => item.id === vendorId);
    if (!v) return [];
    return bookings.filter(b => b.listingId === v.listingId || b.listingTitle.toLowerCase() === v.businessName.toLowerCase());
  };

  const resetToDemoData = () => {
    setListings(INITIAL_LISTINGS);
    setBookings(INITIAL_BOOKINGS);
    setReviews(INITIAL_REVIEWS);
    setFavorites(['hall-1', 'car-1', 'artist-1']);
    setMyWedding(DEFAULT_MY_WEDDING);
    setVendors(INITIAL_VENDORS);
    setActiveVendor(null);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_VENDOR_ID);
  };

  return (
    <StoreContext.Provider
      value={{
        listings,
        bookings,
        reviews,
        favorites,
        myWedding,
        isAdminLoggedIn,
        vendors,
        activeVendor,
        registerVendor,
        loginVendor,
        logoutVendor,
        approveVendor,
        rejectVendor,
        updateVendorStatus,
        updateActiveVendorProfile,
        updateActiveVendorAvailability,
        acceptVendorBookingRequest,
        rejectVendorBookingRequest,
        getVendorListing,
        getVendorBookings,
        getListingById,
        getListingBySlug,
        addListing,
        updateListing,
        deleteListing,
        togglePublishListing,
        updateListingAvailability,
        incrementListingViews,
        filterListings,
        addBookingRequest,
        updateBookingStatus,
        deleteBookingRequest,
        addReview,
        approveReview,
        deleteReview,
        toggleFavorite,
        isFavorite,
        updateMyWedding,
        selectServiceForWedding,
        loginAdmin,
        logoutAdmin,
        resetToDemoData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
