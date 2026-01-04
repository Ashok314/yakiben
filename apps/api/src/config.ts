const CONFIG = {
  SHEET_ID: '1KOwUmZymm3ghQ52ybRvGQQhZ-RCNmYtYTm_wzyZuB40',

  SHEETS: {
    MENU: 'Menu',
    ORDERS: 'Orders',
    USERS: 'Users',
    SETTINGS: 'Settings',
    CUSTOMIZATIONS: 'Customizations',
    STAFF: 'Staff',
    SESSIONS: 'Sessions'
  },

  // Public endpoints (no auth required)
  PUBLIC_ENDPOINTS: [
    'ping',
    'health',
    'getMenu',
    'getCustomizations',
    'getRestaurantInfo',
    'createOrder',
    'login'
  ],

  // Protected endpoints (auth required)
  PROTECTED_ENDPOINTS: [
    'getOrders',
    'updateOrder',
    'updateMenuItem',
    'getUsers',
    'updateSettings'
  ]
};