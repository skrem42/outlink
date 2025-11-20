// Database table types matching Supabase schema

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Creator {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  tier: 'free' | 'pro' | 'premium';
  status: 'active' | 'inactive';
  total_clicks: number;
  total_revenue: number;
  joined_date: string;
  created_at: string;
  updated_at: string;
}

export interface Domain {
  id: string;
  user_id: string;
  domain: string;
  status: 'active' | 'pending' | 'expired';
  verified: boolean;
  ssl_enabled: boolean;
  clicks: number;
  connected_links: number;
  registered_date: string;
  expiry_date: string | null;
  registrar: string | null;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  user_id: string;
  creator_id: string | null;
  domain_id: string | null;
  link_type: 'whitehat' | 'greyhat' | 'blackhat';
  platform: string | null;
  domain: string;
  path: string;
  full_url?: string;
  destination_url: string;
  title: string | null;
  description: string | null;
  status: boolean;
  clicks: number;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  id: string;
  link_id: string;
  event_type: 'click' | 'view' | 'conversion';
  timestamp: string;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  created_at: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface CTACardStyle {
  type: 'text' | 'logo' | 'image' | 'solid' | 'gradient' | 'video';
  logo_name?: string; // e.g., 'OnlyFans', 'Instagram'
  logo_icon?: string; // iconify icon
  logo_color?: string; // brand color for logo
  prefix_text?: string; // e.g., 'Free', 'Paid'
  background_image?: string;
  background_color?: string;
  background_gradient?: { start: string; end: string };
  background_video?: string; // video URL for video backgrounds
}

export interface CTRMechanisms {
  // Click-to-reveal gamification
  click_to_reveal?: {
    enabled: boolean;
    clicks_required: number; // e.g., 5
    button_text: string; // e.g., "Tap to reveal"
  };
  
  // Countdown timer before reveal
  countdown_timer?: {
    enabled: boolean;
    duration_seconds: number; // e.g., 5
    message: string; // e.g., "Link unlocking in..."
  };
  
  // Limited slots scarcity
  limited_slots?: {
    enabled: boolean;
    current: number; // Fake configurable number
    total: number;
    message: string; // e.g., "Only X spots left!"
  };
  
  // Live viewers count
  live_viewers?: {
    enabled: boolean;
    count: number; // Fake configurable number
  };
  
  // Exclusive access badge
  exclusive_badge?: {
    enabled: boolean;
    text: string; // e.g., "VIP Access", "Members Only"
  };
  
  // Password/code entry
  access_code?: {
    enabled: boolean;
    code: string;
    hint?: string;
  };
  
  // Curiosity gap with blur
  blur_preview?: {
    enabled: boolean;
    blur_amount: number; // 1-10
    teaser_text: string;
  };
  
  // Visual effects
  visual_effects?: {
    pulse_animation: boolean;
    glow_effect: boolean;
    confetti_on_reveal: boolean;
  };
  
