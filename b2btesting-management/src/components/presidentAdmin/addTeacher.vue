<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 新增老师</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form ref="form" :model="type" label-width="80px">
      <el-form-item label="用户类型:" >
        <el-radio-group v-model="type.userGradeId">
          <el-radio   class="radio"  v-bind:label='2'  >教师</el-radio>
          <el-radio   class="radio"  v-bind:label='3'  >校长</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-form ref="form" :model="form" label-width="80px" >
      <el-form-item label="用户姓名:" style="width: 400px">
        <el-input v-model="form.userName" :maxlength=maxlength></el-input>



      </el-form-item>
      <!--<el-form-item label="默认密码:">-->
        <!--<el-input v-model="form.userPassword"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="年级:" v-if="type.userGradeId == 2">
        <el-radio-group v-model="form.userGradeId" @change="getSubject()">
          <el-radio  v-for="(item,index) in groundCode" :key = 'item.groupId' class="radio"  v-bind:label=item.groupIden  >{{item.groupName}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="学科:" v-if="type.userGradeId == 2">
        <el-radio-group v-model="form.userSubject" @change="getNoClass()">
          <el-radio v-for="(item,index) in subjectlist" :key = 'item.subjectId' class="radio"  v-bind:label=item.subjectId>{{item.subjectName}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="班级:" v-if="type.userGradeId == 2">
        <span v-if="classList.length == 0"  style="color: red">(可选班级为空)</span>
        <el-checkbox-group v-model="form.classBeanList">
          <el-checkbox v-for="(item,index) in classList" :key="item.groupId" v-bind:label=item.groupId name="type">{{item.groupName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label-width="400px">
        <el-button type="primary"  @click="onSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  export default {
    name:'addTeacher',
    data() {
      return {
        maxlength:10, //姓名最大几个字
        groundCode: [
          {code:11,name:'一年级'},
          {code:12,name:'二年级'},
          {code:13,name:'三年级'},
          {code:14,name:'四年级'},
          {code:15,name:'五年级'},
          {code:16,name:'六年级'},
          {code:21,name:'七年级'},
          {code:22,name:'八年级'},
          {code:23,name:'九年级'},
          {code:31,name:'高一'},
          {code:32,name:'高二'},
          {code:33,name:'高三'},
        ],
        form: {
          userName: '',
          userAccount: '',
          userPassword: '',
          userGradeId: null,
          userSubject: false,
          classBeanList: [],
        },
        userSchoolId: JSON.parse(window.localStorage.getItem("Userinfo")).userSchoolId,
        subjectlist: [],
        classList: [],
        type:{
          userGradeId:4
        }
      }
    },
    mounted: function () {
      this.useSidGetGradeList()
    },
    methods: {
      useSidGetGradeList() {
        this.$http.post(this.rootUrl + 'groupManager/getGradeList?requestId=123',{"groupId":this.userSchoolId}).then((res) => {
          this.groundCode = res.body.result;
          this.form.userSubject = '';
        }, (res) => {
          console.log(res);
        });
      },
      //根据 学年获取学科和班级
      getSubject: function () {
        this.$http.post(this.rootUrl + 'groupManager/getSubjectByGradeId?requestId=123',{
          "groupIden" : this.form.userGradeId,
          "groupParentId" : this.userSchoolId,
        }).then((res) => {
          this.subjectlist = res.body.result;
          this.form.userSubject = '';
        }, (res) => {
          console.log(res);
        });
      },
      getNoClass:function() {
          if(this.form.userSubject.length < 1){
              return
          }
        let GradeId
        this.groundCode.forEach((e)=>{
          if(this.form.userGradeId == e.groupIden){
            GradeId = e.groupId
          }
        })
        this.$http.post(this.rootUrl + 'groupManager/getNoClassList?requestId=123',{
          "schoolId":this.userSchoolId,
          "gradeId":GradeId,
          "gradeIden":this.form.userGradeId,
          "subjectIden":this.form.userSubject
        }).then((res) => {
          this.classList = res.body.result;
        }, (res) => {
          console.log(res);
        });
      },
      //提交
      onSubmit: function () {
          if(!this.form.userName){
            this.$message('请输入教师姓名');
            return;
          }
//        if(!this.form.userPassword){
//          this.$message('请输入密码');
//          return;
//        }
        if(this.type.userGradeId == 2){
          if(!this.form.userGradeId){
            this.$message('请选择年级');
            return;
          }
          if(!this.form.userSubject){
            this.$message('请选择学科');
            return;
          }
          if(this.form.classBeanList.length < 1){
            this.$message('请选择班级');
            return;
          }
        }
        let userGradeId = ''
        this.groundCode.forEach((e)=> {
          if(e.groupIden == this.form.userGradeId){
            userGradeId = e.groupId
          }
        })
        this.$http.post(this.rootUrl + 'userManager/addTeacherManager?requestId=123',
          {
            "userType":this.type.userGradeId,
            "userName":this.form.userName,
//            "userPassword":this.form.userPassword,
            'userAccount': "111",
            "userSchoolId":this.userSchoolId,
            "userGradeId":userGradeId==''?null:userGradeId,
            "userSubject":this.form.userSubject==''?null:this.form.userSubject,
            "classBeanList":this.form.classBeanList.map(function (item) {
              return {classId:item}
            })
        }).then((res) => {
          if(res.body.code == 'Success' && res.body.httpCode == '200'){
            this.$message('添加成功');
            this.form.userName = ''
            if(this.type.userGradeId == 2){
              this.$router.push('/teacherList')
            }
            if(this.type.userGradeId == 3){
              this.$router.push('/presidentList')
            }
          }else {
            this.$message('添加失败');
          }
        }, (res) => {
          console.log(res);
        });
      }
    },
  }
</script>

