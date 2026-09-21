import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ListingItem, 
  BookingRequest, 
  ReviewItem, 
  CategoryType, 
  AvailabilityStatus,
  BookingStatus,
  MyWeddingPlan 
} from '../types';
import { INITIAL_LISTINGS, INITIAL_BOOKINGS, INITIAL_REVIEWS } from '../data/seedData';
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
  loginAdmin: (password: string) => boolean;
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
        return rawList.map(item => ({
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
      results = results.filter(item => 
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.location.district.toLowerCase().includes(q) ||
        item.location.region.toLowerCase().includes(q) ||
        item.location.address.toLowerCase().includes(q) ||
        item.amenities.some(a => a.toLowerCase().includes(q)) ||
        (item.carDetails && (item.carDetails.brand.toLowerCase().includes(q) || item.carDetails.model.toLowerCase().includes(q))) ||
        (item.artistDetails && item.artistDetails.genre.toLowerCase().includes(q))
      );
    }

    // 5. Date availability check
    if (date) {
      if (onlyAvailable) {
        results = results.filter(item => {
          const st = item.availability[date];
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

      if (district) {
        if (a.location.district.toLowerCase() === district.toLowerCase()) scoreA += 100;
        if (b.location.district.toLowerCase() === district.toLowerCase()) scoreB += 100;
      }
      if (region) {
        if (a.location.region.toLowerCase().includes(region.toLowerCase())) scoreA += 40;
        if (b.location.region.toLowerCase().includes(region.toLowerCase())) scoreB += 40;
      }

      // If user provided a date, prioritize available over booked
      if (date) {
        if (a.availability[date] === 'available') scoreA += 30;
        if (b.availability[date] === 'available') scoreB += 30;
        if (a.availability[date] === 'booked') scoreA -= 50;
        if (b.availability[date] === 'booked') scoreB -= 50;
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
    setBookings(prev =>
      prev.map(item => (item.id === id ? { ...item, status } : item))
    );
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
  const loginAdmin = (password: string): boolean => {
    // Demo admin password: 'admin' or 'admin123' or 'toy2026'
    if (password === 'admin' || password === 'admin123' || password === 'toy2026') {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  const resetToDemoData = () => {
    setListings(INITIAL_LISTINGS);
    setBookings(INITIAL_BOOKINGS);
    setReviews(INITIAL_REVIEWS);
    setFavorites(['hall-1', 'car-1', 'artist-1']);
    setMyWedding(DEFAULT_MY_WEDDING);
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
