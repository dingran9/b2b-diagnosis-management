<template>
  <div class="savePaperSuccess">
    <div class="container">
      <div class="top">
        <img src="../../../static/img/success.png"/>试卷{{this.$route.query.caozuo}}成功
      </div>
      <div class="buttons">
        <el-button class="cancel" @click="preFn">返回试卷管理</el-button>
        <el-button class="confirm" @click="nextFn">查看试卷</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        data: {},
        list: {},
        flag: {},
      }
    },
    components: {},
    mounted() {
    },
    methods: {
      preFn(){
        this.$router.push({path:'/paperManger'});
      },
      nextFn(){
      		//新窗口打开页面
//      this.$router.push({path:'/watchPaper',query:{code:this.$route.query.code}});
				var url = window.location.origin + window.location.pathname;
				window.open(url + "#/" + "watchPaper?code=" + this.$route.query.code);
      },
    },
    computed: {},
    filters: {}

  }
</script>


<style lang="scss" scoped>
  .savePaperSuccess {
    width: 100%;
    height: 100%;
    background: #f0f4fb;
    padding-top: 40px;
    .container {
      width: 1200px;
      height: 880px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0px 0px 20px 0px rgba(39, 113, 170, 0.23);
      .top {
        margin-bottom: 82px;
        padding-top: 188px;
        * {
          display: inline-block;
          vertical-align: middle;
        }
        img{
          width: 60px;
          height: 60px;
          margin-right: 20px;
        }
      }
      .buttons {
        .el-button {
          color: #fff;
          border: 0;
          width: 141px;
          height: 40px;
          border-radius: 20px;
          font-size: 18px;
          &:hover {
            border: 0;
          }
        }
        .cancel {
          background: #afb1b3;
          margin-right: 40px;
        }
        .confirm {
          background: #1fcc95;
        }
      }
    }
  }
</style>
<style lang="scss">
  .savePaperSuccess {

  }
</style>
