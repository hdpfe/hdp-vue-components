import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import hdpVueComponents from 'hdp-vue-components';

Vue.config.debug = true;

Vue.use(hdpVueComponents.components);
Vue.use(VueRouter);

var router = new VueRouter();

var App = Vue.extend({});

router.map(routes);

router.start(App, '#app-main');
