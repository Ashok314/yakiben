import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User, UserRole } from '../types/types'
import { callAPI } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  // Initialize from localStorage immediately (not in onMounted)
  try {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
      isAuthenticated.value = true
    }
  } catch (error) {
    console.error('Failed to parse user from localStorage', error)
  }

  const loginWithGoogle = async (credential: string) => {
    const res = await callAPI('login', { credential });

    if (res.success && res.data) {
      const userData = res.data.user as User;

      // Ensure user has a valid admin role
      if (!userData.role || !['manager', 'staff', 'driver'].includes(userData.role)) {
        return {
          success: false,
          message: 'Access denied. Your account does not have admin privileges.'
        };
      }

      // Update user and authentication state
      user.value = userData;
      isAuthenticated.value = true;

      // Save to localStorage
      localStorage.setItem('yakiben-admin-token', res.data.token);
      localStorage.setItem('user', JSON.stringify(user.value));

      return { success: true };
    }

    return { success: false, message: res.error || 'Authentication failed' };
  };

  const login = async (email: string, password: string) => {
    const res = await callAPI('login', { email, password });

    if (res.success && res.data) {
      user.value = res.data.user as User;
      isAuthenticated.value = true;

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(user.value));
      localStorage.setItem('yakiben-admin-token', res.data.token);
      return { success: true };
    }

    return { success: false, message: res.error || 'Invalid credentials' };
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('user');
    localStorage.removeItem('yakiben-admin-token');
  };

  const updateUser = (updatedUser: User) => {
    user.value = { ...updatedUser };
    localStorage.setItem('user', JSON.stringify(user.value));
  };

  return {
    user,
    isAuthenticated,
    loginWithGoogle,
    login,
    logout,
    updateUser,
  }
})
