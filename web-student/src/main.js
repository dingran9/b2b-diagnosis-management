// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import animate from 'animate.css'
Vue.use(ElementUI)
//vue方法扩展
import * as vuePrototype from '@/assets/tools';
for (let key in vuePrototype) {
  Vue.prototype[key] = vuePrototype[key];
}
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  mounted(){
    let user = this.$user().get();
    if(!user.className || !user.gradeName || !user.userName){

    }
  }
})
