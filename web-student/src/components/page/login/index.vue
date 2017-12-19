<template>
  <div class="login-wrap">
    <div class="login-bg">
      <div class="ms-login">
        <div class="ms-title">
          <img src="../../../../static/img/student_login.png">
        </div>
        <div class="input-wrap">
          <label class="input-item">
            <img src="../../../../static/img/icon/icon11.png" alt="" class="input-icon">
            <input class="input-item-input"
                      v-model="ruleForm.phone"
                      placeholder="请输入用户名">
          </label>
          <label class="input-item">
            <img src="../../../../static/img/icon/icon13.png" alt="" class="input-icon">
            <input class="input-item-input"
                      max-length="16"
                      v-model="ruleForm.password"
                      type="password"
                      placeholder="请输入密码" />
          </label>
          <label class="input-item" v-if="0">
            <img src="../../../../static/img/icon/icon12.png" class="input-icon">

          </label>
        </div>
        <div class="login-btn"
             @click="login">

        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import geInput from '../../common/geInputPhone.vue'
  import md5 from 'MD5'
  export default {
    components: {
      geInput
    },
    data: function () {
      return {
        ruleForm: {
          phone: '',
          password: '',
          equipmentType:"Web"
        },
        data: {
          isShowPhoneError: false,
        }

      }
    },
    mounted() {

    },
    methods: {
      login(){
        let {
          ruleForm: {phone, password},
          $regexp: {isMobile}
        } = this;
        if(!phone){
            this.showMobileError('请输入手机号');
            return;
        }
//        if (!isMobile(phone)) {
//          this.showMobileError('手机号错误');
//          return;
//        }
        if (!password) {
          this.showPwdError('请输入密码');
          return;
        }
        if (password.length < 6 || password.length > 16) {
            this.showPwdError('密码为6-16位');
            return;
        }
        let sendData = Object.assign({},this.ruleForm);
        sendData.password = md5(sendData.password);
        this.$ajax.login(sendData)
          .then(({httpCode,result}) =>{
            if(httpCode == 200){
              this.$message('登录成功');
              let user = result.authUserVo;
              user.token = result.token;
              user.openId = result.openId;
              this.$user().set(user);
              this.$router.push('main');
            }else if(httpCode == 40005){
              this.$message('账号不存在!');
            }else if(httpCode == 40301){
              this.$message('密码错误!');
            }else{
              this.$message('账号或密码错误');
            }

          })
      },
      showPwdError(val){
        this.$message(val);
      },
      showMobileError(val){

        this.$message(val);
      }
    }
  }
</script>
<style scoped lang="scss">
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../../../../static/img/b_bg.png) repeat-x;
  }

  .login-bg {
    background: url(../../../../static/img/bg.png) no-repeat;
    width: 1422px;
    height: 773px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .ms-title {
    padding: 110px 0;

  }

  .ms-login {
    width: 460px;
    float: right;
    margin-right: 125px;
    .input-wrap {
      width: 360px;
      text-align: left;
      font-size: 20px;
      .input-item {
        display: block;
        width: 100%;
        height: 80px;
        line-height: 50px;
        padding-top: 30px;
        border-bottom: 1px solid #3cc0fe;
        .input-icon {
          vertical-align: middle;
          width: 30px;
          padding: 0 30px 0 10px;
        }
        .input-item-input {
          height: 100%;
          background: transparent;
        }
      }

    }
    .login-btn {
      margin-top: 60px;
      cursor: pointer;
      width: 458px;
      height: 70px;
      background-image: url(../../../../static/img/login_btn1.png);
      &:active {
        background-image: url(../../../../static/img/login_btn2.png);
      }
    }
  }


</style>
