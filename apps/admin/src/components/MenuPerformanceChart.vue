<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="bg-white shadow-md rounded-lg p-4">
      <h3 class="text-lg font-semibold mb-2">Top-Selling Menu Items</h3>
      <canvas id="menuPerformanceChart"></canvas>
    </div>
    <div class="bg-white shadow-md rounded-lg p-4">
      <h3 class="text-lg font-semibold mb-2">Revenue Over Time</h3>
      <canvas id="revenueChart"></canvas>
    </div>
    <div class="bg-white shadow-md rounded-lg p-4">
      <h3 class="text-lg font-semibold mb-2">Order Distribution</h3>
      <canvas id="orderCountChart"></canvas>
    </div>
    <div class="bg-white shadow-md rounded-lg p-4">
      <h3 class="text-lg font-semibold mb-2">Payment Methods</h3>
      <canvas id="paymentMethodChart"></canvas>
    </div>
    <div class="bg-white shadow-md rounded-lg p-4">
      <h3 class="text-lg font-semibold mb-2">Sales Comparison (Last Week vs This Week)</h3>
      <canvas id="salesComparisonChart"></canvas>
    </div>
    <div class="bg-white shadow-md rounded-lg p-4">
      <h3 class="text-lg font-semibold mb-2">Scheduled Orders</h3>
      <canvas id="scheduledOrdersChart"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';

onMounted(() => {
  const menuCtx = document.getElementById('menuPerformanceChart') as HTMLCanvasElement;
  new Chart(menuCtx, {
    type: 'bar',
    data: {
      labels: ['Item 1', 'Item 2', 'Item 3'],
      datasets: [
        {
          label: 'Sales',
          data: [12, 19, 3],
          backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });

  const revenueCtx = document.getElementById('revenueChart') as HTMLCanvasElement;
  new Chart(revenueCtx, {
    type: 'line',
    data: {
      labels: ['Day 1', 'Day 2', 'Day 3'],
      datasets: [
        {
          label: 'Revenue',
          data: [300, 500, 400],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });

  const orderCountCtx = document.getElementById('orderCountChart') as HTMLCanvasElement;
  new Chart(orderCountCtx, {
    type: 'pie',
    data: {
      labels: ['Dine-In', 'Takeaway', 'Delivery'],
      datasets: [
        {
          label: 'Order Count',
          data: [50, 30, 20],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });

  const paymentMethodCtx = document.getElementById('paymentMethodChart') as HTMLCanvasElement;
  new Chart(paymentMethodCtx, {
    type: 'doughnut',
    data: {
      labels: ['Cash', 'Card', 'PayPal'],
      datasets: [
        {
          label: 'Payment Methods',
          data: [40, 35, 25],
          backgroundColor: ['rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });

  const salesComparisonCtx = document.getElementById('salesComparisonChart') as HTMLCanvasElement;
  new Chart(salesComparisonCtx, {
    type: 'bar',
    data: {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [
        {
          label: 'Last Week',
          data: [50, 60, 70, 80, 90, 100, 110],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'This Week',
          data: [55, 65, 75, 85, 95, 105, 115],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });

  const scheduledOrdersCtx = document.getElementById('scheduledOrdersChart') as HTMLCanvasElement;
  new Chart(scheduledOrdersCtx, {
    type: 'line',
    data: {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
      datasets: [
        {
          label: 'Scheduled Orders',
          data: [5, 10, 15, 20, 25],
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });
});
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: 200px;
}
</style>