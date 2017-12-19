<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 考试推卷</el-breadcrumb-item>
        <!--<el-breadcrumb-item>教师列表</el-breadcrumb-item>-->
      </el-breadcrumb>
    </div>
    <hr>
    <div class="comflter">
      <p class="comflter-p">
        <span class="comflter-p-span">年级:</span>
        <el-radio-group v-model="grondRadio" @change="getPaper()">
          <el-radio  v-for="(item,index) in groundCode" :key = 'item.groupIden' class="radio"  v-bind:label=item.groupIden  >{{item.groupName}}</el-radio>
        </el-radio-group>
      </p>
    </div>
    <hr>
    <el-table :data="paperListData" border  style="width: 100%;margin-top: 15px">
      <el-table-column type="index" label="序号" width="105">
      </el-table-column>
      <el-table-column prop="diagnosisPaperName" label="试卷名称" width="125">
      </el-table-column>
      <el-table-column prop="paperType" label="试卷标签" width="125">
        <template scope="scope">
          <span style="margin-left: 10px" v-if="scope.row.paperType == 1">期中</span>
          <span style="margin-left: 10px" v-if="scope.row.paperType == 2">期末</span>
          <span style="margin-left: 10px" v-if="scope.row.paperType == 3">模拟考</span>
          <span style="margin-left: 10px" v-if="scope.row.paperType == 4">会考</span>
        </template>
      </el-table-column>
      <el-table-column prop="subjectCode" label="包含学科">
        <template scope="scope">
          <el-tag type='primary' v-for="item in scope.row.subjectCode" :key=item close-transition>{{item|subjectFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isRelease" label="状态" width="125">
        <template scope="scope">
          <el-tag type='primary' v-if="scope.row.isRelease" close-transition>已发布</el-tag>
            <el-tag type='success'v-else close-transition>未发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small"  @click="openDialog(scope.row)" :disabled="Boolean(scope.row.isRelease)">发送</el-button>
          <el-button size="small" type="primary" @click="openExamPaper(scope.row)">查看试卷</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[currentRootPageSize, currentRootPageSize*2]"
        :page-size="currentPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataTotal">
      </el-pagination>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :show-close="showCloseFlag"
      >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="接收班级:">
          <span>{{form.group|gradeCodeFilter}}</span>
          <!--<el-input v-model="form.name" :disabled="true" style="width: 350px"></el-input>-->
        </el-form-item>
        <el-form-item label="考试名称:">
          <el-input v-model="form.name" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="考试时间:">
          <el-col :span="9">
            <el-date-picker :picker-options="pickerOptions0" v-model="form.time" type="datetime" placeholder="选择开始时间"></el-date-picker>
          </el-col>
          <el-col :span="9">
            <el-date-picker :picker-options="pickerOptions0" v-model="form.time2" type="datetime" placeholder="选择结束时间"></el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <el-button :disabled="((!form.name) || (Date.parse(new Date(this.form.time))) > Date.parse(new Date(this.form.time2)))" style="float: right" type="primary" @click="submitPublish()">确 定</el-button>
      <el-button @click="dialogVisible = false" style="float: right;margin-right: 10px">取 消</el-button>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name:'examPush',
    data() {
      return {
        showCloseFlag:false,
        groundCode: [],
        grondRadio: this.$store.state.grondRadio,
        paperListData:this.$store.state.paperListData,
        currentPage: 1,
        currentRootPageSize: 10,
        currentPageSize: 10,
        dataTotal: 0,
        userSchoolId: JSON.parse(window.localStorage.getItem("Userinfo")).userSchoolId,
        dialogVisible: false,
        form: {
          group:'',
          name: '',
          time: "",
          time2: "",
        },
        submitForm: {},
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
      }
    },
    mounted(){
      this.useSidGetGradeList()
    },
    methods: {
      //获取学校当前开通的年级
      useSidGetGradeList() {
        this.$http.post(this.rootUrl + 'groupManager/getGradeList?requestId=123',{"groupId":this.userSchoolId}).then((res) => {
          this.groundCode = res.body.result;
        }, (res) => {
          console.log(res);
        });
      },
      //根据年级试卷
      getPaper: function () {
        this.tableData = []
        let parms = {
          "pageNum": this.currentPage,
          "pageSize": this.currentPageSize,
          "schoolCode":this.userSchoolId,
          "gradeCode":this.grondRadio,
          "flag": 1
        }
        this.$store.state.grondRadio = this.grondRadio
        this.postSearch(parms);
      },
      postSearch: function (parm) {
        this.$http.post(this.rootUrl + 'manager/teacher/getDiagnosisComplexPaperByPaper?requestId=123',parm
        ).then((res) => {
          try {
            this.paperListData=res.body.result.list;  //学生列表
            this.dataTotal=res.body.result.total;  //学生总数
            let rootthis = this;
            this.paperListData.forEach(function (e) {
              e.subjectCode = e.subjectCode.split(',')
              e.subjectCode =[...new Set(e.subjectCode)]
            })
            this.$store.state.paperListData = this.paperListData;
          }catch (e){
            console.log(e.message);
          }
        }, (res) => {
          console.log(res);
        });
      },
      handleSizeChange(val) {
        this.currentPageSize = val
        this.getPaper()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getPaper()
      },
      openDialog(row) {
        this.submitForm = row
        this.form.group = row.gradeCode
        this.dialogVisible = true
      },
      openExamPaper(row){
        this.$router.push({path:"/getExamPaperDetail",query:{code:row.code}});
      },
      submitPublish(){
        if(Date.parse(new Date()) > Date.parse(new Date(this.form.time2))){
          this.$message('时间已过期');
          return
        }
        if(Date.parse(new Date()) > Date.parse(new Date(this.form.time))){
          this.$message('时间已过期');
          return
        }
        let GradeId
        this.groundCode.forEach((e)=>{
          if(this.grondRadio == e.groupIden){
            GradeId = e.groupId
          }
        })
        let parm = {
          "diagnosisName": this.form.name,
          "diagnosisPaperName": this.submitForm.diagnosisPaperName,
          "startTime": this.fTime(JSON.stringify(new Date(this.form.time).getTime())) + ':00',
          "endTime": this.fTime(JSON.stringify(new Date(this.form.time2).getTime())) + ':00',
          "schoolCode": JSON.parse(window.localStorage.getItem("Userinfo")).userSchoolId,
          "schoolName": JSON.parse(window.localStorage.getItem("Userinfo")).schoolName||'易教空间',
          "diagnosisPaperCode": this.submitForm.code,
          "teacherCode": JSON.parse(window.localStorage.getItem("Userinfo")).userId,
          "teacherName": JSON.parse(window.localStorage.getItem("Userinfo")).userName,
          "stageCode": this.submitForm.stageCode,
          "gradeCode": this.submitForm.gradeCode,
          "useType": 0,
          "examType": this.submitForm.paperType,
          "gradeId": GradeId,
          "groupAreaDistrictId": JSON.parse(window.localStorage.getItem("Userinfo")).groupAreaDistrictId,
          "groupAreaDistrictName": JSON.parse(window.localStorage.getItem("Userinfo")).groupAreaDistrictName
        }
        this.$http.post(this.rootUrl + 'teacher/diagnosis/release?requestId=123',parm).then((res) => {
          this.dialogVisible = false
          if(res.body.httpCode=='200'){
            this.$message('发布成功');
            this.getPaper()
          }
        }, (res) => {
          console.log(res);
        });
      }
    }
  }
</script>
<style>
  .comflter {
    margin: 15px 0;
  }
  .comflter-p {
    margin: 15px 0;
    padding-left: 70px;
    position: relative;
  }
  .comflter-p-span{
    position: absolute;
    top: 0;
    left: 0;
  }
  .comflter-p .demand{
    position: absolute;
    top: -10px;
    right: 0px;
  }
</style>
