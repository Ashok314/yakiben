<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Menu Management</h1>
    <p class="mb-4">Manage your restaurant's menu items here.</p>

    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">Name</th>
          <th class="border border-gray-300 px-4 py-2">Price</th>
          <th class="border border-gray-300 px-4 py-2">Category</th>
          <th class="border border-gray-300 px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in menuItems" :key="item.id">
          <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ item.price }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ item.category }}</td>
          <td class="border border-gray-300 px-4 py-2">
            <button class="text-blue-500 hover:underline mr-2" @click="openEditModal(item)">Edit</button>
            <button class="text-red-500 hover:underline" @click="deleteItem(item.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded" @click="openAddModal">Add New Item</button>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit Item' : 'Add Item' }}</h2>
        <form @submit.prevent="saveItem">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input v-model="currentItem.name" type="text" id="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" required />
          </div>
          <div class="mb-4">
            <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
            <input v-model="currentItem.price" type="number" id="price" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" required />
          </div>
          <div class="mb-4">
            <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
            <input v-model="currentItem.category" type="text" id="category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" required />
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

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

const menuItems = ref<MenuItem[]>([
  { id: 1, name: 'Sushi Roll', price: 12.99, category: 'Sushi' },
  { id: 2, name: 'Ramen Bowl', price: 9.99, category: 'Noodles' },
  { id: 3, name: 'Tempura', price: 8.99, category: 'Appetizers' },
]);

const isModalOpen = ref(false);
const isEditing = ref(false);
const currentItem = ref<MenuItem>({ id: 0, name: '', price: 0, category: '' });

const openAddModal = () => {
  isEditing.value = false;
  currentItem.value = { id: 0, name: '', price: 0, category: '' };
  isModalOpen.value = true;
};

const saveItem = () => {
  if (isEditing.value) {
    // Update existing item
    const index = menuItems.value.findIndex(item => item.id === currentItem.value.id);
    if (index !== -1) {
      menuItems.value[index] = { ...currentItem.value };
    }
  } else {
    // Add new item
    const newItem = { ...currentItem.value, id: Date.now() };
    menuItems.value.push(newItem);
  }
  closeModal();
};

const deleteItem = (id: number) => {
  menuItems.value = menuItems.value.filter(item => item.id !== id);
};

const openEditModal = (item: MenuItem) => {
  isEditing.value = true;
  currentItem.value = { ...item };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  currentItem.value = { id: 0, name: '', price: 0, category: '' };
};
</script>

<style scoped>
.table-auto {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  text-align: left;
  padding: 8px;
}

th {
  background-color: #f4f4f4;
}

/* Add any additional scoped styles here */
</style>
