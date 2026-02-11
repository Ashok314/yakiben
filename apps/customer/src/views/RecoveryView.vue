<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div
      class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center"
    >
      <!-- Warning Icon -->
      <div class="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.876c1.27 0 2.09-1.383 1.455-2.455L13.455 4a2 2 0 01-3.41 0L3.607 16.545C2.972 17.617 3.792 19 5.062 19z"
          />
        </svg>
      </div>

      <h1 class="text-2xl font-black text-gray-900 mb-4">アカウントが削除予定です</h1>

      <p class="text-gray-600 mb-8 leading-relaxed">
        このアカウントは削除リクエストが送信されており、現在無効になっています。
        削除申請から30日間はデータの復旧が可能ですが、それ以降は完全に消去されます。
      </p>

      <div class="space-y-4">
        <!-- Recovery Form Link -->
        <a
          :href="restaurantInfo.recovery_form"
          target="_blank"
          class="block w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-primary-dark transition text-center"
        >
          アカウント復旧を申請する
        </a>

        <!-- Logout Button -->
        <button
          @click="auth.logout"
          class="block w-full bg-white text-gray-600 border border-gray-200 font-bold py-4 rounded-xl hover:bg-gray-50 transition"
        >
          ログアウトして戻る
        </button>
      </div>

      <p class="mt-8 text-xs text-gray-400">復旧申請は担当者が確認後、順次対応いたします。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRestaurantStore } from '../stores/restaurant';

const auth = useAuthStore();
const { info: restaurantInfo } = useRestaurantStore();
</script>
