<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="flex justify-end gap-2 mt-4">
        <button type="button" class="px-4 py-2 bg-gray-300 rounded" @click="onCancel">Cancel</button>
        <button type="button" class="px-4 py-2 bg-red-500 text-white rounded" @click="onConfirm">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  title: String,
  message: String,
});

const emit = defineEmits(['cancel', 'confirm']);

const onCancel = () => {
  emit('cancel');
};

const onConfirm = () => {
  emit('confirm');
};
</script>

<style scoped>
/* Add scoped styles here */
</style>
