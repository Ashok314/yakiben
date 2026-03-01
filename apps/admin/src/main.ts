import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import './style.css';
import App from './App.vue';
import store from './store'; // Import Vuex store
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';

const i18n = createI18n({
  legacy: false,
  locale: 'en', // default locale
  fallbackLocale: 'en',
  messages: { en },
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(store); // Use Vuex store
app.use(i18n);
app.mount('#app');
