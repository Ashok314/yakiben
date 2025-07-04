<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div :class="['bg-gray-800 text-white p-4 min-h-screen', isSidebarCollapsed ? 'hidden md:block' : 'block']">
      <div class="space-y-4">
        <nav>
          <router-link 
            v-for="item in filteredNavItems" 
            :key="item.path" 
            :to="item.path" 
            :class="[
              isActive(item.path) 
                ? 'bg-primary text-white' 
                : 'text-gray-700 hover:bg-gray-100',
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
            ]"
          >
            <span class="truncate">{{ item.name }}</span>
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import type { UserRole } from '../types';

const authStore = useAuthStore();
const route = useRoute();

const user = computed(() => authStore.user);

const navItems = [
  { name: 'Orders', path: '/orders', roles: ['manager', 'staff', 'driver'] },
  { name: 'Menu Management', path: '/menu', roles: ['manager'] },
  { name: 'Restaurant Settings', path: '/settings', roles: ['manager'] },
  { name: 'User Management', path: '/users', roles: ['manager'] },
  { name: 'Delivery', path: '/delivery', roles: ['driver'] },
];

const filteredNavItems = computed(() => {
  if (!user.value) return [];
  return navItems.filter(item => item.roles.includes(user.value.role as UserRole));
});

const isActive = (path: string) => {
  return route.path.startsWith(path);
};

const isSidebarCollapsed = ref(false);
</script>

<style scoped>
/* Removed unnecessary styles, fully utilizing TailwindCSS for responsiveness */
</style>
