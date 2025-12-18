const CONFIG = {
  SHEET_ID: '1KOwUmZymm3ghQ52ybRvGQQhZ-RCNmYtYTm_wzyZuB40',

  SHEETS: {
    MENU: 'Menu',
    ORDERS: 'Orders',
    USERS: 'Users',
    SETTINGS: 'Settings',
    CUSTOMIZATIONS: 'Customizations',
    SESSIONS: 'Sessions'
  },

  // Public endpoints (no auth required)
  PUBLIC_ENDPOINTS: [
    'health',
    'getMenu',
    'getCustomizations',
    'getRestaurantInfo'
  ],

  // Protected endpoints (auth required)
  PROTECTED_ENDPOINTS: [
    'createOrder',
    'getOrders',
    'updateOrder',
    'updateMenuItem',
    'getUsers',
    'updateSettings'
  ]
};