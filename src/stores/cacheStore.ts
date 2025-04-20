import axios, { AxiosResponse } from 'axios';

import { defineStore } from 'pinia';
import { getItem, setItem } from '../db';
import { STORE_API, STORE_VERSION } from '../db/constants';
import { ProductCachedMetadata } from '../types';

const LAST_UPDATED_KEY = 'lastUpdated';

interface CacheOptions {
  cacheKey: string;
  cacheName: string;
}

interface FetchOptions extends CacheOptions {
  loadCache?: boolean;
  saveCache?: boolean;
  expirationTime?: number;
}
export const useCacheStore = defineStore('cache', {
  actions: {
    async fetchData<T>(
      url: string,
      options: FetchOptions = { loadCache: false, saveCache: false, cacheName: STORE_API, cacheKey: 'default', expirationTime: 5 * 60 * 1000 }
    ): Promise<T | null> {
      
      if (options.loadCache) {
        const cachedData = await this.getCachedData<T>(options.cacheName, options.cacheKey);
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
        const cachedData = await this.getCachedData<T>(options.cacheName, options.cacheKey);
        if (cachedData) {
          console.warn('⚠️ Нет интернета, используются кешированные данные');
          return cachedData;
        }

        console.error('❌ Данных в кеше нет');
        return null;
      }
    },

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
    },
    async updateProductMetaData(payload: Partial<ProductCachedMetadata>): Promise<void> {
      const cachedMetadata: ProductCachedMetadata[] = await getItem(STORE_VERSION, 'products') || [];
      const entry = cachedMetadata.find((p) => p.licenseId === payload.licenseId);

      if (entry) {
        entry.lastLaunch = payload.lastLaunch ?? entry.lastLaunch;
        entry.activationDate = payload.activationDate ?? entry.activationDate;
        entry.code = payload.code ?? entry.code;
      } else {
        cachedMetadata.push(payload as ProductCachedMetadata);
      }
      await setItem(STORE_VERSION, 'products', cachedMetadata);
    },
    
  },
});