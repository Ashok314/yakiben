import { callAPI } from '../services/api';

// Define types for API responses and customer data
interface Customer {
    customerName?: string;
    companyContact?: string;
    companyAddress?: string;
    notes?: string;
}

interface Item {
    item: { name: string; price: number; description?: string }; // Replace `any` with a more specific structure
    quantity: number;
    subtotal: number;
}

interface Order {
    id: string;
    trackingId: string;
    customer: {
        name: string;
        phone: string;
        address: {
            street: string;
            city: string;
            postalCode: string;
        };
    };
    items: Item[];
    total: number;
    status: string;
    createdAt: string;
    deliveryTime: string;
    paymentMethod: string;
    paymentStatus: string;
    comments: string;
}

export const ordersApi = {
    async getOrders(): Promise<Order[]> {
        const res = await callAPI<{ id: string; tracking_id: string; customer_json: string | Customer; items_json: { item: { name: string; price: number; description?: string }; quantity: number; subtotal: number; }[]; total: string; status: string; created_at: string; delivery_time: string; payment_method: string; payment_status: string; }[]>('getOrders');
        if (res.success && res.data) {
            return res.data.map(item => {
                let customer: Customer = {};
                try {
                    customer = typeof item.customer_json === 'string' ? JSON.parse(item.customer_json) : item.customer_json;
                } catch (error) {
                    console.error('Failed to parse customer_json:', error);
                }

                return {
                    id: item.id,
                    trackingId: item.tracking_id,
                    customer: {
                        name: customer.customerName || 'Unknown',
                        phone: customer.companyContact || '',
                        address: {
                            street: customer.companyAddress || '',
                            city: '',
                            postalCode: '',
                        }
                    },
                    items: item.items_json.map((i) => ({
                        item: i.item,
                        quantity: i.quantity || 0,
                        subtotal: i.subtotal || 0
                    })),
                    total: Number(item.total || 0),
                    status: item.status,
                    createdAt: item.created_at,
                    deliveryTime: item.delivery_time,
                    paymentMethod: item.payment_method,
                    paymentStatus: item.payment_status,
                    comments: customer.notes || ''
                };
            }) as Order[];
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
    }
};
