/**
 * Application-wide constants
 */

// Media paths
export const MEDIA_PATHS = {
  HERO_VIDEO: '/videos/Video_Generation_Request_For_Website.mp4',
  LOGO: '/logo.svg',
  SAMPLE_AUDIO_1: '/sample-1.mp3',
  SAMPLE_AUDIO_2: '/sample-2.mp3',
} as const;

// API endpoints (relative)
export const API_ROUTES = {
  AUTH: '/api/auth',
  CHAPTERS: '/api/chapters',
  PLAN: '/api/plan',
  PLAYLISTS: '/api/playlists',
  TRACKS: '/api/tracks',
  CHECKOUT: '/api/checkout',
  WEBHOOKS_STRIPE: '/api/webhooks/stripe',
} as const;

// App routes
export const APP_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  LIBRARY: '/library',
  SEARCH: '/search',
  CATEGORIES: '/categories',
  CREATORS: '/creators',
  HELP: '/help',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  DOWNLOADS: '/downloads',
  RECENTLY_PLAYED: '/recently-played',
  HISTORY: '/history',
  LIKED: '/liked',
  PRICING: '/pricing',
  SUCCESS: '/success',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_LIMIT: 12,
  TRENDING_LIMIT: 12,
  CATEGORY_LIMIT: 12,
} as const;

// Categories
export const CATEGORIES = {
  FICTION: 'fiction',
  NON_FICTION: 'non-fiction',
  ROMANCE: 'romance',
  MYSTERY: 'mystery',
  BIOGRAPHY: 'biography',
  SELF_HELP: 'self-help',
} as const;

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PREMIUM: 'premium',
} as const;

// Features by Plan
export const PLAN_FEATURES = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      '5 audiobooks per month',
      'Standard audio quality (128kbps)',
      'Ads between chapters',
      'Basic support',
    ],
    limitations: {
      maxBooksPerMonth: 5,
      audioQuality: '128kbps',
      hasAds: true,
      offlineDownloads: false,
    },
  },
  premium: {
    name: 'Premium',
    price: 9.99,
    features: [
      'Unlimited audiobooks',
      'HD audio quality (320kbps)',
      'Ad-free experience',
      'Offline downloads',
      'Early access to new releases',
      'Exclusive content',
      'Priority support',
      'Cancel anytime',
    ],
    limitations: {
      maxBooksPerMonth: Infinity,
      audioQuality: '320kbps',
      hasAds: false,
      offlineDownloads: true,
    },
  },
} as const;

// Stripe Price IDs (set these after creating products in Stripe)
export const STRIPE_PRICE_IDS = {
  MONTHLY: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || '',
  YEARLY: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || '',
} as const;