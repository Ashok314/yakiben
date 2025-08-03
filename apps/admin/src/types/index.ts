export type UserRole = 'staff' | 'manager' | 'driver';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image: string;
  customizations?: {
    id: string;
    name: string;
    description?: string;
    price: number;
    available: boolean;
  }[];
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  trackingId: string;
  items: {
    item: MenuItem;
    quantity: number;
    customizations: string[];
    subtotal: number;
  }[];
  customerName: string;
  companyName: string;
  companyAddress: string;
  companyContact: string;
  pickupTime: Date;
  notes?: string;
  status: OrderStatus;
  paymentMethod: 'cash' | 'paypay';
  paymentStatus: 'pending' | 'completed';
  needReceipt: boolean;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  deliveryInfo?: {
    driverId?: string;
    assignedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    location?: {
      lat: number;
      lng: number;
    };
  };
}

export interface RestaurantConfig {
  name: string;
  address: {
    postal: string;
    prefecture: string;
    city: string;
    line1: string;
  };
  phone: string;
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
