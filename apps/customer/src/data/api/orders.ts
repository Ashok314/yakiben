import { supabase } from '@yakiben/supabase';
import type { Order } from '../../types';
import { STORAGE_KEYS } from '../../constants';

export const ordersApi = {
  // Create a new order
  async createOrder(orderData: Partial<Order>): Promise<any> {
    const { data: { session } } = await supabase.auth.getSession();

    console.log('Creating order with payload:', orderData);
    // Call the Edge Function via the Supabase client
    const { data, error } = await supabase.functions.invoke('create-order', {
      body: { orderData }
    });

    if (error) {
      console.error('Edge Function Error:', error);
      throw new Error(error.message || 'Failed to create order');
    }

    // Save to local storage for immediate visibility (handles redirect latency)
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      const orders = saved ? JSON.parse(saved) : [];

      const finalOrder = {
        ...orderData,
        id: data.orderId || orderData.id,
        trackingId: data.trackingId || orderData.trackingId
      };

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

    return data;
  },

  // Get all orders
  async getOrders(): Promise<Order[]> {
    let orders: Order[] = [];

    // 1. Load from Cache (Fast Initial Paint)
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) {
        orders = JSON.parse(saved);
        // Basic sanity check
        if (!Array.isArray(orders)) orders = [];
      }
    } catch (e) {
      console.warn('Failed to load local orders:', e);
    }

    // 2. Fetch Fresh Data from Supabase (Source of Truth)
    const { data: apiData, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, menu_item:menu_items(*))')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Failed to fetch API orders:', error);
      // Fallback: Return cached orders if API fails
      return orders;
    }

    if (apiData) {
      // Map API data to Order interface
      const freshOrders = apiData.map((o: any) => {
        const items = (o.items || []).map((i: any) => ({
          item: {
            id: i.menu_item?.id || 'unknown',
            name: i.menu_item?.name || 'Unknown Item',
            price: Number(i.price_at_order),
            description: i.menu_item?.description || '', // Added default
            category: i.menu_item?.category || '',
            image: i.menu_item?.image || '',
            available: true
          },
          quantity: Number(i.quantity),
          subtotal: Number(i.line_total || (i.quantity * i.price_at_order)),
          customizations: []
        }));

        const calculatedTotal = items.reduce((sum: number, item: any) => sum + (item.subtotal || 0), 0);

        return {
          id: o.id,
          trackingId: o.tracking_id,
          items: items,
          total: o.total ? Number(o.total) : calculatedTotal,
          status: o.status,
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          deliveryTime: o.delivery_datetime,
          createdAt: o.created_at,
          updatedAt: o.updated_at,
          customer: {
            name: 'Me', // RLS restricted
            phone: '', // Could fetch profile if needed
            address: {
              street: '',
              city: '',
              postalCode: ''
            }
          }
        } as Order;
      });

      // 3. Update Cache & Return Fresh Data
      // Supabase is the Truth. We overwrite local storage completely.
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(freshOrders));
      return freshOrders;
    }

    return orders;
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
