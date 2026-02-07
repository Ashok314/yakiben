import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'menu',
    component: () => import('./views/MenuView.vue')
  },
  {
    path: '/item/:id',
    name: 'itemDetail',
    component: () => import('./views/ItemDetailView.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('./views/CartView.vue')
  },
  {
    path: '/order/:trackingId',
    name: 'order',
    component: () => import('./views/OrderView.vue')
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('./views/HistoryView.vue')
  },
  {
    path: '/auth/callback',
    name: 'authCallback',
    component: () => import('./views/AuthCallbackView.vue')
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
