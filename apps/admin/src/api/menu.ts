import { supabase } from '@yakiben/supabase';
import type { MenuItem } from '../types/types';

export const menuApi = {
    async getMenu(): Promise<MenuItem[]> {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*, category:menu_categories(name), customization_groups(*, options:customization_options(*))');

        if (error) throw error;

        return (data || []).map((item: any) => ({
            id: item.id,
            name: item.name || 'Unknown',
            description: item.description || '',
            price: Number(item.price),
            category: item.category?.name || 'その他',
            imageUrl: item.image_url,
            outOfStock: !item.is_available,
            options: item.customization_groups?.flatMap((g: any) =>
                g.options?.map((o: any) => ({
                    id: o.id,
                    name: o.name,
                    price: o.price_add,
                    available: true
                })) || []
            ) || []
        })) as MenuItem[];
    },

    async updateMenuItem(itemId: string, updates: any): Promise<boolean> {
        // Map UI field names to DB names if needed
        const dbUpdates: any = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.price !== undefined) dbUpdates.price = Number(updates.price);
        if (updates.outOfStock !== undefined) dbUpdates.is_available = !updates.outOfStock;
        if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;

        const { error } = await supabase
            .from('menu_items')
            .update(dbUpdates)
            .eq('id', itemId);

        return !error;
    },

    async getCategories(): Promise<string[]> {
        const { data, error } = await supabase
            .from('menu_categories')
            .select('name')
            .order('sort_order');

        if (error) return [];
        return data.map(c => c.name);
    },

    async getCustomizations(): Promise<any[]> {
        const { data, error } = await supabase
            .from('customization_groups')
            .select('*, options:customization_options(*)');

        if (error) return [];
        return data || [];
    }
};
