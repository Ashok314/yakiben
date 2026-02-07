import { ref, computed } from 'vue';

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

import { supabase } from '@yakiben/supabase';
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
            const { data, error: sbError } = await supabase
                .from('settings')
                .select('*');

            if (sbError) throw sbError;

            if (data) {
                // Convert settings array to object
                const settingsObj: any = {};
                data.forEach((s: any) => settingsObj[s.key] = s.value);

                info.value = {
                    ...RESTAURANT_INFO,
                    ...settingsObj,
                    address: { ...RESTAURANT_INFO.address, ...(settingsObj.restaurant_address || {}) },
                    hours: { ...RESTAURANT_INFO.hours, ...(settingsObj.business_hours || {}) },
                    support: { ...RESTAURANT_INFO.support, ...(settingsObj.support_info || {}) }
                } as RestaurantInfo;
                isFetched.value = true;
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
