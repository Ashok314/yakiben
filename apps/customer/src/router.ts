
import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./components/HelloWorld.vue'),
    props: { msg: 'Vite + Vue' },
  },
  // Add more routes here
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
