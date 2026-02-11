<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <header class="sticky top-0 bg-white shadow-sm z-50">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center">
          <button @click="$router.back()" class="text-gray-600 hover:text-gray-900 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 class="text-lg font-bold">営業カレンダー</h1>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-1 md:p-4">
        <div
          v-if="restaurantInfo.calendar_link"
          class="w-full aspect-[4/3] md:aspect-video min-h-[500px]"
        >
          <iframe
            :src="restaurantInfo.calendar_link"
            style="border: 0"
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="no"
            class="rounded-lg"
          ></iframe>
        </div>
        <div v-else class="py-20 text-center text-gray-400">カレンダーが設定されていません。</div>
      </div>

      <div class="mt-6 bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
        <div class="flex gap-3 text-sm text-blue-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>
            店休日や営業時間の変更はこちらのカレンダーをご確認ください。
            ご予約やご注文の際にご参考いただけます。
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRestaurantStore } from '../stores/restaurant';

const { info: restaurantInfo } = useRestaurantStore();
</script>
