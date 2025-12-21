import { callAPI } from '../services/api';
import type { Order } from '../types/types';

export const ordersApi = {
    async getOrders(): Promise<Order[]> {
        const res = await callAPI<any[]>('getOrders');
        if (res.success && res.data) {
            return res.data.map(item => ({
                id: item.id,
                trackingId: item.tracking_id,
                customer: {
                    name: item.customer_json?.customerName || 'Unknown',
                    phone: item.customer_json?.companyContact || '',
                    address: {
                        street: item.customer_json?.companyAddress || '',
                        city: '',
                        postalCode: '',
                    }
                },
                items: item.items_json || [],
                total: Number(item.total || 0),
                status: item.status,
                createdAt: item.created_at,
                deliveryTime: item.delivery_time,
                paymentMethod: item.payment_method,
                paymentStatus: item.payment_status,
                comments: item.customer_json?.notes || ''
            })) as Order[];
        }
        return [];
    },

    async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
        const res = await callAPI('updateOrder', { orderId, updates: { status, updated_at: new Date().toISOString() } });
        return res.success;
    },

    async assignDriver(orderId: string, driverId: string): Promise<boolean> {
        const res = await callAPI('updateOrder', { orderId, updates: { user_id: driverId, updated_at: new Date().toISOString() } });
        return res.success;
    },

    async unassignDriver(orderId: string): Promise<boolean> {
        const res = await callAPI('updateOrder', { orderId, updates: { user_id: '', updated_at: new Date().toISOString() } });
        return res.success;
    }
};
