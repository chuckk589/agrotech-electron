import { defineStore } from "pinia";
import { RetrieveNewsDto } from "../../../agrotech-back/shared";
import { STORE_API } from "../db/constants";
import { useCacheStore } from "./cacheStore";


//@ts-ignore
const API_URL = import.meta.env.VITE_API_URL;

export const useNewsStore = defineStore('news', {
    state: () => ({
        loading: true,
        currentEntry: {} as RetrieveNewsDto,
        news: [] as RetrieveNewsDto[],
    }),
    getters: {
        updateNews(state) {
            return state.news.filter((item) => item.type == 'update')
        },
        eventNews(state) {
            return state.news.filter((item) => item.type == 'event')
        }
    },
    actions: {
        async fetchNews() {
            const limit = 30;
            const range = 30; //30 days 
            try {
                this.loading = true;
                
                const url = new URL('/news', API_URL);
                url.searchParams.append('limit', limit.toString());
                url.searchParams.append('range', range.toString());

                const cacheStore = useCacheStore();

                const data = await cacheStore.fetchData<RetrieveNewsDto[]>(url.toString(), { loadCache: true, saveCache: true, cacheName: STORE_API, cacheKey: 'news', expirationTime: 60 * 1000 });
                
                if (data) {
                    this.news = data;
                }
            } catch (error) { } finally {
                this.loading = false;
            }
        },

        async setActiveEntry(id: number) {
            this.currentEntry = this.news.find((item) => item.id == id);
        }
    }
})