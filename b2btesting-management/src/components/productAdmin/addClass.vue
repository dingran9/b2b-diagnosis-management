<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 班级管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增班级</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="border-bottom:1px solid #ccc;margin:20px 0;"></div>
    <el-form ref="form" :rules="rules" :model="form" label-width="150px" class="demo-ruleForm">
      <el-form-item label="选择班级：" prop="groupIden" style="margin-top:20px;">
        <el-col :span="12">
          <el-radio-group v-model="form.groupIden">
            <el-radio v-for="(grade,$index) in gradeListResult" :key='grade.groupIden' :label="grade.groupIden" :value="grade.groupIden">{{grade.groupName}}</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item label="文理类型：" prop="groupIden" style="margin-top:20px;" v-if="form.groupIden == 32 || form.groupIden == 33">
        <el-col :span="12">
          <el-radio-group v-model="form.groupArt">
            <el-radio  label='1'>理科</el-radio>
            <el-radio  label='0'>文科</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>

      <el-form-item label="班级名称：" prop="gradeName" style="margin-top:20px;">
        <el-col :span="12">
          <el-select v-model="form.gradeName" placeholder="请选择班级名称">
            <el-option
              v-for="(item,index) in classList"
              :key="index"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="(!form.groupIden || !form.gradeName ) " type="primary" @click="onSubmit('form')">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import stage_grade_subject from '../../../static/jsons/stage_grade_subject'
  import grades_list from '../../../static/jsons/grades_list'
  import Vue from 'vue';
  import {getStore} from '../../config/utils.js'

  export default {
      name:'addClass',
    data() {
      return {
        userInfo: JSON.parse(getStore('Userinfo')),//用户登录后保存用户信息
        gradeListResult:null,//根据学校id初始化年级列表
        stage_grade:null,//学段、年级
        grades_list:null,//年级
        form: {
          gradeName: '',//年级Name
          groupIden:null,//年级ID
          groupArt: '1'
        },
        rules: {
          gradeName: [
            { required: true, message: '请输入班级名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
        },
        classList:[
        ]
      }
    },
    mounted(){
      for (var i = 0; i < 40; i++) {
          this.classList.push({label:i+1+"班"})
      }
        this.$nextTick(function(){
            this.getGradeList();
        })
        this.stage_grade=stage_grade_subject,
        this.grades_list = grades_list;
    },
    methods: {
      //根据学校id查询年级
      getGradeList(){
        this.$http.post(this.rootUrl + 'groupManager/getGradeList?requestId=' + Math.random(),
          {
            "groupId":this.userInfo.userSchoolId
          }).then((res) => {
          if(res.body.httpCode=='200'){
            this.gradeListResult=res.body.result;
          }
        });
      },
      selectStyle (gradeList,item, index) {
        this.form.groupIden=item.groupIden;
        this.$nextTick(function () {
          gradeList.forEach(function (item) {
            Vue.set(item,'active',false);
          });
          Vue.set(item,'active',true);
//          this.classManagerList();
        });
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let className = this.form.groupIden==32 ||this.form.groupIden==33?this.form.gradeName+(this.form.groupArt==1?'(理)':'(文)'):this.form.gradeName
            this.$http.post(this.rootUrl + 'groupManager/addClassInfo?requestId=' + Math.random(),
              {
                "schoolId":this.userInfo.userSchoolId,
                "gradeIden":this.form.groupIden,
                "groupArt":this.form.groupIden==32 ||this.form.groupIden==33 ?this.form.groupArt-0:2,
                "className":className
              }).then((res) => {
              if(res.body.httpCode=='200'&&res.body.result==true){
                this.$notify({
                  title: '成功',
                  message: '班级创建成功',
                  type: 'success'
                });
                this.$router.push('/classMange')
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      }
    }

  }
</script>

<style>
  ul.sActive li{
    list-style:none;
  }
  ul.sActive li span{
    display: inline-block;
    /*background-color:#ffc365;*/
    border:1px solid #ffc365;
    border-radius:4px;
    padding:0px 20px;
    margin:4px;
    /*color:#fff;*/
  }
  .active{
    background-color:#ffc365;
    color:#fff;
  }
</style>

