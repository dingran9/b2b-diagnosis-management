<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 区域管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增用户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <hr>
    <el-form :model="form" label-width="100px" style="margin-top: 15px;width: 700px">
      <el-form-item label="所在区域">
        <area-select @change="areaChange"></area-select>
      </el-form-item>
      <el-form-item label="用户姓名" >
        <el-input v-model="form.userName" auto-complete="off" class="addU-i"></el-input>
      </el-form-item>
      <el-form-item label="用户账号" >
        <el-input v-model="form.userAccount" auto-complete="off" class="addU-i"></el-input>
      </el-form-item>
      <el-form-item label="手机号" >
        <el-input v-model="form.userPhone" auto-complete="off" class="addU-i"></el-input>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-radio-group v-model="form.userType">
          <el-radio :label="7" :value="7">局长</el-radio>
          <el-radio :label="8" :value="8">教研员</el-radio>
          <el-radio :label="9" :value="9">区域管理员</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所属学科" prop="schoolName" v-if="form.userType == 8">
        <el-col :span="6">
          <el-select v-model="form.subject" placeholder="请选择">
            <el-option
              v-for="item in subject"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="所属学段" prop="schoolName" v-if="form.userType == 8">
        <el-col :span="8">
          <el-checkbox-group v-model="form.userStage" placeholder="请选择">
            <el-checkbox label="1" value="1">小学</el-checkbox>
            <el-checkbox label="2" value="2">初中</el-checkbox>
            <el-checkbox label="3" value="3">高中</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitEdit" style="float: right">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import md5 from 'MD5'
  import areaSelect from '../common/areaSelect.vue'
  export default {
      name:'addUser',
    data() {
      return {
        form: {
          userName: '',
          userAccount: '',
          userType: 8,
          userPhone: null,
          subject: null,
          userStage: [],
          area: [],
        },
        subject: [
          {id:1,name:'语文'},
          {id:2,name:'数学'},
          {id:3,name:'英语'},
          {id:4,name:'物理'},
          {id:5,name:'化学'},
          {id:6,name:'生物'},
          {id:7,name:'历史'},
          {id:8,name:'地理'},
          {id:9,name:'政治'},
        ]
      }
    },
    components: {areaSelect},
    mounted: function () {

    },
    methods: {
      //添加用户
      onSubmitEdit(){
        if(!this.form.area[2])return this.$message('地区不能为空');
        if(!this.form.userName)return this.$message('姓名不能为空');
        if(!this.form.userAccount)return this.$message('账号不能为空');
        if(!/^1[34578]\d{9}$/gi.test(this.form.userPhone))return this.$message('手机号格式不正确');
        if(this.form.userType == 8 && !this.form.subject)return this.$message('学科不能为空');
        if(this.form.userType == 8 && this.form.userStage<1)return this.$message('学段不能为空');
        this.$http.post(this.rootUrl + 'authUserAuthority/save?requestId=123',{
            "userName": this.form.userName,
            "userAccount": this.form.userAccount,
            "userPassword": 'e10adc3949ba59abbe56e057f20f883e',
            "userType": this.form.userType,
            "userSubject": this.form.subject,
            "userStage": this.form.userStage.join(','),
            "userSex": 0,
            "userPhone": this.form.userPhone,
            "equipmentType": "Web",
            "userGroupAreaProvinceId": this.form.area[0].id,
            "userGroupAreaProvinceName": this.form.area[0].areaname,
            "userGroupAreaCityId": this.form.area[1].id,
            "userGroupAreaCityName": this.form.area[1].areaname,
            "userGroupAreaDistrictId": this.form.area[2].id,
            "userGroupAreaDistrictName": this.form.area[2].areaname,
            "status": 0
          }).then((res) => {
          if(res.body.code == 'Success'&&res.body.httpCode == '200'){
            this.$message('新增成功');
            this.$router.push('/arealist')
          }
          if(res.body.httpCode == '40007'){
            this.$message('用户账号已存在,请换个账号');
          }
        }, (res) => {
          console.log(res);
        });
      },
      areaChange(val) {
        console.log(val);
        this.form.area = val
      }
    },
  }
</script>
<style>
  .addU-i{
    width: 300px;
  }
</style>
