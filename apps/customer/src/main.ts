import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { router } from './router';
import vue3GoogleLogin from 'vue3-google-login';

const app = createApp(App);

app.use(router);
app.use(vue3GoogleLogin, {
  clientId: '228058456776-74ia8mkrg3jsqmgvmpgkfru3h6khv09v.apps.googleusercontent.com',
});

app.mount('#app');
