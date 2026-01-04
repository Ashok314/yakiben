import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from './stores/auth';
import OrdersView from './views/OrdersView.vue';
import BaseLayout from './layouts/BaseLayout.vue';
import MenuManagementView from './views/MenuManagementView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/orders' },
  {
    path: '/orders',
    component: BaseLayout,
    children: [
      {
        path: '',
        component: OrdersView,
        meta: { requiresAuth: true, roles: ['manager', 'staff', 'driver'] }
      },
    ]
  },
  {
    path: '/menu-management',
    component: BaseLayout,
    children: [
      {
        path: '',
        component: MenuManagementView,
        meta: { requiresAuth: true, roles: ['manager'] },
      },
    ],
  },
  {
    path: '/user-management',
    component: BaseLayout,
    children: [
      {
        path: '',
        component: () => import('./views/UserManagementView.vue'),
        meta: { requiresAuth: true, roles: ['manager'] },
      },
    ],
  },
  {
    path: '/delivery',
    component: BaseLayout,
    children: [
      {
        path: '',
        component: () => import('./views/DeliveryView.vue'),
        meta: { requiresAuth: true, roles: ['driver', 'manager'] }
      }
    ]
  },
  {
    path: '/settings',
    component: BaseLayout,
    children: [
      {
        path: '',
        component: () => import('./views/SettingsView.vue'),
        meta: { requiresAuth: true, roles: ['manager'] }
      }
    ]
  },
  {
    path: '/account',
    component: BaseLayout,
    children: [
      {
        path: '',
        component: () => import('./views/AccountView.vue'),
        meta: { requiresAuth: true, roles: ['manager', 'staff', 'driver'] },
      },
    ],
  },
  {
    path: '/order-summary',
    component: BaseLayout,
    children: [
      {
        path: '',
        component: () => import('./views/OrderSummaryView.vue'),
        meta: { requiresAuth: true, roles: ['manager'] },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('./views/LoginView.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {

  const authStore = useAuthStore();

  const isLoggedIn = !!authStore.user;

  if (to.path === '/login' && isLoggedIn) {
    next('/orders');
  } else if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else if (to.meta.roles && Array.isArray(to.meta.roles) && !to.meta.roles.includes(authStore.user?.role)) {
    next('/');
  } else {
    next();
  }
});

export default router;
