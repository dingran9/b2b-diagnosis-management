// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from  './store'
console.log(store);
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false
Object.assign(Vue.prototype,require( '@/assets/vueexport'),require('@/assets/tools'))
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created(){
    if (!this.$user().get()) {
      this.$router.push('/login');
    }
  }
})

Vue.filter('time', Vue.prototype.dataParse);
/*Vue.filter('examType', function (value) {
  switch(value)
  {
    case 1:return "期中";  break;
    case 2:return "期末";  break;
    case 3:return "模拟考";  break;
    case 4:return "会考";  break;
    default: return n;
  }
})*/

Vue.prototype.othersContent ={
  colors:['#93bcf2', '#b8e4be', '#fbc05e', '#f5aaaa', '#fbe083', '#d9a1eb',
    '#fc898f', '#949dd4', '#bdaddb','88dbf3'],
}
