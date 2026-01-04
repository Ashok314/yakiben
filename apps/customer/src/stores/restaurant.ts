import { ref, computed } from 'vue';
import { callAPI } from '../services/api';

interface BusinessHours {
    open: number;
    close: number;
    orderDeadline: number;
    minAdvanceTime: number;
    maxAdvanceDays: number;
    businessDays: readonly number[];
}

interface RestaurantInfo {
    name: string;
    address: {
        postal: string;
        prefecture: string;
        city: string;
        line1: string;
    };
    phone: string;
    email: string;
    hours: BusinessHours;
    support: {
        phone: string;
        hours: string;
        email: string;
    };
}

import { RESTAURANT_INFO } from '../config/restaurant';

const info = ref<RestaurantInfo>(RESTAURANT_INFO);
const isLoading = ref(false);
const error = ref<string | null>(null);

const isFetched = ref(false);

export const useRestaurantStore = () => {
    async function fetchInfo() {
        if (isFetched.value || isLoading.value) return;

        isLoading.value = true;
        try {
            const res = await callAPI<RestaurantInfo>('getRestaurantInfo');
            if (res.success && res.data) {
                // Merge with fallback to ensure no missing fields break the UI
                info.value = {
                    ...RESTAURANT_INFO,
                    ...res.data,
                    address: { ...RESTAURANT_INFO.address, ...(res.data.address || {}) },
                    hours: { ...RESTAURANT_INFO.hours, ...(res.data.hours || {}) },
                    support: { ...RESTAURANT_INFO.support, ...(res.data.support || {}) }
                } as RestaurantInfo;
                isFetched.value = true;
            } else {
                error.value = res.error || 'Failed to fetch restaurant info';
            }
        } catch (e) {
            error.value = String(e);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        info: computed(() => info.value),
        isLoading: computed(() => isLoading.value),
        error: computed(() => error.value),
        fetchInfo
    };
};
