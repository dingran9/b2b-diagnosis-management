<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 学校管理</el-breadcrumb-item>
        <el-breadcrumb-item>教材版本管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="border-bottom:1px solid #ccc;margin:20px 0;"></div>
    <!--另一种展现形式-->
   <!-- <ul class="selectActive">
      <li v-for="(grade,$index) in grade_list.gradeList" :key='grade' @click="selectStyle(grade_list.gradeList,grade, $index) "
          :class="{'active':grade.active}" > &lt;!&ndash;:class="{grade:grade.checked}"&ndash;&gt;
        {{grade.gradeName}}
      </li>
    </ul>-->
    <el-form ref="form" :model="form">
      <el-form-item label="选择班级：" style="margin-top:20px;">
        <el-col :span="12">
          <!--   <ul class="selectActive">
               <li v-for="(grade,$index) in gradeListResult" @click="selectStyle(gradeListResult,grade,$index) " :class="{'active':grade.active}" >
                 {{grade.groupName}}
               </li>
             </ul>-->
          <el-radio-group v-model="form.groupIden" @change='initData()' >
            <el-radio class="radio" :label=null checked >全部</el-radio>
            <el-radio v-for="(grade,$index) in gradeListResult" :key='grade.groupIden' :label="grade.groupIden"
                      :value="grade.groupIden">{{grade.groupName}}</el-radio>
          </el-radio-group>
        </el-col>
      </el-form-item>
    </el-form>
    <div style="border-bottom:1px solid #ccc;margin:20px 0;"></div>
    <el-button type="primary" @click="addSubject">新增学科</el-button>
    <div style="border-bottom:1px solid #ccc;margin:20px 0;"></div>
    <el-table
      :data="resultList"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="gradeName"
        label="学年"
        width="180">
      </el-table-column>
      <el-table-column
        prop="subjectName"
        label="学科"
        width="180">
      </el-table-column>
      <el-table-column
        prop="materialVersion"
        label="教材版本">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle==0?'编辑':'新增'" v-model="dialogVisible" size="tiny">
       <span>
         <el-form :model="form" class="demo-ruleForm" label-width="100px">
          <el-form-item label="年级：" prop="groupName">
            <span v-if="dialogTitle==0">
              {{gradeName}}
            </span>
            <span v-else>
               <el-select v-model="addForm.groupIden" placeholder="请选择年级" @change="getSubject(addForm.groupIden)">
                 <el-option v-for="(grade,$index) in gradeListResult" :key='grade.groupIden' :label="grade.groupName"
                           :value="grade.groupIden"></el-option>
               </el-select>
            </span>
          </el-form-item>
          <el-form-item label="学科：">
            <span v-if="dialogTitle==0">
              {{dsubjectName}}
            </span>
            <span v-else>
              <el-select v-model="addForm.subject" placeholder="请选择学科"
                                     @change="getBookTypeVersion(addForm.groupIden,addForm.subject)">
              <el-option v-for="(subject,$index) in subjectResult" :key='subject' :label="subject.subject_name"
                         :value="subject"></el-option>
            </el-select>
            </span>
          </el-form-item>
          <el-form-item label="教材版本："><!--bookTypeResult-->
            <el-select v-model="addForm.bookType" placeholder="请选择教材版本">
             <el-option v-for="(bookType,$index) in bookTypeResult" :key='bookType' :label="bookType.book_type"
                        :value="bookType"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
       </span>
       <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="cofrimDialog(dialogTitle,addForm)">确 定</el-button>
       </span>
    </el-dialog>
  </div>
