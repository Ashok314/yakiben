<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import type { CallbackTypes } from 'vue3-google-login';

const auth = useAuthStore();
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

const handleLoginSuccess: CallbackTypes.CredentialCallback = async (response) => {
  if (response.credential) {
    await auth.loginWithGoogle(response.credential);
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <!-- Logged In State -->
    <div v-if="auth.isAuthenticated.value && auth.user.value" class="flex items-center gap-2">
      <button @click="toggleDropdown" class="flex items-center gap-2 focus:outline-none hover:opacity-80 transition">
        <img :src="auth.user.value.picture" alt="User" class="w-9 h-9 rounded-full border border-gray-200 shadow-sm" />
      </button>

      <!-- Dropdown Menu -->
      <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
        <div v-if="isOpen"
          class="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 origin-top-right">
          <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ auth.user.value.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ auth.user.value.email }}</p>
          </div>

          <div class="py-1">
            <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              @click="isOpen = false">
              プロフィール設定
            </router-link>
            <router-link to="/history" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              @click="isOpen = false">
              注文履歴
            </router-link>
          </div>

          <div class="py-1 border-t border-gray-100">
            <button @click="auth.logout"
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
              Sign out
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- Logged Out State (Google Button) -->
    <div v-else>
      <GoogleLogin :callback="handleLoginSuccess" />
    </div>
  </div>
</template>
