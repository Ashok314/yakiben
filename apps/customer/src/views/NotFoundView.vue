<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
    <div class="mb-6 text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-24 w-24 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ SYSTEM_STATUS_TEXT.notFound.title }}</h1>
    <h2 class="text-xl font-medium text-gray-700 mb-4">
      {{ SYSTEM_STATUS_TEXT.notFound.subtitle }}
    </h2>
    <p class="text-gray-500 mb-8 max-w-xs mx-auto">
      {{ SYSTEM_STATUS_TEXT.notFound.message }}
    </p>

    <router-link
      to="/"
      class="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl"
    >
      {{ SYSTEM_STATUS_TEXT.notFound.backButton }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { SYSTEM_STATUS_TEXT } from '../constants/system-status-text';
</script>
