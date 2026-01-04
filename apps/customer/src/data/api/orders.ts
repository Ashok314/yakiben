import { callAPI } from '../../services/api';
import type { Order } from '../../types';
import { STORAGE_KEYS } from '../../constants';

export const ordersApi = {
  // Create a new order
  async createOrder(orderData: Partial<Order>): Promise<any> {
    // Transform data to match backend expectation if needed
    // Backend expects: customer, items, paymentMethod, deliveryTime

    const payload = {
      customer: orderData.customerName || 'Guest',
      companyAddress: orderData.companyAddress,
      companyContact: orderData.companyContact,
      notes: orderData.notes,
      items: orderData.items,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      deliveryTime: orderData.deliveryTime,
      id: orderData.id,
      trackingId: orderData.trackingId
    };

    const token = localStorage.getItem('yakiben-auth-token');

    // Inject auth token if available to link order to user
    const finalPayload = token ? { ...payload, authToken: token } : payload;

    const res = await callAPI('createOrder', finalPayload);

    if (!res.success) {
      throw new Error(res.error || 'Failed to create order');
    }

    // Save to local storage for immediate visibility (handles redirect latency)
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      const orders = saved ? JSON.parse(saved) : [];

      // Update with server IDs if available
      const finalOrder = {
        ...orderData,
        id: res.data?.orderId || orderData.id,
        trackingId: res.data?.trackingId || orderData.trackingId
      };

      // Prevent duplicates in local storage itself (using UUID)
      const existingIndex = orders.findIndex((o: any) => o.id === finalOrder.id);
      if (existingIndex > -1) {
        orders[existingIndex] = finalOrder;
      } else {
        orders.push(finalOrder);
      }

      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save order locally:', e);
    }

    return res.data;
  },

  // Get all orders
  async getOrders(): Promise<Order[]> {
    let localOrders: Order[] = [];

    // 1. Fetch from Local Storage
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) {
        localOrders = JSON.parse(saved).map((o: any) => ({
          ...o,
          deliveryTime: new Date(o.deliveryTime),
          createdAt: new Date(o.createdAt),
          updatedAt: new Date(o.updatedAt),
          total: Number(o.total)
        }));
      }
    } catch (e) {
      console.warn('Failed to load local orders:', e);
    }

    // 2. Fetch from API if logged in
    let apiOrders: Order[] = [];
    const token = localStorage.getItem('yakiben-auth-token');

    if (token) {
      const res = await callAPI<any[]>('getOrders', { authToken: token });

      if (res.success) {
        apiOrders = res.data.map((o: any) => {
          // Robust total calculation if backend returns null
          const calculatedTotal = Array.isArray(o.items)
            ? o.items.reduce((sum: number, item: any) => sum + (item.subtotal || 0), 0)
            : 0;

          return {
            ...o,
            // Ensure trackingId exists (fallback to ID snippet)
            trackingId: o.trackingId || (o.id ? o.id.slice(0, 6).toUpperCase() : 'UNKNOWN'),
            // Ensure dates are valid
            deliveryTime: new Date(o.deliveryTime || o.deliveryTime || o.createdAt),
            createdAt: new Date(o.createdAt),
            updatedAt: new Date(o.updatedAt),
            // Use calculated total if backend total is null/0
            total: o.total ? Number(o.total) : calculatedTotal
          };
        }) as Order[];
      } else {
        console.warn('Failed to fetch API orders:', res.error);
      }
    }

    // 3. Merge Strategies
    // We want to keep all local orders ( guest mode)
    // AND all API orders (logged in mode)
    // AND update local orders with API data if they match (e.g. status updates)

    const orderMap = new Map<string, Order>();

    // Add API orders first (Authority)
    // Use 'id' (UUID) as the key for reliable mapping
    apiOrders.forEach(o => orderMap.set(o.id, o));

    // Add local orders ONLY if not already present
    localOrders.forEach(o => {
      if (!orderMap.has(o.id)) {
        orderMap.set(o.id, o);
      }
    });

    // Update local storage with latest merged data (sync back)
    // We normalize to the map values which are de-duplicated by UUID
    try {
      const mergedOrders = Array.from(orderMap.values());
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mergedOrders));
    } catch (e) {
      console.warn('Failed to sync merged orders to local:', e);
    }

    return Array.from(orderMap.values());
  },

  // Get order by tracking ID
  async getOrderByTrackingId(trackingId: string): Promise<Order | null> {
    // Backend technically supports filtering by trackingId in getOrders
    // But let's reuse getOrders for now or implement specific endpoint if optimized
    const orders = await this.getOrders();
    return orders.find(o => o.trackingId === trackingId) || null;
  },

  // Update an order (staff/manager role usually required)
  async updateOrder(updatedOrder: Order): Promise<Order> {
    // Customer app usually doesn't update orders directly except maybe cancelling
    console.warn('updateOrder not implemented for customer app');
    return updatedOrder;
  },

  // Get most recent pending order
  async getMostRecentPendingOrder(): Promise<Order | null> {
    const orders = await this.getOrders();
    // Filter for current user if backend doesn't? 
    // Currently backend returns all, which is a leak, but we can't fix backend logic easily right now.
    // We assume backend might later filter.

    return orders
      .filter(order => !['completed', 'cancelled'].includes(order.status))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
  }
};
