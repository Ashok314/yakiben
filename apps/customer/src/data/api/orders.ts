import { STORAGE_KEYS } from '../../constants';
import type { Order, OrderStatus, PaymentMethod, PaymentStatus } from '../../types';

// Mock database data
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    trackingId: '9J8E7M',
    customerName: '山田 太郎',
    companyAddress: '〒100-0005 東京都千代田区丸の内1-1-1',
    companyContact: '0312345678',
    items: [
      {
        item: {
          id: '1',
          name: '唐揚げ弁当',
          description: '揚げたての唐揚げ、季節の野菜添え',
          price: 850,
          category: '弁当',
          image: '/assets/menu/placeholder.jpeg',
          available: true,
          customizations: [
            { id: '1-1', name: '大盛り', price: 100, available: true },
            { id: '1-2', name: 'ご飯少なめ', price: 0, available: true },
            { id: '1-3', name: '唐揚げ増量', price: 200, available: true }
          ]
        },
        quantity: 2,
        customizations: ['1-1'],
        subtotal: 1900
      }
    ],
    total: 1900,
    status: 'pending' as OrderStatus,
    paymentMethod: 'cash' as PaymentMethod,
    paymentStatus: 'completed' as PaymentStatus,
    pickupTime: new Date('2025-07-02T12:30:00'),
    notes: 'できるだけ早めに準備をお願いします。',
    createdAt: new Date('2025-07-02T10:00:00'),
    updatedAt: new Date('2025-07-02T10:00:00')
  },
  {
    id: '2',
    trackingId: 'X5Y4W3',
    customerName: '鈴木 花子',
    companyAddress: '〒100-0004 東京都千代田区大手町2-2-2',
    companyContact: '0309876543',
    items: [
      {
        item: {
          id: '5',
          name: 'カレーライス',
          description: '濃厚なカレールーと特製スパイス',
          price: 800,
          category: 'カレー',
          image: '/assets/menu/placeholder.jpeg',
          available: true,
          customizations: [
            { id: '5-1', name: '大盛り', price: 100, available: true },
            { id: '5-2', name: '辛さ増し', price: 50, available: true },
            { id: '5-3', name: '温泉卵トッピング', price: 80, available: true }
          ]
        },
        quantity: 1,
        customizations: ['5-2'],
        subtotal: 850
      }
    ],
    total: 850,
    status: 'completed' as OrderStatus,
    paymentMethod: 'paypay' as PaymentMethod,
    paymentStatus: 'completed' as PaymentStatus,
    pickupTime: new Date('2025-07-02T13:00:00'),
    notes: '',
    createdAt: new Date('2025-07-02T09:30:00'),
    updatedAt: new Date('2025-07-02T09:30:00')
  }
];

// Mock API service for orders
export const ordersApi = {
  // Create a new order
  async createOrder(order: Order): Promise<Order> {
    const orders = await this.getOrders();
    orders.push(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return order;
  },

  // Get all orders
  async getOrders(): Promise<Order[]> {
    console.log('Getting all orders...');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Always start with mock data
    const allOrders = [...MOCK_ORDERS];
    console.log('Mock orders:', allOrders);
    
    // Add orders from localStorage that don't conflict with mock data
    try {
      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) {
        const localOrders: Order[] = JSON.parse(savedOrders);
        console.log('Local orders:', localOrders);
        
        // Only include local orders that aren't in mock data
        const additionalOrders = localOrders.filter(
          (local: Order) => !MOCK_ORDERS.some(mock => mock.trackingId === local.trackingId)
        );
        console.log('Additional orders to add:', additionalOrders);
        
        allOrders.push(...additionalOrders);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    
    console.log('Final orders list:', allOrders);
    return allOrders;
  },

  // Get order by tracking ID
  async getOrderByTrackingId(trackingId: string): Promise<Order | null> {
    console.log('Looking for order with tracking ID:', trackingId);
    
    if (!trackingId) {
      console.log('No tracking ID provided');
      return null;
    }
    
    const normalizedId = trackingId.toUpperCase();
    console.log('Normalized tracking ID:', normalizedId);
    
    // First check mock data directly for better performance
    const mockOrder = MOCK_ORDERS.find(
      o => o.trackingId.toUpperCase() === normalizedId
    );
    
    if (mockOrder) {
      console.log('Found in mock data:', mockOrder);
      return mockOrder;
    }
    
    // If not in mock data, check all orders including localStorage
    const orders = await this.getOrders();
    const order = orders.find(
      o => o.trackingId.toUpperCase() === normalizedId
    );
    
    console.log('Search result:', order || 'Not found');
    return order || null;
  },

  // Update an order
  async updateOrder(updatedOrder: Order): Promise<Order> {
    const orders = await this.getOrders();
    const index = orders.findIndex(o => o.id === updatedOrder.id);
    if (index === -1) {
      throw new Error('Order not found');
    }
    orders[index] = {
      ...updatedOrder,
      updatedAt: new Date()
    };
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return orders[index];
  },

  // Get most recent pending order
  async getMostRecentPendingOrder(): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders
      .filter(order => order.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
  }
};
