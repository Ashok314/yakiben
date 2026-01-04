import { callAPI } from '../services/api';

export const settingsApi = {
    async getRestaurantInfo(): Promise<any> {
        const res = await callAPI('getRestaurantInfo');
        if (res.success && res.data) {
            return res.data;
        }
        return null;
    },

    async updateSettings(key: string, value: any): Promise<boolean> {
        const res = await callAPI('updateSettings', { key, value });
        return res.success;
    }
};
