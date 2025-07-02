<template>
  <div class="min-h-screen bg-gray-50">
  <div>
    <header class="sticky top-0 bg-white shadow z-50 print:hidden">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center">
          <router-link
              to="/history"
              class="text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </router-link>
            <h1 class="text-xl font-bold ml-4">{{ UI_TEXT.order.detail.title }}</h1>
          </div>
          <div class="flex items-center space-x-2">
            <button
              v-if="order"
              @click="printOrder"
              class="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="印刷"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
            <button
              v-if="order?.needReceipt"
              @click="printReceipt"
              class="p-2 text-primary hover:text-primary-dark transition-colors"
              title="領収書を印刷"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Loading State -->
      <main v-if="isLoading" class="container mx-auto px-4 py-12 text-center">
        <div class="inline-block animate-spin mr-2">
          <svg class="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-gray-600 mt-4">{{ UI_TEXT.common.loading }}</p>
      </main>

      <!-- Not Found -->
      <main v-else-if="!order" class="container mx-auto px-4 py-12">
        <div class="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto text-center space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-lg font-bold text-gray-900">{{ UI_TEXT.order.detail.notFound.title }}</h2>
          <p class="text-gray-600">{{ UI_TEXT.order.detail.notFound.message }}</p>
          <div class="pt-4">
            <router-link 
              to="/history"
              class="inline-block bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary-dark transition-colors"
            >
              {{ UI_TEXT.order.detail.notFound.action }}
            </router-link>
          </div>
        </div>
      </main>

      <!-- Order Content -->
      <main v-else class="container mx-auto px-4 py-6 space-y-6">
        <!-- Order Status -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-4 flex justify-between items-center border-b">
            <div>
              <span class="text-sm text-gray-500">{{ UI_TEXT.order.detail.orderNumber }}</span>
              <div class="font-medium">{{ order.trackingId }}</div>
            </div>
            <div class="text-right">
              <span :class="{
                'text-yellow-600': order.status === 'pending',
                'text-green-600': order.status === 'completed',
                'text-red-600': order.status === 'cancelled'
              }" class="font-medium">
                {{ statusText[order.status] }}
              </span>
              <div class="text-sm text-gray-500">
                {{ formatDate(order.createdAt) }}
              </div>
            </div>
          </div>
          
          <!-- Order Progress -->
          <div class="px-4 py-3 bg-gray-50">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full"
                    :class="{
                      'bg-yellow-500 animate-pulse': order.status === 'pending',
                      'bg-green-500': order.status === 'completed',
                      'bg-red-500': order.status === 'cancelled'
                    }"></span>
              <span class="text-sm font-medium" :class="{
                'text-yellow-800': order.status === 'pending',
                'text-green-800': order.status === 'completed',
                'text-red-800': order.status === 'cancelled'
              }">
                {{ order.status === 'pending' ? '準備中' : order.status === 'completed' ? 'お渡し完了' : 'キャンセル済み' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Order Details -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-4 border-b">
            <h2 class="font-bold">注文内容</h2>
          </div>
          <div class="divide-y">
            <div v-for="item in order.items" :key="item.item.id" class="p-4 flex justify-between items-center">
              <div class="flex items-center space-x-3">
                <img :src="`/yakiben/customer${item.item.image}`" :alt="item.item.name" 
                     class="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <div class="font-medium">{{ item.item.name }}</div>
                  <div class="text-sm text-gray-600">{{ item.quantity }}個</div>
                  <div v-if="item.customizations?.length" class="text-sm text-gray-500">
                    {{ item.customizations.join('、') }}
                  </div>
                </div>
              </div>
              <div class="font-medium">
                ¥{{ item.subtotal }}
              </div>
            </div>
          </div>
          <div class="p-4 border-t bg-gray-50">
            <div class="flex justify-between items-center text-lg font-bold">
              <span>合計</span>
              <span class="text-primary">¥{{ order.total }}</span>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-4 border-b">
            <h2 class="font-bold">お客様情報</h2>
          </div>
          <div class="p-4 space-y-3">
            <div>
              <div class="text-sm text-gray-500">{{ UI_TEXT.order.detail.name }}</div>
              <div>{{ order.customerName }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">{{ UI_TEXT.order.detail.address }}</div>
              <div>{{ order.companyAddress }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">{{ UI_TEXT.order.detail.phone }}</div>
              <div>{{ order.companyContact }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">{{ UI_TEXT.order.detail.pickupTime }}</div>
              <div>{{ formatDate(order.pickupTime) }}</div>
            </div>
            <div v-if="order.notes">
              <div class="text-sm text-gray-500">{{ UI_TEXT.order.detail.notes }}</div>
              <div>{{ order.notes }}</div>
            </div>
          </div>
        </div>

        <!-- Payment Info -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-4 border-b">
            <h2 class="font-bold">{{ UI_TEXT.order.detail.paymentInfo }}</h2>
          </div>
          <div class="p-4 space-y-3">
            <div>
              <div class="text-sm text-gray-500">{{ UI_TEXT.order.detail.paymentMethod }}</div>
              <div class="flex items-center">
                <span v-if="order.paymentMethod === 'paypay'" class="font-bold text-[#0095EE]">{{ UI_TEXT.cart.payment.paypay }}</span>
                <span v-else>{{ UI_TEXT.cart.payment.cash }}</span>
                <span class="text-sm text-gray-500 ml-2">({{ order.paymentStatus === 'completed' ? UI_TEXT.cart.payment.completed : UI_TEXT.cart.payment.pending }})</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <button
            @click="reorder"
            :disabled="isReordering"
            class="flex-1 bg-primary text-white py-4 rounded-xl font-bold shadow-lg 
                   hover:bg-primary-dark transition-all duration-300 transform 
                   hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5
                   disabled:opacity-50 disabled:cursor-not-allowed 
                   disabled:transform-none disabled:shadow-none
                   flex items-center justify-center"
          >
            <span v-if="isReordering" class="inline-block animate-spin mr-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span>{{ isReordering ? UI_TEXT.order.detail.action.reordering : UI_TEXT.order.detail.action.reorder }}</span>
          </button>
        </div>
      </main>

      <!-- Print Layout -->
      <div v-if="order" class="hidden print:block p-8">
        <div class="text-center mb-8 border-b pb-4">
          <h1 class="text-2xl font-bold mb-2">{{ RESTAURANT_INFO.name }}</h1>
          <p class="text-sm">〒{{ RESTAURANT_INFO.address.postal }} {{ RESTAURANT_INFO.address.prefecture }}{{ RESTAURANT_INFO.address.city }}{{ RESTAURANT_INFO.address.line1 }}</p>
          <p class="text-sm">Tel: {{ RESTAURANT_INFO.phone }}</p>
        </div>

        <div class="mb-8">
          <h2 class="text-xl font-bold mb-4 text-center border-b pb-2">{{ order.needReceipt ? UI_TEXT.order.detail.print.receiptTitle : UI_TEXT.order.detail.print.orderTitle }}</h2>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <p class="text-sm text-gray-600">{{ UI_TEXT.order.detail.print.customerName }}</p>
              <p class="font-medium">{{ order.customerName }} 様</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">{{ UI_TEXT.order.detail.orderNumber }}</p>
              <p class="font-medium">{{ order.trackingId }}</p>
            </div>
          </div>
          <div class="mt-4">
            <p class="text-sm text-gray-600">{{ UI_TEXT.order.detail.print.deliveryAddress }}</p>
            <p class="font-medium">{{ order.companyAddress }}</p>
            <p class="font-medium">TEL: {{ order.companyContact }}</p>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-2">
            <div>
              <p class="text-sm text-gray-600">{{ UI_TEXT.order.detail.print.orderDate }}</p>
              <p class="font-medium">{{ formatDateForPrint(order.createdAt) }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">{{ UI_TEXT.order.detail.pickupTime }}</p>
              <p class="font-medium">{{ formatDateForPrint(order.pickupTime) }}</p>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <h3 class="font-bold mb-2">注文内容</h3>
          <table class="w-full mb-4">
            <thead>
              <tr class="border-b">
                <th class="text-left py-2">{{ UI_TEXT.order.detail.print.itemName }}</th>
                <th class="text-center py-2">{{ UI_TEXT.order.detail.print.quantity }}</th>
                <th class="text-right py-2">{{ UI_TEXT.order.detail.print.amount }}</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="item in order?.items" :key="item.item.id">
                <td class="py-2">
                  {{ item.item.name }}
                  <div v-if="item.customizations?.length" class="text-sm text-gray-600">
                    {{ item.customizations.join('、') }}
                  </div>
                </td>
                <td class="text-center py-2">{{ item.quantity }}</td>
                <td class="text-right py-2">¥{{ item.subtotal }}</td>
              </tr>
            </tbody>
            <tfoot class="border-t">
              <tr>
                <td colspan="2" class="py-2 font-bold">合計</td>
                <td class="text-right py-2 font-bold">¥{{ order?.total }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="text-sm text-gray-600 mt-8 text-center">            <p>{{ UI_TEXT.order.detail.print.thanks }}</p>
            <p>{{ UI_TEXT.order.detail.print.seeYouAgain }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { STORAGE_KEYS } from '../constants';
import { RESTAURANT_INFO } from '../config/restaurant';
import { UI_TEXT } from '../constants/ui-text';
import type { Order } from '../types';
import { useCart } from '../stores/cart';
import { ordersApi } from '../data/api/orders';

const route = useRoute();
const router = useRouter();
const { clearCart } = useCart();

const order = ref<Order | null>(null);
const isReordering = ref(false);
const isLoading = ref(true);

const statusText = UI_TEXT.order.status;

// Format date for display
function formatDate(date: string | Date) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short'
  }).format(d);
}

async function loadOrder() {
  console.log('Loading order...');
  isLoading.value = true;
  try {
    const trackingId = route.params.trackingId;
    console.log('TrackingID from route:', trackingId);

    if (!trackingId) {
      console.log('No tracking ID provided');
      order.value = null;
      return;
    }
    
    // Check for current order first
    const currentOrderId = localStorage.getItem(STORAGE_KEYS.CURRENT_ORDER);
    console.log('Current order ID from storage:', currentOrderId);
    if (currentOrderId === trackingId) {
      // Clear it so we don't use it again
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ORDER);
    }

    // Load order from mock API
    const result = await ordersApi.getOrderByTrackingId(trackingId);
    console.log('API returned order:', result);
    order.value = result;
  } catch (error) {
    console.error('Failed to load order:', error);
    order.value = null;
  } finally {
    isLoading.value = false;
  }
}

// Initialize and handle route changes
onMounted(() => {
  console.log('Component mounted, initial params:', route.params);
  loadOrder();
});

// Watch for route changes after initial mount
watch(() => route.params.trackingId, (newId) => {
  console.log('Route param changed to:', newId);
  loadOrder();
});

async function reorder() {
  if (isReordering.value || !order.value) return;
  
  isReordering.value = true;
  
  try {
    // Clear current cart
    clearCart();
    
    // Add all items from the old order
    const { cartItems } = useCart();
    order.value.items.forEach(item => {
      cartItems.value.push({...item}); // Clone the item to avoid reference issues
    });

    // Extract customer name parts
    const [lastName = '', firstName = ''] = (order.value.customerName || '').split(' ');
    
    // Extract address parts with proper error handling
    const addressMatch = order.value.companyAddress.match(/〒(\d{3}-\d{4})\s+(.+?)[都道府県](.+)$/);
    const [_fullMatch, postalCode = '', prefecture = '', city = ''] = addressMatch || [];
    
    const customerInfo = {
      lastName,
      firstName,
      companyName: '',  // Default to empty as it's not in the order model
      postalCode,
      prefecture: prefecture ? `${prefecture}都道府県` : '',
      city,
      addressLine: order.value.companyAddress.replace(/〒\d{3}-\d{4}\s+/, ''),
      companyContact: order.value.companyContact || '',
      needReceipt: order.value.needReceipt || false,
      notes: order.value.notes || '',  // Preserve notes
      paymentMethod: order.value.paymentMethod || 'cash',  // Preserve payment method with default
    };
    
    // Save all customer information
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_INFO, JSON.stringify(customerInfo));

    // Redirect to cart
    await router.push('/cart');
  } catch (error) {
    console.error('Reorder failed:', error);
  } finally {
    isReordering.value = false;
  }
}

// Add print functions
function printOrder() {
  window.print();
}

function printReceipt() {
  // TODO: Implement receipt-specific print layout
  window.print();
}

// Add date format for printing
function formatDateForPrint(date: string | Date) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short'
  }).format(d);
}

