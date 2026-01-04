import { callAPI } from '../services/api';
import type { Order, OrderItem } from '../types/types';

// Define types for API responses and customer data
interface ApiCustomer {
    customerName?: string;
    companyContact?: string;
    companyAddress?: string;
    notes?: string;
}

export const ordersApi = {
    async getOrders(): Promise<Order[]> {
        const res = await callAPI<{ id: string; tracking_id: string; customer_json: string | ApiCustomer; items_json: any[]; total: string; status: string; created_at: string; updated_at?: string; delivery_time: string; payment_method: string; payment_status: string; }[]>('getOrders');
        if (res.success && res.data) {
            return res.data.map(item => {
                let customer: ApiCustomer = {};
                try {
                    customer = typeof item.customer_json === 'string' ? JSON.parse(item.customer_json) : item.customer_json;
                } catch (error) {
                    console.error('Failed to parse customer_json:', error);
                }

                let items_parsed: any[] = [];
                try {
                    items_parsed = typeof item.items_json === 'string' ? JSON.parse(item.items_json) : item.items_json;
                } catch (error) {
                    console.error('Failed to parse items_json:', error);
                }

                return {
                    id: item.id,
                    trackingId: item.tracking_id,
                    customer: {
                        name: customer?.customerName || 'Unknown',
                        phone: customer?.companyContact || '',
                        address: {
                            street: customer?.companyAddress || '',
                            city: '',
                            postalCode: '',
                            instructions: customer?.notes || ''
                        }
                    },
                    items: (Array.isArray(items_parsed) ? items_parsed : []).map((i: any) => ({
                        id: i.item?.id || '',
                        name: i.item?.name || 'Unknown',
                        quantity: i.quantity || 0,
                        price: i.item?.price || 0,
                        options: (i.customizations || []).map((c: any) => ({ name: String(c), choice: String(c) }))
                    })),
                    total: Number(item.total || 0),
                    status: item.status as any,
                    createdAt: item.created_at || new Date().toISOString(),
                    updatedAt: item.updated_at || item.created_at || new Date().toISOString(),
                    deliveryTime: item.delivery_time || '',
                    paymentMethod: item.payment_method as any,
                    paymentStatus: item.payment_status as any,
                    comments: customer?.notes || ''
                };
            });
        }
        return [];
    },

    async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
        const token = localStorage.getItem('yakiben-admin-token');
        const res = await callAPI('updateOrder', { orderId, updates: { status, updated_at: new Date().toISOString() }, authToken: token });
        return res.success;
    },

    async assignDriver(orderId: string, driverId: string): Promise<boolean> {
        const token = localStorage.getItem('yakiben-admin-token');
        const res = await callAPI('updateOrder', { orderId, updates: { user_id: driverId, updated_at: new Date().toISOString() }, authToken: token });
        return res.success;
    },

    async unassignDriver(orderId: string): Promise<boolean> {
        const token = localStorage.getItem('yakiben-admin-token');
        const res = await callAPI('updateOrder', { orderId, updates: { user_id: '', updated_at: new Date().toISOString() }, authToken: token });
        return res.success;
    },
    async getOrderSummaries(): Promise<any[]> {
        const orders = await this.getOrders();
        const summaries: Record<string, any> = {};
        orders.forEach(order => {
            const date = (order.createdAt || '').split('T')[0];
            if (!date) return;
            if (!summaries[date]) {
                summaries[date] = { date, totalOrders: 0, totalRevenue: 0, cash: 0, card: 0, paypay: 0 };
            }
            summaries[date].totalOrders += 1;
            summaries[date].totalRevenue += order.total;
            if (order.paymentMethod === 'cash') summaries[date].cash += order.total;
            if (order.paymentMethod === 'card') summaries[date].card += order.total;
            if (order.paymentMethod === 'paypay') summaries[date].paypay += order.total;
        });
        return Object.values(summaries);
    }
};
