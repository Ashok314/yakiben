<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="px-6 py-8">
        <h2 class="text-center text-3xl font-bold text-gray-800 mb-6">{{ t('LOGIN_TITLE') }}</h2>
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">{{ t('EMAIL_LABEL') }}</label>
            <input 
              v-model="email" 
              type="email" 
              id="email" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">{{ t('PASSWORD_LABEL') }}</label>
            <input 
              v-model="password" 
              type="password" 
              id="password" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              required
            />
          </div>
          <div v-if="error" class="text-red-500 text-sm" aria-live="polite">{{ error }}</div>
          <div>
            <button 
              type="submit" 
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="loader mr-2"></span>
              {{ isLoading ? t('LOGGING_IN') : t('SIGN_IN') }}
            </button>
          </div>
          <!-- <div class="text-sm text-gray-600">
            <p class="mt-4">{{ t('DEMO_ACCOUNTS_TITLE') }}</p>
            <ul class="list-disc pl-5 mt-2">
              <li>{{ t('MANAGER_ACCOUNT') }}</li>
              <li>{{ t('STAFF_ACCOUNT') }}</li>
              <li>{{ t('DRIVER_ACCOUNT') }}</li>
            </ul>
          </div> -->
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';

  if (!email.value || !password.value) {
    error.value = t('EMAIL_PASSWORD_REQUIRED');
    isLoading.value = false;
    return;
  }

  try {
    const result = await authStore.login(email.value, password.value);
    if (result.success) {
      router.push('/orders');
    } else {
      error.value = result.message || t('INVALID_EMAIL_PASSWORD');
    }
  } catch (err) {
    error.value = t('UNEXPECTED_ERROR');
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
