const MainRoutes = {
  path: '/main',
  component: () => import('../components/Container.vue'),
  redirect: '/main/products',
  children: [
    {
      path: '/main/products',
      name: 'products',
      component: () => import('../views/Products.vue'),
      meta: {
        bgClass: 'dark-bg'
      }
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
      meta: {
        bgClass: 'dark-bg'
      }
    },
    {
      path: '/main/news',
      name: 'news',
      component: () => import('../views/News.vue'),
      meta: {
        bgClass: 'dark-bg'
      }
    },
    {
      path: '/main/news-view/',
      name: 'news-view',
      component: () => import('../views/NewsView.vue'),
      meta: {
        bgClass: 'dark-bg'
      }
    },
    {
      path: '/main/codes/',
      name: 'codes',
      component: () => import('../views/Codes.vue'),
      meta: {
        bgClass: 'dark-bg'
      }
    },
    {
      path: '/main/help/',
      name: 'help',
      component: () => import('../views/Help.vue'),
      meta: {
        bgClass: 'dark-bg'
      }
    }
  ],
};

export default MainRoutes;
