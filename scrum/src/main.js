import Vue from 'vue'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import '@/assets/font/font.css';

import infiniteScroll from "vue-infinite-scroll";
Vue.use(infiniteScroll);
Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default {
  name: "ComFlowList",
  directives: {infiniteScroll},
  data(){}
}

