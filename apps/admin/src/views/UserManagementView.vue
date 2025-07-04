<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">User Management</h1>
    <p class="mb-4">Manage users and roles here.</p>

    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">Name</th>
          <th class="border border-gray-300 px-4 py-2">Email</th>
          <th class="border border-gray-300 px-4 py-2">Role</th>
          <th class="border border-gray-300 px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="border border-gray-300 px-4 py-2">{{ user.name }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ user.email }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ user.role }}</td>
          <td class="border border-gray-300 px-4 py-2">
            <button class="text-blue-500 hover:underline mr-2" @click="editUser(user)">Edit</button>
            <button class="text-red-500 hover:underline" @click="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded" @click="openAddModal">Add New User</button>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit User' : 'Add User' }}</h2>
        <form @submit.prevent="saveUser">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input v-model="currentUser.name" type="text" id="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" required />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="currentUser.email" type="email" id="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" required />
          </div>
          <div class="mb-4">
            <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
            <select v-model="currentUser.role" id="role" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
              <option value="staff">Staff</option>
              <option value="driver">Driver</option>
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" class="px-4 py-2 bg-gray-300 rounded" @click="closeModal">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'staff' | 'driver';
}

const users = ref<User[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'staff' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'driver' },
]);

const isModalOpen = ref(false);
const isEditing = ref(false);
const currentUser = ref<User>({ id: 0, name: '', email: '', role: 'staff' });

const openAddModal = () => {
  isEditing.value = false;
  currentUser.value = { id: 0, name: '', email: '', role: 'staff' };
  isModalOpen.value = true;
};

const editUser = (user: User) => {
  isEditing.value = true;
  currentUser.value = { ...user };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  currentUser.value = { id: 0, name: '', email: '', role: 'staff' };
};

const saveUser = () => {
  if (isEditing.value) {
    // Update existing user
    const index = users.value.findIndex(user => user.id === currentUser.value.id);
    if (index !== -1) {
      users.value[index] = { ...currentUser.value };
    }
  } else {
    // Add new user
    const newUser = { ...currentUser.value, id: Date.now() };
    users.value.push(newUser);
  }
  closeModal();
};

const deleteUser = (id: number) => {
  users.value = users.value.filter(user => user.id !== id);
};
</script>

<style scoped>
/* Add scoped styles here */
</style>
