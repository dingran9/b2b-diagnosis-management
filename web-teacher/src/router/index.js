import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: resolve => require(['../components/login/login.vue'], resolve)
    },
    {
      path: '/main',
      redirect: '/myClass/myClass',
      component: resolve => require(['../components/main/index.vue'], resolve),
      children: [{
        path: '/senseOfIntellectualClass',
        component: resolve => require(['../components/senseOfIntellectualClass/realTimeClass.vue'], resolve)//
      },{
        path: '/realTimeClass',
        component: resolve => require(['../components/realTimeClass/realTimeClass.vue'], resolve)//
      }, {
        path: '/myClass/myClass',
        component: resolve => require(['../components/myClass/myClass.vue'], resolve)//
      }, {
        path: '/errorManager/studentsList',
        component: resolve => require(['../components/errorManager/studentsList.vue'], resolve)//
      }, {
        path: '/errorManager/errorsList/:id/:userName',
        name: 'errorsList',
        component: resolve => require(['../components/errorManager/errorsList.vue'], resolve)//
      }, {
        path: '/errorManager/errorDetail/:userName',
        name: 'errorDetail',
        component: resolve => require(['../components/errorManager/errorDetail.vue'], resolve)//
      }, {
        path: '/projectLearning/projectLearning',
        name: '/projectLearning',
        component: resolve => require(['../components/projectLearning/projectLearning.vue'], resolve)//
      }, {
        path: '/lessonManager/lessonManager',
        name: '/lessonManager',
        component: resolve => require(['../components/lessonManager/lessonManager.vue'], resolve)//
      }, {
        path: '/paperManger',
        component: resolve => require(['../pages/paperManger/paperManger.vue'], resolve)//
      }, {
        path: '/questionStorage/questionTest',
        component: resolve => require(['../components/questionStorage/questionTest.vue'], resolve)//
      }, {
        path: '/questionStorage/questionList',
        component: resolve => require(['../components/questionStorage/questionList.vue'], resolve)//
      }, {
        path: '/questionStorage/singleQuestionList',
        component: resolve => require(['../components/questionStorage/singleQuestionList.vue'], resolve)//
      }, {
        path: '/questionStorage/singleQuestionEdit',
        component: resolve => require(['../components/questionStorage/singleQuestionEdit.vue'], resolve)//
      }, {
        path: '/questionStorage/createNewPaper',
        component: resolve => require(['../components/questionStorage/createNewPaper.vue'], resolve)//
      }, {
        path: '/questionStorage/classTestReport',
        component: resolve => require(['../components/questionStorage/classTestReport/classTestReport.vue'], resolve)//
      }, {
        path: '/questionStorage/favorite_kzc',
        component: resolve => require(['../components/questionStorage/classTestReport/favorite_kzc.vue'], resolve)//
      }, {
        path: '/questionStorage/reportDetail_kzc',
        component: resolve => require(['../components/questionStorage/classTestReport/reportDetail_kzc.vue'], resolve)//
      }, {
        path: '/questionStorage/reportDetail_duoheyi',
        component: resolve => require(['../components/questionStorage/classTestReport/reportDetail_duoheyi.vue'], resolve)//
      }, {
        path: '/studentPaperList',
        component: resolve => require(['../components/markPapers/studentPaperList/index.vue'], resolve)//
      }, {
        path: '/teacherMarkDetail',
        component: resolve => require(['../components/markPapers/teacherMarkDetail/index.vue'], resolve)//
      }, {
        path: '/markStudentPaper',
        component: resolve => require(['../components/markPapers/markStudentPaper/index.vue'], resolve)//
      }, {
        path: '/markPapers',
        component: resolve => require(['../components/markPapers/index.vue'], resolve)//
      }, {
        path: '/markJeduanPapers',
        component: resolve => require(['../components/markPapers/index.vue'], resolve)//
      }, {
        path: '/syncCoach/syncCoach',
        component: resolve => require(['../components/syncCoach/syncCoach.vue'], resolve)//
      }, {
        path: '/disciplineEvaluation/disciplineEvaluation',
        component: resolve => require(['../components/disciplineEvaluation/disciplineEvaluation.vue'], resolve)//
      }, {
        path: '/releaseTesting/releaseTesting',
        component: resolve => require(['../components/releaseTesting/releaseTesting.vue'], resolve)//
      }, {
        path: '/showData/reportDetailsSingleClass',//一个班级报告详情
        component: resolve => require(['../components/common/showData/reportDetailsSingleClass.vue'], resolve)//
      }, {
        path: '/showData/reportDetailsTotal',//总报告详情
        component: resolve => require(['../components/common/showData/reportDetailsTotal.vue'], resolve),//
        children: [
          {
            path: '/showData/reportDetailsTotal/class1',
            component: resolve => require(['../components/common/showData/class1.vue'], resolve)//
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
            path: '/showData/reportDetailsTotal/class5/',
            component: resolve => require(['../components/common/showData/class5.vue'], resolve),//
            children: [
              {
                path: '/',
                component: resolve => require(['../components/common/showData/class1a.vue'], resolve)
              },
              {
                path: '/showData/reportDetailsTotal/class5a5',//我的班级-班级-教师报告-班级知识掌握情况-模块
                component: resolve => require(['../components/common/showData/class1a.vue'], resolve)
              },
              {
                path: '/showData/reportDetailsTotal/class5b5',//我的班级-班级-教师报告-班级知识掌握情况-知识点
                component: resolve => require(['../components/common/showData/class1b.vue'], resolve)
              },
            ]
          }, {
            path: '/showData/reportDetailsTotal/class6',
            component: resolve => require(['../components/common/showData/class6.vue'], resolve)//
          }, {
            path: '/showData/reportDetailsTotal/class7',
            component: resolve => require(['../components/common/showData/class7.vue'], resolve)//
          }, {
            path: '/showData/reportDetailsTotal/class8',
            component: resolve => require(['../components/common/showData/class8.vue'], resolve)//
          }, {
            path: '/showData/reportDetailsTotal/class9',
            component: resolve => require(['../components/common/showData/class9.vue'], resolve)//
          },
        ]
      }
        , {
          path: '/main/testDetail',
          component: resolve => require(['../components/releaseTesting/testDetail.vue'], resolve)//
        }, {
          path: '/main/sendTestPaper',
          component: resolve => require(['../components/releaseTesting/sendTestPaper.vue'], resolve)//
        },
        {
          path: '/main/newTest',
          component: resolve => require(['../components/newCreatTest/newTest.vue'], resolve)
        }, {
          path: '/main/classroomTest',
          component: resolve => require(['../components/newCreatTest/classroomTest'], resolve)
        }, {
          path: '/main/testPaperList',
          component: resolve => require(['../components/newCreatTest/testPaperList'], resolve)
        }, {
          path: '/main/testPaperInfo',
          component: resolve => require(['../components/newCreatTest/testPaperInfo'], resolve)
        }
      ]
    },
    {
      path: '/startExercise',
      component: resolve => require(['../components/realTimeClass/startExercise.vue'], resolve)
    },
    {
      path: '/kezhongceReportDetail',
      component: resolve => require(['../pages/kezhongceReportDetail/index.vue'], resolve)
    },
    {
      path: '/watchKezhongcePaperDetail',
      component: resolve => require(['../pages/watchKezhongcePaperDetail/index.vue'], resolve)
    },
    {
      path: '/watchKezhongcePaperDetail2',
      component: resolve => require(['../pages/watchKezhongcePaperDetail/index2.vue'], resolve)
    },
    // {
    //   path:'/seeTheQuestionsAdded',
    //   component: resolve => require(['../components/freeMakePaper/seeTheQuestionsAdded.vue'], resolve),
    // }
    {
      path: '/seeTheQuestionsAdded',//自由组卷,dhl
      component: resolve => require(['../components/freeMakePaper/seeTheQuestionsAdded.vue'], resolve),
    },
    {
      path: '/perfectTestInformation',//自由组卷,dhl
      component: resolve => require(['../components/freeMakePaper/perfectTestInformation.vue'], resolve),
    },
    {
      path: '/demo',//自由组卷,dhl
      component: resolve => require(['../components/freeMakePaper/demo.vue'], resolve),
    },
    {
      path: '/savePaperSuccess',//自由组卷,dhl
      component: resolve => require(['../components/freeMakePaper/savePaperSuccess.vue'], resolve),
    },
    {
      path: '/watchPaper',
      component: resolve => require(['../pages/watchPaper/index.vue'], resolve),

    }
  ],
  linkActiveClass: 'act',
})
