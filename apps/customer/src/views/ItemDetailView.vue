<template>
  <div class="min-h-screen bg-gray-50 pb-32">
    <!-- Header -->
    <header class="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
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
          <h1 class="text-lg font-bold ml-4">{{ item?.name || UI_TEXT.menu.item.title }}</h1>
        </div>

        <!-- Help Button -->
        <button 
          @click="showHelp = true"
          class="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </header>

    <main v-if="item" class="container mx-auto px-4 py-6">
      <!-- Item Image -->
      <div class="aspect-video rounded-xl overflow-hidden mb-6">
        <img 
          :src="`/yakiben/customer${item.image}`" 
          :alt="item.name"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Item Details -->
      <div class="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div class="flex justify-between items-start mb-2">
          <h2 class="text-xl font-bold">{{ item.name }}</h2>
          <div class="text-2xl font-bold text-primary">¥{{ item.price }}</div>
        </div>

        <!-- Quantity Selector -->
        <div class="flex items-center justify-between py-4 border-t border-b">
          <span class="font-medium">{{ UI_TEXT.menu.item.quantity }}</span>
          <div class="flex items-center space-x-4">
            <button 
              @click="quantity > 1 ? quantity-- : null"
              class="w-8 h-8 rounded-full border flex items-center justify-center
                     text-gray-500 hover:text-gray-700 hover:border-gray-400 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{ 'opacity-50 cursor-not-allowed': quantity <= 1 }"
            >
              -
            </button>
            <span class="w-8 text-center font-medium">{{ quantity }}</span>
            <button 
              @click="quantity++"
              class="w-8 h-8 rounded-full border flex items-center justify-center
                     text-gray-500 hover:text-gray-700 hover:border-gray-400 
                     transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <!-- Customizations -->
        <div v-if="item.customizations?.length" class="py-4">
          <h3 class="font-bold mb-4">{{ UI_TEXT.menu.item.customization }}</h3>
          <div class="space-y-4">
            <div v-for="custom in item.customizations" 
                 :key="custom.id"
                 class="flex items-center justify-between">
              <div class="flex items-center">
                <input 
                  type="checkbox"
                  :id="custom.id"
                  v-model="selectedCustomizations"
                  :value="custom.id"
                  class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label :for="custom.id" class="ml-3">
                  {{ custom.name }}
                  <span v-if="custom.price" class="text-gray-600 text-sm">
                    (+¥{{ custom.price }})
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p class="text-gray-600 py-4 border-t">
          {{ item.description }}
        </p>
      </div>

      <!-- Total and Add to Cart -->
      <div class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg border-t">
        <div class="container mx-auto p-4">
          <div class="flex justify-between items-center mb-3">
            <div>
              <div class="text-sm text-gray-600">{{ UI_TEXT.menu.item.itemTotal }}</div>
              <div class="text-lg font-bold">¥{{ itemTotal }}</div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-600">{{ UI_TEXT.menu.item.cartTotal }}</div>
              <div class="text-lg font-bold text-primary">¥{{ cartAndItemTotal }}</div>
            </div>
          </div>
          <button 
            @click="addToCartAndNavigate"
            :disabled="!item.available"
            class="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg 
                   disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark 
                   transition-all duration-300"
          >
            {{ UI_TEXT.menu.item.addToCart }}
          </button>
        </div>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" 
         class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
         @click.self="showHelp = false">
      <div class="bg-white rounded-xl p-6 max-w-md w-full">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-bold">{{ UI_TEXT.menu.help.title }}</h3>
          <button @click="showHelp = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <p>{{ UI_TEXT.menu.help.message }}</p>
          <div class="bg-gray-50 rounded-lg p-4 space-y-2">
            <p>電話番号：<a :href="`tel:${RESTAURANT_INFO.support.phone}`" class="text-primary">{{ RESTAURANT_INFO.support.phone }}</a></p>
            <p>受付時間：{{ RESTAURANT_INFO.support.hours }}</p>
            <p>メール：<a :href="`mailto:${RESTAURANT_INFO.support.email}`" class="text-primary">{{ RESTAURANT_INFO.support.email }}</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { menuItems } from '../data/menu';
import { useCart } from '../stores/cart';
import type { MenuItem } from '../types';
import { RESTAURANT_INFO } from '../config/restaurant';
import { UI_TEXT } from '../constants/ui-text';

const route = useRoute();
const router = useRouter();
const { addToCart, cartTotal } = useCart();

const item = ref<MenuItem | undefined>();
const quantity = ref(1);
const selectedCustomizations = ref<string[]>([]);
const showHelp = ref(false);

onMounted(() => {
  const id = route.params.id as string;
  item.value = menuItems.find(i => i.id === id);
  
  if (!item.value) {
    router.push('/');
  }
});

const itemTotal = computed(() => {
  if (!item.value) return 0;
  
  const basePrice = item.value.price * quantity.value;
  const customizationsTotal = selectedCustomizations.value.reduce((sum, customId) => {
    const customization = item.value?.customizations?.find(c => c.id === customId);
    return sum + (customization?.price || 0);
  }, 0) * quantity.value;
  
  return basePrice + customizationsTotal;
});

const cartAndItemTotal = computed(() => {
  return cartTotal.value + itemTotal.value;
});

function addToCartAndNavigate() {
  if (!item.value) return;

  // Add to cart multiple times based on quantity
  for (let i = 0; i < quantity.value; i++) {
    addToCart(item.value, selectedCustomizations.value);
  }
  
  router.push('/cart');
}
</script>
