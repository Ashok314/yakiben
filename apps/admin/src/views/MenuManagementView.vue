<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">{{ UI_TEXTS.menuManagement.title }}</h1>
    <p class="mb-4">{{ UI_TEXTS.menuManagement.description }}</p>

    <table class="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">{{ UI_TEXTS.menuManagement.tableHeaders.name }}</th>
          <th class="border border-gray-300 px-4 py-2">{{ UI_TEXTS.menuManagement.tableHeaders.price }}</th>
          <th class="border border-gray-300 px-4 py-2">{{ UI_TEXTS.menuManagement.tableHeaders.description }}</th>
          <th class="border border-gray-300 px-4 py-2">{{ UI_TEXTS.menuManagement.tableHeaders.outOfStock }}</th>
          <th class="border border-gray-300 px-4 py-2">{{ UI_TEXTS.menuManagement.tableHeaders.actions }}</th>
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
              <span v-if="item.outOfStock" class="text-red-500">{{ UI_TEXTS.menuManagement.itemStatus.outOfStock }}</span>
              <span v-else class="text-green-500">{{ UI_TEXTS.menuManagement.itemStatus.available }}</span>
            </td>
            <td class="border border-gray-300 px-4 py-2">
              <button class="text-blue-500 hover:underline mr-2" @click="openEditModal(item)">{{ UI_TEXTS.menuManagement.actions.edit }}</button>
              <button class="text-red-500 hover:underline" @click="confirmDelete(item.id)">{{ UI_TEXTS.menuManagement.actions.delete }}</button>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded" @click="openAddModal">{{ UI_TEXTS.menuManagement.actions.addNewItem }}</button>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex">
      <div class="w-4/5 bg-white p-6 rounded shadow-lg overflow-auto ml-auto">
        <h2 class="text-2xl font-bold mb-4">{{ isEditing ? UI_TEXTS.menuManagement.modals.editItem.title : UI_TEXTS.menuManagement.modals.addItem.title }}</h2>
        <form @submit.prevent="saveItem">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.menuManagement.modals.form.nameLabel }}</label>
            <input v-model="currentItem.name" type="text" id="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" required />
          </div>
          <div class="mb-4">
            <label for="price" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.menuManagement.modals.form.priceLabel }}</label>
            <input v-model="currentItem.price" type="number" id="price" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" required />
          </div>
          <div class="mb-4">
            <label for="category" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.menuManagement.modals.form.categoryLabel }}</label>
            <select v-model="currentItem.category" id="category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" required>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              <option value="add-new">{{ UI_TEXTS.menuManagement.modals.form.addNewCategory }}</option>
            </select>
            <div v-if="currentItem.category === 'add-new'" class="mt-2">
              <input v-model="newCategory" type="text" placeholder="{{ UI_TEXTS.menuManagement.modals.form.newCategoryPlaceholder }}" class="border rounded px-2 py-1 w-full" />
              <button @click="addCategory(newCategory)" class="mt-2 px-4 py-2 bg-green-500 text-white rounded">{{ UI_TEXTS.menuManagement.modals.form.addCategoryButton }}</button>
            </div>
          </div>
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.menuManagement.modals.form.descriptionLabel }}</label>
            <textarea v-model="currentItem.description" id="description" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" required></textarea>
          </div>
          <div class="mb-4">
            <label for="imageUrl" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.menuManagement.modals.form.imageUrlLabel }}</label>
            <input v-model="currentItem.imageUrl" type="text" id="imageUrl" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" required />
          </div>
          <div class="mb-4">
            <label for="outOfStock" class="block text-sm font-medium text-gray-700">{{ UI_TEXTS.menuManagement.modals.form.outOfStockLabel }}</label>
            <input v-model="currentItem.outOfStock" type="checkbox" id="outOfStock" class="mt-1" />
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" class="px-4 py-2 bg-gray-300 rounded" @click="confirmCloseModal">{{ UI_TEXTS.menuManagement.modals.form.cancelButton }}</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">{{ UI_TEXTS.menuManagement.modals.form.saveButton }}</button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmDialog
      v-if="isConfirmDialogOpen"
      :isOpen="isConfirmDialogOpen"
      :title="confirmDialogTitle"
      :message="confirmDialogMessage"
      @cancel="closeConfirmDialog"
      @confirm="handleConfirmAction"
    />
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from '../components/ConfirmDialog.vue';
import { ref } from 'vue';
import type { MenuItem } from '../types';
import { categoriesApi, MOCK_MENU_ITEMS } from '../mocks/menu';
import { UI_TEXTS } from "../constants/ui-texts";

const menuItems = ref<MenuItem[]>(MOCK_MENU_ITEMS);
const categories = ref<string[]>([]);

categoriesApi.getCategories().then((data) => {
  categories.value = data;
});

const isModalOpen = ref(false);
const isEditing = ref(false);
const currentItem = ref<MenuItem>({ id: 0, name: '', price: 0, category: '', description: '', imageUrl: '', outOfStock: false });
const isConfirmDialogOpen = ref(false);
const confirmDialogTitle = ref('');
const confirmDialogMessage = ref('');
const confirmAction = ref<() => void>(() => {});
const newCategory = ref('');
const unsavedChanges = ref(false);

const openAddModal = () => {
  isEditing.value = false;
  currentItem.value = { id: 0, name: '', price: 0, category: '', description: '', imageUrl: '', outOfStock: false };
  isModalOpen.value = true;
};

const saveItem = () => {
  openConfirmDialog(
    UI_TEXTS.menuManagement.modals.confirmDialogs.save.title,
    UI_TEXTS.menuManagement.modals.confirmDialogs.save.message,
    () => {
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
    }
  );
};

const openConfirmDialog = (title: string, message: string, action: () => void) => {
  confirmDialogTitle.value = title;
  confirmDialogMessage.value = message;
  confirmAction.value = action;
  isConfirmDialogOpen.value = true;
};

const handleConfirmAction = () => {
  confirmAction.value();
  closeConfirmDialog();
};

const confirmDelete = (id: number) => {
  openConfirmDialog(
    UI_TEXTS.menuManagement.modals.confirmDialogs.delete.title,
    UI_TEXTS.menuManagement.modals.confirmDialogs.delete.message,
    () => deleteItem(id)
  );
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
    openConfirmDialog(
      UI_TEXTS.menuManagement.modals.confirmDialogs.unsavedChanges.title,
      UI_TEXTS.menuManagement.modals.confirmDialogs.unsavedChanges.message,
      closeModal
    );
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
};

const addCategory = (newCategory: string) => {
  if (newCategory && !categories.value.includes(newCategory)) {
    categories.value.push(newCategory);
    currentItem.value.category = newCategory; // Automatically select the new category
    newCategory = ''; // Clear the input field properly
  }
};
</script>

<style scoped>
</style>
