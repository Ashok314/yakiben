// General application constants
export const APP_CONSTANTS = {
  APP_NAME: 'やきべん',
  APP_VERSION: '1.0.0',
  BASE_PATH: '/yakiben/customer',
} as const;

// Time-related constants
export const TIME_CONSTANTS = {
  BUSINESS_DAYS: [1, 2, 3, 4, 5] as number[], // Monday to Friday
  MIN_ADVANCE_TIME: 30, // minutes
  MAX_ADVANCE_DAYS: 5,
  HOURS: {
    OPEN: 10,
    CLOSE: 15,
    ORDER_DEADLINE: 15,
  },
} as const;

// Order-related constants
export const ORDER_CONSTANTS = {
  TRACKING_ID_LENGTH: 6,
  TRACKING_ID_CHARS: '23456789ABCDEFGHJKLMNPQRSTUVWXYZ',
  MIN_ORDER_AMOUNT: 500,
  MAX_ITEMS_PER_ORDER: 20,
} as const;

// Image paths
export const IMAGE_PATHS = {
  BASE_PATH: '/assets/menu/',
  PLACEHOLDER: '/assets/menu/placeholder.jpeg',
  LOGO: '/assets/logo.svg',
} as const;

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  BASE_URL: '/api',
  ORDERS: '/api/orders',
  MENU: '/api/menu',
  CUSTOMERS: '/api/customers',
} as const;
