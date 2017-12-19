import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/syncCoach/syncCoach'
    },
    {
      path: '/login',
      component: resolve => require(['../components/login/login.vue'], resolve)
    },
    {
      path: '/main',
      redirect: '/overview',
      component: resolve => require(['../components/main/index.vue'], resolve),
      children: [
        {
          path: '/addQuyuliankao',
          component: resolve => require(['../pages/quyuliankao/addQuyuliankao/index.vue'], resolve),
        },
        {
          path: '/quyuliankao',  //概览
          component: resolve => require(['../pages/quyuliankao/index.vue'], resolve),
        }, {
          path: '/overview',  //概览
          component: resolve => require(['../components/overview/overview.vue'], resolve)
        }, {
          path: '/createUnit',  // 创建单元进度
          component: resolve => require(['../components/createUnit/createUnit.vue'], resolve)
        }, {
          path: '/syncCoach/syncCoach',
          meta: {keepAlive: true},
          component: resolve => require(['../components/syncCoach/syncCoach.vue'], resolve)
        }, {
          path: '/disciplineEvaluation/disciplineEvaluation',
          meta: {keepAlive: true},
          component: resolve => require(['../components/disciplineEvaluation/disciplineEvaluation.vue'], resolve)
        }, {
          path: '/showData/reportDetailsTotal',//总报告详情
          component: resolve => require(['../components/common/showData/reportDetailsTotal.vue'], resolve),
          children: [
            {
              path: '/showData/reportDetailsTotal/class1',
              component: resolve => require(['../components/common/showData/class1.vue'], resolve)//
            }, {
              path: '/showData/reportDetailsTotal/classZhiliang',
              component: resolve => require(['../components/common/showData/classZhiliang.vue'], resolve)//
            }, {
              path: '/showData/reportDetailsTotal/classjiaoxue',
              component: resolve => require(['../components/common/showData/classjiaoxuechengguo.vue'], resolve)//
            }, {
              path: '/showData/reportDetailsTotal/class2',
              component: resolve => require(['../components/common/showData/class2.vue'], resolve)//
            }, {
              path: '/showData/reportDetailsTotal/class3',
              component: resolve => require(['../components/common/showData/class3.vue'], resolve)//
            }, {
              path: '/showData/reportDetailsTotal/class4',
              component: resolve => require(['../components/common/showData/class4.vue'], resolve)//
            }, {
              path: '/showData/reportDetailsTotal/classAreaTeacherPro',
              component: resolve => require(['../components/common/showData/areaTeacherPro.vue'], resolve)//
            }, {
              path: '/showData/reportDetailsTotal/class5',
              component: resolve => require(['../components/common/showData/class5.vue'], resolve),//
            }, {
              path: '/showData/reportDetailsTotal/classjiaoxuejindu',
              component: resolve => require(['../pages/danyuance/jiaoxuechengji/index.vue'], resolve),//
            }, {
              path: 'classxueshengcankao',
              component: resolve => require(['../pages/danyuance/xueshengcankao/index.vue'], resolve),//
            }, {
              path: 'classxueshengchengji',
              component: resolve => require(['../pages/danyuance/xueshengchengji/index.vue'], resolve),//
            }, {
              path: 'classjiaoshipaiming',
              component: resolve => require(['../pages/danyuance/jiaoshipaiming/index.vue'], resolve),//
            }, {
              path: '/showData/reportDetailsTotal/class6',
              component: resolve => require(['../components/common/showData/class6.vue'], resolve)//
            }, {
              path: '/showData/reportDetailsTotal/class7',
              component: resolve => require(['../components/common/showData/class7.vue'], resolve)//
            }, {
              path: '/showData/reportDetailsTotal/class8',
              component: resolve => require(['../components/common/showData/class8.vue'], resolve)//
            }
          ]
        }
      ]
    },
  ],
  linkActiveClass: 'act',
})
