import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import store from './store';
import * as utils  from './config/utils';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import VueDND from 'awe-dnd'
import echarts from 'echarts'

Vue.use(Vuex);
Vue.use(ElementUI);

Vue.use(VueDND)
Vue.use(echarts)

var vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

for (let key in utils) {
  Vue.prototype[key] = utils[key];
}

Vue.prototype.eleAlert = function(str){
  this.$message(str);
};
Vue.prototype.$echarts = echarts
/**
 * 过滤器
 */
Vue.filter('time', Vue.prototype.fTime);
Vue.filter('subjectFilter', Vue.prototype.fSubjectCode);
Vue.filter('gradeCodeFilter',Vue.prototype.fGradeCode);

//vue-resource 拦截器
Vue.http.interceptors.push((request, next) => {
  const user = JSON.parse(localStorage.getItem('Userinfo'));
  const ajaxTime = JSON.parse(localStorage.getItem('ajaxTime'));
  if(ajaxTime && Date.parse(new Date())-ajaxTime >1000*60*60*3 ){
    vm.eleAlert('会话已过期,请重新登录');
    localStorage.clear();
    vm.$router.push('login')
  }
  if (user) {
    if (request.method === "POST") {
      request.body.token = user.token;
    }
    request.headers.set('token', user.token);
    request.headers.set('userId', user.userId+'');
  }
  next((response) => {
    //存储请求的时间
    localStorage.setItem('ajaxTime',Date.parse(new Date()))
    //响应之后对应答进行处理, 对失败的请求做统一处理,对响应时间很长的做统一处理
    if(request.url.indexOf("getCityByProvinceId")!=-1||request.url.indexOf("getDistrictByCityId")!=-1){
      return ;
    }
    switch (response.body.httpCode) {
      case '500':
        Vue.prototype.eleAlert('系统内部错误')
        break
      case "20002":
        Vue.prototype.eleAlert('用户或密码不正确')
        break
      case "40001":
        Vue.prototype.eleAlert('未知请求')
        break
      case "40002":
        Vue.prototype.eleAlert('参数丢失')
        break
      case "40003":
        Vue.prototype.eleAlert('参数类型错误')
        break
      case "40004":
        Vue.prototype.eleAlert('状态错误')
        break
      case "40005":
        Vue.prototype.eleAlert('资源不存在')
        break
      case "40006":
        Vue.prototype.eleAlert('资源被使用')
        break
      case "40007":
        Vue.prototype.eleAlert('资源重复')
        break
      case "40008":
        Vue.prototype.eleAlert('请求达到上限')
        break
      case "40010":
        Vue.prototype.eleAlert('该年级尚有班级没有相关学科的任课老师,请完善信息.')
        break
      case "40301":
        Vue.prototype.eleAlert('认证失败')
        break
      case "40302":
        Vue.prototype.eleAlert('无操作权限')
        break
      case "40304":
        Vue.prototype.eleAlert('签名错误')
        break
      case "40305":
        Vue.prototype.eleAlert('资源锁定')
        break
      case "40101":
        Vue.prototype.eleAlert('用户重复登录')
        break
      case "600002":
        Vue.prototype.eleAlert('账号异地登录,请重新登录');
        window.location.href = 'index.html'
        break
      case "600003":
        Vue.prototype.eleAlert('token过期,请重新登录');
        window.location.href = 'index.html'
        break
      default:
        return response
    }
  });
});

//
// Vue.prototype.rootUrl = '/managerRootUrl'
// Vue.prototype.rootUrl1 = '/managerRootUrl1'

/*测试环境*/
Vue.prototype.rootUrl = Vue.prototype.rootUrls.rootUrl
Vue.prototype.rootUrl1 = Vue.prototype.rootUrls.rootUrl1
// console.log(Vue.prototype.rootUrl);

// /*prod   产品演示环境*/
// Vue.prototype.rootUrl = 'http://diagnosismanager.e-eduspace.com/'
// Vue.prototype.rootUrl1 = 'http://diagnosisprotal.e-eduspace.com/'

