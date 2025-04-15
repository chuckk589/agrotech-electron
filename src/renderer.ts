import { createPinia } from 'pinia';
import { createApp } from 'vue';
import 'vueperslides/dist/vueperslides.css';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { router } from './router/index';
import './styles/main.scss';
import './styles/settings.scss';
import './styles/typography.scss';

const app = createApp(App);
app.use(vuetify);
app.use(createPinia());
app.use(router);


app.mount('#app');