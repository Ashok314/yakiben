import { supabase } from '@yakiben/supabase';
import type { Order, OrderItem } from '../types/types';

export const ordersApi = {
    async getOrders(): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                profile:profiles(f_name, l_name, tel, address, postcode),
                items:order_items(
                    *,
                    menu_item:menu_items(name, price),
                    customizations:order_item_customizations(
                        option:customization_options(name, price_add)
                    )
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((order: any) => ({
            id: order.id,
            trackingId: order.tracking_id || order.id.slice(0, 8),
            customer: {
                name: `${order.profile?.f_name || ''} ${order.profile?.l_name || ''}`.trim() || 'Unknown',
                phone: order.profile?.tel || '',
                address: {
                    street: order.profile?.address || '',
                    city: '',
                    postalCode: order.profile?.postcode || '',
                    instructions: order.notes || ''
                }
            },
            items: (order.items || []).map((i: any) => ({
                id: i.menu_item_id,
                name: i.menu_item?.name || 'Unknown',
                quantity: i.quantity,
                price: i.price_at_order,
                options: (i.customizations || []).map((c: any) => ({
                    name: c.option?.name || '',
                    choice: c.option?.name || '',
                    price: c.option?.price_add || 0
                }))
            })),
            total: Number(order.total),
            status: order.status as any,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
            deliveryTime: order.delivery_datetime,
            paymentMethod: order.payment_method as any,
            paymentStatus: order.payment_status as any,
            comments: order.notes
        }));
    },

    async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
        const { error } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', orderId);
        return !error;
    },

    async assignDriver(orderId: string, driverId: string): Promise<boolean> {
        const { error } = await supabase
            .from('orders')
            .update({ user_id: driverId, updated_at: new Date().toISOString() })
            .eq('id', orderId);
        return !error;
    },

    async unassignDriver(orderId: string): Promise<boolean> {
        // This might need careful handling if user_id is NOT NULL
        const { error } = await supabase
            .from('orders')
            .update({ user_id: null, updated_at: new Date().toISOString() })
            .eq('id', orderId);
        return !error;
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
