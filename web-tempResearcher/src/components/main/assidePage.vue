<template>
  <div class="asside-page">
    <router-link
    to="/overview"
    class="asside-page-item"
    >
    <img src="../../../static/img/icon/icon7.png"
    class="asside-page-img">
    教学进度
    </router-link>
    <router-link
      v-if="!isJuZhang"
      to="/syncCoach/syncCoach"
      class="asside-page-item"
      :class=" isUnitPage ? 'act':''"
    >
      <img src="../../../static/img/icon/icon9.png"
           class="asside-page-img">
      单元检测
    </router-link>


    <router-link
      :class=" isAreaPage ? 'act':''"
      to="/disciplineEvaluation/disciplineEvaluation"
      class="asside-page-item"
    >
      <img src="../../../static/img/icon/icon8.png"
           class="asside-page-img">
      全区统考
    </router-link>
    <router-link
      v-if="!isJuZhang && false"
      to="/createUnit"
      class="asside-page-item"
    >
      <img src="../../../static/img/teacher_peixun.png"
           class="asside-page-img">
      创建单元进度
    </router-link>
    <!--<router-link-->
      <!--to="/quyuliankao"-->
      <!--class="asside-page-item"-->
    <!--&gt;-->
      <!--<img src="../../../static/img/teacher_peixun.png"-->
           <!--class="asside-page-img">-->
      <!--区域联考-->
    <!--</router-link>-->

  </div>

</template>
<script>
  export default {
    components: {},
    data() {
      return {
        sellect: false,
        myClassFlag: false,
        syncCoachFlag: false,
        subjectEvaluationFlag: false,
        data: {
          peopleCenterLinks: [
            {
              link: '/markPapers?type=1',
              title: '单元检测判卷'
            }, {
              link: '/markJeduanPapers?type=2',
              title: '阶段检测判卷'
            }
          ]
        }
      }
    },
    mounted() {

    },
    methods: {
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
      isUnitOrAreaPage() {
        return this.$route.path.includes('showData/reportDetailsTotal');
      },
      isAreaPage() {
        return this.isUnitOrAreaPage && this.localData.get('reportType') == 2;
      },
      isUnitPage() {
        return this.isUnitOrAreaPage && this.localData.get('reportType') == 1;
      },
      isJuZhang() {
        return this.$user().get().userType == 7;
      }
    },
    filters: {}

  }
</script>
<style lang="scss" scoped>
  .asside-page {
    width: 240px;
    height: 100%;
    padding-top: 20px;
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
      font-size: 18px;
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
      padding-left: 60px;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
<style>
  .asside-page .asside-page-item.act {
    color: #3cc0fe;
  }
</style>
