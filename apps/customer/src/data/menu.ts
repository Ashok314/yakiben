import { ref, computed } from 'vue';
import type { MenuItem } from '../types';
import { callAPI } from '../services/api';

const items = ref<MenuItem[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

export async function fetchMenu() {
  // If we already have items, we don't strict need to fetch, but let's allow refresh
  // For now, simple cache-first
  if (items.value.length > 0) return;

  isLoading.value = true;
  try {
    const res = await callAPI<MenuItem[]>('getMenu');
    if (res.success) {
      items.value = res.data;
    } else {
      error.value = res.error || 'Failed to fetch menu';
    }
  } catch (e) {
    error.value = String(e);
  } finally {
    isLoading.value = false;
  }
}

export const menuItems = computed(() => items.value);

export const categories = computed(() =>
  Array.from(new Set(items.value.map(i => i.category || 'その他')))
);

export const getMenuItemsByCategory = (category: string) =>
  computed(() => items.value.filter(i => (i.category || 'その他') === category));

const ORDER_CONSTANTS = {
  TRACKING_ID_LENGTH: 6,
  TRACKING_ID_CHARS: '23456789ABCDEFGHJKLMNPQRSTUVWXYZ',
};

export function generateTrackingId(): string {
  return Array.from({ length: ORDER_CONSTANTS.TRACKING_ID_LENGTH }, () =>
    ORDER_CONSTANTS.TRACKING_ID_CHARS.charAt(Math.floor(Math.random() * ORDER_CONSTANTS.TRACKING_ID_CHARS.length))
  ).join('');
}

export { isLoading, error };
