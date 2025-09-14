<template>
  <div class="min-h-screen bg-gray-50">
    <header class="sticky top-0 bg-white shadow z-50">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center">
          <router-link 
            to="/"
            class="text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <h1 class="text-xl font-bold ml-4">注文履歴</h1>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <div v-if="!orders.length" class="text-center py-12">
        <p class="text-gray-600 mb-4">注文履歴がありません</p>
        <router-link 
          to="/"
          class="inline-block bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary-dark transition-colors"
        >
          メニューに戻る
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <div v-for="order in sortedOrders" :key="order.id" 
             class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-4 border-b">
            <div class="flex justify-between items-start">
              <div>
                <div class="font-medium text-gray-900">
                  {{ order.customerName }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ formatDate(order.delivertTime) }}
                </div>
                <div class="text-sm text-gray-500 mt-1">
                  {{ order.items.length }}品
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold text-primary">
                  ¥{{ order.total }}
                </div>
                <div class="text-sm">
                  <span :class="{
                    'text-green-600': order.status === 'completed',
                    'text-yellow-600': order.status === 'pending',
                    'text-red-600': order.status === 'cancelled'
                  }">
                    {{ statusText[order.status] }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="px-4 py-3 bg-gray-50 flex justify-between items-center">
            <div class="text-sm text-gray-600">
              注文番号: {{ order.trackingId }}
            </div>
            <div class="flex gap-2">
              <router-link
                :to="`/order/${order.trackingId}`"
                class="px-4 py-2 font-medium text-primary bg-primary/10 rounded-lg
                       hover:bg-primary/20 transition-colors"
              >
                詳細を見る
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ordersApi } from '../data/api/orders';
import type { Order } from '../types';

const orders = ref<Order[]>([]);

const statusText = {
  pending: '準備中',
  completed: '完了',
  cancelled: 'キャンセル'
} as const;

onMounted(async () => {
  orders.value = await ordersApi.getOrders();
});

const sortedOrders = computed(() => {
  return [...orders.value].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

function formatDate(date: string | Date) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}
</script>
