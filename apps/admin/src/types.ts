export type UserRole = 'manager' | 'staff' | 'driver';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Order {
  id: string;
  trackingId: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
  pickupTime?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    instructions?: string;
  };
  paymentMethod: 'cash' | 'card' | 'online';
  paymentStatus: 'pending' | 'paid';
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

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  options?: MenuItemOption[];
}

export interface MenuItemOption {
  name: string;
  required: boolean;
  choices: {
    name: string;
    price?: number;
  }[];
}

export interface RestaurantSettings {
  name: string;
  description: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  openingHours: {
    day: string;
    open: string;
    close: string;
  }[];
  announcement?: string;
  orderingEnabled: boolean;
  minimumOrderAmount?: number;
  deliveryFee?: number;
  estimatedDeliveryTime?: number;
  estimatedPickupTime?: number;
}
