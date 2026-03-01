<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
    <div class="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
      <div class="mb-6 text-yellow-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-20 w-20 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        {{ SYSTEM_STATUS_TEXT.maintenance.title }}
      </h1>
      <p class="text-gray-600 mb-8" v-html="SYSTEM_STATUS_TEXT.maintenance.message"></p>

      <div class="bg-yellow-50 rounded-xl p-4 text-left border border-yellow-100 mb-6">
        <h3 class="font-bold text-yellow-800 mb-2">
          {{ SYSTEM_STATUS_TEXT.maintenance.contactTitle }}
        </h3>
        <p class="text-gray-700 mb-1">
          <span class="font-medium">{{ SYSTEM_STATUS_TEXT.maintenance.phoneLabel }}</span>
          <a :href="`tel:${info.phone}`" class="text-primary font-bold hover:underline">{{
            info.phone
          }}</a>
        </p>
        <p class="text-gray-700 mb-1">
          <span class="font-medium">{{ SYSTEM_STATUS_TEXT.maintenance.lineLabel }}</span>
          <a
            :href="`https://line.me/R/ti/p/${info.sns.line}`"
            class="text-primary font-bold underline"
            >{{ info.sns.line }}</a
          >
        </p>
        <p class="text-sm text-gray-500 mt-2">
          {{ SYSTEM_STATUS_TEXT.maintenance.note }}
        </p>
      </div>

      <!-- Google Calendar Iframe -->
      <div
        v-if="info.calendar_link"
        class="w-full mb-6 overflow-hidden rounded-xl border border-gray-200"
      >
        <iframe
          :src="info.calendar_link"
          style="border: 0"
          width="100%"
          height="300"
          frameborder="0"
          scrolling="no"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRestaurantStore } from '../stores/restaurant';
import { SYSTEM_STATUS_TEXT } from '../constants/system-status-text';

const { info } = useRestaurantStore();
</script>
