export const STORAGE_KEYS = {
  CART_ITEMS: 'yakiben_cart_items',
  CUSTOMER_INFO: 'yakiben_customer_info',
  ORDERS: 'yakiben_orders',
  REORDER_PICKUP_TIME: 'yakiben_reorder_pickup_time',
  CURRENT_ORDER: 'yakiben_current_order',
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;
