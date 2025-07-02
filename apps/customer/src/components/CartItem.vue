<template>
  <div class="bg-white p-4">
    <div class="flex items-start gap-4">
      <img 
        :src="`/yakiben/customer${cartItem.item.image}`"
        :alt="cartItem.item.name"
        class="w-20 h-20 object-cover rounded-md bg-gray-100"
      />
      
      <div class="flex-1">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-medium">{{ cartItem.item.name }}</h3>
            <div v-if="cartItem.customizations?.length" class="text-sm text-gray-600 mt-1">
              <div v-for="customId in cartItem.customizations" :key="customId">
                {{ getCustomizationName(customId) }}
                <span class="text-gray-500" v-if="getCustomizationPrice(customId)">
                  (+¥{{ getCustomizationPrice(customId) }})
                </span>
              </div>
            </div>
          </div>
          
          <div class="text-right">
            <div class="font-medium">¥{{ cartItem.subtotal }}</div>
          </div>
        </div>
        
        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center space-x-2">
            <button 
              @click="decrementQuantity"
              class="w-8 h-8 flex items-center justify-center rounded-full border
                     text-gray-500 hover:text-gray-700 hover:border-gray-400 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="cartItem.quantity <= 1"
            >
              -
            </button>
            <span class="w-8 text-center">{{ cartItem.quantity }}</span>
            <button 
              @click="incrementQuantity"
              class="w-8 h-8 flex items-center justify-center rounded-full border
                     text-gray-500 hover:text-gray-700 hover:border-gray-400 
                     transition-colors"
            >
              +
            </button>
          </div>
          
          <button 
            @click="removeItem"
            class="text-red-500 text-sm hover:text-red-600 transition-colors"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '../stores/cart';
import type { MenuItem } from '../types';

interface CartItemProps {
  item: MenuItem;
  quantity: number;
  customizations: string[];
  subtotal: number;
}

const props = defineProps<{
  cartItem: CartItemProps;
}>();

const { updateQuantity, removeFromCart } = useCart();

function getCustomizationName(customId: string): string {
  return props.cartItem.item.customizations?.find(c => c.id === customId)?.name || '';
}

function getCustomizationPrice(customId: string): number | undefined {
  return props.cartItem.item.customizations?.find(c => c.id === customId)?.price;
}

function incrementQuantity() {
  updateQuantity(
    props.cartItem.item.id,
    props.cartItem.quantity + 1,
    props.cartItem.customizations
  );
}

function decrementQuantity() {
  if (props.cartItem.quantity > 1) {
    updateQuantity(
      props.cartItem.item.id,
      props.cartItem.quantity - 1,
      props.cartItem.customizations
    );
  }
}

function removeItem() {
  removeFromCart(props.cartItem.item.id, props.cartItem.customizations);
}
</script>
