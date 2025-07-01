<template>
  <div class="relative min-h-screen pb-32">
     <!-- Announcement Banner -->
      <div v-if="showAnnouncement" class="bg-primary/10 relative">
        <div class="container mx-auto px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <p class="text-sm text-gray-700">
                7月限定！からあげ弁当が¥100引き！この機会をお見逃しなく！
              </p>
            </div>
            <button 
              @click="closeAnnouncement" 
              class="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

    <!-- Header -->
    <header class="sticky top-0 bg-white shadow-sm z-50">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <img src="/yakiben/customer/assets/menu/placeholder.jpeg" alt="やきべん" class="h-8 w-8 rounded-lg" />
            <h1 class="text-lg font-bold text-gray-900">やきべん</h1>
          </div>
          <div class="flex items-center space-x-2">
            <router-link
              to="/history"
              class="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="注文履歴"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </router-link>
            <button 
            @click="showInfo = true"
            class="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
      </div>
    </header>

   

    <!-- Menu Items by Selected Category -->
    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <MenuCard 
          v-for="item in getMenuItemsByCategory(selectedCategory)"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="fixed py-2 bottom-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t shadow-lg">
      <div class="container mx-auto">
        <div class="flex overflow-x-auto no-scrollbar py-4 px-4 gap-2">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 flex-shrink-0 transform hover:scale-105',
              selectedCategory === category
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Cart Summary -->
    <div class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-xl border-t">
      <div class="container mx-auto p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="flex items-center justify-center min-w-[1.5rem] h-6 rounded-full bg-primary text-white font-bold text-sm px-2">
              {{ cartItemCount }}
            </div>
            <span class="font-bold text-xl">¥{{ cartTotal }}</span>
          </div>
          <router-link 
            to="/cart"
            class="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20
                   hover:bg-primary-dark transition-all duration-300 transform hover:shadow-xl 
                   hover:shadow-primary/30 hover:-translate-y-0.5"
            :class="{ 'pointer-events-none opacity-50': cartItemCount === 0 }"
          >
            お持ち帰りへ
          </router-link>
        </div>
      </div>
    </div>

    <!-- Restaurant Info Modal -->
    <div v-if="showInfo" 
         class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
         @click.self="showInfo = false">
      <div class="bg-white rounded-xl p-6 max-w-md w-full">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-bold">店舗情報</h3>
          <button @click="showInfo = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <h4 class="font-medium mb-1">住所</h4>
            <p class="text-gray-600">〒100-0005 東京都千代田区丸の内1-1-1</p>
          </div>
          <div>
            <h4 class="font-medium mb-1">営業時間</h4>
            <p class="text-gray-600">平日 10:00-15:00</p>
          </div>
          <div>
            <h4 class="font-medium mb-1">電話番号</h4>
            <p class="text-gray-600">03-1234-5678</p>
          </div>
          <div>
            <h4 class="font-medium mb-2">アクセス</h4>
            <div class="aspect-video rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.8280303808788!2d139.76466661525905!3d35.68123618019432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bfbd89f700b%3A0x277c49ba34ed38!2z5p2x5Lqs6aeF!5e0!3m2!1sja!2sjp!4v1625124433123!5m2!1sja!2sjp"
                width="100%"
                height="100%"
                style="border:0"
                allowfullscreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getCategories, getMenuItemsByCategory } from '../data/menu';
import type { MenuItem } from '../types';
import MenuCard from '../components/MenuCard.vue';
import { useCart } from '../stores/cart';

const categories = getCategories();
const selectedCategory = ref(categories[0]);
const { cartItems, cartItemCount, cartTotal, addToCart, getItemQuantity } = useCart();

const showAnnouncement = ref(true);
const showInfo = ref(false);

function closeAnnouncement() {
  showAnnouncement.value = false;
}
</script>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
