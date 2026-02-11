import { supabase } from './client';
import type { Database } from './types';
type OrderRow = Database['public']['Tables']['orders']['Row'];

// Create a new order
export async function createOrder(
  order: Database['public']['Tables']['orders']['Insert']
): Promise<OrderRow[]> {
  const { data, error } = await supabase.from('orders').insert([order]);
  if (error) throw error;
  return data ?? [];
}

// Get all orders for a user
export async function getOrders(userId: string): Promise<OrderRow[]> {
  const { data, error } = await supabase.from('orders').select('*').eq('user_id', userId);
  if (error) throw error;
  return data ?? [];
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string): Promise<OrderRow[]> {
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', orderId);
  if (error) throw error;
  return data ?? [];
}

// Get most recent pending order
export async function getMostRecentPendingOrder(): Promise<OrderRow | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  return data?.[0] || null;
}
