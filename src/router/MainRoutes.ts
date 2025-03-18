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
    },
    {
      path: '/main/news',
      name: 'news',
      component: () => import('../views/News.vue'),
    },
    {
      path: '/main/news-view/',
      name: 'news-view',
      component: () => import('../views/NewsView.vue'),
    },
    {
      path: '/main/codes/',
      name: 'codes',
      component: () => import('../views/Codes.vue'),
    },
    {
      path: '/main/help/',
      name: 'help',
      component: () => import('../views/Help.vue'),
    }
  ],
};

export default MainRoutes;
