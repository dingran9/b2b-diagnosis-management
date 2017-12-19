<template>
  <div class="asside-page">
    <router-link
      to="/myClass/myClass"
      class="asside-page-item"
    >
      <img src="../../../static/img/icon/icon7.png"
           class="asside-page-img">
      我的班级
    </router-link>
<!--    <router-link
      to="/errorManager/studentsList"
      class="asside-page-item"
    >
      <img src="../../../static/img/icon/icon17.png"
           class="asside-page-img">
      错题管理
    </router-link>-->
<!--    <router-link
      to="/projectLearning/projectLearning"
      class="asside-page-item"
    >
      <img src="../../../static/img/icon/icon8.png"
           class="asside-page-img">
      学习研究
    </router-link>-->
<!--    <router-link
      to="/lessonManager/lessonManager"
      class="asside-page-item"
    >
      <img src="../../../static/img/icon/icon9.png"
           class="asside-page-img">
      备课管理
    </router-link>-->
    <router-link
      to="/senseOfIntellectualClass"
      class="asside-page-item"
    >
      <img src="../../../static/img/icon/icon7.png"
           class="asside-page-img">
      感智课堂

     </router-link>
    <router-link
      to="/realTimeClass"
      class="asside-page-item"
    >
      <img src="../../../static/img/icon/icon7.png"
           class="asside-page-img">
      同步跟踪
    </router-link>
    <div>
      <div class="asside-page-item"
           :class="{act1:classSellect}"
           @click="classSellect = !classSellect">
        <img src="../../../static/img/icon/icon17.png"
             class="asside-page-img">
        课中检测
        <img src="../../../static/img/jiantou.png" class="jiantou">
      </div>
      <transition name="fade">
        <div v-show="classSellect"
             class="slide-down">
          <router-link
            class="asside-page-item"
            v-for="item in data.questionLinks"
            :to="item.link"
            :key="item.link">
            {{item.title}}
          </router-link>
        </div>
      </transition>
    </div>
    <router-link
      to="/syncCoach/syncCoach"
      class="asside-page-item"
    >
      <img src="../../../static/img/icon/icon9.png"
           class="asside-page-img">
      单元检测
    </router-link>
    <div>
      <!--<div class="asside-page-item"-->
      <!--:class="{act1:selfPaperSelect}"-->
      <!--@click="selfPaperSelect = !selfPaperSelect">-->
      <!--<img src="../../../static/img/icon/icon17.png"-->
      <!--class="asside-page-img">-->
      <!--自主组卷-->
      <!--<img src="../../../static/img/jiantou.png" class="jiantou">-->
      <!--</div>-->
      <transition name="fade">
        <div v-show="selfPaperSelect"
             class="slide-down">
          <router-link
            class="asside-page-item"
            v-for="item in data.selfPackagePaper"
            :to="item.link"
            :key="item.link">
            {{item.title}}
          </router-link>
        </div>
      </transition>
    </div>
    <router-link
      to="/disciplineEvaluation/disciplineEvaluation"
      class="asside-page-item"
    >
      <img src="../../../static/img/icon/icon8.png"
           class="asside-page-img">
      阶段检测
    </router-link>
    <div>
      <div class="asside-page-item"
           :class="{act1:sellect}"
           @click="sellect = !sellect">
        <img src="../../../static/img/icon/icon9.png"
             class="asside-page-img">
        阅卷系统
        <img src="../../../static/img/jiantou.png" class="jiantou">
      </div>
      <transition name="fade">
        <div v-show="sellect"
             class="slide-down">
          <router-link
            class="asside-page-item"
            v-for="item in data.peopleCenterLinks"
            :to="item.link"
            :key="item.link"
          >
            {{item.title}}
          </router-link>
        </div>
      </transition>
    </div>
    <!--<div-->
    <!--@click="nocanUse"-->
    <!--class="asside-page-item"-->
    <!--&gt;-->
    <!--<img src="../../../static/img/teacher_peixun.png"-->
    <!--class="asside-page-img">-->
    <!--教师培训-->
    <!--</div>-->
    <div v-if="false">
      <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
        <el-radio-button :label="false">展开</el-radio-button>
        <el-radio-button :label="true">收起</el-radio-button>
      </el-radio-group>
      <el-menu default-active="onRoutes" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
               :collapse="isCollapse" router>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-message"></i>
            <span slot="title">导航一</span>
          </template>
          <el-menu-item-group>
            <span slot="title">分组一</span>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <span slot="title">选项4</span>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导航二</span>
        </el-menu-item>
        <template v-for="(menu,index) in router">
          <el-submenu :index="index+''" v-if="menu.router">
            <template slot="title">
              <i class="el-icon-message"></i>
              <span slot="title">导航 {{index}}</span>
            </template>
          </el-submenu>
          <el-menu-item :index="menu.link" v-else>
            <i class="el-icon-menu"></i>
            <span slot="title">{{menu.title}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>

</template>
<script>
  export default {
    components: {},
    data() {
      return {
        isCollapse: false,
        sellect: false,
        selfPaperSelect: false,
        classSellect: false,
        myClassFlag: false,
        syncCoachFlag: false,
        subjectEvaluationFlag: false,
        data: {
          peopleCenterLinks: [
            {
              link: '/markPapers?type=1',
              title: '单元测判卷'
            }, {
              link: '/markJeduanPapers?type=2',
              title: '阶段考判卷'
            }
          ],
          selfPackagePaper: [
            {
              link: '/paperManger',
              title: '试卷管理'
            },
//            {
//              link: '/selfPackagePapers',
//              title: '我的组卷试题库'
//            }
          ],
          questionLinks: [
            {
              link: '/questionStorage/questionTest',
              title: '测试'
            },
            {
              link: '/questionStorage/questionList',
              title: '题库'
            }
//            , {
//              link: '/questionStorage/classTestReport',
//              title: '班级测试报告'
//            }
          ]
        },
        router: [{
          link: '/myClass/myClass',
          title: '我的班级'
        }, {
          link: '/myClass/myClass',
          title: '实时课堂'
        }, {
          link: '/myClass/myClass',
          title: '单元测'
        }, {
          link: '/myClass/myClass',
          title: '阶段考'
        }, {
          link: '/myClass/myClass',
          title: '教师培训'
        },
        ]
      }
    },
    mounted() {

    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      tutoring() {
        this.sellect = 1;
      },
      subjectTest() {
        this.sellect = 2;
      },
      peopleCenter() {
        this.sellect = 3;
      },
      nocanUse() {
        this.$message('敬请期待!')
      }
    },
    computed: {
      onRoutes(){
        return this.$route.path.replace('/', '');
      }
    },
    filters: {}

  }
</script>
<style lang="scss" scoped>
  .asside-page {
    width: 240px;
    height: 100%;
    padding-top: 10px;
    border-right: 2px solid #cbd2e6;
    background-color: #fff;
    position: relative;
    z-index: 100;
    .asside-page-item {
      display: block;
      width: 100%;
      $h: 60px;
      height: $h;
      line-height: $h;
      padding-left: 30px;
      font-size: 22px;
      color: #505050;
      text-align: left;
      cursor: pointer;
      &.act {
        color: #3cc0fe;

      }
      &.act1 .jiantou {
        transform: rotate(0);

      }
      .asside-page-img {
        border: 0;
        outline: none 0;
        vertical-align: middle;
        padding-right: 10px;
        display: inline-block;
      }
      .jiantou {
        float: right;
        margin: ($h - 8)/2 25px 0 0;
        height: 8px;
        vertical-align: middle;
        transform: rotate(-90deg);
        transition: .5s all;
      }
    }
    .slide-down .asside-page-item {
      padding-left: 70px;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>

