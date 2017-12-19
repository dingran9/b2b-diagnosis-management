<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">个人中心>个人设置
        <goback></goback>
      </h2>
    </div>
    <div class="content-right-body-wrap clear-fix">
      <div v-if="!flagNext" class="set">
        <div class="title">
          更改手机号
        </div>
        <div class="body">
          <div class="item">
            <div class="caption">
              <img src="../../../../../static/img/icon/icon_souji.png" height="27" width="18"/>
              当前手机号
            </div>
            <label class="input-wrap">

              <ge-input class="input-item-input"
                        v-model="user.userAccount"
                        readonly
              ></ge-input>
            </label>
          </div>
          <div class="item">
            <div class="caption">
              <img src="../../../../../static/img/icon/icon_suo.png" height="24" width="21"/>
              验证码
            </div>
            <label class="input-wrap" style="width:55%;">
              <input type="password" placeholder="请输入验证码" v-model="code">
            </label>
            <code-btn class="ge-pull-right code-btn" :config="config" key="1">

            </code-btn>
          </div>

        </div>
        <div class="foot">
          <div class="submit-btn" @click="nextTemp">
            下一步
          </div>
        </div>
      </div>
      <div v-else class="set">
        <div class="title">
          更改手机号
        </div>
        <div class="body">
          <div class="item">
            <div class="caption">
              <img src="../../../../../static/img/icon/icon_souji.png" height="27" width="18"/>
              新手机号
            </div>
            <label class="input-wrap">

              <ge-input class="input-item-input"
                        v-model="phone"
                        placeholder="请输入新手机号"></ge-input>
            </label>
          </div>
          <div class="item">
            <div class="caption">
              <img src="../../../../../static/img/icon/icon_suo.png" height="24" width="21"/>
              验证码
            </div>
            <label class="input-wrap" style="width:55%;">
              <input type="password" placeholder="请输入验证码" v-model="newCode">
            </label>
            <code-btn class="ge-pull-right code-btn" :config="config2" key="2">

            </code-btn>
          </div>

        </div>
        <div class="foot">
          <div class="submit-btn" @click="changePhone">
            完成
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import geInput from '../../../common/geInputPhone.vue'
  import codeBtn from '../../../common/codeBtn.vue'
  import goback from '../../../common/goback.vue';
  import md5 from 'md5';
  export default {
    components: {goback, geInput, codeBtn},
    data(){

      return {
        config: {
          startText: '获取验证码',
          endText: '再次获取',
          totalTime: 60,
          tickTime: 1,
          computeText(num){
            return '重新获取 ' + num + 's';
          },
          canTodo: () => {
            return this.$regexp.isMobile(this.user.userAccount);
          },
          todo: () => {
            return this.$ajax.sendCodeForChangePhone({
              "phone": this.user.userAccount,
              "smsType": "comcode",
              "type": 1
            })
              .then(({httpCode, result}) => {
                if (httpCode == 200 && result) {
                  this.$message('验证码发送成功,请查看手机接收');
                  console.log(result)
                } else {
                  this.$message('验证码发送失败,请重试!');
                  return Promise.reject();
                }
              })
          }
        },
        config2: {
          startText: '获取验证码',
          endText: '再次获取',
          totalTime: 60,
          tickTime: 1,
          computeText(num){
            return '重新获取 ' + num + 's';
          },
          canTodo: () => {
            let temp = this.$regexp.isMobile(this.phone);
            if (!this.phone) {
              this.$message('请输入手机号!');
            } else if (!temp) {
              this.$message('手机号格式错误!');
            }
            return temp;
          },
          todo: () => {
            return this.$ajax.sendCodeForChangePhone({
              "phone": this.phone,
              "smsType": "comcode",
              "type": 2
            })
              .then(({httpCode, result}) => {
                if (httpCode == 200 && result) {
                  this.$message('验证码发送成功,请查看手机接收');
                  console.log(result)
                } else {
                  this.$message('验证码发送失败,请重试!');
                  return Promise.reject();
                }
              })
          }
        },
        flagNext: false,
        user: this.$user().get(),
        phone: '',
        code: '',
        newCode: '',
        data: {},
        passwords: {
          oldPsd: '',
          newPsd: '',
          twoPsd: ''
        },
        flag: {
          subjectSelect: 0
        }
      }
    },
    mounted(){
      this.user = this.$user().get();
    },
    methods: {
      changePhone(){
        let {phone, newCode} = this;
        if (!phone) {
          this.$message('请输入手机号!');
        } else if (!this.$regexp.isMobile(phone)) {
          this.$message('手机号格式错误!');
        } else if (!newCode) {
          this.$message('请输入验证码');
        } else if (!this.$regexp.isCode(newCode)) {
          this.$message('验证码格式错误!');
        } else {
          this.$ajax.changePhone({
            "userCode": this.user.userId,
            "phone": phone,
            "code": newCode,
            "token": this.user.token
          })
            .then(({httpCode, result}) => {
              if (httpCode == 200 && result) {
                this.$message('手机号修改成功');
                this.user.userAccount = phone;
                this.$user().set(this.user);
                this.$router.push("/main/peopleSet");
              } else if (httpCode == 40003) {
                this.$message('验证码错误,请重试!');
              }  else if (httpCode == 40007) {
                this.$message('该手机号已被使用!');
              } else {
                this.$message('修改失败,请重试!');
              }
            })

        }
      },
      nextTemp(){
        if (!this.code) {
          this.$message('请输入验证码');
        } else if (!this.$regexp.isCode(this.code)) {
          this.$message('验证码错误');
        } else {
          this.$ajax.commitCodeForOldPhone({
            "phone": this.user.userAccount,
            "code": this.code,
            "type": 1
          })
            .then(({httpCode, result}) => {
              if (httpCode == 200 && result) {
                this.flagNext = true;
              } else {
                this.$message('验证码错误,请重试!');
              }
            })
        }
      }
    }
    ,
    computed: {
      isPhoneNum(){
        return this.$regexp.isMobile(this.phone);
      }
    }
    ,
    filters: {}

  }
</script>
<style lang="scss" scoped>
  @import '../../../../../static/css/contentRight.scss', "../../../../../static/css/gemixin.scss";

  .set {
    max-width: 1000px;
    min-width: 700px;
    background: #fff;
    margin: 100px auto;
    min-height: 200px;
    .title {
      $h: 60px;
      height: $h;
      line-height: $h;
      color: #4c6175;
      font-size: 20px;
      font-weight: 600;
      border-bottom: 1px solid #e1e5ec;
    }
    .body {
      padding: 45px;
      text-align: left;
      font-size: 18px;
      .item {
        $h: 40px;
        height: $h;
        line-height: $h;
        clear: both;
        &:after {
          content: '';
          display: table;
          clear: both;
        }
        margin-bottom: 20px;
        .caption {
          width: 23%;
          display: inline-block;
          float: left;
          color: #4c6175;
          img {
            margin-right: 20px;
          }
        }
        .input-wrap {
          width: 77%;
          display: inline-block;
          float: left;
          background: #f0f4fb;
          input {
            background-color: transparent;
            display: inline-block;
            padding-left: 20px;
            font-size: 18px;
          }
        }
        .code-btn {
          width: 20%;
          border-radius: 0;
          &.isRun {
            opacity: .7;
          }
        }

      }

    }
    .foot {
      padding: 100px 0 30px 0;
      .submit-btn {
        @include ge-btn(400px, 50px);
      }
    }
  }

</style>
