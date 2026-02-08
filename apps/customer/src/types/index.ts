export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  customizations?: Customization[];
  available: boolean;
}

export interface Customization {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  customizations: string[];
  subtotal: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed';
export type PaymentMethod = 'cash' | 'card' | 'paypay';

export interface Order {
  id: string;
  trackingId: string;
  items: CartItem[];
  customer: {
    name: string;
    phone: string;
    company?: string;
    postalCode?: string; // Add explicit postalCode
    address: string | {
      street: string;
      city: string;
      postalCode: string;
      prefecture?: string;
      instructions?: string;
    };
  };
  deliveryTime?: string;
  notes?: string;
  needReceipt?: boolean;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
}
