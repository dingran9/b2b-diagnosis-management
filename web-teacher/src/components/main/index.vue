<template>
  <div class="ge-WH100 main-content-wrap">
    <div class="app-title">
      <div class="head">
        学业质量提升平台-教师端
      </div>
      <div class="people-wrap">
        <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link people-item" style="color:#fff;">
                   <img class="people-item-img" src="../../../static/img/icon/icon1.png" alt="">
                    {{user.userName}}
                </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
            <el-dropdown-item command="loginout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
    <el-dialog v-model="dialogFormVisible" size="tiny" :show-close=false>
      <el-form label-width="80px" :model="form">
        <el-form-item label="新密码">
          <el-input type="password" placeholder="请输入6-12位新密码" v-model="form.pwd" :maxlength="12" auto-complete="off"
                    class="pwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" placeholder="请再次输入新密码" v-model="form.pwd2" :maxlength="12" auto-complete="off"
                    class="pwd"></el-input>
        </el-form-item>
      </el-form>
      <p class="changeP">
        <el-button type="primary" @click="changePwd" class="changeP-b">确 定</el-button>
        <el-button @click="dialogFormVisible = false" class="changeP-b">取 消</el-button>
      </p>
    </el-dialog>
  </div>
</template>
<script>
  import assidePage from './assidePage.vue'
  import md5 from "MD5";
  export default {
    components: {
      assidePage
    },
    data() {
      return {
        user: this.$user().get(),
        dialogFormVisible: false,
        form: {
          pwd: '',
          pwd2: ''
        }
      }
    },
    mounted() {
    },
    methods: {
      unLogin() {
        this.$user().set({});
//        this.$router.push('/login');
//        location.href = location.hostname + '/newlogin/index.html'
        if(location.hostname == 'localhost'){
          window.location.href = '#'
        }else {
          window.location.href = location.protocol + '//' + location.hostname+ '/newlogin/index.html'
        }
      },
      handleCommand(command) {
        if (command == 'loginout') {
          this.unLogin();
        }
        if (command == 'changePwd') {
          this.form = {}
          this.dialogFormVisible = true
        }
      },
      changePwd() {
        let {pwd, pwd2} = this.form;
        if (!pwd) {
          this.$message('新密码不能为空');
          return;
        }
        if (pwd.length < 6) {
          this.$message('新密码不能小于6位');
          return;
        }
        if (pwd !== pwd2) {
          this.$message('两次密码不一致');
          return;
        }
        this.$ajax.updateTeacherInfo({userPassword: md5(pwd)})
          .then(({result, httpCode}) => {
            if (httpCode === '200') {
              this.$message('修改成功,请重新登录');
              this.unLogin();
            } else {
              this.$message('修改失败');
            }
          })


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
      $h: 50px;
      height: $h;
      width: 100%;
      min-width: 640px;
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
      padding-top: 50px;
      background: red;
      .main-page {
        position: absolute;
        right: 0;
        top: 0;
        overflow: auto;
        padding-left: 240px;
        width: 100%;
        background-color: #ebf1f9;
        height: 100%;
      }
    }
  }
</style>
