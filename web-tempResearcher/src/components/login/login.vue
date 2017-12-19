<template>
  <div class="login-wrap">
    <div class="login-bg">
      <div class="ms-login">
        <div class="ms-title">

        </div>
        <div class="input-wrap">
          <label class="input-item">
            <img src="../../../static/img/icon/icon11.png" alt="" class="input-icon">
            <!--            <ge-input class="input-item-input"
                                  v-model="ruleForm.userAccount"
                                  placeholder="请输入用户名"></ge-input>-->
            <input type="text" class="input-item-input" v-model="ruleForm.userAccount" placeholder="请输入用户名">
          </label>
          <label class="input-item">
            <img src="../../../static/img/icon/icon13.png" alt="" class="input-icon">
            <ge-input class="input-item-input"
                      max-length="16"
                      v-model="ruleForm.userPassword"
                      type="password"
                      placeholder="请输入密码"></ge-input>
          </label>
          <label class="input-item" v-if="0">
            <img src="../../../static/img/icon/icon12.png" class="input-icon">

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
  import geInput from '../common/geInputPhone.vue'
  import md5 from 'MD5'

  export default {
    components: {
      geInput
    },
    data: function () {
      return {
        ruleForm: {
          userAccount: '',
          userPassword: '',
          equipmentType: "Web",
          userType: 2,
        },
        data: {
          isShowPhoneError: false,
        }

      }
    },
    mounted() {

    },
    methods: {
      login() {
        let {
          ruleForm: {userAccount, userPassword},
          $regexp: {isMobile}
        } = this;
        if (!userAccount) {
          this.showMobileError('请输入用户名');
          return;
        }
        /*        if(!userAccount){
                    this.showMobileError('请输入手机号');
                    return;
                }
                if (!isMobile(userAccount)) {
                  this.showMobileError('手机号错误');
                  return;
                }*/
        if (!userPassword) {
          this.showPwdError('请输入密码');
          return;
        }
        if (userPassword.length < 6 || userPassword.length > 16) {
          this.showPwdError('密码为6-16位');
          return;
        }
        let sendData = Object.assign({"equipmentType": "Web"}, this.ruleForm);
        sendData.userPassword = md5(sendData.userPassword);
        this.loading = this.$loading();
        this.$ajax.login(sendData)
          .then(({httpCode, result}) => {
            this.loading.close();
            if (httpCode == 200) {
              this.$message('登录成功');
              let user = result.model;
              user.token = result.token;
              user.openId = result.openId;
              this.$user().set(user);
              if (user.userType != 7 && user.userType != 8) {
                this.$message("权限不足,无法登入本系统!")
                //this.$message("本系统需使用教研人员或局长账号登录,请使用正确的账号!")
                return;
              }
              if (user.userType == 7)
                this.$router.push('/disciplineEvaluation/disciplineEvaluation');
              else
                this.$router.push('/syncCoach/syncCoach');
            } else {
              this.$message('登录失败,请重试');
            }
          })
          .catch(() => {
            this.loading.close();
          })
      },
      showPwdError(val) {
        this.$message(val);
      },
      showMobileError(val) {
        this.$message(val);
      },
    }
  }
</script>
<style scoped lang="scss">
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../../../static/img/tip034t015468.png);
    background-size: cover;
    .login-bg {
      background: url(../../../static/img/bg.png) no-repeat;
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
          border-bottom: 1px solid #5bddb1;
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
        width: 458px;
        height: 70px;
        background-image: url(../../../static/img/login_btn1.png);
        &:active {
          background-image: url(../../../static/img/login_btn2.png);
        }
      }
    }
  }


</style>
