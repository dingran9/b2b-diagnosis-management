/**
 * 引入vue,axios,elementUI
 */
import Vue from 'vue';
import axios from 'axios';
import ElementUI from 'element-ui';
/**
 * 服务器地址
 */
import {rootUrl} from '../config/utils'

Vue.use(ElementUI);
Vue.prototype.eleAlert = function (str) {
  this.$message(str);
};

/**
 * 用户登录
 */
var login = (params) => axios.post(rootUrl + ':8866/login/userManagerLogin?requestId=' + Math.random(), params)

//添加一个请求拦截器
axios.interceptors.request.use(function (request) {
  const user = JSON.parse(localStorage.getItem('Userinfo'));
  const ajaxTime = JSON.parse(localStorage.getItem('ajaxTime'));
  if (ajaxTime && Date.parse(new Date()) - ajaxTime > 1000 * 60 * 60 * 3) {
    vm.eleAlert('会话已过期,请重新登录');
    localStorage.clear();
    vm.$router.push('login')
  }
  if (user) {
    if (request.method === "POST") {
      request.body.token = user.token;
    }
    request.headers.set('userId', user.userId + '');
  }
  return request;
}, function (err) {
  //Do something with request error
  console.log(11);
  return Promise.reject(err);
});
//添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  //存储请求的时间
  localStorage.setItem('ajaxTime', Date.parse(new Date()))
  //响应之后对应答进行处理, 对失败的请求做统一处理,对响应时间很长的做统一处理
  if (response.request.responseURL.indexOf("getCityByProvinceId") != -1 || response.request.responseURL.indexOf("getDistrictByCityId") != -1) {
    return response;
  }
  switch (response.data.httpCode) {
    case '500':
      return Vue.prototype.eleAlert('系统内部错误')
      break;
    case "20002":
      return Vue.prototype.eleAlert('用户或密码不正确')
      break;
    case "40001":
      return Vue.prototype.eleAlert('未知请求')
      break;
    case "40002":
      return Vue.prototype.eleAlert('参数丢失')
      break;
    case "40003":
      return Vue.prototype.eleAlert('参数类型错误')
      break;
    case "40004":
      return Vue.prototype.eleAlert('状态错误')
      break;
    case "40005":
      return Vue.prototype.eleAlert('资源不存在')
      break;
    case "40006":
      return Vue.prototype.eleAlert('资源被使用')
      break;
    case "40007":
      return Vue.prototype.eleAlert('资源重复')
      break;
    case "40008":
      return Vue.prototype.eleAlert('请求达到上限')
      break;
    case "40010":
      return Vue.prototype.eleAlert('该年级尚有班级没有相关学科的任课老师,请完善信息.')
      break;
    case "40301":
      return Vue.prototype.eleAlert('认证失败')
      break;
    case "40302":
      return Vue.prototype.eleAlert('无操作权限')
      break;
    case "40304":
      return Vue.prototype.eleAlert('签名错误')
      break;
    case "40305":
      return Vue.prototype.eleAlert('资源锁定')
      break;
    case "40101":
      return Vue.prototype.eleAlert('用户重复登录')
      break;
    default:
      return response;
  }
}, function (err) {
  //Do something with response error
  return Promise.reject(err);
})

export {login}
