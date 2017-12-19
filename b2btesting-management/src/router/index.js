import Vue from 'vue';
import Router from 'vue-router';
import VueResource from 'vue-resource';


Vue.use(Router);
Vue.use(VueResource);

const router =  new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/readme',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      children: [
        {
          path: '/areaPaperList',  //区域联考列表
          component: resolve => require(['../components/productAdmin/areaPaperList.vue'], resolve)
        },
        {
          path: '/areaPaperAdd',  //添加区域联考
          component: resolve => require(['../components/productAdmin/areaPaperAdd.vue'], resolve)
        },
        {
          path: '/arealist',  //局长和教研员列表
          component: resolve => require(['../components/productAdmin/arealist.vue'], resolve)
        },
        {
          path: '/areaAdd',  //添加区域
          component: resolve => require(['../components/productAdmin/areaAdd.vue'], resolve)
        },
        {
          path: '/errorR',
          component: resolve => require(['../components/common/errorR.vue'], resolve)
        },
        {
          path: '/welcome',
          component: resolve => require(['../components/common/welcome.vue'], resolve)
        },
        {
          path: '/',
          component: resolve => require(['../components/productAdmin/schoolMange.vue'], resolve)
        },
        {
          path: '/schoolList',
          component: resolve => require(['../components/productAdmin/schoolList.vue'], resolve)
        },
        {
          path: '/addSchool',
          component: resolve => require(['../components/productAdmin/addSchool.vue'], resolve)
        },
        {//教师管理
          path: '/teacherMange',
          component: resolve => require(['../components/productAdmin/teacherMange.vue'], resolve)
        },
        {
          path: '/teachVersion',
          component: resolve => require(['../components/productAdmin/teachVersion.vue'], resolve)
        },
        {
          path: '/paperMange',
          component: resolve => require(['../components/productAdmin/paperMange.vue'], resolve)
        },
        {
          path: '/paperFormMange',
          component: resolve => require(['../components/productAdmin/paperFormMange.vue'], resolve)
        },
        {
          path: '/addPaperForm',
          component: resolve => require(['../components/productAdmin/addPaperForm.vue'], resolve)
        },
        {
          path: '/editPaperForm',
          component: resolve => require(['../components/productAdmin/editPaperForm.vue'], resolve)
        },
        {
          path: '/addPaper',
          component: resolve => require(['../components/productAdmin/addPaper.vue'], resolve)
        },
        {//教材版本
          path: '/textbookVersion',
          component: resolve => require(['../components/productAdmin/textbookVersion.vue'], resolve)
        },
        {//学校管理
          path: '/schoolMange',
          component: resolve => require(['../components/productAdmin/schoolMange.vue'], resolve)
        },
        {//添加老师
          path: '/addTeacher',
          component: resolve => require(['../components/presidentAdmin/addTeacher.vue'], resolve)
        }, {//批量导入老师
          path: '/importTeacher',
          component: resolve => require(['../components/presidentAdmin/importTeacher.vue'], resolve)
        }, {//新增班级
          path: '/addClass',
          component: resolve => require(['../components/productAdmin/addClass.vue'], resolve)
        }, {//班级管理
          path: '/classMange',
          component: resolve => require(['../components/productAdmin/classMange.vue'], resolve)
        },
        {//校长列表
          path: '/presidentList',
          component: resolve => require(['../components/presidentAdmin/presidentList.vue'], resolve)
        }, {//学生列表-后台管理
          path: '/proAdminStuMange',
          component: resolve => require(['../components/productAdmin/stuMangeList.vue'], resolve)
        }, {//教师列表-后台管理
          path: '/proAdminTeaMange',
          component: resolve => require(['../components/presidentAdmin/teacherList.vue'], resolve)
        }, {//学生列表-校方管理
          path: '/preAdminStuMange',
          component: resolve => require(['../components/productAdmin/stuMangeList.vue'], resolve)
        },{//学生导入-校方管理
          path: '/importStudents',
          component: resolve => require(['../components/productAdmin/importStudent.vue'], resolve)
        }, {//教师列表-校方管理
          path: '/teacherList',
          component: resolve => require(['../components/presidentAdmin/teacherList.vue'], resolve)
        }, {//教师列表-校方管理
          path: '/examPush',
          component: resolve => require(['../components/presidentAdmin/examPush.vue'], resolve)
        },{//诊断报告
          path: '/diagnosticReport',
          meta: { keepAlive: true },
          component: resolve => require(['../components/president/resport/diagnosticReport.vue'], resolve)
        }
        , {//部门列表
          path: '/departmentList',
          component: resolve => require(['../components/productAdmin/authority/departmentList.vue'], resolve)
        },
        {//新增部门
          path: '/addDepartment',
          component: resolve => require(['../components/productAdmin/authority/addDepartment.vue'], resolve)
        },
        {//新增用户
          path: '/userList',
          component: resolve => require(['../components/productAdmin/authority/userList.vue'], resolve)
        },
        {//新增用户
          path: '/addUser',
          component: resolve => require(['../components/productAdmin/authority/addUser.vue'], resolve)
        },
        // ,{//新增权限
        //   path: '/addAuthority',
        //   component: resolve => require(['../components/productAdmin/authority/addAuthority.vue'], resolve)
        // },
        {//查看试卷详情
          path: '/getExamPaperDetail',
          component: resolve => require(['../components/common/examPaperDetail.vue'], resolve)
        },
        {//app包管理
          path: '/appAndroidMange',
          component: resolve => require(['../components/productAdmin/appMange.vue'], resolve)
        },
        {//新增app
          path: '/addAndroidApp',
          component: resolve => require(['../components/productAdmin/addAndroidApp.vue'], resolve)
        },
        {
          path: '/allSubjectReport',
          redirect: '/allGradeScoreTable',
          component: resolve => require(['../components/president/resport/allSubjectReport.vue'], resolve),
          children: [
            {
              path: '/allGradeScoreTable',
              component: resolve => require(['../components/president/resport/allGradeScoreTable.vue'], resolve)
            },
            {
              path: '/allStudentScoreTable',
              component: resolve => require(['../components/president/resport/allStudentScoreTable.vue'], resolve)
            },
            {
              path: '/allTeacherScoreTable',
              component: resolve => require(['../components/president/resport/allTeacherScoreTable.vue'], resolve)
            },
          ]
        },
        {
          path: '/aloneSubjectReport',
          redirect: '/studentScoreReport',
          component: resolve => require(['../components/president/resport/aloneSubjectReport.vue'], resolve),
          children: [
            {//学生成绩情况
              path: '/studentScoreReport',
              component: resolve => require(['../components/president/resport/studentScoreReport.vue'], resolve)
            },
            {//教师教学成绩
              path: '/teacherScoreReport',
              component: resolve => require(['../components/president/resport/teacherScoreReport.vue'], resolve)
            },
            {//各班原始分数
              path: '/classPriginalScore',
              component: resolve => require(['../components/president/resport/classPriginalScore.vue'], resolve)
            },
            {//各班标准分数
              path: '/classStandardScore',
              component: resolve => require(['../components/president/resport/classStandardScore.vue'], resolve)
            },
          ]
        },

        {//单元测
          path: '/unitTest',
          meta: { keepAlive: true },
          component: resolve => require(['../components/president/unitTest/unitTest.vue'], resolve)
        },
        //概览
        {
          path:'/surveyReport',
          meta: { keepAlive: true },
          component:resolve => require(['../components/survey/surveyReport.vue'],resolve)
        },
        {
          path: '/reportDetailsSingleClass',//一个班级报告详情
          component: resolve => require(['../components/president/unitTest/report/reportDetailsSingleClass.vue'], resolve)//
        },
        ,{
          path: '/showData/reportDetailsTotal',//班级总报告
          component: resolve => require(['../components/president/unitTest/report/reportDetailsTotal.vue'], resolve),
          children: [
            {
              path: '/class1',
              component: resolve => require(['../components/president/unitTest/report/class1.vue'], resolve)//
            }, {
              path: '/class2',
              component: resolve => require(['../components/president/unitTest/report/class2.vue'], resolve)//
            }, {
              path: '/class3',
              component: resolve => require(['../components/president/unitTest/report/class3.vue'], resolve)//
            }, {
              path: '/class4',
              component: resolve => require(['../components/president/unitTest/report/class4.vue'], resolve)//
            }, {
              path: '/class5/',
              component: resolve => require(['../components/president/unitTest/report/class5.vue'], resolve),//
              children: [
                {
                  path: '/',
                  component: resolve => require(['../components/president/unitTest/report/class1a.vue'], resolve)
                },
                {
                  path: '/class5a5',//我的班级-班级-教师报告-班级知识掌握情况-模块
                  component: resolve => require(['../components/president/unitTest/report/class1a.vue'], resolve)
                },
                {
                  path: '/class5b5',//我的班级-班级-教师报告-班级知识掌握情况-知识点
                  component: resolve => require(['../components/president/unitTest/report/class1b.vue'], resolve)
                },
              ]
            }, {
              path: '/class6',
              component: resolve => require(['../components/president/unitTest/report/class6.vue'], resolve)//
            }, {
              path: '/class7',
              component: resolve => require(['../components/president/unitTest/report/class7.vue'], resolve)//
            }, {
              path: '/class8',
              component: resolve => require(['../components/president/unitTest/report/class8.vue'], resolve)//
            }, {
              path: '/class9',
              component: resolve => require(['../components/president/unitTest/report/class9.vue'], resolve)//
            },
          ]
        },
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
      path: '/beforeLogin',
      component: resolve => require(['../components/page/beforeLogin.vue'], resolve)
    },
  ]
})

