<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
    <div class="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
      <div class="mb-6 text-red-500">
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
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        {{ SYSTEM_STATUS_TEXT.networkError.title }}
      </h1>
      <p class="text-gray-600 mb-8" v-html="SYSTEM_STATUS_TEXT.networkError.message"></p>

      <div class="bg-red-50 rounded-xl p-4 text-left border border-red-100">
        <h3 class="font-bold text-red-800 mb-2">
          {{ SYSTEM_STATUS_TEXT.networkError.emergencyContactTitle }}
        </h3>
        <p class="text-gray-700 mb-1">
          <span class="font-medium">{{ SYSTEM_STATUS_TEXT.networkError.phoneLabel }}</span>
          <a
            :href="`tel:${SYSTEM_STATUS_TEXT.networkError.phone}`"
            class="text-primary font-bold hover:underline"
            >{{ SYSTEM_STATUS_TEXT.networkError.phone }}{{ info.phone }}</a
          >
        </p>
        <p class="text-gray-700 mb-1">
          <span class="font-medium">{{ SYSTEM_STATUS_TEXT.networkError.lineLabel }}</span>
          <a
            :href="`https://line.me/R/ti/p/${info.sns.line}`"
            class="text-primary font-bold underline"
            >{{ info.sns.line }}</a
          >
        </p>
        <p class="text-sm text-gray-500 mt-2">
          {{ SYSTEM_STATUS_TEXT.networkError.note }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRestaurantStore } from '../stores/restaurant';
import { SYSTEM_STATUS_TEXT } from '../constants/system-status-text';

const { info } = useRestaurantStore();
</script>
