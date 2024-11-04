import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { VueQueryPlugin } from '@tanstack/vue-query'; // Import VueQueryPlugin

createApp(App).use(router).use(VueQueryPlugin).mount('#app');
