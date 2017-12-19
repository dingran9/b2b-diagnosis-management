<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 班级管理</el-breadcrumb-item>
        <!--<el-breadcrumb-item>学校列表</el-breadcrumb-item>-->
      </el-breadcrumb>
      <router-link :to="{path:'/addClass'}">
        <el-button type="primary" style="position: absolute;right:0;top: -10px;">添加班级</el-button>
      </router-link>
    </div>
    <div style="border-bottom:1px solid #ccc;margin:20px 0;"></div>
    <el-form ref="form" :model="form">
      <el-form-item label="选择班级：" style="margin-top:20px;">
        <el-col :span="12">
       <!--   <ul class="selectActive">
            <li v-for="(grade,$index) in gradeListResult" @click="selectStyle(gradeListResult,grade,$index) " :class="{'active':grade.active}" >
              {{grade.groupName}}
            </li>
          </ul>-->
          <el-radio-group v-model="form.groupIden"  @change='classManagerList()' >
            <el-radio class="radio" :label=null checked >全部</el-radio>
            <el-radio v-for="(grade,$index) in gradeListResult" :key='grade.groupIden' :label="grade.groupIden"
                     :value="grade.groupIden">{{grade.groupName}}</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <div style="border-bottom:1px solid #ccc;margin:20px 0;"></div>
      <!--<el-row :gutter="10" v-for="(data,index) in gradeList" :key="index" style="text-align:center;" >
        <el-col :xs="8" :sm="6" :md="4" :lg="3"  v-for="classs in data.classBeanList" :key='classs' class="grid-content bg-purple" style="padding-top:20px;">
          <p>{{data.gradeName}}</p>
          <p>{{classs.className}}</p>
          <p style="padding-top:40px;">教师：{{classs.teacherNumber}}人</p>
          <p>学生：{{classs.studentNumber}}人</p>
        </el-col>
      </el-row>-->
      <!--表格展现形式-->
      <div v-for="(data,index) in gradeList" :key="index">
        <el-table
          :data="data.classBeanList"
          border
          style="width: 100%">
          <el-table-column
            prop="index"
            label="年级名称">
            <template scope="scope">
              {{data.gradeName}}
            </template>
          </el-table-column>
          <el-table-column
            prop="className"
            label="班级名称">
          </el-table-column>
          <el-table-column
            prop="teacherNumber"
            label="老师人数（人）">
          </el-table-column>
          <el-table-column
            prop="studentNumber"
            label="学生人数（人）">
          </el-table-column>
        </el-table>
      </div>
      <p v-if="gradeList.length==0" align="center">该年级没有班级</p>
    </el-form>
  </div>
</template>

<script>
  import Vue from 'vue';
  import grade_list from '../../../static/jsons/grade_list'
  import {getStore} from '../../config/utils.js'
  export default {
    data() {
      return {
        userInfo: JSON.parse(getStore('Userinfo')),//用户登录后保存用户信息
        gradeList:null,
        gradeListResult:[],//班级初始化数据
        pageSize:10,//每页显示记录数
        pageNumber:1,//当前页
        grade_list:null,//学段、年级
        form: {
          gradeName: '',//年级Name
          groupIden:null,//年级ID
        },

        sortCurrent:0,
        isActive:false,//选中班级样式

        active: false,


        message:'hetr',
        initialChooseBol:true,
      }
    },
    mounted(){
      this.$nextTick(function(){
          this.getGradeList();
      })
      this.grade_list=grade_list;
      this.classManagerList();

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
//            this.gradeListResult.push({groupName:'全部'});
//            Vue.set(this.gradeListResult[this.gradeListResult.length-1],'active',true);
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
          this.classManagerList();
        });
      },
      classManagerList() {
        let params = {
          "schoolId":this.userInfo.userSchoolId,
          "pageNumber":this.pageNumber,
          "pageSize":this.pageSize
        }
        console.log(this.form.groupIden);
        if(this.form.groupIden!=null){
          params.gradeIden = this.form.groupIden
        }
        this.gradeList = []
        this.$http.post(this.rootUrl + 'groupManager/classManagerList?requestId=' + Math.random(),
          params).then((res) => {
          if(res.body.httpCode=='200'){
            if(this.initialChooseBol||this.form.groupIden==null){//初始全部显示或者点击全部的时候全部显示
              let datas=res.body.result.list;
              let resultArr=[];
              for(var a in datas){                
                if(datas[a].classBeanList.length!=0){   
                    resultArr.push(datas[a])                
                  this.gradeList =resultArr;
                }
              }  
              this.initialChooseBol=false;
            }else{
                let datas=res.body.result.list;
                let resultArr=[];
                for(var a in datas){
                  if(datas[a].gradeIden==this.form.groupIden){   
                      resultArr.push(datas[a])                
                    this.gradeList =resultArr;
                  }
                }                
            }          
          }
        });
      },
    }

  }
</script>

<style>

  .bg-purple {
    background: #fff;
    border:1px solid #d3dce6;
    text-align:center;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 160px;
    margin:4px;
    padding:4px 8px;
  }
  ul.selectActive li{
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


