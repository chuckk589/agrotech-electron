import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/main',
    },
    MainRoutes,
  ],
});