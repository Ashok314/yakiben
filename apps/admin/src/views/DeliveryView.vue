<template>
  <div>
    <!-- Tabs -->
    <div class="flex justify-around mb-4">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="['px-4 py-2 rounded', activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200']"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Current Delivery Tab -->
    <div v-if="activeTab === 'Current Delivery'">
      <h2 class="text-lg font-semibold mb-4">Current Delivery</h2>
      <div v-if="currentDelivery" class="p-4 bg-white shadow rounded-md">
        <p><strong>Order ID:</strong> {{ currentDelivery.id }}</p>
        <p><strong>Customer:</strong> {{ currentDelivery.customer }}</p>
        <p><strong>Address:</strong> {{ currentDelivery.address }}</p>
        <p><strong>Delivery Time:</strong> {{ formatTime(currentDelivery.deliveryTime) }}</p>
        <p><strong>Order Details:</strong></p>
        <ul class="list-disc pl-5">
          <li v-for="item in currentDelivery.items" :key="item.id">
            {{ item.name }} (x{{ item.quantity }}) - ${{ item.price.toFixed(2) }}
          </li>
        </ul>
        <p><strong>Total:</strong> ${{ currentDelivery.total.toFixed(2) }}</p>
        <p><strong>Payment Status:</strong> {{ currentDelivery.paymentStatus }}</p>
        <div class="flex flex-col gap-4 mt-4">
          <a :href="`https://maps.google.com/?q=${currentDelivery.address}`" target="_blank" class="text-blue-500 hover:underline">View on Map</a>
          <button @click="contactCustomer(currentDelivery)" class="px-4 py-2 bg-green-500 text-white rounded">Contact Customer</button>
          <button @click="markAsDelivered(currentDelivery)" class="px-4 py-2 bg-blue-500 text-white rounded">Mark as Delivered</button>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">
        <p>No current delivery assigned.</p>
      </div>
    </div>

    <!-- My Deliveries Tab -->
    <div v-if="activeTab === 'My Deliveries'">
      <h2 class="text-lg font-semibold mb-4">My Deliveries</h2>
      <div v-for="order in myDeliveries" :key="order.id" class="p-4 mb-4 bg-white shadow rounded-md">
        <p><strong>Order ID:</strong> {{ order.id }}</p>
        <p><strong>Customer:</strong> {{ order.customer }}</p>
        <p><strong>Address:</strong> {{ order.address }}</p>
        <p><strong>Status:</strong> {{ order.status }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface DeliveryOrder {
  id: number;
  customer: string;
  address: string;
  status: string;
  deliveryTime: string;
  assignedTo: string | null;
  items: { id: number; name: string; quantity: number; price: number }[];
  total: number;
  paymentStatus: string;
}

const deliveryOrders = ref<DeliveryOrder[]>([
  {
    id: 1,
    customer: 'John Doe',
    address: '123 Main St',
    status: 'Pending',
    deliveryTime: '12:30 PM',
    assignedTo: null,
    items: [
      { id: 1, name: 'Sushi Roll', quantity: 2, price: 12.99 },
      { id: 2, name: 'Miso Soup', quantity: 1, price: 3.99 },
    ],
    total: 29.97,
    paymentStatus: 'Paid',
  },
  {
    id: 2,
    customer: 'Jane Smith',
    address: '456 Elm St',
    status: 'In Progress',
    deliveryTime: '1:00 PM',
    assignedTo: 'Driver A',
    items: [
      { id: 3, name: 'Ramen Bowl', quantity: 1, price: 9.99 },
    ],
    total: 9.99,
    paymentStatus: 'Pending',
  },
  {
    id: 3,
    customer: 'Alice Johnson',
    address: '789 Oak St',
    status: 'Completed',
    deliveryTime: '2:00 PM',
    assignedTo: 'Driver A',
    items: [
      { id: 4, name: 'Tempura', quantity: 3, price: 8.99 },
    ],
    total: 26.97,
    paymentStatus: 'Paid',
  },
]);

const currentDriver = 'Driver A';
const tabs = ['Current Delivery', 'My Deliveries'];
const activeTab = ref('Current Delivery');
const currentDelivery = ref<DeliveryOrder | null>(deliveryOrders.value.find(order => order.status === 'In Progress' && order.assignedTo === currentDriver) || null);
const myDeliveries = ref(deliveryOrders.value.filter(order => order.assignedTo === currentDriver));

const formatTime = (time: string) => time;

const contactCustomer = (order: DeliveryOrder) => {
  alert(`Contacting customer: ${order.customer}`);
};

const markAsDelivered = (order: DeliveryOrder) => {
  alert(`Order ${order.id} marked as delivered.`);
  order.status = 'Completed';
  currentDelivery.value = null;
};
</script>

<style scoped>
/* Add mobile-friendly styles */
button {
  margin-right: 8px;
}

.flex {
  display: flex;
  flex-wrap: wrap;
}

.shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.rounded-md {
  border-radius: 0.375rem;
}
</style>
