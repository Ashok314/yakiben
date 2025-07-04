<template>
  <div class="account-view p-4">
    <h1 class="text-2xl font-bold mb-4">Account</h1>
    <div class="user-info mb-4">
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Role:</strong> {{ user.role }}</p>
    </div>
    <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';

export default {
  data() {
    const authStore = useAuthStore();
    return {
      user: authStore.user || { name: 'Guest', email: 'N/A', role: 'guest' },
    };
  },
  methods: {
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.account-view {
  max-width: 600px;
  margin: 0 auto;
}
</style>
