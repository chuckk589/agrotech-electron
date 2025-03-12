import { createApp } from 'vue';
import vuetify from './plugins/vuetify';
// import { LicenseManager } from 'ag-grid-enterprise';
// import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router/index';


const app = createApp(App);
app.use(vuetify);
// app.use(createPinia());
app.use(router);

// app.config.globalProperties.$http = axiosInstance;
// app.config.globalProperties.$emitter = emitter;

app.mount('#app');