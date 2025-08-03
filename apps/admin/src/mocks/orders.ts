import type { Order } from '../types/types';

// Mock data for orders
export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    trackingId: 'ORD123',
    customer: { name: 'John Doe', phone: '123-456-7890' },
    status: 'preparing',
    total: 45.99,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    createdAt: '2025-07-01T10:00:00Z',
    items: [
      { id: '1', name: 'Chicken Teriyaki', quantity: 2, price: 12.99 },
      { id: '2', name: 'Miso Soup', quantity: 1, price: 4.99 },
    ],
  },
  {
    id: '2',
    trackingId: 'ORD124',
    customer: { name: 'Jane Smith', phone: '987-654-3210' },
    status: 'ready',
    total: 89.99,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    createdAt: '2025-07-02T12:00:00Z',
    items: [
      { id: '3', name: 'Sushi Platter', quantity: 1, price: 50.0 },
      { id: '4', name: 'Green Tea', quantity: 2, price: 5.0 },
    ],
  },
  {
    id: '3',
    trackingId: 'ORD125',
    customer: { name: 'Alice Johnson', phone: '555-555-5555' },
    status: 'delivered',
    total: 120.5,
    paymentMethod: 'online',
    paymentStatus: 'paid',
    createdAt: '2025-07-03T15:00:00Z',
    items: [
      { id: '5', name: 'Ramen', quantity: 3, price: 15.0 },
      { id: '6', name: 'Tempura', quantity: 2, price: 20.0 },
    ],
  },
  {
    id: '4',
    trackingId: 'ORD126',
    customer: { name: 'Bob Williams', phone: '111-222-3333' },
    status: 'pending',
    total: 60.0,
    paymentMethod: 'card',
    paymentStatus: 'pending',
    createdAt: '2025-07-04T09:00:00Z',
    items: [
      { id: '7', name: 'Udon Noodles', quantity: 1, price: 10.0 },
      { id: '8', name: 'Spring Rolls', quantity: 3, price: 15.0 },
    ],
  },
];

// Mock API service for orders
export const ordersApi = {
  async getOrders(): Promise<Order[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_ORDERS;
  },
};
