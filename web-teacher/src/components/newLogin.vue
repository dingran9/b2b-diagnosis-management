<template>
  <div class="login-wrap">
    <header>
      <p>学业质量提升平台</p>
    </header>
    <div class="body">
      <div class="in-body">
        <p class="plase-choose">请选择您的角色:</p>
        <ul class="items">
          <li><img src="../../../static/img/new/1student.png" alt=""><p>学生登录</p></li>
          <li><img src="../../../static/img/new/1teacher.png" alt=""><p>教师登录</p></li>
          <li><img src="../../../static/img/new/1principal.png" alt=""><p>校长登录</p></li>
          <li><img src="../../../static/img/new/1jiaoyanyuan.png" alt=""><p>教研员登录</p></li>
          <li><img src="../../../static/img/new/1directorGeneral.png" alt=""><p>局长登录</p></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>

  export default {
    components: {},
    data: function () {
      return {}
    },
    mounted() {
      window.localStorage.clear();
    },
    methods: {}
  }
</script>
<style scoped lang="scss">
  .login-wrap {
    height: 100%;
    position: relative;
    header {
      position: absolute;
      text-align: left;
      z-index: 2;
      width: 100%;
      height: 70px;
      line-height: 70px;
      background-color: #ffffff;
      box-shadow: 0px 1px 0px 0px #7188e2;
      font-family: PingFang-SC-Bold;
      font-size: 20px;
      color: #6aa4b5;
      p{
        width: 56%;
        min-width:1100px;
        margin:0 auto;
      }
    }
    .body {
      height: 100%;
      padding-top: 70px;
      background-image: url('../../../static/img/new/1bg.png');
      background-size: 100% 100%;
      position: relative;
      .in-body {
        width: 56%;
        min-width:1100px;
        height: 50%;
        min-height: 600px;
        background-image: url('../../../static/img/new/1bg2.png');
        background-size: 100% 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .plase-choose{
          width: 190*5px;
          display: inline-block;
          text-align: left;
          margin-top: 130px;
          margin-bottom: 64px;
          font-size: 18px;
          color: #fff;
          text-indent: 35px;
        }
        ul.items{
          font-size: 0;
          &>*{
            font-size: 18px;
            color: #fff;
            display: inline-block;
          }
          li{
            width: 190px;
            font-weight:bold;
            img{
              width: 120px;
              height: 120px;
              cursor: pointer;
            }
            p{

            }
          }
        }
      }
    }
  }


</style>
