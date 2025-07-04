<template>
  <div class="flex flex-row h-screen">
    <AdminNav v-if="!isMobile" :userRole="userRole" @logout="handleLogout" class="w-64" />
    <div class="flex-1 overflow-y-auto">
      <router-view />
    </div>
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