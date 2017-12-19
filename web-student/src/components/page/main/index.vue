<template>
  <div class="ge-WH100 main-content-wrap">
    <div class="app-title">
      <div class="head">
        学业质量提升平台-学生端
      </div>
      <div class="people-wrap">

        <div class="people-item">
          <img class="people-item-img" src="../../../../static/img/icon/icon1.png" alt="">
          {{user.userName}}
        </div>
        <div class="people-item" @click="unLogin">
          <img class="people-item-img" src="../../../../static/img/icon/icon3.png" alt="">
          退出
        </div>
      </div>
    </div>
    <div class="main-content">
      <div class="ge-WH100 ge-por">
        <asside-page></asside-page>
        <div class="main-page">
          <router-view style="overflow-y: scroll;height: 100%;">

          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import assidePage from '../../common/assidePage.vue'
  export default {
    components: {
      assidePage
    },
    data(){
      return {
        user: this.$user().get() || {}
      }
    },
    mounted(){
        setInterval(()=>{
            try{
              this.user.userName = this.$user().get().userName;
            }catch (e){
            }
        },1000);
    },
    methods: {
      unLogin(){
        this.$user().set({});
        //        this.$router.push('/login');
//        location.href = location.hostname + '/newlogin/index.html'
        if(location.hostname == 'localhost'){
          window.location.href = '#'
        }else {
          window.location.href = location.protocol + '//' + location.hostname+ '/newlogin/index.html'
        }
      }
    },
    computed: {},
    filters: {}

  }
</script>
<style lang="scss" scoped>
  .main-content-wrap {
    .app-title {
      position: fixed;
      z-index: 101;
      top: 0;
      left: 0;
      $h: 70px;
      height: $h;
      width: 100%;
      line-height: $h;
      background: #4c6175;
      color: #fff;
      .head {
        width: 320px;
        float: left;
        font-size: 24px;
        line-height: 40px;
        margin: ($h - 40 )/2 0;
        padding-left: 30px;
      }
      .people-wrap {
        float: right;
        padding-right: 80px;
        .people-item {
          display: inline-block;
          font-size: 18px;
          padding-left: 35px;
          cursor: pointer;
          .people-item-img {
            vertical-align: middle;
            margin-right: 15px;
            display: inline-block;
          }
        }
      }
    }
    .main-content {
      height: 100%;
      padding-top: 70px;
      background: red;
      .main-page {
        position: absolute;
        right: 0;
        top: 0;
        overflow: hidden;
        padding-left: 240px;
        width: 100%;
        background-color:#ebf1f9;
        height: 100%;
      }
    }
  }
</style>
