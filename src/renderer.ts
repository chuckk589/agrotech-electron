import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { router } from './router/index';
import { useErrorStore } from './stores/error';
import { useVersionStore } from './stores/version';
import './styles/variables.css';

const app = createApp(App);
app.use(vuetify);
app.use(createPinia());
app.use(router);

const errorStore = useErrorStore()
errorStore.subscribeToErrors()

const versionStore = useVersionStore()
versionStore.subscribe()

app.mount('#app');