import Vue from 'vue'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import axios from 'axios';
import '@/assets/font/font.css';
import infiniteScroll from "vue-infinite-scroll";
import 'wowjs/css/libs/animate.css'



import VueSVGIcon from 'vue-svgicon'
Vue.use(infiniteScroll);
Vue.use(VueSVGIcon)

Vue.config.productionTip = false
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://43.138.21.64:8080'
Vue.use(ElementUI);
new Vue({
  axios,
  router,
  store,
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.$bus = this
  },
}).$mount('#app')

//axios.defaults.baseURL='/test'

export default {
  name: "ComFlowList",
  directives: {infiniteScroll},
  data(){}
}

