<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Menu Management</h1>
    <p class="mb-4">Manage your restaurant's menu items here.</p>

    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">Name</th>
          <th class="border border-gray-300 px-4 py-2">Price</th>
          <th class="border border-gray-300 px-4 py-2">Description</th>
          <th class="border border-gray-300 px-4 py-2">Out of Stock</th>
          <th class="border border-gray-300 px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="category in categories">
          <tr>
            <td colspan="5" class="bg-gray-200 text-gray-700 font-bold px-4 py-2">{{ category }}</td>
          </tr>
          <tr v-for="item in menuItems.filter(item => item.category === category)" :key="item.id">
            <td class="border border-gray-300 px-4 py-2">{{ item.name }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ item.price }}</td>
            <td class="border border-gray-300 px-4 py-2">
              {{ item.description.split(' ').slice(0, 30).join(' ') }}{{ item.description.split(' ').length > 30 ? '...' : '' }}
            </td>
            <td class="border border-gray-300 px-4 py-2">
              <span v-if="item.outOfStock" class="text-red-500">Out of Stock</span>
              <span v-else class="text-green-500">Available</span>
            </td>
            <td class="border border-gray-300 px-4 py-2">
              <button class="text-blue-500 hover:underline mr-2" @click="openEditModal(item)">Edit</button>
              <button class="text-red-500 hover:underline" @click="confirmDelete(item.id)">Delete</button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded" @click="openAddModal">Add New Item</button>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex">
      <div class="w-4/5 bg-white p-6 rounded shadow-lg overflow-auto ml-auto">
        <h2 class="text-2xl font-bold mb-4">{{ isEditing ? 'Edit Item' : 'Add Item' }}</h2>
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
            <select v-model="currentItem.category" id="category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" required>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              <option value="add-new">Add New Category</option>
            </select>
            <div v-if="currentItem.category === 'add-new'" class="mt-2">
              <input v-model="newCategory" type="text" placeholder="Enter new category" class="border rounded px-2 py-1 w-full" />
              <button @click="addCategory(newCategory)" class="mt-2 px-4 py-2 bg-green-500 text-white rounded">Add Category</button>
            </div>
          </div>
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea v-model="currentItem.description" id="description" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" required></textarea>
          </div>
          <div class="mb-4">
            <label for="imageUrl" class="block text-sm font-medium text-gray-700">Image URL</label>
            <input v-model="currentItem.imageUrl" type="text" id="imageUrl" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" required />
          </div>
          <div class="mb-4">
            <label for="outOfStock" class="block text-sm font-medium text-gray-700">Out of Stock</label>
            <input v-model="currentItem.outOfStock" type="checkbox" id="outOfStock" class="mt-1" />
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" class="px-4 py-2 bg-gray-300 rounded" @click="confirmCloseModal">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <div v-if="isConfirmDialogOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this item?</p>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="px-4 py-2 bg-gray-300 rounded" @click="closeConfirmDialog">Cancel</button>
          <button type="button" class="px-4 py-2 bg-red-500 text-white rounded" @click="deleteItem(confirmItemId)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { categoriesApi, MOCK_MENU_ITEMS } from '../mocks/menu';
import { MenuItem } from '../types/types';

const menuItems = ref<MenuItem[]>(MOCK_MENU_ITEMS);

const categories = ref<string[]>([]);

categoriesApi.getCategories().then((data) => {
  categories.value = data;
});

const isModalOpen = ref(false);
const isEditing = ref(false);
const currentItem = ref<MenuItem>({ id: 0, name: '', price: 0, category: '', description: '', imageUrl: '', outOfStock: false });
const isConfirmDialogOpen = ref(false);
const confirmItemId = ref<number | null>(null);
const newCategory = ref('');
const unsavedChanges = ref(false);

const openAddModal = () => {
  isEditing.value = false;
  currentItem.value = { id: 0, name: '', price: 0, category: '', description: '', imageUrl: '', outOfStock: false };
  isModalOpen.value = true;
};

const saveItem = () => {
  if (isEditing.value) {
    // Update existing item
    const index = menuItems.value.findIndex((item: MenuItem) => item.id === currentItem.value.id);
    if (index !== -1) {
      menuItems.value[index] = { ...currentItem.value };
    }
  } else {
    // Add new item
    const newItem = { ...currentItem.value, id: Date.now() };
    menuItems.value.push(newItem);
  }
  unsavedChanges.value = false; // Reset unsaved changes flag
  closeModal();
};

const confirmDelete = (id: number) => {
  confirmItemId.value = id;
  isConfirmDialogOpen.value = true;
};

const deleteItem = (id: number) => {
  menuItems.value = menuItems.value.filter((item: MenuItem) => item.id !== id);
  closeConfirmDialog();
};

const openEditModal = (item: MenuItem) => {
  isEditing.value = true;
  currentItem.value = { ...item };
  isModalOpen.value = true;
};

const confirmCloseModal = () => {
  if (unsavedChanges.value) {
    if (confirm('You have unsaved changes. Are you sure you want to close?')) {
      closeModal();
    }
  } else {
    closeModal();
  }
};

const closeModal = () => {
  isModalOpen.value = false;
  currentItem.value = { id: 0, name: '', price: 0, category: '', description: '', imageUrl: '', outOfStock: false };
  unsavedChanges.value = false; // Reset unsaved changes flag
};

const closeConfirmDialog = () => {
  isConfirmDialogOpen.value = false;
  confirmItemId.value = null;
};

const addCategory = (newCategory: string) => {
  if (newCategory && !categories.value.includes(newCategory)) {
    categories.value.push(newCategory);
    currentItem.value.category = newCategory; // Automatically select the new category
    newCategory.value = ''; // Clear the input field properly
  }
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
