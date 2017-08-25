import Vue from 'vue';
import axios from 'axios';
import Vuetify from 'vuetify';
import VueAxios from 'vue-axios';

import App from './App';
import router from './router';
import store from './store';

import('../../node_modules/vuetify/dist/vuetify.min.css'); // Ensure you are using css-loader

const userApi = 'http://localhost:3000/user/';

Vue.use(Vuetify, VueAxios, axios);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app');
