export type UserRole = 'manager' | 'staff' | 'driver';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for security reasons
  role: UserRole;
}

export interface Order {
  id: string;
  trackingId: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: {
      street: string;
      city: string;
      postalCode: string;
      instructions?: string;
    };
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered';
  createdAt: string;
  deliveryTime: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    instructions?: string;
  };
  paymentMethod: 'cash' | 'card' | 'paypay';
  paymentStatus: 'pending' | 'paid';
  comments?: string;
  driver?: User;
  deliveredAt?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  options?: OrderItemOption[];
}

export interface OrderItemOption {
  name: string;
  choice: string;
  price?: number;
}

export interface Customization {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  outOfStock?: boolean;
  options?: Customization[];
}

export interface RestaurantSettings {
  name: string;
  address: {
    postal: string;
    prefecture: string;
    city: string;
    line1: string;
  };
  phone: string;
  email: string;
  hours: {
    open: number;
    close: number;
    orderDeadline: number;
    minAdvanceTime: number;
    maxAdvanceDays: number;
    businessDays: number[];
  };
  support: {
    phone: string;
    hours: string;
    email: string;
  };
}

export interface Banner {
  id: number;
  text: string;
  url?: string; // Optional redirect URL
  startDate: string;
  endDate: string;
}

export interface OrderSummary {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  cash: number;
  card: number;
  paypay: number;
}
