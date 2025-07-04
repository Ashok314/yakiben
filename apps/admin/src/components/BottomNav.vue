<template>
  <div class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-around items-center h-16 shadow-lg">
    <router-link v-for="item in filteredMenu" :key="item.name" :to="item.path" class="flex flex-col items-center justify-center text-sm">
      <span>{{ item.icon }}</span>
      <span v-if="!isMobile" class="text-xs">{{ item.name }}</span>
    </router-link>
  </div>
</template>

<script>
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
        { name: 'Orders', path: '/orders', icon: '📦', roles: ['staff', 'manager', 'driver'] },
        { name: 'Menu Management', path: '/menu-management', icon: '📋', roles: ['manager'] },
        { name: 'User Management', path: '/user-management', icon: '👥', roles: ['manager'] },
        { name: 'Settings', path: '/settings', icon: '⚙️', roles: ['manager'] },
        { name: 'Delivery', path: '/delivery', icon: '🚚', roles: ['driver', 'manager'] },
        { name: 'Account', path: '/account', icon: '👤', roles: ['staff', 'manager', 'driver'] },
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
