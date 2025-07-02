<template>
  <div class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative">
    <div class="relative h-32 group-hover:h-40 transition-all duration-300">
      <img 
        :src="`/yakiben/customer${item.image}`" 
        :alt="item.name"
        class="w-full h-full object-cover transition-transform duration-500"
      />
      <div 
        v-if="!item.available" 
        class="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      >
        <span class="text-white font-medium px-3 py-1 bg-red-500/90 rounded-lg text-sm">
          売り切れ
        </span>
      </div>
    </div>

    <div class="p-3">
      <div class="space-y-1">
        <div class="flex justify-between items-start">
          <h3 class="font-bold text-gray-900 text-base line-clamp-1">{{ item.name }}</h3>
          <div class="font-bold text-primary">¥{{ item.price }}</div>
        </div>
        <p class="text-xs text-gray-600 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
          {{ item.description }}
        </p>
      </div>

      <div class="mt-3 flex gap-2">
        <!-- Order Button -->
        <router-link 
          :to="{ name: 'itemDetail', params: { id: item.id }}"
          class="flex-1 py-1.5 rounded-lg text-sm font-bold text-center transition-all duration-300"
          :class="[
            item.available 
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          ]"
        >
          詳細を見る
        </router-link>

        <!-- Add to Cart Button -->
        <button
          v-if="item.available"
          @click="addToCartDirectly"
          class="flex-1 py-1.5 rounded-lg text-sm font-bold text-center transition-all duration-300
                 bg-primary/10 text-primary hover:bg-primary hover:text-white"
        >
          カートに入れる
        </button>
      </div>

      <!-- Quantity Badge -->
      <div v-if="quantity > 0" 
           class="absolute top-2 right-2 min-w-[20px] h-5 rounded-full bg-primary text-white 
                  flex items-center justify-center text-xs font-bold px-1.5
                  shadow shadow-primary/30">
        {{ quantity }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MenuItem } from '../types';
import { useCart } from '../stores/cart';

const props = defineProps<{
  item: MenuItem;
}>();

const { getItemQuantity, addToCart } = useCart();

const quantity = computed(() => 
  getItemQuantity(props.item.id)
);

function addToCartDirectly() {
  if (!props.item.available) return;
  addToCart(props.item);
}
</script>
