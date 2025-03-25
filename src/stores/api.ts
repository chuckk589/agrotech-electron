// stores/apiStore.ts
import { defineStore } from 'pinia';
import { RetrieveSimulatorDto } from '../../../agrotech-back/shared';
import { STORE_API } from '../db/constants';
import { useCacheStore } from './cache';

//@ts-ignore
const API_URL = import.meta.env.VITE_API_URL;

export const useApiStore = defineStore('apiStore', {
    state: () => ({
        loading: false,
        error: null as string | null,
        products: [] as RetrieveSimulatorDto[],
    }),

    actions: {
        async fetchProducts() {
            const apiCache = useCacheStore();
            this.loading = true;
            try {
                const data = await apiCache.fetchData<RetrieveSimulatorDto[]>(API_URL + '/simulators', { useCache: true, cacheName: STORE_API, cacheKey: 'products', expirationTime: 60 * 1000 });
                if (data) {
                    this.products = data;
                }
                else {
                    this.error = 'Не удалось загрузить продукты.';

                }
            } catch (error) {
                this.error = 'Ошибка при получении продуктов.';
            } finally {
                this.loading = false;
            }
        }
        // Получение списка постов с кешированием
        // async fetchPosts(useCache = true) {
        //   const apiCache = useCacheStore(); // Используем apiCacheStore
        //   this.loading = true;

        //   try {
        //     const data = await apiCache.fetchData<Post[]>(
        //       'https://jsonplaceholder.typicode.com/posts',
        //       { useCache, expirationTime: 5 * 60 * 1000 }
        //     );
        //     if (data) {
        //       this.posts = data;
        //     } else {
        //       this.error = 'Не удалось загрузить посты.';
        //     }
        //   } catch (error) {
        //     this.error = 'Ошибка при получении постов.';
        //   } finally {
        //     this.loading = false;
        //   }
        // },

        // // Получение отдельного поста по ID
        // async fetchPostById(postId: number) {
        //   const apiCache = useCacheStore();
        //   this.loading = true;

        //   try {
        //     const data = await apiCache.fetchData<Post>(
        //       `https://jsonplaceholder.typicode.com/posts/${postId}`,
        //       { useCache: false } // Не используем кеш для одного поста
        //     );
        //     return data;
        //   } catch (error) {
        //     this.error = 'Ошибка при загрузке поста.';
        //     return null;
        //   } finally {
        //     this.loading = false;
        //   }
        // },

        // // Очистка кеша для всех данных
        // async clearCache() {
        //   const apiCache = useCacheStore();
        //   await apiCache.resetCache();
        //   console.log('🗑️ Кеш очищен');
        // },
    },

    // getters: {
    //     hasPosts: (state) => state.posts.length > 0,
    // },
});
