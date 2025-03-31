import axios, { AxiosResponse } from 'axios';

import { defineStore } from 'pinia';
import { getItem, setItem } from '../db';

const LAST_UPDATED_KEY = 'lastUpdated';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

interface CacheOptions {
  cacheKey: string;
  cacheName: string;
}

interface FetchOptions extends CacheOptions {
  loadCache?: boolean;
  saveCache?: boolean;
  expirationTime?: number;
}
export const useCacheStore = defineStore('cacheStore', {
  actions: {
    async fetchData<T>(
      url: string,
      options: FetchOptions = { loadCache: false, saveCache: false, cacheName: 'ApiData', cacheKey: 'default', expirationTime: 5 * 60 * 1000 }
    ): Promise<T | null> {

      if (options.loadCache) {
        const cachedData = await this.getCachedData(options.cacheName, options.cacheKey);
        const cacheExpired = await this.isCacheExpired(options.cacheName, options.expirationTime);
        if (cachedData && !cacheExpired) {
          console.log('✅ Данные взяты из IndexedDB');
          return cachedData;
        }
      }

      try {
        console.log('🔄 Загрузка данных с сервера');
        const response: AxiosResponse<T> = await axios.get(url);
        if (options.saveCache) {
          await this.cacheData(response.data, { cacheName: options.cacheName, cacheKey: options.cacheKey });
        }
        return response.data;
      } catch (err) {
        //FIXME: add error handling
        // const error = err as any;
        // this.error = error.response?.data?.message || 'Ошибка при запросе данных';
        console.log(err)
        const cachedData = await this.getCachedData(options.cacheName, options.cacheKey);
        if (cachedData) {
          console.warn('⚠️ Нет интернета, используются кешированные данные');
          return cachedData;
        }

        console.error('❌ Данных в кеше нет');
        return null;
      }
    },

    // async postData<T>(url: string, payload: any, options: CacheOptions = { cacheName: 'ApiData', cacheKey: 'default' }): Promise<T | null> {
    //   this.loading = true;
    //   this.error = null;

    //   try {
    //     const response: AxiosResponse<T> = await axios.post(url, payload);
    //     this.data = response.data;
    //     await this.cacheData(response.data, options);
    //     return response.data;
    //   } catch (err) {
    //     throw err;
    //   }
    // },

    async cacheData<T>(data: T, options: CacheOptions): Promise<void> {
      await setItem(options.cacheName, options.cacheKey, data);
      const timestamp = new Date().toISOString();
      await setItem(options.cacheName, LAST_UPDATED_KEY, timestamp);
    },

    async getCachedData<T>(cacheName: string, cacheKey: string): Promise<T | null> {
      return await getItem(cacheName, cacheKey);
    },
    async isCacheExpired(cacheName: string, expirationTime: number): Promise<boolean> {
      const lastUpdated = await getItem(cacheName, LAST_UPDATED_KEY);
      if (!lastUpdated) return true;
      const lastUpdatedTime = new Date(lastUpdated as string).getTime();
      const currentTime = new Date().getTime();
      return (currentTime - lastUpdatedTime) > expirationTime;
    }
  },
});