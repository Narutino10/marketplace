import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from "pinia";
import piniaPersist from 'pinia-plugin-persist'
import App from './App.vue'
import router from './router/router';
import { VueCookieNext } from 'vue-cookie-next';
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fas, far, fab)
dom.watch();

const pinia = createPinia()
pinia.use(piniaPersist)

const app = createApp(App)

app.use(pinia);
app.use(router);
app.use(VueCookieNext);
app.mount('#app');



