export type UserRole = "user" | "admin" | "moderator" | "editor";

export type ContentStatus = "draft" | "published" | "archived";

export type ContentType = "movie" | "series";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url: string | null;
  video_url: string | null;
  year: number;
  duration: number; // minutes
  rating: number;
  is_premium: boolean;
  is_featured: boolean;
  status: ContentStatus;
  created_at: string;
  genres?: Genre[];
}

export interface Series {
  id: string;
  title: string;
  description: string;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url: string | null;
  year: number;
  rating: number;
  is_premium: boolean;
  is_featured: boolean;
  status: ContentStatus;
  created_at: string;
  genres?: Genre[];
  seasons?: Season[];
}

export interface Season {
  id: string;
  series_id: string;
  season_number: number;
  title: string | null;
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  season_id: string;
  episode_number: number;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  duration: number;
  is_premium: boolean;
  created_at: string;
}

export interface WatchHistoryEntry {
  id: string;
  user_id: string;
  content_type: ContentType;
  content_id: string;
  progress_seconds: number;
  completed: boolean;
  updated_at: string;
}

export interface WatchlistEntry {
  id: string;
  user_id: string;
  content_type: ContentType;
  content_id: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  duration: number; // jours
  features: string[];
  active: boolean;
}

export type SubscriptionStatus = "active" | "expired" | "canceled";

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  created_at: string;
}

export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  transaction_id: string | null;
  created_at: string;
}

export type AdPlacement = "pre-roll" | "mid-roll" | "post-roll" | "banner";

export interface Ad {
  id: string;
  title: string;
  media_url: string;
  target_url: string | null;
  placement: AdPlacement;
  active: boolean;
  start_date: string | null;
  end_date: string | null;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}
