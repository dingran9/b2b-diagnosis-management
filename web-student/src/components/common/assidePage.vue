<template>
  <div class="asside-page">

    <router-link
      to="/main/kezhongce"
      class="asside-page-item"
    >
      <img src="../../../static/img/icon/icon7.png"
           class="asside-page-img">
      课中检测
    </router-link>
    <router-link
      to="/main/demoShow"
      class="asside-page-item"
    >
      <img src="../../../static/img/icon/icon14.png"
           class="asside-page-img">
      课后作业
    </router-link>
    <router-link
      to="/main/tutoring"
      class="asside-page-item"
    >
      <img src="../../../static/img/icon/icon7.png"
           class="asside-page-img">
      单元检测
    </router-link>
    <router-link
      to="/main/subjectTest"
      class="asside-page-item"
    >
      <img src="../../../static/img/icon/icon9.png"
           class="asside-page-img">
      阶段检测
    </router-link>
    <div>
      <div class="asside-page-item"
           :class="{act1:sellect}"
           @click="sellect = !sellect">
        <img src="../../../static/img/icon/icon8.png" class="asside-page-img">
        个人中心
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

  </div>

</template>
<script>
  export default {
    components: {},
    data(){
      return {
        sellect: false,
        data:{
            peopleCenterLinks:[
              {
                link:'/main/favourite',
                title:'我的收藏'
              },{
                link:'/main/errorRecord',
                title:'错题记录'
              },{
                link:'/main/schoolInfo',
                title:'学校信息'
              },{
                link:'/main/peopleSet',
                title:'个人设置'
              },
            ]
        }
      }
    },
    mounted(){

    },
    methods: {
      tutoring(){
        this.sellect = 1;
      },
      subjectTest(){
        this.sellect = 2;
      },
      peopleCenter(){
        this.sellect = 3;
      }
    },
    computed: {},
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
        width: 24px;
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
    .slide-down .asside-page-item{
      padding-left:60px;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
