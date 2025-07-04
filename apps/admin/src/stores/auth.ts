import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User, UserRole } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  // Initialize from localStorage if available
  try {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
      isAuthenticated.value = true
    }
  } catch (error) {
    console.error('Failed to parse user from localStorage', error)
  }

  // Mock users for testing
  const mockUsers = [
    { id: '1', name: 'Manager User', email: 'manager@yakiben.com', password: 'manager123', role: 'manager' as UserRole },
    { id: '2', name: 'Staff User', email: 'staff@yakiben.com', password: 'staff123', role: 'staff' as UserRole },
    { id: '3', name: 'Driver User', email: 'driver@yakiben.com', password: 'driver123', role: 'driver' as UserRole }
  ]

  const login = async (email: string, password: string) => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      // Clone user without password for security
      const { password: _, ...userWithoutPassword } = foundUser
      user.value = userWithoutPassword as User
      isAuthenticated.value = true
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
      return { success: true }
    }
    
    return { success: false, message: 'Invalid email or password' }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('user')
  }

  return {
    user,
    isAuthenticated,
    login,
    logout
  }
})
