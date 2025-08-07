<template>
  <div class="flex h-screen">
    <!-- Navigation Container -->
    <div :class="isCollapsed ? 'w-16' : 'w-64'" class="flex flex-col" style="background-color: var(--color-nav-bg); color: #000; transition: all 0.3s; overflow: hidden;">
      <!-- Header Section -->
      <div class="flex items-center justify-between p-4" style="background-color: var(--color-nav-bg);">
        <button @click="toggleCollapse" class="text-black text-xl">
          <span>☰</span>
        </button>
        <span v-if="!isCollapsed" class="text-lg font-bold">Admin Panel</span>
      </div>

      <!-- Navigation Section -->
      <nav class="flex-1 overflow-y-auto">
        <ul class="space-y-2">
          <li v-for="item in filteredMenu" :key="item.name" class="px-4 py-2">
            <router-link :to="item.path" class="flex items-center space-x-2 hover:bg-yellow-200 p-2 rounded">
              <component :is="item.icon" class="w-6 h-6" />
              <span v-if="!isCollapsed" class="whitespace-nowrap">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Mobile Collapsible Menu -->
      <div v-if="isCollapsed" class="absolute top-0 left-0 w-full h-full bg-white z-50 md:hidden">
        <nav>
          <ul class="space-y-2">
            <li v-for="item in filteredMenu" :key="item.name" class="px-4 py-2">
              <router-link :to="item.path" class="flex items-center space-x-2 hover:bg-yellow-200 p-2 rounded">
                <component :is="item.icon" class="w-6 h-6" />
                <span>{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { HomeIcon, ClipboardDocumentListIcon, UserGroupIcon, Cog6ToothIcon, TruckIcon, UserIcon, ChartBarIcon } from '@heroicons/vue/24/outline';

export default {
  props: {
    userRole: {
      type: String,
      required: true,
    },
  },
  emits: ['toggle-collapse'], // Declare the emit
  data() {
    return {
      isCollapsed: false,
      isPhone: window.innerWidth <= 640, // Tailwind's sm breakpoint
      menu: [
        { name: 'Orders', path: '/orders', icon: HomeIcon, roles: ['staff', 'manager', 'driver'] },
        { name: 'Menu Management', path: '/menu-management', icon: ClipboardDocumentListIcon, roles: ['manager'] },
        { name: 'User Management', path: '/user-management', icon: UserGroupIcon, roles: ['manager'] },
        { name: 'Settings', path: '/settings', icon: Cog6ToothIcon, roles: ['manager'] },
        { name: 'Delivery', path: '/delivery', icon: TruckIcon, roles: ['driver', 'manager'] },
        { name: 'Account', path: '/account', icon: UserIcon, roles: ['staff', 'manager', 'driver'] },
        { name: 'Order Summary', path: '/order-summary', icon: ChartBarIcon, roles: ['manager'] },
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
      // Emit the new collapse state to parent
      this.$emit('toggle-collapse', this.isCollapsed);
    },
    handleResize() {
      this.isPhone = window.innerWidth <= 640;
      if (this.isPhone) {
        this.isCollapsed = true; // Always start fully collapsed on mobile
        // Emit the collapse state on resize too
        this.$emit('toggle-collapse', this.isCollapsed);
      }
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize(); // Initialize on mount
    // Emit initial state
    this.$emit('toggle-collapse', this.isCollapsed);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>