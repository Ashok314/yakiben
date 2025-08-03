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
            <button class="text-blue-500 hover:underline mr-2" @click="openEditModal(user)">Edit</button>
            <button class="text-red-500 hover:underline" @click="openDeleteDialog(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded" @click="openAddModal">Add New User</button>

    <!-- Edit User Modal -->
    <div v-if="isEditModalOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">Edit User</h2>
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
              <option value="manager">Manager</option>
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" class="px-4 py-2 bg-gray-300 rounded" @click="closeEditModal">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      v-if="isDeleteDialogOpen"
      :isOpen="isDeleteDialogOpen"
      title="Confirm Delete"
      message="Are you sure you want to delete this user?"
      @cancel="closeDeleteDialog"
      @confirm="deleteUser"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import type { User } from '../types';
import { MOCK_USERS } from '../mocks/users';

const users = ref<User[]>(MOCK_USERS);

const isEditModalOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const currentUser = ref<User>({ id: 0, name: '', email: '', role: 'staff' });
const deleteUserId = ref<number | null>(null);

const openAddModal = () => {
  currentUser.value = { id: 0, name: '', email: '', role: 'staff' };
  isEditModalOpen.value = true;
};

const openEditModal = (user: User) => {
  currentUser.value = { ...user };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  currentUser.value = { id: 0, name: '', email: '', role: 'staff' };
};

const openDeleteDialog = (id: number) => {
  deleteUserId.value = id;
  isDeleteDialogOpen.value = true;
};

const closeDeleteDialog = () => {
  isDeleteDialogOpen.value = false;
  deleteUserId.value = null;
};

const deleteUser = async () => {
  if (deleteUserId.value !== null) {
    try {
      // FIXME Replace with API call
      users.value = users.value.filter((user: User) => user.id !== deleteUserId.value);
      closeDeleteDialog();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  }
};

const saveUser = async () => {
  try {
    // FIXME Replace with API call
    const index = users.value.findIndex((user: User) => user.id === currentUser.value.id);
    if (index !== -1) {
      users.value[index] = { ...currentUser.value };
    }
    closeEditModal();
  } catch (error) {
    console.error('Failed to save user:', error);
  }
};

</script>
