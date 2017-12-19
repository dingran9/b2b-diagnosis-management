<template>
    <div class="login-wrap">
        <div class="login-bg">
          <div class="ms-login">
            <!--<div class="ms-title">{{$route.query.role || elseRole}}登录</div>-->
            <div class="ms-title">登录</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
              <el-form-item prop="userAccount">
               <!--<el-input v-model="ruleForm.userAccount" placeholder="请输入教师ID/手机号"></el-input>-->
                <input class="input_txt input_txt_user" type="text" v-model="ruleForm.userAccount" placeholder="请输入教师ID/手机号">
              </el-form-item>
              <el-form-item prop="userPassword">
                <!--<el-input type="password" placeholder="请输入密码" v-model="ruleForm.userPassword" @keyup.enter.native="submitForm()"></el-input>-->
                <input class="input_txt input_txt_pwd" type="password" placeholder="请输入密码" v-model="ruleForm.userPassword" @keyup.enter.native="submitForm()">
              </el-form-item>
              <div class="login-btn">
                <span @click="submitForm('ruleForm')">登录</span>
              </div>
              <!--<el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>-->
              <p class="tips"><router-link to="beforeLogin"></router-link><a>忘记密码？</a></p>
            </el-form>
          </div>
        </div>

    </div>
</template>

<script>
    import md5 from 'MD5'
    import {setStore} from '../../config/utils.js'
    export default {
        data: function(){
            return {
                elseRole: '校长',
                role:'角色',//登录角色
                ruleForm: {
                  userAccount: '',
                  userPassword: ''
                },
                rules: {
                  userAccount: [
                        { required: true, message: '请输入教师ID/手机号', trigger: 'blur' }
                    ],
                  userPassword: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
      mounted: function () {
        localStorage.clear();
      },
        methods: {
          submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                const self = this;
                this.$http.post(this.rootUrl +'login/userManagerLogin?requestId=test123456',{
                  "equipmentType":"Web",
                  "userAccount":this.ruleForm.userAccount,
                  "userPassword":md5(this.ruleForm.userPassword),
                }).then((res) => {

                  localStorage.setItem('schoolSection', res.data.result.schoolsections)

                  if (res.body.httpCode =="200"){
                    const resBody = res.body.result;
                    setStore('Userinfo',resBody);
                    if(res.body.result.userType == 6 ){
                      self.$router.push('/proAdminStuMange');
                    }
                    if(res.body.result.userType == 3){
                      self.$router.push('/diagnosticReport');
                    }
                    if(res.body.result.userType == 4){
                      self.$router.push('/preAdminStuMange');
                    }
                    if(res.body.result.userType == 5){
                      self.$router.push('/welcome');
                    }
                    if(res.body.result.userType == 9){
                      self.$router.push('/areaPaperList');
                    }
                  }
                },(response) => {
                });
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
        }
    }
</script>
<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background:url(../../../static/img/b_bg.png) repeat-x;
    }
    .login-bg{
      background:url(../../../static/img/bg.png) no-repeat;
      width:1422px;
      height:773px;
      position: absolute;
      left:50%;
      top:50%;
      transform: translate(-50%,-50%);
    }
    .ms-title{
      font-size:36px;
      color: #7fbed0;
      margin:46px 0;
      text-align: center;
    }
    .ms-login{
      width:460px;
      border-radius: 5px;
      background: #fff;
      position: absolute;
      left:75%;
      top:30%;
      transform: translate(-50%,-50%);
    }
    .input_txt{
      height:40px;
      border:none;
      border-bottom:1px solid #7fbed0;
      padding-left:44px;
      font-size:16px;
      width:300px;
      font-family:"microsoft yahei";
    }
    .input_txt_user{
      background:url(../../../static/img/user.png) no-repeat;
    }
    .input_txt_pwd{
      background:url(../../../static/img/pwd.png) no-repeat;
    }
    .login-btn{
      margin-top:80px;
        text-align: center;
    }
    .login-btn span{
      display: inline-block;
      line-height: 65px;
      border-radius: 5px;
      width:460px;
      height:65px;
      font-size:24px;
      background: #7fbed0;
      border:none;
      color:#fff;
      font-family:"microsoft yahei";
      cursor:pointer;
    }
    .login-btn span:hover{
      opacity: 0.8;
    }
    .tips{
      position: relative;
      color:#999;
      line-height:60px;
    }
    .tips a:nth-of-type(2){
      position: absolute;
      right:0;
    }
</style>
