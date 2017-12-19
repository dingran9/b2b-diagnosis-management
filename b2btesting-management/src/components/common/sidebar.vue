<template>
  <div class="sidebar">
    <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
      <div v-if="showFlag == 3">
        <el-menu-item index="surveyReport">概览</el-menu-item>
        <el-menu-item index="unitTest">单元检测</el-menu-item>
        <el-menu-item index="diagnosticReport">阶段检测</el-menu-item>
        <!--<el-submenu index="211">
          <template slot="title"><i class="el-icon-menu"></i>阶段考</template>
          <el-menu-item index="diagnosticReport">阶段考</el-menu-item>
          <el-menu-item index="unitTest">单元测</el-menu-item>
          &lt;!&ndash;<el-submenu index="212">&ndash;&gt;
            &lt;!&ndash;<template slot="title">全科学科教学情况</template>&ndash;&gt;
            &lt;!&ndash;<el-menu-item index="allGradeScoreTable">&ndash;&gt;
              &lt;!&ndash;全年级总分成绩分布情况&ndash;&gt;
            &lt;!&ndash;</el-menu-item>&ndash;&gt;
            &lt;!&ndash;<el-menu-item index="allStudentScoreTable">&ndash;&gt;
              &lt;!&ndash;各班学生成绩分布情况概览&ndash;&gt;
            &lt;!&ndash;</el-menu-item>&ndash;&gt;
            &lt;!&ndash;<el-menu-item index="allTeacherScoreTable">&ndash;&gt;
              &lt;!&ndash;各学科成绩优秀率与及格率&ndash;&gt;
            &lt;!&ndash;</el-menu-item>&ndash;&gt;
          &lt;!&ndash;</el-submenu>&ndash;&gt;
          &lt;!&ndash;<el-menu-item index="aloneSubjectReport">单科学科教学情况</el-menu-item>&ndash;&gt;
        </el-submenu>-->
      </div>
      <div v-if="showFlag == 4">
      <!--<div >-->
        <!--<el-menu-item index="preAdminStuMange">-->
          <!--<i class="el-icon-setting"></i>学生管理-->
      <!--</el-menu-item>-->
        <el-submenu index="310">
          <template slot="title"><i class="el-icon-menu"></i>学生管理</template>
          <el-menu-item index="preAdminStuMange">学生列表</el-menu-item>
          <el-menu-item index="importStudents">批量导入</el-menu-item>
        </el-submenu>
        <el-submenu index="311">
          <template slot="title"><i class="el-icon-menu"></i>教师管理</template>
          <el-menu-item index="teacherList">教师列表</el-menu-item>
          <el-menu-item index="addTeacher">新增用户</el-menu-item>
          <el-menu-item index="importTeacher">批量导入</el-menu-item>
        </el-submenu>
        <el-submenu index="312">
          <template slot="title"><i class="el-icon-menu"></i>班级管理</template>
          <el-menu-item index="classMange">班级管理</el-menu-item>
          <el-menu-item index="addClass">新增班级</el-menu-item>
        </el-submenu>
        <el-menu-item index="presidentList">
          <i class="el-icon-setting"></i>校长列表
      </el-menu-item>
        <el-menu-item index="examPush">
          <i class="el-icon-setting"></i>考试推送
      </el-menu-item>
      </div>
      <div v-if="showFlag == 5||showFlag == 6">
      <!--<div >-->
        <el-menu-item index="proAdminStuMange" v-if="showFlatArray.includes(1)">
          <i class="el-icon-setting"></i>学生管理
      </el-menu-item>
        <el-menu-item index="proAdminTeaMange" v-if="showFlatArray.includes(2)">
          <i class="el-icon-setting"></i>教师管理
      </el-menu-item>
        <el-submenu index="411" v-if="showFlatArray.includes(3)">
          <template slot="title"><i class="el-icon-menu"></i>学校管理</template>
          <el-menu-item index="schoolMange">学校管理</el-menu-item>
          <el-menu-item index="addSchool">添加学校</el-menu-item>
        </el-submenu>
        <el-menu-item index="arealist" v-if="showFlatArray.includes(2)">
          <i class="el-icon-setting"></i>区域管理
      </el-menu-item>
        <el-menu-item index="paperMange" v-if="showFlatArray.includes(4)">
          <i class="el-icon-setting"></i>试卷管理
      </el-menu-item>
        <el-menu-item index="paperFormMange" v-if="showFlatArray.includes(7)">
          <i class="el-icon-setting"></i>试卷组织管理
      </el-menu-item>
        <el-menu-item index="areaPaperList" v-if="showFlatArray.includes(7)">
          <i class="el-icon-setting"></i>区域联考
      </el-menu-item>
        <el-submenu index="412" v-if="showFlatArray.includes(6)">
          <template slot="title"><i class="el-icon-menu"></i>权限管理</template>
          <el-menu-item index="departmentList">部门列表</el-menu-item>
          <el-menu-item index="addDepartment">新增部门</el-menu-item>
          <el-menu-item index="userList">用户列表</el-menu-item>
          <el-menu-item index="addUser">新增用户</el-menu-item>
          <!--<el-menu-item index="addAuthority">新增权限</el-menu-item>-->
        </el-submenu>
        <el-menu-item index="appAndroidMange" v-if="showFlatArray.includes(6)">
          <i class="el-icon-setting"></i>app版本管理
      </el-menu-item>
        <!--<el-submenu index="3">-->
        <!--<template slot="title"><i class="el-icon-menu"></i>报告管理&待议</template>-->
        <!--<el-menu-item index="authManager">怎么管理</el-menu-item>-->
        <!--<el-menu-item index="">报告详情</el-menu-item>-->
        <!--</el-submenu>-->
        <!--<div v-for="(item,index) in list">-->
        <!--<el-menu-item v-if="!item.hasChild" :index=item.url>-->
        <!--<i :class=item.icon></i>{{item.name}}-->
        <!--</el-menu-item>-->
        <!--<el-submenu v-else :index=index>-->
        <!--<template slot="title"><i :class=item.icon></i>{{item.name}}</template>-->
        <!--<el-menu-item v-for="www in item.children" :key=www.url :index=www.url>{{www.name}}</el-menu-item>-->
        <!--</el-submenu>-->
        <!--</div>-->
      </div>
      <div v-if="showFlag == 9">
        <el-menu-item index="areaPaperList">
          <i class="el-icon-setting"></i>区域联考
      </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data(){
      let thisFlag = JSON.parse(localStorage.getItem('Userinfo')).list
      if(thisFlag){
        thisFlag = thisFlag.map(function (e) {
          return e.resource_id
        })
      }
      return {
        list: [
          {
            icon: 'el-icon-setting',
            name: '学生管理',
            url: 'proAdminStuMange',
            hasChild: 0,
            children: []
          },
          {
            icon: 'el-icon-setting',
            name: '教师管理',
            url: 'proAdminTeaMange',
            hasChild: 0,
            children: []
          },
          {
            icon: 'el-icon-menu',
            name: '学生管理',
            url: '',
            hasChild: 1,
            children: [
              {
                icon: 'el-icon-setting',
                name: '学校管理',
                url: 'schoolMange',
                hasChild: 0,
                children: []
              },
              {
                icon: 'el-icon-setting',
                name: '添加学校',
                url: 'addSchool',
                hasChild: 0,
                children: []
              }
            ]
          }
        ],
        showFlag: JSON.parse(localStorage.getItem('Userinfo')).userType,
        showFlatArray: thisFlag
      }
    },
    computed: {
      onRoutes(){
        return this.$route.path.replace('/', '');
      }
    }
  }


  /*
  * 教师   1**
  * 校长   2**
  * 校管   3**
  * 我方   4**
  *
  *
  * */
</script>
<style>
  .el-menu-item, .el-submenu__title{
    font-size:18px;
  }
</style>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    width: 250px;
    left: 0;
    top: 70px;
    bottom: 0;
    background: #2E363F;
  }

  .sidebar > ul {
    height: 100%;
  }
</style>
