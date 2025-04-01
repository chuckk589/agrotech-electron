import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { router } from './router/index';
import { useErrorStore } from './stores/error';
import { useManagerStore } from './stores/managerStore';
// import { useVersionStore } from './stores/version';
// import './styles/main.scss';

const app = createApp(App);
app.use(vuetify);
app.use(createPinia());
app.use(router);

const errorStore = useErrorStore()
errorStore.subscribeToErrors()

// const versionStore = useVersionStore()
// versionStore.initializeStore()
const managerStore = useManagerStore()
managerStore.initializeStore()
app.mount('#app');