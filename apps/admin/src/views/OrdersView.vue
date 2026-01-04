<template>
  <div class="p-4">
    <!-- Tabs -->
    <div class="mb-4">
      <div class="flex border-b border-gray-300">
        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
          :class="['px-4 py-2', activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500']"
          class="focus:outline-none">
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- All Items Tab -->
    <div v-if="activeTab === 'All Items'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Items for the Day - {{ new Date().toLocaleDateString() }}</h2>
        <button @click="printGroupedItems"
          class="px-2 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 flex items-center justify-center">
          <PrinterIcon class="h-5 w-5 mr-2" />
          Print
        </button>
      </div>
      <table class="table-auto w-full text-left border-collapse">
        <thead>
          <tr>
            <th class="border-b border-gray-300 py-2">Item</th>
            <th class="border-b border-gray-300 py-2">Customizations</th>
            <th class="border-b border-gray-300 py-2">Quantity</th>
            <th class="border-b border-gray-300 py-2">Comments</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in groupedItems" :key="index">
            <td class="py-2">{{ item.name }}</td>
            <td class="py-2">
              <ul>
                <li v-for="(customization, i) in item.customizations" :key="i">
                  {{ customization }}
                </li>
              </ul>
            </td>
            <td class="py-2">{{ item.quantity }}</td>
            <td class="py-2">
              <span v-for="(comment, idx) in item.comments" :key="idx">
                {{ comment.text }} ({{ comment.orderNumber }})<span v-if="idx < item.comments.length - 1">, </span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Single Orders Tab -->
    <div v-if="activeTab === 'Single Orders'">
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
          <div v-for="status in filteredStatuses" :key="status"
            :class="getStatusColor(status) + ' p-4 rounded-lg shadow'">
            <!-- Kanban Column Title -->
            <h2 class="text-lg font-bold mb-2">{{ status }}</h2>

            <div v-for="order in filteredOrdersByStatus[status]" :key="order.id"
              class="bg-white p-4 rounded-md mb-2 shadow cursor-pointer relative" @click="selectOrder(order)">
              <!-- Top Section: Time Remaining and Buttons -->
              <div class="flex flex-wrap justify-between items-center mb-2">
                <!-- Time Remaining -->
                <div class="text-lg font-bold text-gray-700">
                  {{ calculateTimeRemaining(order.createdAt) }}
                </div>

                <!-- Buttons -->
                <div class="flex gap-2 flex-wrap">
                  <button v-if="order.status !== 'pending'" @click.stop="updateOrderStatus(order, 'prev')"
                    :class="getStatusColor(getPrevStatus(order.status)) + ' px-2 py-1 text-black text-sm rounded-md hover:bg-opacity-80 flex items-center justify-center'">
                    <ArrowLeftIcon class="h-5 w-5" />
                  </button>
                  <button v-if="canUpdateStatus(order)" @click.stop="updateOrderStatus(order)"
                    :class="getStatusColor(getNextStatus(order.status)) + ' px-2 py-1 text-black text-sm rounded-md hover:bg-opacity-80 flex items-center justify-center'">
                    <ArrowRightIcon class="h-5 w-5" />
                  </button>
                  <button @click.stop="printOrder(order)"
                    class="px-2 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 flex items-center justify-center">
                    <PrinterIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <p class="font-bold">{{ UI_TEXTS.orders.kanban.orderDetails.trackingId }} {{ order.trackingId }}</p>
                <p class="text-sm text-gray-600">{{ blurName(order.customer.name) }}</p>
                <p v-if="order.deliveryTime" class="text-sm text-gray-500">{{
                  UI_TEXTS.orders.kanban.orderDetails.scheduledAt }}: {{ order.deliveryTime }}</p>
                <p class="text-sm text-gray-500">{{ UI_TEXTS.orders.kanban.orderDetails.total }}: ${{
                  order.total.toFixed(2) }}</p>
              </div>

              <div v-if="DRIVER_STATUS.includes(order.status)" class="mt-4">
                <!-- Assign Driver Button -->
                <button v-if="!order.driver && !order.deliveredAt" @click.stop="showAssignDriverModal(order)"
                  class="px-2 py-1 bg-blue-400 text-white text-sm rounded-md hover:bg-blue-500 flex items-center justify-center md:w-auto w-full">
                  <DeliverIcon class="h-5 w-5 mr-2" />
                  Assign Driver
                </button>

                <!-- Unassign Driver Button -->
                <button v-if="order.driver && !order.deliveredAt" @click.stop="unassignDriver(order)"
                  class="px-2 py-1 bg-red-400 text-white text-sm rounded-md hover:bg-red-500 flex items-center justify-center md:w-auto w-full">
                  <DeliverIcon class="h-5 w-5 mr-2" />
                  Unassign Driver
                </button>

                <!-- Display Assigned Driver -->
                <p v-if="order.driver && !order.deliveredAt" class="text-sm text-gray-600 mt-2">Assigned to: {{
                  order.driver.name }}</p>
                <p v-else-if="order.deliveredAt" class="text-sm text-gray-600 mt-2">Delivered by: {{ order.driver?.name
                  }} at {{ new Date(order.deliveredAt).toLocaleString() }}</p>
              </div>

              <div v-if="status === STATUS_DELIVERED" class="mt-4">
                <!-- Display Delivered By and Delivered At -->
                <p v-if="order.driver" class="text-sm text-gray-600">Delivered by: {{ order.driver.name }}</p>
                <p v-if="order.deliveredAt" class="text-sm text-gray-500">Delivered at: {{ new
                  Date(order.deliveredAt).toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Full-Screen Modal for Order Details -->
        <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          @click.self="closeOrderDetail">
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
                <button v-if="selectedOrder.status !== 'pending'" @click="updateOrderStatus(selectedOrder, 'prev')"
                  :class="getStatusColor(getPrevStatus(selectedOrder.status)) + ' px-4 py-2 text-black text-sm rounded-md hover:bg-opacity-80 flex items-center justify-center'">
                  <ArrowLeftIcon class="h-5 w-5" />
                </button>
                <button v-if="canUpdateStatus(selectedOrder)" @click="updateOrderStatus(selectedOrder)"
                  :class="getStatusColor(getNextStatus(selectedOrder.status)) + ' px-4 py-2 text-black text-sm rounded-md hover:bg-opacity-80 flex items-center justify-center'">
                  <ArrowRightIcon class="h-5 w-5" />
                </button>
                <button @click="printOrder(selectedOrder)"
                  class="px-2 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 flex items-center justify-center">
                  <PrinterIcon class="h-5 w-5" />
                </button>
                <button @click="closeOrderDetail"
                  class="px-2 py-1 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 flex items-center justify-center">
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <h2 class="text-lg font-bold mb-4">{{ UI_TEXTS.orders.modal.title }}</h2>

            <!-- Customer and Order Info -->
            <div class="mb-4 border-b border-gray-300 pb-4">
              <h3 class="text-md font-semibold">{{ UI_TEXTS.orders.modal.customerInfo.title }}</h3>
              <p><span class="font-semibold">{{ UI_TEXTS.orders.modal.customerInfo.name }}:</span> {{ isManagerOrDriver
                ? selectedOrder.customer.name : blurName(selectedOrder.customer.name) }}</p>
              <p><span class="font-semibold">{{ UI_TEXTS.orders.modal.customerInfo.phone }}:</span> {{ isManagerOrDriver
                ? selectedOrder.customer.phone : '***-***-****' }}</p>
              <p><span class="font-semibold">{{ UI_TEXTS.orders.modal.orderInfo.orderId }}:</span> {{
                selectedOrder.trackingId }}</p>
              <p v-if="selectedOrder.deliveryTime"><span class="font-semibold">{{
                UI_TEXTS.orders.modal.orderInfo.scheduledAt }}:</span> {{ selectedOrder.deliveryTime }}</p>
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
                    <td class="py-2">
                      {{ item.name }}
                      <div v-if="item.options && item.options.length" class="text-sm text-gray-500">
                        Options: {{item.options.map(o => o.name).join(', ')}}
                      </div>
                    </td>
                    <td class="py-2">x{{ item.quantity }}</td>
                    <td class="py-2">${{ item.price ? item.price.toFixed(2) : '0.00' }}</td>
                  </tr>
                </tbody>
              </table>
              <p class="text-right font-bold mt-4">{{ UI_TEXTS.orders.modal.items.total }}: ${{
                selectedOrder.total.toFixed(2) }}</p>
            </div>

            <!-- Comments -->
            <div v-if="selectedOrder.comments" class="mb-4 bg-yellow-100 p-4 rounded">
              <h3 class="text-md font-semibold">{{ UI_TEXTS.orders.modal.comments.title }}</h3>
              <p>{{ selectedOrder.comments }}</p>
            </div>
          </div>
        </div>

        <!-- Modal for Assigning Driver -->
        <div v-if="assignDriverModalVisible"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <h2 class="text-lg font-bold mb-4">Assign Driver</h2>
            <ul class="space-y-2">
              <li v-for="user in availableUsers" :key="user.id" class="flex items-center justify-between">
                <span>{{ user.name }} ({{ user.role }})</span>
                <button @click="assignDriverToOrder(selectedOrder, user)"
                  class="px-2 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Order, User, OrderItem } from '../types/types';
import { ordersApi } from '../api/orders';
import { usersApi } from '../api/users';
import { ArrowLeftIcon, ArrowRightIcon, PrinterIcon, XMarkIcon, UserIcon as DeliverIcon } from '@heroicons/vue/24/solid';
import { UI_TEXTS } from "../constants/ui-texts";

const tabs = ['All Items', 'Single Orders'];
const activeTab = ref('All Items');

const orders = ref<Order[]>([]);
const users = ref<User[]>([]);
const STATUS_FLOW = ['pending', 'accepted', 'preparing', 'ready', 'delivering', 'completed'];
const selectedOrder = ref<Order | null>(null);
const hideDeliveredAndDelivering = ref(true); // Checkbox is checked by default
const assignDriverModalVisible = ref(false);
const availableUsers = computed(() => users.value.filter(user => user.role === 'driver'));

// Declare constants for status checks
const STATUS_READY = 'ready';
const STATUS_DELIVERED = 'completed';
const STATUS_DELIVERING = 'delivering';
const HIDDEN_STATUSES = [STATUS_DELIVERED, STATUS_DELIVERING];
const DRIVER_STATUS = [STATUS_READY, STATUS_DELIVERING];

onMounted(async () => {
  orders.value = await ordersApi.getOrders();
  users.value = await usersApi.getUsers();
});

const selectedDateFilter = ref('today');
const specificDate = ref('');

const filteredOrdersByStatus = computed(() => {
  return STATUS_FLOW.reduce((acc: Record<string, Order[]>, status: string) => {
    acc[status] = orders.value.filter((order: Order) => {
      const matchesStatus = order.status === status;
      const isVisible = !(hideDeliveredAndDelivering.value && (order.status === STATUS_DELIVERED || order.status === STATUS_DELIVERING));
      const deliveryDateString = order.deliveryTime ? new Date(order.deliveryTime).toDateString() : '';
      const isToday = selectedDateFilter.value === 'today' && deliveryDateString === new Date().toDateString();
      const isTomorrow = selectedDateFilter.value === 'tomorrow' && deliveryDateString === new Date(Date.now() + 86400000).toDateString();
      const isSpecificDate = selectedDateFilter.value === 'specific' && deliveryDateString === new Date(specificDate.value).toDateString();
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
  if (!name) return '***';
  const parts = name.split(' ');
  const firstName = parts[0] || '';
  const rest = parts.slice(1);
  return `${firstName[0] || ''}*** ${rest.join(' ')}`;
};

const canUpdateStatus = (order: Order) => {
  return STATUS_FLOW.indexOf(order.status) < STATUS_FLOW.length - 1;
};

const updateOrderStatus = async (order: Order, direction: 'next' | 'prev' = 'next') => {
  const currentIndex = STATUS_FLOW.indexOf(order.status);
  let newStatus = order.status;

  if (direction === 'next' && currentIndex < STATUS_FLOW.length - 1) {
    newStatus = STATUS_FLOW[currentIndex + 1] as Order['status'];
  } else if (direction === 'prev' && currentIndex > 0) {
    newStatus = STATUS_FLOW[currentIndex - 1] as Order['status'];
  }

  if (newStatus !== order.status) {
    const success = await ordersApi.updateOrderStatus(order.id, newStatus);
    if (success) {
      order.status = newStatus;
    }
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
  if (!order || !order.items) {
    console.error('Order or items are undefined');
    return;
  }

  const printContent = `
    <div>
      <h1>Order Details</h1>
      <p><strong>Order ID:</strong> ${order.trackingId}</p>
      <p><strong>Customer:</strong> ${order.customer?.name || 'Unknown'}</p>
      <p><strong>Phone:</strong> ${order.customer?.phone || 'N/A'}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Total:</strong> $${order.total?.toFixed(2) || '0.00'}</p>
      <h2>Items</h2>
      <ul>
        ${order.items.map((item, index) => {
    const itemName = item.name || 'Unknown Item';
    const itemPrice = item.price?.toFixed(2) || '0.00';
    const customizations = item.options?.map(o => o.name).join(', ') || '';
    return `<li>${index + 1}. ${item.quantity}x ${itemName} ${customizations ? `(${customizations})` : ''} - $${itemPrice}</li>`;
  }).join('')}
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

const printGroupedItems = () => {
  const todayDate = new Date().toLocaleDateString();
  const printContent = `
    <div>
      <h1>Items for the Day - ${todayDate}</h1>
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr>
            <th style="border-bottom: 1px solid #ccc; padding: 8px;">Item</th>
            <th style="border-bottom: 1px solid #ccc; padding: 8px;">Quantity</th>
            <th style="border-bottom: 1px solid #ccc; padding: 8px;">Comments</th>
          </tr>
        </thead>
        <tbody>
          ${groupedItems.value.map(item => `
            <tr>
              <td style="padding: 8px;">${item.name}</td>
              <td style="padding: 8px;">${item.quantity}</td>
              <td style="padding: 8px;">
                ${item.comments.map(comment => `${comment.text} (${comment.orderNumber})`).join(', ')}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
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
  if (!createdAt) return '--:--';
  const now = new Date();
  const createdTime = new Date(createdAt);
  if (isNaN(createdTime.getTime())) return '--:--';
  const diffInMs = Math.abs(createdTime.getTime() - now.getTime());
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
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
};

const closeAssignDriverModal = () => {
  assignDriverModalVisible.value = false;
  selectedOrder.value = null;
};

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

const groupedItems = computed(() => {
  const today = new Date().toDateString();
  const itemMap: Record<string, { name: string; customizations: string[]; quantity: number; comments: { text: string; orderNumber: string }[] }> = {};

  orders.value
    .filter((order: Order) => {
      if (!order.deliveryTime) return false;
      const deliveryDate = new Date(order.deliveryTime);
      if (isNaN(deliveryDate.getTime())) return false;
      return deliveryDate.toDateString() === today;
    })
    .forEach((order: Order) => {
      order.items.forEach((item: OrderItem) => {
        const itemName = item.name;
        const itemOptions = item.options?.map((o: any) => o.name) || [];
        const itemKey = `${itemName} - ${itemOptions.join(', ')}`;

        if (itemName) {
          if (!itemMap[itemKey]) {
            itemMap[itemKey] = { name: itemName, customizations: itemOptions, quantity: 0, comments: [] };
          }
          itemMap[itemKey].quantity += item.quantity;
          if (order.comments) {
            itemMap[itemKey].comments.push({ text: order.comments, orderNumber: order.trackingId });
          }
        }
      });
    });

  return Object.values(itemMap);
});
</script>