const auth = [
  [],
  [],
  [],
  ['/surveyReport','/diagnosticReport','/unitTest','/reportDetailsSingleClass','/showData/reportDetailsTotal','/class1','/class2','/class3','/class4','/class5','/class1a','/class1a','/class1b','/class6','/class7','/class8','/class9','/errorR','/login','/studentScoreReport','/teacherScoreReport','/classPriginalScore','/classStandardScore','/beforeLogin'],
  ['/preAdminStuMange','/importStudents','/teacherList','/addTeacher','/preAdminStuMange','/importTeacher','/classMange','/addClass','/presidentList','/examPush','/errorR','/login','/getExamPaperDetail','/beforeLogin'],
  [],
  ['/proAdminStuMange','/proAdminTeaMange','/schoolMange','/addSchool','/paperMange','/paperFormMange','/departmentList','/addDepartment','/addUser','/addPaper','/addPaperForm','/errorR','/login','/getExamPaperDetail','/beforeLogin','/textbookVersion','/editPaperForm','/userList','/appAndroidMange','/addAndroidApp','/arealist','/areaAdd','/areaPaperList','/areaPaperAdd'],
  [],[],['/arealist','/areaAdd'],
  []
]
router.beforeEach((to, from, next) => {
  //判断登录
  if(localStorage.getItem('Userinfo')==null){
    if(to.fullPath == '/login'){
      next()
    }else {
      next('/login')
    }
  }else{

    let userType = parseInt(JSON.parse(localStorage.getItem('Userinfo')).userType)
    let arr = []
    arr = auth[userType]
    let aa = to.fullPath
    aa = aa.split('?')[0]


    if(userType == 6 ||userType == 3 || userType == 4  ){
      if(arr.includes(aa)){
        next()
      }else {
        next('/errorR')
      }
    }else{
      next()
    }
  }
})
export default router
