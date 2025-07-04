<template>
  <div class="flex flex-col bg-gray-800 text-white h-screen transition-all duration-300" :class="isPhone && isCollapsed ? 'w-0' : (isCollapsed ? 'w-20' : 'w-64')">
    <!-- Header Section -->
    <div class="flex items-center justify-between p-4 bg-gray-900">
      <button @click="toggleCollapse" class="text-white text-xl">
        <span>☰</span>
      </button>
      <span v-if="!isPhone && !isCollapsed" class="text-lg font-bold">Admin Panel</span>
    </div>

    <!-- Navigation Section -->
    <nav v-show="!isPhone || !isCollapsed" class="flex-1 overflow-y-auto transition-opacity duration-300" :class="isPhone && isCollapsed ? 'opacity-0' : 'opacity-100'">
      <ul class="space-y-2">
        <li v-for="item in filteredMenu" :key="item.name" class="px-4 py-2">
          <router-link :to="item.path" class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
            <span>{{ item.icon }}</span>
            <span v-if="!isCollapsed" class="whitespace-nowrap">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
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
      isCollapsed: false,
      isPhone: window.innerWidth <= 640, // Tailwind's sm breakpoint
      menu: [
        { name: 'Orders', path: '/orders', icon: '📦', roles: ['staff', 'manager', 'driver'] },
        { name: 'Menu Management', path: '/menu-management', icon: '📋', roles: ['manager'] },
        { name: 'User Management', path: '/user-management', icon: '👥', roles: ['manager'] },
        { name: 'Settings', path: '/settings', icon: '⚙️', roles: ['manager'] },
        { name: 'Delivery', path: '/delivery', icon: '🚚', roles: ['driver', 'manager'] },
        { name: 'Account', path: '/account', icon: '👤', roles: ['staff', 'manager', 'driver'] },
      ],
    };
  },
  computed: {
    filteredMenu() {
      return this.menu.filter(item => item.roles.includes(this.userRole));
    },
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    handleResize() {
      this.isPhone = window.innerWidth <= 640;
      if (this.isPhone) {
        this.isCollapsed = true; // Always start fully collapsed on mobile
      }
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize(); // Initialize on mount
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>

<style scoped>
/* No custom styles, using Tailwind CSS */
</style>