</template>
<script>
  import stage_grade_subject from '../../../static/jsons/stage_grade_subject'
  import Vue from 'vue';
  import grade_list from '../../../static/jsons/grade_list'
  import {getStore} from '../../config/utils.js'
  export default {
      name:'textbookVersion',
    data() {
      return {
        userInfo: JSON.parse(getStore('Userinfo')),//用户登录后保存用户信息
        gradeListResult:null,//初始化学年（动态读取）
        resultList:null,//初始化列表
        subjectResult:null,//根据年级获取学科
        bookTypeResult:null,//根据学年、学科获取教材版本

        grade_list:null,//初始化学年（本地）
        schoolData:[
          {'name':1}
        ],//初始化数据列表
        dialogVisible:false,//初始添加学科弹框 不显示
        dialogTitle:1,//弹框头
        editParams:null,//教材版本编辑参数

        currentPage:1,//当前页
        pageSize:10,//每页显示条数

        subjectResult:null,//根据学年 学科初始化数据
        bookTypeResult:null,//根据学年、学科获取教材版本

        form:{
          groupIden:null,//查询
        },
        //表单对象
        addForm: {
          groupIden:null,//年级Id
         /* subjectCode:null,//学科*/
          subject:null,//学科{}
          bookType:null,//教材版本{}
//          subjectIden:null,//学科id标识
          /*bookType:null,//教材版本
          materialVersion:null,//教材版本name*/
        },
        gradeName:null,//年级
        dsubjectName:null,//年级
        ruleForm2:{

        }
      }
    },
    mounted(){
      console.log(this.$store);
      this.grade_list=grade_list;
      this.$nextTick(function(){
          this.getGradeList();
      })
    },
    methods: {
      //根据学校id查询年级
      getGradeList(){
//        console.log(this.$route.query.groupId);
        this.$http.post(this.rootUrl + 'groupManager/getGradeList?requestId=' + Math.random(),
          {
            "groupId":this.$route.query.groupId////this.userInfo.userSchoolId
          }).then((res) => {
          if(res.body.httpCode=='200'){
            this.gradeListResult=res.body.result;
            this.initData();
          }
        });
      },
      //根据学年获取学科
      getSubject(groupIden){
        let _that = this;
        _that.$http.post(this.rootUrl + 'teacher/rescours/getNoSubjectBySchoolGrade?requestId=' + Math.random(),{
          "schoolId":this.$route.query.groupId,
          "gradeCode":groupIden
        }).then((res) => {
          _that.subjectResult=res.body.result;
        });
      },
      //根据学年、学科获取教材版本
      getBookTypeVersion(gradeCode,subject){
        this.$http.post(this.rootUrl + 'teacher/rescours/getBookTypeVersion?requestId=' + Math.random(),{
          "gradeCode":gradeCode,
          "subjectCode":subject.subject_code
        }).then((res) => {
          this.bookTypeResult= res.body.result;
        });
      },
      initData(){
        let params={
          "schoolId":this.$route.query.groupId,//this.userInfo.userSchoolId
        }
        if(this.form.groupIden!=null){
          params.gradeIden=this.form.groupIden
        }
        this.$http.post(this.rootUrl + 'groupManager/managerMaterial?requestId=' + Math.random(),
         params).then((res) => {
          if(res.body.httpCode=='200'){
            this.resultList=res.body.result;
          }
        });
      },
      selectStyle (gradeList,item, index) {
        this.form.gradeId=item.gradeCode;
        this.$nextTick(function () {
          gradeList.forEach(function (item) {
            Vue.set(item,'active',false);
          });
          Vue.set(item,'active',true);
        });
      },
      addSubject(){
        this.addForm.bookType = null
        this.dialogTitle=1;
        this.dialogVisible=true;
      },
      //编辑教材版本
      handleEdit(index,data){
        this.addForm.bookType = null
        this.dialogTitle=0;
        this.dialogVisible=true;
        this.gradeName=data.gradeName;
        this.dsubjectName=data.subjectName;
        this.addForm.groupIden=data.gradeIden;
        let subject_code = {}
        subject_code.subject_code = data.subjectIden
        subject_code.subject_name = data.subjectName
        this.addForm.subject=subject_code;
        this.getBookTypeVersion(data.gradeIden,subject_code);
        this.editParams={
          "schoolId":this.$route.query.groupId,
          "gradeIden":data.gradeIden,
          "subjectId":data.subjectId,
          "subjectIden":data.subjectIden
        }
      },
      cofrimDialog(diagNum,data){
        if(diagNum!=0){ //新增
          this.editParams={
            "schoolId":this.$route.query.groupId,
            "gradeIden":data.groupIden,
            "subjectId":data.subject.subject_code,
            "subjectIden":data.subject.subject_code
          },
          this.editParams.addToMaterialVersion={
            "subjectIden":data.subject.subject_code,
            "subjectName":data.subject.subject_name,
            "materialVersion":data.bookType.book_type,
            "versionCode":data.bookType.ctb_code,
          }
          this.$http.post(this.rootUrl + 'groupManager/addManagerMaterial?requestId=' + Math.random(),
            this.editParams).then((res) => {
            if(res.body.httpCode=='200'&&res.body.result==true){
              this.dialogVisible=false;
              this.initData();
            }
          });
        }else{//编辑
          this.editParams.updateToSubjectIden=data.subject.subject_code,
          this.editParams.updateToMaterialVersion={
            "subjectIden":data.subject.subject_code,
            "subjectName":data.subject.subject_name,
            "materialVersion":data.bookType.book_type,
            "versionCode":data.bookType.ctb_code,
          }
          this.$http.post(this.rootUrl + 'groupManager/updateManagerMaterial?requestId=' + Math.random(),
            this.editParams).then((res) => {
            if(res.body.httpCode=='200'&&res.body.result==true){
              this.dialogVisible=false;
              this.initData();
            }
          });
        }
      },
      //移除学科
      handleDelete(index,data){
        console.log(data);
        let params={
          "schoolId":this.$route.query.groupId,
          "gradeIden":data.gradeIden,
          "subjectId":data.subjectId,
          "subjectIden":data.subjectIden,
        }
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.rootUrl + 'groupManager/deleteManagerMaterial?requestId=' + Math.random(),
            params).then((res) => {
            if(res.body.httpCode=='200'&&res.body.result==true){
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              this.initData();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
    }
  }
</script>
<style>
.text-center{
  text-align: center;
}
ul.selectActive li{
  display: inline-block;
  /*background-color:#ffc365;*/
  border:1px solid #ffc365;
  border-radius:4px;
  padding:6px 20px;
  margin:4px;
  /*color:#fff;*/
}
.active{
  background-color:#ffc365;
  color:#fff;
}
</style>
