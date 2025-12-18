/**
 * User Schema
 */
interface User {
  id: string;
  name: string;
  email?: string;
  role: 'guest' | 'customer' | 'staff' | 'manager' | 'driver';
  isLoggedIn: boolean;
}

/**
 * Menu Item Schema
 */
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  customizations?: Customization[];
  available: boolean;
}

interface Customization {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

/**
 * Order Schema
 */
interface Order {
  id: string;
  trackingId: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'paypay';
  paymentStatus: 'pending' | 'completed';
  deliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  name: string;
  phone: string;
  address: Address;
}

interface Address {
  street: string;
  city: string;
  postalCode: string;
  instructions?: string;
}

interface OrderItem {
  item: MenuItem;
  quantity: number;
  customizations?: string[];
  subtotal: number;
}

/**
 * Restaurant Info Schema
 */
interface RestaurantInfo {
  name: string;
  address: {
    postal: string;
    prefecture: string;
    city: string;
    line1: string;
  };
  phone: string;
  email: string;
  hours: BusinessHours;
  support: {
    phone: string;
    hours: string;
    email: string;
  };
}

interface BusinessHours {
  open: number;
  close: number;
  orderDeadline: number;
  minAdvanceTime: number;
  maxAdvanceDays: number;
  businessDays: number[];
}

/**
 * API Response Types
 */
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  headers?: Record<string, string>;
}