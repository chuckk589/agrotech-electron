import axios from 'axios';
import { defineStore } from 'pinia';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useTheme } from 'vuetify';
//@ts-ignore
const API_URL = import.meta.env.VITE_API_URL;

export const useConfigStore = defineStore('config', () => {
  const theme = useTheme();
  const online = ref(false);

  const setTheme = (name: string) => {
    theme.global.name.value = name;
  };

  const loadCurrentTheme = async () => {
    const response = await axios.get(`${API_URL}/config/theme`);
    setTheme(response.data);
  };

  const checkOnline = async () => {
    try {
      await axios.get(`${API_URL}/healthcheck`);
      online.value = true;
    } catch (error) {
      online.value = false;
    }
  };

  const checkOnlineInterval = setInterval(async () => {
    await checkOnline();
  }, 30 * 1000);

  onBeforeUnmount(() => {
    clearInterval(checkOnlineInterval);
  });

  onMounted(async () => {
    await checkOnline();
  });


  return {
    loadCurrentTheme,
    setTheme,
    online,
  };
});
