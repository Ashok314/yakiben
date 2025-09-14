import type { Order, UserRole } from '../types/types';

// Mock data for orders
export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    trackingId: 'ORD123',
    customer: {
      name: 'John Doe',
      phone: '123-456-7890',
      address: {
        street: '123 Elm St',
        city: 'Springfield',
        postalCode: '12345',
        instructions: 'Leave at the front door',
      },
    },
    status: 'delivering',
    total: 45.99,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    createdAt: '2025-09-14T10:00:00Z',
    items: [
      { id: '1', name: 'Chicken Teriyaki', quantity: 2, price: 12.99 },
      { id: '2', name: 'Miso Soup', quantity: 1, price: 4.99 },
    ],
    deliveryTime: '2025-09-14T12:00:00Z',
    deliveredAt: '2025-07-02T12:30:00Z',
    comments: 'Please be quick!',
  },
  {
    id: '2',
    trackingId: 'ORD124',
    customer: {
      name: 'Jane Smith',
      phone: '987-654-3210',
      address: {
        street: '456 Oak St',
        city: 'Springfield',
        postalCode: '12345',
        instructions: 'Ring the bell',
      },
    },
    status: 'pending',
    total: 89.99,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    createdAt: '2025-07-02T12:00:00Z',
    items: [
      { id: '3', name: 'Chicken Teriyaki', quantity: 1, price: 50.0 },
      { id: '4', name: 'Green Tea', quantity: 2, price: 5.0 },
    ],
    deliveryTime: '2025-09-14T14:00:00Z',
    comments: 'Please be quick!',
  },
  {
    id: '3',
    trackingId: 'ORD125',
    customer: {
      name: 'Alice Johnson',
      phone: '555-555-5555',
      address: {
        street: '789 Maple St',
        city: 'Springfield',
        postalCode: '12345',
        instructions: 'Leave at the back door',
      },
    },
    status: 'delivered',
    total: 120.5,
    paymentMethod: 'paypay',
    paymentStatus: 'paid',
    createdAt: '2025-07-03T15:00:00Z',
    items: [
      { id: '5', name: 'Ramen', quantity: 3, price: 15.0 },
      { id: '6', name: 'Tempura', quantity: 2, price: 20.0 },
    ],
    driver: { id: "1", name: 'Mike Brown', role: 'driver', email: 'mike.brown@example.com' },
    deliveredAt: '2025-07-03T16:00:00Z',
    deliveryTime: '2025-07-03T16:00:00Z',
  },
  {
    id: '4',
    trackingId: 'ORD126',
    customer: {
      name: 'Bob Williams',
      phone: '111-222-3333',
      address: {
        street: '321 Birch St',
        city: 'Springfield',
        postalCode: '12345',
        instructions: 'Call upon arrival',
      },
    },
    status: 'delivered',
    total: 60.0,
    paymentMethod: 'card',
    paymentStatus: 'pending',
    createdAt: '2025-07-04T09:00:00Z',
    items: [
      { id: '7', name: 'Udon Noodles', quantity: 1, price: 10.0 },
      { id: '8', name: 'Spring Rolls', quantity: 3, price: 15.0 },
    ],
    deliveryTime: '2025-07-02T12:30:00Z',
    deliveredAt: '2025-07-02T14:00:00Z',
    driver: { id: "1", name: 'Mike Brown', role: 'driver', email: 'mike.brown@example.com' },
  },
  {
    id: '5',
    trackingId: 'ORD127',
    customer: {
      name: 'Charlie Brown',
      phone: '333-444-5555',
      address: {
        street: '101 Pine St',
        city: 'Springfield',
        postalCode: '12345',
        instructions: 'Leave with neighbor if not home',
      },
    },
    status: 'ready',
    total: 75.0,
    paymentMethod: 'paypay',
    paymentStatus: 'paid',
    createdAt: '2025-07-05T10:00:00Z',
    items: [
      { id: '9', name: 'Sashimi', quantity: 2, price: 25.0 },
      { id: '10', name: 'Edamame', quantity: 1, price: 5.0 },
    ],
    driver: { id: "2", name: 'Driver B', role: 'driver', email: 'driver.b@example.com' },
    deliveredAt: '2025-07-05T11:00:00Z',
    deliveryTime: '2025-07-05T11:00:00Z',
  },
];

// Mock API service for orders
export const ordersApi = {
  async getOrders(): Promise<Order[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_ORDERS;
  },
  async assignDriver(orderId: string, driverId: string): Promise<void> {
    console.log(`Driver ${driverId} assigned to order ${orderId}`);
    // Mock implementation
  },
  async unassignDriver(orderId: string): Promise<void> {
    console.log(`Driver unassigned from order ${orderId}`);
    // Mock implementation
  },
  async getOrderSummaries() {
    const orders = await this.getOrders();
    const summaries = orders.reduce((acc: Record<string, { totalOrders: number; totalRevenue: number; cash: number; card: number; paypay: number }>, order) => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { totalOrders: 0, totalRevenue: 0, cash: 0, card: 0, paypay: 0 };
      }
      acc[date].totalOrders += 1;
      acc[date].totalRevenue += order.total;
      acc[date][order.paymentMethod] += order.total; // Increment based on payment method
      return acc;
    }, {});

    return Object.entries(summaries).map(([date, { totalOrders, totalRevenue, cash, card, paypay }]: [string, { totalOrders: number; totalRevenue: number; cash: number; card: number; paypay: number }]) => ({
      date,
      totalOrders,
      totalRevenue,
      cash,
      card,
      paypay,
    }));
  },
};

// Mock data for the current user
export const CURRENT_USER = {
  id: '3',
  name: 'Driver User',
  email: 'driver@yakiben.com',
  role: 'driver' as UserRole,
};

// Assign current user to orders
MOCK_ORDERS[1].driver = CURRENT_USER; // Ready
MOCK_ORDERS[0].driver = CURRENT_USER; // Delivering
MOCK_ORDERS[2].driver = CURRENT_USER; // Delivered
MOCK_ORDERS[3].driver = CURRENT_USER; // Delivered
