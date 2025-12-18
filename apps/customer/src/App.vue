<script setup lang="ts">
import HeaderStatus from './components/HeaderStatus.vue';
import UserMenu from './components/UserMenu.vue';
import { ref, onMounted } from 'vue';
import { callAPI } from './services/api';

const publicHealthStatus = ref('');

onMounted(async () => {
  try {
    const data = await callAPI('health');
    console.log('Public health:', data);
    publicHealthStatus.value = `Backend: ${data.data?.message || 'Connected'}`;
  } catch (error) {
    console.error('Public health error:', error);
    publicHealthStatus.value = `Backend: Error connecting`;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900">
    <!-- Navbar -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-[100] shadow-sm">
      <div class="container mx-auto px-4 h-16 flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold tracking-tight text-gray-900 hover:opacity-80 transition">
          Yakiben
        </router-link>
        <UserMenu />
      </div>
    </div>

    <HeaderStatus />

    <main>
      <router-view v-slot="{ Component }">
        <transition 
          name="page" 
          mode="out-in"
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-2"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="mt-12 py-6 text-center text-sm text-gray-400">
       <p class="mb-2">&copy; Yakiben Customer App</p>
       <p class="text-xs">{{ publicHealthStatus }}</p>
    </footer>
  </div>
</template>