import axios from "axios";
import { defineStore } from "pinia";


//@ts-ignore
const API_URL = import.meta.env.VITE_API_URL;

export const useTicketStore = defineStore('ticket', {
    state: () => ({

    }),
    actions: {
        async createTicket(formData: FormData) {
            await axios.post(`${API_URL}/tickets`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        }
    }
})