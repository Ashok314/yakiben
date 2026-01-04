<template>
  <div class="px-4">
    <h1 class="text-2xl font-bold mb-4">{{ UI_TEXTS.menuManagement.title }}</h1>
    <form @submit.prevent="saveItem" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">{{
          UI_TEXTS.menuManagement.modals.form.nameLabel }}</label>
        <input v-model="menuItem.name" type="text" id="name"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          required />
      </div>
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700">{{
          UI_TEXTS.menuManagement.modals.form.priceLabel }}</label>
        <input v-model="menuItem.price" type="number" id="price"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          required />
      </div>
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700">{{
          UI_TEXTS.menuManagement.modals.form.categoryLabel }}</label>
        <input v-model="menuItem.category" type="text" id="category"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          required />
      </div>
      <div>
        <label for="available" class="block text-sm font-medium text-gray-700">{{
          UI_TEXTS.menuManagement.modals.form.outOfStockLabel }}</label>
        <input v-model="menuItem.available" type="checkbox" id="available" class="mt-1" />
      </div>
      <div>
        <button type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          {{ UI_TEXTS.menuManagement.modals.form.saveButton }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UI_TEXTS } from "../constants/ui-texts";

interface MenuItem {
  name: string;
  price: number;
  category: string;
  available: boolean;
}

const menuItem = ref<MenuItem>({
  name: '',
  price: 0,
  category: '',
  available: false,
});

const saveItem = () => {
  alert(`Item saved: ${JSON.stringify(menuItem.value)}`);
};
</script>

<style scoped></style>
