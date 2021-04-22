import Vue from 'vue'
import App from './Test.vue'

Vue.config.productionTip = false;

import History from './plugins/History.js';
const historyOption = { query: [] };
Vue.use(History, historyOption);
Vue.prototype.$queryCallback = historyOption.query;

new Vue({
	render: h => h(App),
}).$mount('#app')