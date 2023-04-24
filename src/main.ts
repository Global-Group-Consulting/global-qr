import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice';

import App from './App.vue'
import router from './router'

import "primevue/resources/themes/viva-dark/theme.css";
import "primevue/resources/primevue.min.css";
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';

import './assets/main.scss'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue);
app.use(ToastService);
app.use(DialogService);

app.mount('#app')
