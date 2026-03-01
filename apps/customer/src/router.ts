import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'menu',
    component: () => import('./views/MenuView.vue'),
  },
  {
    path: '/item/:id',
    name: 'itemDetail',
    component: () => import('./views/ItemDetailView.vue'),
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('./views/CartView.vue'),
  },
  {
    path: '/order/:trackingId',
    name: 'order',
    component: () => import('./views/OrderView.vue'),
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('./views/HistoryView.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('./views/ProfileView.vue'),
  },
  {
    path: '/auth/callback',
    name: 'authCallback',
    component: () => import('./views/AuthCallbackView.vue'),
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('./views/PrivacyPolicyView.vue'),
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('./views/TermsOfServiceView.vue'),
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('./views/CalendarView.vue'),
  },
  {
    path: '/recovery',
    name: 'recovery',
    component: () => import('./views/RecoveryView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('./views/NotFoundView.vue'),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

import { useAuthStore } from './stores/auth';

const PUBLIC_ROUTES = ['calendar', 'privacy', 'terms', 'recovery', 'notFound'];

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // If user is soft-deleted, they must stay on /recovery or public info pages
  if (auth.isSoftDeleted.value && !PUBLIC_ROUTES.includes(to.name as string)) {
    return next({ name: 'recovery' });
  }

  // If user is NOT soft-deleted but tries to access /recovery, send them home
  if (!auth.isSoftDeleted.value && to.name === 'recovery') {
    return next({ name: 'menu' });
  }

  next();
});
