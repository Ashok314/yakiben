<template>
  <div>
    <div v-if="order" class="bg-white shadow rounded-lg p-6">
      <!-- Header -->
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Order #{{ order.trackingId }}</h1>
          <p class="text-gray-600">{{ formatDate(order.createdAt) }}</p>
        </div>
        <div class="flex gap-2">
          <button 
            v-if="canUpdateOrderStatus"
            @click="updateStatus"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update Status
          </button>
          <button 
            v-if="order.status === 'confirmed' || order.status === 'ready'"
            @click="printOrder"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Print
          </button>
          <router-link 
            to="/orders" 
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Back to Orders
          </router-link>
        </div>
      </div>
      
      <!-- Status badge -->
      <div class="mb-6">
        <span class="px-3 py-1 text-sm rounded-full" :class="getStatusClasses(order.status)">
          {{ order.status }}
        </span>
      </div>
      
      <!-- Order details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 class="text-lg font-semibold mb-2">Customer Details</h2>
          <div class="bg-gray-50 p-4 rounded-md">
            <p><span class="font-semibold">Name:</span> {{ order.customer.name }}</p>
            <p><span class="font-semibold">Phone:</span> {{ order.customer.phone }}</p>
            <p v-if="order.customer.email"><span class="font-semibold">Email:</span> {{ order.customer.email }}</p>
          </div>
        </div>
        
        <div>
          <h2 class="text-lg font-semibold mb-2">Order Details</h2>
          <div class="bg-gray-50 p-4 rounded-md">
            <p><span class="font-semibold">Payment Method:</span> {{ order.paymentMethod }}</p>
            <p><span class="font-semibold">Payment Status:</span> {{ order.paymentStatus }}</p>
            <p v-if="order.pickupTime"><span class="font-semibold">Pickup Time:</span> {{ formatDate(order.pickupTime) }}</p>
          </div>
        </div>
        
        <div v-if="order.address" class="md:col-span-2">
          <h2 class="text-lg font-semibold mb-2">Delivery Address</h2>
          <div class="bg-gray-50 p-4 rounded-md">
            <p>{{ order.address.street }}</p>
            <p>{{ order.address.city }}, {{ order.address.postalCode }}</p>
            <p v-if="order.address.instructions"><span class="font-semibold">Instructions:</span> {{ order.address.instructions }}</p>
          </div>
        </div>
      </div>
      
      <!-- Order items -->
      <h2 class="text-lg font-semibold mb-2">Order Items</h2>
      <div class="overflow-x-auto mb-6">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in order.items" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                  <div v-if="item.options && item.options.length > 0" class="text-sm text-gray-500">
                    <div v-for="option in item.options" :key="option.name">
                      {{ option.name }}: {{ option.choice }}
                      <span v-if="option.price">(+${{ option.price.toFixed(2) }})</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.quantity }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ item.price.toFixed(2) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ (item.price * item.quantity).toFixed(2) }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50">
            <tr>
              <td colspan="3" class="px-6 py-4 text-right text-sm font-medium text-gray-900">Total:</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${{ order.total.toFixed(2) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <p class="text-gray-500">Loading order details...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Order } from '../types';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const order = ref<Order | null>(null);

// Mock orders data - would be fetched from an API in a real app
const mockOrders: Order[] = [
  {
    id: '1',
    trackingId: 'ORD-12345',
    customer: {
      name: 'John Doe',
      phone: '123-456-7890',
    },
    items: [
      { id: '1', name: 'Chicken Teriyaki Bento', quantity: 1, price: 12.99 },
      { id: '2', name: 'California Roll', quantity: 2, price: 8.99 }
    ],
    total: 30.97,
    status: 'pending',
    createdAt: '2025-07-02T10:30:00Z',
    paymentMethod: 'card',
    paymentStatus: 'paid',
  },
  {
    id: '2',
    trackingId: 'ORD-12346',
    customer: {
      name: 'Jane Smith',
      phone: '123-456-7891',
    },
    items: [
      { id: '3', name: 'Salmon Nigiri', quantity: 5, price: 3.99 },
      { id: '4', name: 'Miso Soup', quantity: 1, price: 2.99 }
    ],
    total: 22.94,
    status: 'confirmed',
    createdAt: '2025-07-02T11:00:00Z',
    pickupTime: '2025-07-02T12:00:00Z',
    paymentMethod: 'cash',
    paymentStatus: 'pending',
  },
  {
    id: '3',
    trackingId: 'ORD-12347',
    customer: {
      name: 'Bob Johnson',
      phone: '123-456-7892',
    },
    items: [
      { id: '5', name: 'Katsu Curry', quantity: 1, price: 14.99 }
    ],
    total: 14.99,
    status: 'preparing',
    createdAt: '2025-07-02T11:15:00Z',
    pickupTime: '2025-07-02T12:15:00Z',
    paymentMethod: 'card',
    paymentStatus: 'paid',
  },
  {
    id: '4',
    trackingId: 'ORD-12348',
    customer: {
      name: 'Alice Williams',
      phone: '123-456-7893',
    },
    items: [
      { id: '6', name: 'Vegetable Tempura', quantity: 1, price: 9.99 },
      { id: '7', name: 'Edamame', quantity: 1, price: 4.99 }
    ],
    total: 14.98,
    status: 'ready',
    createdAt: '2025-07-02T10:00:00Z',
    pickupTime: '2025-07-02T10:45:00Z',
    paymentMethod: 'online',
    paymentStatus: 'paid',
  },
  {
    id: '5',
    trackingId: 'ORD-12349',
    customer: {
      name: 'Charlie Brown',
      phone: '123-456-7894',
      email: 'charlie@example.com'
    },
    items: [
      { id: '8', name: 'Spicy Tuna Roll', quantity: 2, price: 9.99 },
      { id: '9', name: 'Green Tea', quantity: 1, price: 2.99 }
    ],
    total: 22.97,
    status: 'delivered',
    createdAt: '2025-07-02T09:30:00Z',
    pickupTime: '2025-07-02T10:15:00Z',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
    },
    paymentMethod: 'card',
    paymentStatus: 'paid',
  }
];

onMounted(() => {
  // Get order by tracking ID from route params
  const trackingId = route.params.trackingId as string;
  order.value = mockOrders.find(o => o.trackingId === trackingId) || null;
  
  if (!order.value) {
    alert('Order not found');
    router.push('/orders');
  }
});

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString();
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'preparing':
      return 'bg-purple-100 text-purple-800';
    case 'ready':
      return 'bg-green-100 text-green-800';
    case 'delivered':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const canUpdateOrderStatus = computed(() => {
  if (!order.value) return false;
  const userRole = authStore.user?.role;
  
  // Different roles might have different abilities to update status
  if (userRole === 'manager') return order.value.status !== 'delivered';
  if (userRole === 'staff') return ['pending', 'confirmed', 'preparing'].includes(order.value.status);
  if (userRole === 'driver') return order.value.status === 'ready';
  
  return false;
});

const updateStatus = () => {
  if (!order.value) return;
  
  // Mock status update logic based on role
  const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
  const currentIndex = statusFlow.indexOf(order.value.status);
  if (currentIndex < statusFlow.length - 1) {
    order.value.status = statusFlow[currentIndex + 1] as any;
  }
};

const printOrder = () => {
  const printContent = document.querySelector('.order-details')?.innerHTML;
  if (printContent) {
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`<html><head><title>Print Order</title></head><body>${printContent}</body></html>`);
    printWindow?.document.close();
    printWindow?.print();
  } else {
    alert('No order details available to print.');
  }
};
</script>
