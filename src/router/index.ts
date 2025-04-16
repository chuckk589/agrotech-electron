import { createRouter, createWebHashHistory } from 'vue-router';
import MainRoutes from './MainRoutes';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/main/my-products',
    },
    MainRoutes,
  ],
});