// Add print styles
const style = document.createElement('style');
style.textContent = `
@media print {
  @page {
    size: A4;
    margin: 1cm;
  }
  html {
    background-color: white !important;
  }
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
    background-color: white !important;
  }
  .print\\:block {
    display: block !important;
  }
  .print\\:hidden {
    display: none !important;
  }
  /* Ensure proper borders in print */
  .border, .border-t, .border-b {
    border-color: #000 !important;
    border-width: 1px !important;
  }
  .divide-y > * + * {
    border-top: 1px solid #000 !important;
  }
  /* Ensure text colors are visible */
  .text-gray-500, .text-gray-600 {
    color: #444 !important;
  }
  .text-primary {
    color: #000 !important;
  }
  /* Force background colors */
  .bg-white, .bg-gray-50 {
    background-color: white !important;
  }
  /* Table styles */
  table {
    border-collapse: collapse;
  }
  th, td {
    border-bottom: 1px solid #000 !important;
  }
  thead {
    display: table-header-group;
  }
  tfoot {
    display: table-footer-group;
  }
  /* Ensure proper spacing */
  .container {
    width: 100% !important;
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
`;
document.head.appendChild(style);
</script>

<style scoped>
@media print {
  @page {
    size: A4;
    margin: 1cm;
  }
  /* Additional print-specific styles */
  :root {
    color-scheme: light !important;
  }
  * {
    box-shadow: none !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>

