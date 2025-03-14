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
    {
      path: '/main/product',
      name: 'product',
      component: () => import('../views/ProductView.vue'),
    },
    {
      path: '/main/my-products',
      name: 'my-products',
      component: () => import('../views/MyProducts.vue'),
    }
  ],
};

export default MainRoutes;
