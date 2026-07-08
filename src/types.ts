export interface ConcertSlide {
  id: string;
  day: string;
  month: string;
  ordinal: string;
  time: string;
  location: string;
  venue: string;
  ticketType: string;
}

export interface EventItem {
  id: string;
  title: string;
  month: string;
  day: string;
  description: string;
  location: string;
  category: 'Concert' | 'Festival' | 'Sports' | 'Arts' | 'Lifestyle';
  subcategories?: string[];
  imageUrl: string;
  imagePosition?: string;
  artistId?: string; // Links this event to an artist/creator
  ticketLink?: string; // Optional external booking or info link
  ticketLimit?: number; // Maximum available tickets
  ticketsSold?: number; // Current tickets booked so far
  hasEarlyBird?: boolean; // Whether early bird offers are active
  earlyBirdPrice?: string; // Price for early bird list
  generalPrice?: string; // General Admission price
  vipPrice?: string; // VIP Admission price
  alternativeDates?: {
    id: string;
    month: string;
    day: string;
    time: string;
    status: 'AVAILABLE' | 'STANDBY' | 'SOLD OUT';
  }[];
}

export interface ArtistItem {
  id: string;
  name: string;
  slug: string;
  category: 'Music' | 'Food' | 'Festival';
  typeLabel: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  location: string;
  festivalDate: string;
  festivalTime: string;
  avatarPosition?: string;
  bannerPosition?: string;
  specialties?: string[];
}
