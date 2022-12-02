import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import router from "./router";
import vSelect from "vue-select";

const app = createApp(App);

app.use(router);

app.component("v-select", vSelect);

app.mount("#app");