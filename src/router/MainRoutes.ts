const MainRoutes = {
  path: '/main',
  component: () => import('../components/Container.vue'),
  redirect: '/main/products',
  children: [
    {
      path: '/main/products',
      name: 'products',
      component: () => import('../views/Products.vue'),
    },
  ],
};

export default MainRoutes;
