// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import echarts from 'echarts'
import "babel-polyfill"

Vue.config.productionTip = false

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './styles/reset.css';
import './styles/color.scss';
import '../theme/index.css';

Vue.use(ElementUI);
Vue.prototype.$reMessage = function (msg,type) {
  this.$message({message: msg,duration:1000,type,center:true})
}
Vue.prototype.$echarts = echarts;

Vue.directive('document-click', {
  bind: function (el, binding, vnode) {
    document.addEventListener('click',binding.value,false);
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
