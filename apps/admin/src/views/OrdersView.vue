<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">{{ UI_TEXTS.orders.title }}</h1>

    <!-- Filter to show orders based on date range -->
    <div class="mb-4">
      <label class="flex items-center space-x-2">
        <span>{{ UI_TEXTS.orders.filterLabel }}</span>
        <select v-model="selectedDateFilter" class="form-select">
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="specific">Specific Date</option>
        </select>
        <input v-if="selectedDateFilter === 'specific'" type="date" v-model="specificDate" class="form-input" />
      </label>
      <label class="flex items-center space-x-2 mt-2">
        <input type="checkbox" v-model="hideDeliveredAndDelivering" class="form-checkbox" checked>
        <span>{{ UI_TEXTS.orders.hideDeliveredAndDeliveringLabel }}</span>
      </label>
    </div>

    <div class="flex flex-col md:flex-row gap-4 pb-16">
      <!-- Kanban Board -->
      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-x-auto">
        <div v-for="status in filteredStatuses" :key="status" :class="getStatusColor(status) + ' p-4 rounded-lg shadow'">
          <!-- Kanban Column Title -->
          <h2 class="text-lg font-bold mb-2">{{ status }}</h2>

          <div v-for="order in filteredOrdersByStatus[status]" :key="order.id" class="bg-white p-4 rounded-md mb-2 shadow cursor-pointer relative" @click="selectOrder(order)">
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

            <div class="space-y-2">
              <p class="font-bold">{{ UI_TEXTS.orders.kanban.orderDetails.trackingId }} {{ order.trackingId }}</p>
              <p class="text-sm text-gray-600">{{ blurName(order.customer.name) }}</p>
              <p v-if="order.deliveryTime" class="text-sm text-gray-500">{{ UI_TEXTS.orders.kanban.orderDetails.scheduledAt }}: {{ order.deliveryTime }}</p>
              <p class="text-sm text-gray-500">{{ UI_TEXTS.orders.kanban.orderDetails.total }}: ${{ order.total.toFixed(2) }}</p>
            </div>

            <div v-if="DRIVER_STATUS.includes(order.status)" class="mt-4">
              <!-- Assign Driver Button -->
              <button 
                v-if="!order.driver && !order.deliveredAt"
                @click.stop="showAssignDriverModal(order)"
                class="px-2 py-1 bg-blue-400 text-white text-sm rounded-md hover:bg-blue-500 flex items-center justify-center md:w-auto w-full"
              >
                <DeliverIcon class="h-5 w-5 mr-2" />
                Assign Driver
              </button>

              <!-- Unassign Driver Button -->
              <button 
                v-if="order.driver && !order.deliveredAt"
                @click.stop="unassignDriver(order)"
                class="px-2 py-1 bg-red-400 text-white text-sm rounded-md hover:bg-red-500 flex items-center justify-center md:w-auto w-full"
              >
                <DeliverIcon class="h-5 w-5 mr-2" />
                Unassign Driver
              </button>

              <!-- Display Assigned Driver -->
              <p v-if="order.driver && !order.deliveredAt" class="text-sm text-gray-600 mt-2">Assigned to: {{ order.driver.name }}</p>
              <p v-else-if="order.deliveredAt" class="text-sm text-gray-600 mt-2">Delivered by: {{ order.driver?.name }} at {{ new Date(order.deliveredAt).toLocaleString() }}</p>
            </div>

            <div v-if="status === STATUS_DELIVERED" class="mt-4">
              <!-- Display Delivered By and Delivered At -->
              <p v-if="order.driver" class="text-sm text-gray-600">Delivered by: {{ order.driver.name }}</p>
              <p v-if="order.deliveredAt" class="text-sm text-gray-500">Delivered at: {{ new Date(order.deliveredAt).toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Full-Screen Modal for Order Details -->
      <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeOrderDetail">
        <div class="bg-white w-full max-w-3xl max-h-full overflow-y-auto p-6 rounded-lg shadow-lg relative">
          <!-- Top Section: Status and Time Remaining -->
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
            <div class="flex gap-4 items-center">
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
              <button @click="closeOrderDetail" class="px-2 py-1 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 flex items-center justify-center">
                <XMarkIcon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <h2 class="text-lg font-bold mb-4">{{ UI_TEXTS.orders.modal.title }}</h2>

          <!-- Customer and Order Info -->
          <div class="mb-4 border-b border-gray-300 pb-4">
            <h3 class="text-md font-semibold">{{ UI_TEXTS.orders.modal.customerInfo.title }}</h3>
            <p><span class="font-semibold">{{ UI_TEXTS.orders.modal.customerInfo.name }}:</span> {{ isManagerOrDriver ? selectedOrder.customer.name : blurName(selectedOrder.customer.name) }}</p>
            <p><span class="font-semibold">{{ UI_TEXTS.orders.modal.customerInfo.phone }}:</span> {{ isManagerOrDriver ? selectedOrder.customer.phone : '***-***-****' }}</p>
            <p><span class="font-semibold">{{ UI_TEXTS.orders.modal.orderInfo.orderId }}:</span> {{ selectedOrder.trackingId }}</p>
            <p v-if="selectedOrder.deliveryTime"><span class="font-semibold">{{ UI_TEXTS.orders.modal.orderInfo.scheduledAt }}:</span> {{ selectedOrder.deliveryTime }}</p>
          </div>

          <!-- Items -->
          <div class="mb-4">
            <h3 class="text-md font-semibold">{{ UI_TEXTS.orders.modal.items.title }}</h3>
            <table class="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th class="border-b border-gray-300 py-2">{{ UI_TEXTS.orders.modal.items.headers.index }}</th>
                  <th class="border-b border-gray-300 py-2">{{ UI_TEXTS.orders.modal.items.headers.item }}</th>
                  <th class="border-b border-gray-300 py-2">{{ UI_TEXTS.orders.modal.items.headers.quantity }}</th>
                  <th class="border-b border-gray-300 py-2">{{ UI_TEXTS.orders.modal.items.headers.price }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in selectedOrder.items" :key="item.id">
                  <td class="py-2">{{ index + 1 }}</td>
                  <td class="py-2">{{ item.name }}</td>
                  <td class="py-2">x{{ item.quantity }}</td>
                  <td class="py-2">${{ item.price.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
            <p class="text-right font-bold mt-4">{{ UI_TEXTS.orders.modal.items.total }}: ${{ selectedOrder.total.toFixed(2) }}</p>
          </div>

          <!-- Comments -->
          <div v-if="selectedOrder.comments" class="mb-4 bg-yellow-100 p-4 rounded">
            <h3 class="text-md font-semibold">{{ UI_TEXTS.orders.modal.comments.title }}</h3>
            <p>{{ selectedOrder.comments }}</p>
          </div>
        </div>
      </div>

      <!-- Modal for Assigning Driver -->
      <div v-if="assignDriverModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
          <h2 class="text-lg font-bold mb-4">Assign Driver</h2>
          <ul class="space-y-2">
            <li v-for="user in availableUsers" :key="user.id" class="flex items-center justify-between">
              <span>{{ user.name }} ({{ user.role }})</span>
              <button 
                @click="assignDriverToOrder(selectedOrder, user)"
                class="px-2 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
              >
                Assign
              </button>
            </li>
          </ul>
          <button @click="closeAssignDriverModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Order } from '../types/types';
import { ordersApi } from '../mocks/orders';
import { MOCK_USERS } from '../mocks/users';
import { ArrowLeftIcon, ArrowRightIcon, PrinterIcon, XMarkIcon, UserIcon as DeliverIcon } from '@heroicons/vue/24/solid';
import { UI_TEXTS } from "../constants/ui-texts";

const orders = ref<Order[]>([]);
const users = ref(MOCK_USERS);
const STATUS_FLOW = ['pending', 'accepted', 'preparing', 'ready', 'delivering', 'delivered'];
const selectedOrder = ref<Order | null>(null);
const hideDeliveredAndDelivering = ref(true); // Checkbox is checked by default
const assignDriverModalVisible = ref(false);
const availableUsers = ref(users.value.filter((user: { id: number; name: string; role: string }) => user.role === 'driver'));

// Declare constants for status checks
const STATUS_READY = 'ready';
const STATUS_DELIVERED = 'delivered';
const STATUS_DELIVERING = 'delivering';
const HIDDEN_STATUSES = [STATUS_DELIVERED, STATUS_DELIVERING];
const DRIVER_STATUS = [STATUS_READY, STATUS_DELIVERING];

onMounted(async () => {
  orders.value = await ordersApi.getOrders();
});

const selectedDateFilter = ref('today');
const specificDate = ref('');

const filteredOrdersByStatus = computed(() => {
  return STATUS_FLOW.reduce((acc: Record<string, Order[]>, status: string) => {
    acc[status] = orders.value.filter((order: Order) => {
      const matchesStatus = order.status === status;
      const isVisible = !(hideDeliveredAndDelivering.value && (order.status === STATUS_DELIVERED || order.status === STATUS_DELIVERING));
      const isToday = selectedDateFilter.value === 'today' && new Date(order.createdAt).toDateString() === new Date().toDateString();
      const isTomorrow = selectedDateFilter.value === 'tomorrow' && new Date(order.createdAt).toDateString() === new Date(Date.now() + 86400000).toDateString();
      const isSpecificDate = selectedDateFilter.value === 'specific' && new Date(order.createdAt).toDateString() === new Date(specificDate.value).toDateString();
      return matchesStatus && isVisible && (isToday || isTomorrow || isSpecificDate);
    });
    return acc;
  }, {} as Record<string, Order[]>);
});

const filteredStatuses = computed(() => {
  return hideDeliveredAndDelivering.value
    ? STATUS_FLOW.filter((status: string) => !HIDDEN_STATUSES.includes(status))
    : STATUS_FLOW;
});

const blurName = (name: string) => {
  const [firstName, ...rest] = name.split(' ');
  return `${firstName[0]}*** ${rest.join(' ')}`;
};

const canUpdateStatus = (order: Order) => {
  return STATUS_FLOW.indexOf(order.status) < STATUS_FLOW.length - 1;
};

const updateOrderStatus = (order: Order, direction: 'next' | 'prev' = 'next') => {
  const currentIndex = STATUS_FLOW.indexOf(order.status);
  if (direction === 'next' && currentIndex < STATUS_FLOW.length - 1) {
    order.status = STATUS_FLOW[currentIndex + 1] as Order['status'];
  } else if (direction === 'prev' && currentIndex > 0) {
    order.status = STATUS_FLOW[currentIndex - 1] as Order['status'];
  }
};

const selectOrder = (order: Order) => {
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
    case 'delivering':
      return 'bg-yellow-100';
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
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  return currentIndex < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIndex + 1] : 'unknown'; // Return 'unknown' instead of null
};

const getPrevStatus = (currentStatus: string) => {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  return currentIndex > 0 ? STATUS_FLOW[currentIndex - 1] : 'unknown'; // Return 'unknown' instead of null
};

const showAssignDriverModal = (order: Order) => {
  selectedOrder.value = order;
  assignDriverModalVisible.value = true;
  // Fetch available users for assignment (mocked here, replace with real API call)
  availableUsers.value = users.value;
};

const closeAssignDriverModal = () => {
  assignDriverModalVisible.value = false;
  selectedOrder.value = null;
};

import type { User } from '../types/types';

const assignDriverToOrder = async (order: Order | null, user: User) => {
  if (!order) return; // Added null check for selectedOrder
  try {
    await ordersApi.assignDriver(order.id, user.id);
    order.driver = user;
    closeAssignDriverModal();
  } catch (error) {
    console.error('Failed to assign driver:', error);
  }
};

const unassignDriver = async (order: Order) => {
  try {
    // Replace with actual API call
    await ordersApi.unassignDriver(order.id);
    order.driver = undefined;
  } catch (error) {
    console.error('Failed to unassign driver:', error);
  }
};

const isManagerOrDriver = true; // Replace with actual logic to determine if the user is a manager or driver
</script>