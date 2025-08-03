<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Orders</h1>

    <!-- Filter to hide delivered orders -->
    <div class="mb-4">
      <label class="flex items-center space-x-2">
        <input type="checkbox" v-model="hideDelivered" class="form-checkbox">
        <span>Hide Delivered Orders</span>
      </label>
    </div>

    <div class="flex flex-col md:flex-row gap-4 pb-16">
      <!-- Kanban Board -->
      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-x-auto">
        <div v-for="status in filteredStatuses" :key="status" :class="getStatusColor(status) + ' p-4 rounded-lg shadow'">
          <!-- Kanban Column Title -->
          <h2 class="text-lg font-bold mb-2">{{ status }}</h2>

          <div v-for="order in filteredOrdersByStatus[status]" :key="order.id" class="bg-white p-4 rounded-md mb-2 shadow cursor-pointer" @click="selectOrder(order)">
            <!-- Top Section: Time Remaining and Buttons -->
            <div class="flex flex-wrap justify-between items-center mb-2">
              <!-- Time Remaining -->
              <div class="text-lg font-bold text-gray-700">
                {{ calculateTimeRemaining(order.createdAt) }}
              </div>

              <!-- Buttons -->
              <div class="flex gap-2 flex-wrap">
                <button 
                  v-if="order.status !== 'pending'"
                  @click.stop="updateOrderStatus(order, 'prev')"
                  :class="getStatusColor(getPrevStatus(order.status)) + ' px-2 py-1 text-black text-sm rounded-md hover:bg-opacity-80 flex items-center justify-center'"
                >
                  <ArrowLeftIcon class="h-5 w-5" />
                </button>
                <button 
                  v-if="canUpdateStatus(order)"
                  @click.stop="updateOrderStatus(order)"
                  :class="getStatusColor(getNextStatus(order.status)) + ' px-2 py-1 text-black text-sm rounded-md hover:bg-opacity-80 flex items-center justify-center'"
                >
                  <ArrowRightIcon class="h-5 w-5" />
                </button>
                <button @click.stop="printOrder(order)" class="px-2 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 flex items-center justify-center">
                  <PrinterIcon class="h-5 w-5" />
                </button>
              </div>
            </div>

            <p class="font-bold">Order #{{ order.trackingId }}</p>
            <p class="text-sm text-gray-600">{{ blurName(order.customer.name) }}</p>
            <p v-if="order.scheduledAt" class="text-sm text-gray-500">Scheduled At: {{ order.scheduledAt }}</p>
            <p class="text-sm text-gray-500">Total: ${{ order.total.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <!-- Full-Screen Modal for Order Details -->
      <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white w-full max-w-3xl max-h-full overflow-y-auto p-6 rounded-lg shadow-lg relative">
          <!-- Top Section: Time Remaining and Buttons -->
          <div class="flex justify-between items-center mb-4">
            <!-- Status with Color Code -->
            <div class="flex items-center gap-2">
              <div :class="getStatusColor(selectedOrder.status) + ' px-4 py-2 rounded-md font-bold text-black'">
                {{ selectedOrder.status }}
              </div>
              <div class="text-lg font-bold text-gray-700">
                {{ formatTimeRemaining(selectedOrder.createdAt) }}
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-4">
              <button 
                v-if="selectedOrder.status !== 'pending'"
                @click="updateOrderStatus(selectedOrder, 'prev')"
                :class="getStatusColor(getPrevStatus(selectedOrder.status)) + ' px-4 py-2 text-black text-sm rounded-md hover:bg-opacity-80 flex items-center justify-center'"
              >
                <ArrowLeftIcon class="h-5 w-5" />
              </button>
              <button 
                v-if="canUpdateStatus(selectedOrder)"
                @click="updateOrderStatus(selectedOrder)"
                :class="getStatusColor(getNextStatus(selectedOrder.status)) + ' px-4 py-2 text-black text-sm rounded-md hover:bg-opacity-80 flex items-center justify-center'"
              >
                <ArrowRightIcon class="h-5 w-5" />
              </button>
              <button @click="printOrder(selectedOrder)" class="px-2 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 flex items-center justify-center">
                <PrinterIcon class="h-5 w-5" />
              </button>
              <button @click="closeOrderDetail" class="px-4 py-2 bg-gray-300 text-black text-sm rounded-md hover:bg-gray-400 flex items-center justify-center">
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <h2 class="text-lg font-bold mb-4">Order Details</h2>

          <!-- Customer Info -->
          <div class="mb-4 border-b border-gray-300 pb-4">
            <h3 class="text-md font-semibold">Customer Information</h3>
            <p><span class="font-semibold">Name:</span> {{ selectedOrder.customer.name }}</p>
            <p><span class="font-semibold">Phone:</span> {{ selectedOrder.customer.phone }}</p>
          </div>

          <!-- Order Info -->
          <div class="mb-4 border-b border-gray-300 pb-4">
            <h3 class="text-md font-semibold">Order Information</h3>
            <p><span class="font-semibold">Order ID:</span> {{ selectedOrder.trackingId }}</p>
            <p v-if="selectedOrder.scheduledAt"><span class="font-semibold">Scheduled At:</span> {{ selectedOrder.scheduledAt }}</p>
          </div>

          <!-- Items -->
          <div class="mb-4">
            <h3 class="text-md font-semibold">Order Items</h3>
            <table class="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th class="border-b border-gray-300 py-2">#</th>
                  <th class="border-b border-gray-300 py-2">Item</th>
                  <th class="border-b border-gray-300 py-2">Quantity</th>
                  <th class="border-b border-gray-300 py-2">Customizations</th>
                  <th class="border-b border-gray-300 py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in selectedOrder.items" :key="item.id">
                  <td class="py-2">{{ index + 1 }}</td>
                  <td class="py-2">{{ item.name }}</td>
                  <td class="py-2">{{ item.quantity }}</td>
                  <td class="py-2">{{ item.customizations || 'None' }}</td>
                  <td class="py-2">${{ item.price.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
            <p class="text-right font-bold mt-4">Total: ${{ selectedOrder.total.toFixed(2) }}</p>
          </div>

          <!-- Comments -->
          <div v-if="selectedOrder.comments" class="mb-4 bg-yellow-100 p-4 rounded">
            <h3 class="text-md font-semibold">Customer Comments</h3>
            <p>{{ selectedOrder.comments }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Order } from '../types';
import { ordersApi } from '../mocks/orders';
import { ArrowLeftIcon, ArrowRightIcon, PrinterIcon, XMarkIcon } from '@heroicons/vue/24/solid';

const orders = ref<Order[]>([]);
const statuses = ref(['pending', 'accepted', 'preparing', 'ready', 'delivered']);
const selectedOrder = ref<Order | null>(null);
const hideDelivered = ref(false);

onMounted(async () => {
  orders.value = await ordersApi.getOrders();
});

const filteredOrdersByStatus = computed(() => {
  return statuses.value.reduce((acc: Record<string, Order[]>, status: string) => {
    acc[status] = orders.value.filter((order: Order) => {
      const matchesStatus = order.status === status;
      const isVisible = !(hideDelivered.value && order.status === 'delivered');
      return matchesStatus && isVisible;
    });
    return acc;
  }, {} as Record<string, Order[]>);
});

const filteredStatuses = computed(() => {
  return hideDelivered.value
    ? statuses.value.filter((status: string) => status !== 'delivered')
    : statuses.value;
});

const blurName = (name: string) => {
  const [firstName, ...rest] = name.split(' ');
  return `${firstName[0]}*** ${rest.join(' ')}`;
};

const canUpdateStatus = (order: Order) => {
  const statusFlow = ['pending', 'accepted', 'preparing', 'ready', 'delivered'];
  return statusFlow.indexOf(order.status) < statusFlow.length - 1;
};

const updateOrderStatus = (order: Order, direction: 'next' | 'prev' = 'next') => {
  const statusFlow = ['pending', 'accepted', 'preparing', 'ready', 'delivered'];
  const currentIndex = statusFlow.indexOf(order.status);
  if (direction === 'next' && currentIndex < statusFlow.length - 1) {
    order.status = statusFlow[currentIndex + 1] as any;
  } else if (direction === 'prev' && currentIndex > 0) {
    order.status = statusFlow[currentIndex - 1] as any;
  }
};

const selectOrder = (order: Order) => {
  console.log('Order selected:', order);
  selectedOrder.value = order;
};

const closeOrderDetail = () => {
  selectedOrder.value = null;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-[var(--color-pending)]';
    case 'accepted':
      return 'bg-blue-100';
    case 'preparing':
      return 'bg-purple-100';
    case 'ready':
      return 'bg-green-100';
    case 'delivered':
      return 'bg-gray-100';
    default:
      return 'bg-gray-100';
  }
};

const printOrder = (order: Order) => {
  const printContent = `
    <div>
      <h1>Order Details</h1>
      <p><strong>Order ID:</strong> ${order.trackingId}</p>
      <p><strong>Customer:</strong> ${order.customer.name}</p>
      <p><strong>Phone:</strong> ${order.customer.phone}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      <h2>Items</h2>
      <ul>
        ${order.items.map((item, index) => `<li>${index + 1}. ${item.quantity}x ${item.name} - $${item.price.toFixed(2)}</li>`).join('')}
      </ul>
      ${order.comments ? `<h2>Comments</h2><p>${order.comments}</p>` : ''}
    </div>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }
};

const calculateTimeRemaining = (createdAt: string) => {
  const now = new Date();
  const createdTime = new Date(createdAt);
  const diffInMs = createdTime.getTime() - now.getTime();
  const diffInMinutes = Math.ceil(diffInMs / (1000 * 60));
  return diffInMinutes > 0 ? `${diffInMinutes} minutes` : `${Math.abs(diffInMinutes)} minutes`;
};

const formatTimeRemaining = (createdAt: string) => {
  const now = new Date();
  const createdTime = new Date(createdAt);
  const diffInMs = createdTime.getTime() - now.getTime();
  const diffInMinutes = Math.abs(Math.ceil(diffInMs / (1000 * 60)));
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const getNextStatus = (currentStatus: string) => {
  const statusFlow = ['pending', 'accepted', 'preparing', 'ready', 'delivered'];
  const currentIndex = statusFlow.indexOf(currentStatus);
  return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
};

const getPrevStatus = (currentStatus: string) => {
  const statusFlow = ['pending', 'accepted', 'preparing', 'ready', 'delivered'];
  const currentIndex = statusFlow.indexOf(currentStatus);
  return currentIndex > 0 ? statusFlow[currentIndex - 1] : null;
};
</script>