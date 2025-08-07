<template>
  <div class="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 shadow-lg" style="background-color: var(--color-nav-bg); color: #000;">
    <router-link v-for="item in filteredMenu" :key="item.name" :to="item.path" class="flex flex-col items-center justify-center text-sm">
      <component :is="item.icon" class="w-6 h-6" />
      <span v-if="!isMobile" class="text-xs">{{ item.name }}</span>
    </router-link>
  </div>
</template>

<script>
import { HomeIcon, ClipboardDocumentListIcon, Cog6ToothIcon, TruckIcon, UserIcon,ChartBarIcon } from '@heroicons/vue/24/outline';

export default {
  props: {
    userRole: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isMobile: window.innerWidth <= 640, // Tailwind's sm breakpoint
    };
  },
  computed: {
    filteredMenu() {
      const menu = [
        { name: 'Orders', path: '/orders', icon: HomeIcon, roles: ['staff', 'manager', 'driver'] },
        { name: 'Menu Management', path: '/menu-management', icon: ClipboardDocumentListIcon, roles: ['manager'] },
        // { name: 'User Management', path: '/user-management', icon: UserGroupIcon, roles: ['manager'] },
        { name: 'Settings', path: '/settings', icon: Cog6ToothIcon, roles: ['manager'] },
        { name: 'Delivery', path: '/delivery', icon: TruckIcon, roles: ['driver', 'manager'] },
        { name: 'Account', path: '/account', icon: UserIcon, roles: ['staff', 'manager', 'driver'] },
        { name: 'Order Summary', path: '/order-summary', icon: ChartBarIcon, roles: ['manager'] },
      ];
      return menu.filter(item => item.roles.includes(this.userRole));
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.isMobile = window.innerWidth <= 640;
    },
  },
};
</script>

<style scoped>
.fixed {
  z-index: 50;
}
</style>
