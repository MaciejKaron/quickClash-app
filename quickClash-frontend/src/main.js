import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { FontAwesomeIcon } from './plugins/font-awesome'
import BootstrapVue3 from "bootstrap-vue-3";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import CountryFlag from 'vue-country-flag-next'


createApp(App)
    .use(router)
    .use(store)
    .use(BootstrapVue3)
    .use(ToastPlugin)
    .use(CountryFlag)
    .component("font-awesome-icon", FontAwesomeIcon)
    .component('Datepicker', Datepicker)
    .mount('#app')
    
