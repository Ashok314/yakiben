<template>
  <div
    @click="router.push({ name: 'itemDetail', params: { id: item.id } })"
    class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative cursor-pointer"
    :class="{ 'border-2 border-primary': quantity > 0 }"
  >
    <div class="relative aspect-video transition-all duration-300 bg-gray-100">
      <img
        :src="getImageUrl(item.image)"
        :alt="item.name"
        class="w-full h-full object-cover transition-transform duration-500"
      />

      <!-- Sold Out Overlay -->
      <div
        v-if="!item.available"
        class="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10"
      >
        <span class="text-white font-medium px-3 py-1 bg-red-500/90 rounded-lg text-sm">
          売り切れ
        </span>
      </div>

      <!-- Floating Action Controls (Overlay) -->
      <div class="absolute bottom-2 right-2 flex gap-2 items-center z-20" @click.stop>
        <!-- Quantity Controls (if already in cart) -->
        <div
          v-if="quantity > 0"
          class="flex items-center shadow-lg rounded-full bg-white overflow-hidden border border-gray-100"
        >
          <button
            @click.stop="handleRemoveOne"
            class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-gray-50 transition-colors"
          >
            <span v-if="quantity === 1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </span>
            <span v-else class="font-bold">-</span>
          </button>
          <span class="w-6 text-center text-sm font-bold bg-white">{{ quantity }}</span>
          <button
            @click.stop="handleAddToCart"
            class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
          >
            <span class="font-bold">+</span>
          </button>
        </div>

        <!-- Add Button (if 0) -->
        <button
          v-else-if="item.available"
          @click.stop="handleAddToCart"
          class="shadow-xl rounded-full p-2.5 flex items-center justify-center transition-all duration-300 bg-primary text-white hover:bg-primary-dark hover:scale-110 active:scale-95 border-none"
        >
          <span v-if="hasRequiredCustomizations && !canUseDefaults" class="text-sm font-bold px-3"
            >詳細</span
          >
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="p-3 pt-2">
      <div class="space-y-1">
        <div class="flex justify-between items-start">
          <h3 class="font-bold text-gray-900 text-sm leading-tight line-clamp-1">
            {{ item.name }}
          </h3>
          <div class="font-bold text-sm text-primary whitespace-nowrap ml-2">¥{{ item.price }}</div>
        </div>

        <div class="flex justify-between items-end">
          <p class="text-[10px] text-gray-500 line-clamp-1 flex-1 mr-2">
            {{ item.description }}
          </p>

          <span
            v-if="item.customizations && item.customizations.length > 0"
            class="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium whitespace-nowrap max-w-[80px] truncate"
            :title="defaultOptionNames || '詳細で選択'"
          >
            {{ defaultOptionNames || 'カスタマイズ' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { MenuItem } from '../types';
import { useCart } from '../stores/cart';
import { getImageUrl } from '../utils/image';

const props = defineProps<{
  item: MenuItem;
}>();

const { getItemQuantity, addToCart, updateQuantity } = useCart();

const currentDefaultCustomizations = computed(() => {
  const defaults: string[] = [];
  if (props.item.customizationGroups) {
    props.item.customizationGroups.forEach((group) => {
      const groupDefaults = group.options.filter((o) => o.is_default).map((o) => o.id);
      defaults.push(...groupDefaults.slice(0, group.max_selection));
    });
  }
  return defaults;
});

const defaultOptionNames = computed(() => {
  if (!props.item.customizationGroups) return '';

  const names: string[] = [];
  props.item.customizationGroups.forEach((group) => {
    // Only show if required or has defaults
    if (group.min_selection > 0 || group.options.some((o) => o.is_default)) {
      const groupDefaults = group.options.filter((o) => o.is_default).map((o) => o.name);
      if (groupDefaults.length > 0) {
        names.push(...groupDefaults);
      }
    }
  });

  if (names.length === 0 && hasRequiredCustomizations.value) return '';

  return names.join('、');
});

const quantity = computed(() => getItemQuantity(props.item.id, currentDefaultCustomizations.value));

const hasRequiredCustomizations = computed(() => {
  return props.item.customizationGroups?.some((g) => g.min_selection > 0) ?? false;
});

const canUseDefaults = computed(() => {
  // Check if defaults satisfy all required groups
  if (!props.item.customizationGroups) return true;

  return props.item.customizationGroups.every((group) => {
    if (group.min_selection === 0) return true; // Optional group

    // Count defaults
    const defaultCount = group.options.filter((o) => o.is_default).length;
    return defaultCount >= group.min_selection && defaultCount <= group.max_selection;
  });
});

const router = useRouter();

function handleAddToCart() {
  if (!props.item.available) return;

  if (hasRequiredCustomizations.value && !canUseDefaults.value) {
    router.push({ name: 'itemDetail', params: { id: props.item.id } });
  } else {
    addToCart(props.item, currentDefaultCustomizations.value);
  }
}

function handleRemoveOne() {
  // Check if we have an item with these exact customizations
  const currentQ = getItemQuantity(props.item.id, currentDefaultCustomizations.value);
  if (currentQ > 0) {
    updateQuantity(props.item.id, currentQ - 1, currentDefaultCustomizations.value);
  } else {
    // Fallback: If we have ANY of this item in the cart, maybe we should warn?
    // Or just do nothing since we can't safely match what to remove.
    alert('詳細は注文画面で変更してください');
  }
}
</script>