  // Progress bar before reveal
  progress_bar?: {
    enabled: boolean;
    duration_seconds: number;
    message: string;
  };
}

export interface CTACard {
  id: string;
  title: string;
  description?: string;
  url: string;
  order: number;
  style: CTACardStyle;
  ctr_mechanisms?: CTRMechanisms;
  require_18plus?: boolean; // for adult platforms
}

export interface BackgroundGradient {
  start: string;
  end: string;
}

export interface LandingPageSettings {
  id: string;
  link_id: string;
  avatar_url: string | null;
  display_name: string | null;
  bio: string | null;
  background_color: string; // Solid background color (deprecated, use theme_mode)
  background_gradient: BackgroundGradient; // Keep for backward compatibility
  theme_mode: 'light' | 'dark';
  button_style: 'default' | 'gradient' | 'outline' | 'solid';
  button_color: 'primary' | 'success' | 'warning' | 'secondary' | 'danger';
  social_links: SocialLink[];
  cta_cards: CTACard[];
  verified_badge: boolean;
  verified_badge_style: 'chip' | 'solid';
  show_follower_count: boolean;
  follower_count: number;
  show_domain_handle: boolean;
  profile_display_mode: 'full' | 'avatar';
  voice_note_url: string | null;
  created_at: string;
  updated_at: string;
}

// API Request types for Landing Page Settings
export interface CreateLandingPageSettingsRequest {
  link_id: string;
  avatar_url?: string;
  display_name?: string;
  bio?: string;
  background_color?: string;
  background_gradient?: BackgroundGradient; // Keep for backward compatibility
  button_style?: 'default' | 'gradient' | 'outline' | 'solid';
  button_color?: 'primary' | 'success' | 'warning' | 'secondary' | 'danger';
  social_links?: SocialLink[];
  verified_badge?: boolean;
  show_follower_count?: boolean;
  follower_count?: number;
}

export interface UpdateLandingPageSettingsRequest {
  avatar_url?: string;
  display_name?: string;
  bio?: string;
  background_color?: string;
  background_gradient?: BackgroundGradient; // Keep for backward compatibility
  theme_mode?: 'light' | 'dark';
  button_style?: 'default' | 'gradient' | 'outline' | 'solid';
  button_color?: 'primary' | 'success' | 'warning' | 'secondary' | 'danger';
  social_links?: SocialLink[];
  cta_cards?: CTACard[];
  verified_badge?: boolean;
  verified_badge_style?: 'chip' | 'solid';
  show_follower_count?: boolean;
  follower_count?: number;
  show_domain_handle?: boolean;
  profile_display_mode?: 'full' | 'avatar';
  voice_note_url?: string;
}

export interface CreateLinkRequest {
  link_type: 'whitehat' | 'greyhat' | 'blackhat';
  platform: string;
  creator_id?: string;
  domain: string;
  domain_id?: string;
  path: string;
  destination_url: string;
  title?: string;
  description?: string;
  status?: boolean;
}

export interface UpdateLinkRequest {
  creator_id?: string;
  domain?: string;
  domain_id?: string;
  path?: string;
  destination_url?: string;
  title?: string;
  description?: string;
  status?: boolean;
}

export interface CreateCreatorRequest {
  name: string;
  email?: string;
  avatar_url?: string;
  tier?: 'free' | 'pro' | 'premium';
  status?: 'active' | 'inactive';
}

export interface UpdateCreatorRequest {
  name?: string;
  email?: string;
  avatar_url?: string;
  tier?: 'free' | 'pro' | 'premium';
  status?: 'active' | 'inactive';
}

export interface CreateDomainRequest {
  domain: string;
  status?: 'active' | 'pending' | 'expired';
  verified?: boolean;
  ssl_enabled?: boolean;
  registered_date?: string;
  expiry_date?: string;
  registrar?: string;
}

export interface UpdateDomainRequest {
  status?: 'active' | 'pending' | 'expired';
  verified?: boolean;
  ssl_enabled?: boolean;
  expiry_date?: string;
}

export interface TrackEventRequest {
  link_id: string;
  event_type: 'click' | 'view' | 'conversion';
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
  city?: string;
  device_type?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface AnalyticsData {
  total_clicks: number;
  total_views: number;
  total_conversions: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  conversion_rate: number;
  pages_per_session: number;
  events: AnalyticsEvent[];
  chart_data: {
    date: string;
    clicks: number;
    views: number;
    conversions: number;
  }[];
}

export interface DashboardStats {
  total_links: number;
  total_clicks: number;
  active_links: number;
  total_creators: number;
  total_domains: number;
  recent_activity: {
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }[];
}

// Link with related data
export interface LinkWithRelations extends Link {
  creator?: Creator;
  domain_data?: Domain;
  landing_page_settings?: LandingPageSettings;
}

// Creator with stats
export interface CreatorWithStats extends Creator {
  active_links?: number;
  recent_clicks?: number;
}

// Domain with stats
export interface DomainWithStats extends Domain {
  recent_clicks?: number;
}

