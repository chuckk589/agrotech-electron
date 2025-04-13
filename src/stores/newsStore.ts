import axios from "axios";
import { defineStore } from "pinia";
import { RetrieveNewsDto } from "../../../agrotech-back/shared";


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
                const news = await axios.get(`${API_URL}/news?limit=${limit}&range=${range}`);
                this.news = news.data;
            } catch (error) { } finally {
                this.loading = false;
            }
        },
        async setActiveEntry(id: number) {
            this.currentEntry = this.news.find((item) => item.id == id);
        }
    }
})