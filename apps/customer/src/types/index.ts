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

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type PaymentMethod = 'cash' | 'paypay' | 'line_pay';

export interface Order {
  id: string;
  trackingId: string;
  items: CartItem[];
  customerName: string;
  companyAddress: string;
  companyContact: string;
  delivertTime: Date;
  notes?: string;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
