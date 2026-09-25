export type CategoryType = 
  | 'wedding-hall'
  | 'car'
  | 'artist'
  | 'entertainer'
  | 'host'
  | 'famous-artist'
  | 'videographer'
  | 'photographer'
  | 'decorator'
  | 'catering';

export type AvailabilityStatus = 'available' | 'booked' | 'pending';

export type BookingStatus = 'new' | 'contacted' | 'confirmed' | 'cancelled' | 'completed';

export type PriceType = 'per_day' | 'per_seat' | 'per_table' | 'per_hour' | 'per_event';

export interface LocationInfo {
  region: string;
  district: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface CapacityInfo {
  min: number;
  max: number;
}

export interface CarDetails {
  brand: string;
  model: string;
  year?: number;
  vehicleClass: 'premium' | 'luxury' | 'retro' | 'suv' | 'business';
  withDriver: boolean;
  durationHours?: number;
}

export interface ArtistDetails {
  genre: string;
  repertoire?: string;
  performanceDuration?: string;
  audioSample?: string;
  famousRank?: number;
}

export interface HostDetails {
  languages: string[];
  style: string;
  experienceYears: number;
}

export interface ContactInfo {
  phone: string;
  secondaryPhone?: string;
  telegram?: string;
  instagram?: string;
  whatsapp?: string;
}

export interface ListingItem {
  id: string;
  category: CategoryType;
  title: string;
  subtitle?: string;
  slug: string;
  featured: boolean;
  isFamous?: boolean;
  isDemo: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  price: number; // in UZS
  priceType: 'per_day' | 'per_seat' | 'per_table' | 'per_hour' | 'per_event';
  priceLabel: string;
  capacity?: CapacityInfo;
  carDetails?: CarDetails;
  artistDetails?: ArtistDetails;
  hostDetails?: HostDetails;
  location: LocationInfo;
  coverImage: string;
  images: string[];
  description: string;
  amenities: string[];
  facilities?: string[];
  availability: Record<string, AvailabilityStatus>; // 'YYYY-MM-DD': 'available' | 'booked' | 'pending'
  contact: ContactInfo;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  viewsCount?: number;
  vendorId?: string;
}

export interface BookingRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  category: CategoryType;
  customerName: string;
  customerPhone: string;
  requestedDate: string;
  guestCount?: number;
  message?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  listingId: string;
  userName: string;
  userCity?: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}

export interface MyWeddingPlan {
  weddingDate: string;
  region: string;
  district: string;
  guestCount: number;
  budgetUZS: number;
  savedServices: {
    'wedding-hall'?: string | null;
    'car'?: string | null;
    'artist'?: string | null;
    'famous-artist'?: string | null;
    'host'?: string | null;
    'entertainer'?: string | null;
    'photographer'?: string | null;
    'decorator'?: string | null;
  };
  notes?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
}

export type VendorStatus = 'kutilmoqda' | 'tasdiqlangan' | 'rad etilgan';

export interface VendorAccount {
  id: string;
  phone: string;
  passwordHash: string;
  businessName: string;
  category: CategoryType;
  region: string;
  district: string;
  description: string;
  status: VendorStatus;
  rejectionReason?: string;
  listingId: string;
  createdAt: string;
  updatedAt: string;
}

