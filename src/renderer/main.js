import Vue from 'vue';
import axios from 'axios';
import Vuetify from 'vuetify';
import VueAxios from 'vue-axios';
import VueLazyLoad from 'vue-lazyload';
import VueTouch from 'vue-touch';

import App from './App';
import router from './router';
import store from './store';

require('vuetify/dist/vuetify.min.css');
require('vue-image-lightbox/dist/vue-image-lightbox.min.css');

Vue.use(Vuetify, VueAxios, axios);
Vue.use(VueLazyLoad);
Vue.use(VueTouch, { name: 'v-touch' });

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app');
