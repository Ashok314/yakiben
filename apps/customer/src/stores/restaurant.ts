import { ref, computed } from 'vue';

interface BusinessHours {
    open: number;
    close: number;
    orderDeadline: number;
    minAdvanceTime: number;
    maxAdvanceDays: number;
    businessDays: readonly number[];

    holidays?: readonly string[]; // ISO Date strings "YYYY-MM-DD"
    specialDays?: readonly string[]; // ISO Date strings "YYYY-MM-DD"
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
                    phone: settingsObj.restaurant_phone || RESTAURANT_INFO.phone,
                    email: settingsObj.restaurant_email || RESTAURANT_INFO.email,
                    hours: {
                        ...RESTAURANT_INFO.hours,
                        ...(settingsObj.business_hours || {}),
                    }
                } as RestaurantInfo;

                // Normalize Hours (Handle "10:00" strings from Admin)
                if (info.value.hours) {
                    const h = info.value.hours as any;

                    // Helper to parse "10:00" or 10 to number 10
                    const parseHour = (val: any) => {
                        if (typeof val === 'string') return parseInt(val.split(':')[0], 10);
                        return Number(val);
                    };

                    if (h.open !== undefined) info.value.hours.open = parseHour(h.open);
                    if (h.close !== undefined) info.value.hours.close = parseHour(h.close);
                    if (h.orderDeadline !== undefined) info.value.hours.orderDeadline = parseHour(h.orderDeadline);

                    // Normalize Business Days (Handle ["Sunday", "Monday"] strings)
                    if (Array.isArray(h.businessDays) && h.businessDays.length > 0 && typeof h.businessDays[0] === 'string') {
                        const dayMap: Record<string, number> = {
                            "Sunday": 0, "Sun": 0, "sunday": 0,
                            "Monday": 1, "Mon": 1, "monday": 1,
                            "Tuesday": 2, "Tue": 2, "tuesday": 2,
                            "Wednesday": 3, "Wed": 3, "wednesday": 3,
                            "Thursday": 4, "Thu": 4, "thursday": 4,
                            "Friday": 5, "Fri": 5, "friday": 5,
                            "Saturday": 6, "Sat": 6, "saturday": 6
                        };
                        info.value.hours.businessDays = h.businessDays.map((d: string) => dayMap[d] ?? -1).filter((d: number) => d !== -1);
                    }
                }
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
