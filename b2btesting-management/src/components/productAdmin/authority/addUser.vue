<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增用户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <hr>
    <el-form :model="form" label-width="100px" style="margin-top: 15px;width: 500px">
      <el-form-item label="用户姓名" >
        <el-input v-model="form.userName" auto-complete="off" class="addU-i"></el-input>
      </el-form-item>
      <el-form-item label="用户账号" >
        <el-input v-model="form.userAccount" auto-complete="off" class="addU-i"></el-input>
      </el-form-item>
      <el-form-item label="初始密码" >
        <el-input v-model="form.userPassword" auto-complete="off" class="addU-i"></el-input>
      </el-form-item>
      <!--<el-form-item label="用户类型">-->
        <!--<el-radio-group v-model="form.userType">-->
          <!--<el-radio :label="2" :value="2">教师</el-radio>-->
          <!--<el-radio :label="3" :value="3">校长</el-radio>-->
        <!--</el-radio-group>-->
      <!--</el-form-item>-->
      <el-form-item label="所属部门">
        <el-checkbox-group v-model="form.region">
          <el-checkbox :label=item.roleName value="item.roleName" :key="item.roleName" name="type" v-for="item in getAuthRoles"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="((!form.userName) || (!form.userAccount) || (!form.userPassword) ||(form.region.length==0))" type="primary" @click="onSubmitEdit" style="float: right">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import md5 from 'MD5'
  export default {
      name:'addUser',
    data() {
      return {
        getAuthRoles:[],
        form: {
          userName: '',
          userAccount: '',
          userPassword: '',
          userType: '',
          region: []
        },
      }
    },
    mounted: function () {
      //获取所有的权限
      this.$http.post(this.rootUrl + 'authorize/getAuthRoles?requestId=123',{}
      ).then((res) => {
        if(res.body.code == 'Success'&&res.body.httpCode == '200'){
          this.getAuthRoles=res.body.result;
        }
      }, (res) => {
        console.log(res);
      });
    },
    methods: {
      handleIconClick(ev) {
        console.log(ev);
      },
      //添加用户
      onSubmitEdit(){
        let thatThis = this
        let resourceList = [];
        this.form.region.forEach(function (x) {
          thatThis.getAuthRoles.forEach(function (f) {
            if(f.roleName == x){
              resourceList.push({
                "roleId":f.roleId,
                "roleName":f.roleName
              })
            }
          })
        })
        this.$http.post(this.rootUrl + 'authorize/addUserManager?requestId=123',{
          "authUserBean":{
            "userName":this.form.userName,
            "userAccount":this.form.userAccount,
            "userPassword":md5(this.form.userPassword),
            "userType":5,
          },
          "authRoleBeans":resourceList
          }).then((res) => {
          if(res.body.code == 'Success'&&res.body.httpCode == '200'){
            this.$message('新增成功');
            this.$router.push('/departmentList')
          }
          if(res.body.httpCode == '40007'){
            this.$message('用户账号已存在,请换个账号');
          }
        }, (res) => {
          console.log(res);
        });
      }
    },
  }
</script>
<style>
  .addU-i{
    width: 300px;
  }
</style>
