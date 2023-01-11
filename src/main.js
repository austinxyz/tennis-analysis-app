import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import router from "./router";
import vSelect from "vue-select";
import VueModal from '@kouts/vue-modal'
import '@kouts/vue-modal/dist/vue-modal.css'

const app = createApp(App);

app.use(router);

app.component('Modal', VueModal);
app.component("v-select", vSelect);

app.mount("#app");