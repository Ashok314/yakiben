<template>
  <div v-if="activeOrder" 
       class="bg-yellow-50 border-b border-yellow-100 transition-all duration-300">
    <div class="container mx-auto px-4 py-2">
      <router-link :to="`/history`" 
                  class="flex items-center justify-between text-sm">
        <div class="flex items-center space-x-2">
          <span class="w-2 h-2 rounded-full animate-pulse"
                :class="{
                  'bg-yellow-500': activeOrder.status === 'pending',
                  'bg-green-500': activeOrder.status === 'completed',
                  'bg-red-500': activeOrder.status === 'cancelled'
                }"></span>
          <span class="font-medium"
                :class="{
                  'text-yellow-800': activeOrder.status === 'pending',
                  'text-green-800': activeOrder.status === 'completed',
                  'text-red-800': activeOrder.status === 'cancelled'
                }">
            {{ statusText[activeOrder.status] }}
          </span>
        </div>
        <div class="flex items-center text-gray-600">
          <span>{{ formatDate(activeOrder.pickupTime) }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import { STORAGE_KEYS } from '../constants';
import { ordersApi } from '../data/api/orders';
import type { Order } from '../types';

const activeOrder = ref<Order | null>(null);

const statusText = {
  pending: '準備中',
  completed: '完了',
  cancelled: 'キャンセル'
} as const;

// Format date for display
function formatDate(date: string | Date) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

// Watch for changes in orders and update active order
watchEffect(async () => {
  activeOrder.value = await ordersApi.getMostRecentPendingOrder();
});
</script>
