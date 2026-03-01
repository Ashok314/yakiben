<template>
  <div class="flex h-screen">
    <!-- Navigation Container -->
    <AdminNav
      v-if="!isMobile"
      :userRole="userRole"
      @logout="handleLogout"
      @toggle-collapse="handleNavToggle"
      :class="isCollapsed ? 'w-16' : 'w-64'"
      class="transition-all duration-300 flex-shrink-0"
    />

    <!-- Main Content -->
    <div
      :class="isMobile ? 'flex-1 overflow-y-auto pb-16' : 'flex-1 overflow-y-auto'"
      class="transition-all duration-300"
    >
      <router-view />
    </div>

    <!-- Bottom Navigation for Mobile -->
    <BottomNav v-if="isMobile" :userRole="userRole" @logout="handleLogout" />
  </div>
</template>

<script>
import AdminNav from '../components/AdminNav.vue';
import BottomNav from '../components/BottomNav.vue';
import { useAuthStore } from '../stores/auth';

export default {
  components: {
    AdminNav,
    BottomNav,
  },
  data() {
    return {
      isMobile: window.innerWidth <= 640, // Tailwind's sm breakpoint
      isCollapsed: false, // Track collapsed state
    };
  },
  computed: {
    userRole() {
      const authStore = useAuthStore();
      return authStore.user?.role || 'guest';
    },
  },
  methods: {
    handleResize() {
      this.isMobile = window.innerWidth <= 640;
    },
    handleLogout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push('/');
    },
    handleNavToggle(collapsed) {
      this.isCollapsed = collapsed;
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>
