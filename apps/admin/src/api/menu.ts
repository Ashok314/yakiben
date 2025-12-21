import { callAPI } from '../services/api';
import type { MenuItem } from '../types/types';

export const menuApi = {
    async getMenu(): Promise<MenuItem[]> {
        const res = await callAPI<any[]>('getMenu');
        if (res.success && res.data) {
            return res.data.map(item => ({
                id: item.id,
                name: item.name,
                description: item.description,
                price: Number(item.price),
                category: item.category,
                imageUrl: item.image,
                outOfStock: item.available === false || item.available === 'FALSE',
                options: item.customizations || []
            })) as MenuItem[];
        }
        return [];
    },

    async updateMenuItem(itemId: string, updates: any): Promise<boolean> {
        const res = await callAPI('updateMenuItem', { itemId, updates });
        return res.success;
    },

    async getCategories(): Promise<string[]> {
        const items = await this.getMenu();
        return Array.from(new Set(items.map(i => i.category)));
    },

    async getCustomizations(): Promise<any[]> {
        const res = await callAPI<any[]>('getCustomizations');
        if (res.success && res.data) {
            return res.data;
        }
        return [];
    }
};
