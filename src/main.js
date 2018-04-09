// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import  Vuex from 'vuex'
import store from './store/store.js'
import Api from './axios/index.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.prototype.$api = Api;
Vue.use(ElementUI);
Vue.use(Vuex);
let comStore = new Vuex.Store(store);
Vue.config.productionTip = false

console.log(Vue.version)

let vm= new Vue({
  // el: '#app',
  router,
  store:comStore,
  template: '<App/>',
  components: { App }
})

vm.$mount('#app')

