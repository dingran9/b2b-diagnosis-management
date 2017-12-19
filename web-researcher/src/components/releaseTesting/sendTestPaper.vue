<template>
  <div class="sendTestPaper">
    <section class="header" v-if="true">
      <div class="title">
        <span>单元检测>发布测试>发送试卷</span>
        <button @click="goBack">返回上一级</button>
      </div>
    </section>
    <section class="content">
      <div class="item">
        <img src="../../../static/img/icon/icon14.png" height="20" width="20"/>
        <span class="textLeft">试卷名称</span>
        <span class="textRight">{{localStorage.testDetail.diagnosisPaperName}}</span>
      </div>

      <div class="item">
        <img src="../../../static/img/icon/icon15.png" height="20" width="20"/>
        <span class="textLeft">诊断卷名称</span>
        <el-input v-model="data.paperName" placeholder="请输入内容"  class="textRight textInput"></el-input>
      </div>

      <div class="item">
        <img src="../../../static/img/icon/icon14.png" height="20" width="20"/>
        <span class="textLeft">开考时间</span>
        <el-date-picker  class="textRight textTime"
          v-model="data.datetimeStart"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </div>

      <div class="item">
        <img src="../../../static/img/icon/icon15.png" height="20" width="20"/>
        <span class="textLeft">结束时间</span>
        <el-date-picker  class="textRight textTime"
          v-model="data.datetimeEnd"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </div>

      <div class="item">
        <img src="../../../static/img/icon/icon16.png" height="20" width="20"/>
        <span class="textLeft">接收班级</span>
        <el-checkbox-group v-model="data.checkbox">
          <el-checkbox :label="item.classId" v-for="(item,index) in localStorage.getTeacherInfo.classBeanList" :value="item.classId" key="key666">
            <template>
              <span>{{item.className}}</span>
            </template>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </section>
    <section class="foot" v-if="true">
        <button @click="send">发送试卷</button>
    </section>

  </div>
</template>
<script>
  import favQuestion from './testPaperAnalysis';
  export default {
    props:[],
    components: {

    },
    data(){
      return {
        data: {
          paperName:'',
          datetimeStart:'',
          datetimeEnd:'',
          checkbox:[],
        },
        flag: {

        },
        query:this.$route.query,
        localStorage:{
          testDetail:JSON.parse(window.localStorage.testDetail),
          getTeacherInfo:JSON.parse(window.localStorage.getTeacherInfo),
        },

      }
    },
    mounted(){

    },
    methods: {
      goBack(){
        this.$router.push({path:"/main/testDetail"})
      },
      send(){
          let start=this.data.datetimeStart;
          let end=this.data.datetimeEnd;
          let now=new Date()
        if(this.data.paperName.length==''){
          this.$message('请输入诊断券名称');
          return;
        }else if(this.data.datetimeStart==''){
          this.$message('请选择开始时间');
          return;
        }else if(this.data.datetimeEnd==''){
          this.$message('请选择结束时间');
          return;
        }else if(start*1<now*1){
          this.$message('开始时间不能早于当前时间');
          return;
        }else if(end*1<now*1){
          this.$message('结束时间不能早于当前时间');
          return;
        }else if(start*1>end*1){
          this.$message('开始时间不能晚于结束时间');
          return;
        }else if(this.data.checkbox.length==0){
          this.$message('请选择班级');
          return;
        }
        this.$ajax.release({
          "diagnosisName": this.data.paperName,
          "diagnosisPaperName": this.localStorage.testDetail.diagnosisPaperName,
          "startTime": this.data.datetimeStart,
          "endTime": this.data.datetimeEnd,
          "schoolCode": this.localStorage.getTeacherInfo.userSchoolId,
          "schoolName": this.localStorage.getTeacherInfo.schoolName,
          "diagnosisPaperCode": this.localStorage.testDetail.code,
          "teacherCode": this.localStorage.getTeacherInfo.userId,
          "teacherName": this.localStorage.getTeacherInfo.userName,
          "stageCode": this.localStorage.testDetail.stageCode,
          "gradeCode": this.localStorage.testDetail.gradeCode,
          "useType": 0,//0诊断 1作业
          "classCodes": this.data.checkbox,
          "subjectCode": this.localStorage.testDetail.subjectCode,
          "examType": 0,
          "totalScore": this.localStorage.testDetail.totalScore
        })
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.$message('发送成功');
              this.$router.push({path:"/releaseTesting/releaseTesting"})
            } else {
              this.$message('发送试卷失败,请刷新页面重试');
            }
          })
      }

    },
    computed: {},
    filters: {},
  }
</script>
<style lang="scss" >
.sendTestPaper{
  min-width:998px;
  .header{
    padding:0;
    .title{
      overflow:hidden;
      margin-top: 20px;
      margin-left:18px;
      box-sizing:border-box;
      padding:10px 40px;
      background:white;
      span{
        color:#000000;
        font-size:18px;
        float:left;
        display:inline-block;
        height:40px;
        line-height:40px;
      }
      button{
        float:right;
        width:143px;
        height:40px;
        border-radius:20px;
        font-size:18px;
        color:#fff;
        background:#1fd094;
        outline:none;
        cursor: pointer;
      }
    }
  }
  .content{
    margin:30px auto 30px 18px;
    background:white;
    text-align:left;
    padding:40px;
    .item{
      margin-bottom:24px;
      *{
        vertical-align:middle;
        display:inline-block;
      }
      .textLeft{
        display:inline-block;
        width:138px;
        text-align:left;
        height:40px;
        line-height:40px;
      }
      .textTime{
        width:580px;
        height:40px;
        input{
          /*text-align:center;*/
        }
      }
      .textInput{
        width:710px;
        height:40px;
        text-align:left;
      }
    }
  }
.foot{
  margin-bottom:50px;
  button{
    width:143px;
    height:40px;
    border-radius:20px;
    font-size:18px;
    color:#fff;
    background:#1fd094;
    outline:none;
    cursor: pointer;
  }
}
  .el-input{
    width:200px;
    input{
     border:0;
      background:#f0f4fb;
    }
  }
}
</style>
