import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/login/index.vue'], resolve)
    },
    {
      path: '/main',
      redirect: '/main/tutoring',
      component: resolve => require(['../components/page/main/index.vue'], resolve),
      children: [{
        path: '/main/tutoring',
        component: resolve => require(['../components/page/main/tutoring/index.vue'], resolve)
      },{
        path: '/main/kezhongce',

        component: resolve => require(['../components/page/main/kezhongce/index.vue'], resolve)
      }, {
        path: '/main/subjectTest',
        component: resolve => require(['../components/page/main/subjectTest/index.vue'], resolve)
      }, {
        path: '/main/favourite',
        component: resolve => require(['../components/page/main/favourite/index.vue'], resolve)
      }, {
        path: '/main/errorRecord',
        component: resolve => require(['../components/page/main/errorRecord/index.vue'], resolve)
      }, {
        path: '/main/schoolInfo',
        component: resolve => require(['../components/page/main/schoolInfo/index.vue'], resolve)
      }, {
        path: '/main/peopleSet',
        component: resolve => require(['../components/page/main/peopleSet/index.vue'], resolve)
      }, {
        path: '/main/answerQuestion',
        component: resolve => require(['../components/page/main/answerQuestion/index.vue'], resolve)
      }, {
        path: '/main/reportDetail',
        component: resolve => require(['../components/page/main/reportDetail/index.vue'], resolve)
      }, {
        path: '/main/kezhongceReportDetail',
        component: resolve => require(['../components/page/main/kezhongceReportDetail/index.vue'], resolve)
      }, {
        path: '/main/watchKezhongcePaperDetail',
        component: resolve => require(['../components/page/main/watchKezhongcePaperDetail/index.vue'], resolve)
      }, {
        path: '/main/watchKezhongcePaperDetail2',
        component: resolve => require(['../components/page/main/watchKezhongcePaperDetail2/index.vue'], resolve)
      }, {
        path: '/main/watchPaperDetail',
        component: resolve => require(['../components/page/main/watchPaperDetail/index.vue'], resolve)
      }, {
        path: '/main/capture',
        component: resolve => require(['../components/page/main/capture/index.vue'], resolve)
      }, {
        path: '/main/practice',
        component: resolve => require(['../components/page/main/practice/index.vue'], resolve)
      }, {
        path: '/main/subjectTestList',
        component: resolve => require(['../components/page/main/subjectTestList/index.vue'], resolve)
      }, {
        path: '/main/errorDetail',
        component: resolve => require(['../components/page/main/errorDetail/index.vue'], resolve)
      }, {
        path: '/main/changePwd',
        component: resolve => require(['../components/page/main/changePwd/index.vue'], resolve)
      }, {
        path: '/main/changePhone',
        component: resolve => require(['../components/page/main/changePhone/index.vue'], resolve)
      }, {
        path: '/main/practicePaperDetail',
        component: resolve => require(['../components/page/main/practicePaperDetail/index.vue'], resolve)
      }, {
        path: '/main/setting',
        component: resolve => require(['../components/page/main/setting/index.vue'], resolve)
      },{
        path: '/main/demoShow',
        component: resolve => require(['../components/page/main/demo/demoShow.vue'], resolve)
      },{
        path: '/main/startHomeWork',
        component: resolve => require(['../components/page/main/demo/startHomeWork.vue'], resolve)
      },{
        path: '/main/checkAnswers',
        component: resolve => require(['../components/page/main/demo/checkAnswers.vue'], resolve)
      }]
    },
  ],
  linkActiveClass: 'act',
});
router.beforeEach((to, from, next) => {
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('web-user')) || {};
  } catch (e) {

  }
  if (!user.token && to.path != '/login') {
    console.log('登录')
    next('/login');
  }else if((!user.className || !user.gradeName || !user.userName )&& to.path != '/main/setting' && to.path != '/login'){
    console.log('完善信息')
    next('/main/setting');
  }else{
    next();
  }
})
export default router;

