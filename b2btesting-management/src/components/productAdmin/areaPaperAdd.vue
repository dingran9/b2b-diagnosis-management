<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 区域联考</el-breadcrumb-item>
        <el-breadcrumb-item>添加试卷</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <hr>
    <div style="margin-top: 15px">
      <p class="paper-list">
        <span>考试名称</span><el-input v-model="diagnosisName" placeholder="考试名称" style="width: 300px;
    margin-left: 10px;"></el-input>
      </p>
      <p class="paper-list">
        <span>考试类型</span><el-select @change="detailModels = []" v-model="examType" placeholder="考试类型" style="width: 300px;
    margin-left: 10px;">
          <el-option
            v-for="item in examTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </p>
      <p class="paper-list">
        <span>参考科目</span><el-select @change="detailModels = []" v-model="diagnosisType" placeholder="参考科目" style="width: 300px;
    margin-left: 10px;">
        <el-option label="单科" value="0"></el-option>
        <el-option label="全科" value="1"></el-option>
      </el-select>
      </p>
      <p class="paper-list">
        <el-button @click='dialogVisible = true' type="success" :disabled="!diagnosisName">添加试卷<i class="el-icon-plus"></i></el-button>
      </p>
      <p class="paper-list addFontSize" v-for="item in detailModels">
        <span>{{item.subjectCode | subjectFilter}}试卷</span><span style="margin-left: 10px;margin-right: 15px;width: 490px;
    display: inline-block;">{{item.diagnosisPaperName}}</span>开始时间
        <el-date-picker
          v-model="item.startTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker> 结束时间
        <el-date-picker
        v-model="item.endTime"
        type="datetime"
        placeholder="选择日期时间">
      </el-date-picker>
      </p>
      <el-button style="float: right;margin-top: 60px" type="primary" @click="onSubmit" :disabled="submitFlag">确认发布</el-button>
    </div>
    <el-dialog title="试卷列表" v-model="dialogVisible" size="small">
      <div class="comflter">
        <p class="comflter-p">
          <span class="comflter-p-span">年级:</span>
          <el-radio-group v-model="grondRadio" @change="getSubject()">
            <el-radio  v-for="(item,index) in groundCode" :key = 'item.code' class="radio"  v-bind:label=item.code  >{{item.name}}</el-radio>
          </el-radio-group>
        </p>
        <p class="comflter-p" v-if="subjectlist.length > 0">
          <span class="comflter-p-span">学科:</span>
          <el-radio-group v-model="subjectRadio" @change="getBookTypeVersion()">
            <el-radio v-for="(item,index) in subjectlist" :key = 'item.subject_code' class="radio"  v-bind:label=item.subject_code>{{item.subject_name}}</el-radio>
          </el-radio-group>
        </p>
        <p class="comflter-p" v-if="bookVersionlist.length > 0">
          <span class="comflter-p-span">教材:</span>
          <el-radio-group v-model="bookVersionRadio" @change="getbookTypeVersionAndUnit()">
            <el-radio v-for="(item,index) in bookVersionlist" :key = 'item.ctb_code' class="radio"  v-bind:label=item.ctb_code>{{item.book_type}}</el-radio>
          </el-radio-group>
        </p>
        <p class="comflter-p" v-if="bookTopBotlist.length > 0">
          <span class="comflter-p-span">上下册:</span>
          <el-radio-group v-model="bookTopBotRadio" @change="getbookTypeVersionUnit()">
            <el-radio v-for="(item,index) in bookTopBotlist" :key = 'item.code' class="radio"  v-bind:label=item.code>{{item.name}}</el-radio>
          </el-radio-group>
        </p>
        <p class="comflter-p" style="padding-right: 100px" v-if="unitlist.length > 0">
          <span class="comflter-p-span">单元:</span>
          <el-radio-group v-model="UnitRadio" > <!--@change="getPaperByUnit()"-->
            <el-radio v-for="(item,index) in unitlist" :key = 'item.code' class="radio"  v-bind:label=item.code>{{item.name}}</el-radio>
          </el-radio-group>
          <el-button class="demand" type="primary" @click="getPaperByUnit">查询试卷</el-button>
        </p>
        <p class="comflter-p" style="padding-right: 100px" v-if="(grondRadio == 32 || grondRadio == 33) && subjectRadio == 2">
          <span class="comflter-p-span">文理类型:</span>
          <el-radio-group v-model="artType" >
            <el-radio  label='1'>理科</el-radio>
            <el-radio  label='0'>文科</el-radio>
          </el-radio-group>
        </p>
      </div>
      <el-table :data="paperListData" highlight-current-row @row-click="getrowclick">
        <el-table-column property="diagnosisPaperName" label="试卷名称(单击添加)" min-width='600'></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">关 闭</el-button>
    <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name:'addPaper',
    data() {
      return {
        pickerOptions: {   //小于当前时间
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
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
        grondRadio: 0,
        subjectlist:[],
        subjectRadio: ' ',
        bookVersionlist:[],
        bookVersionRadio: ' ',
        bookTopBotlist:[],
        bookTopBotRadio:' ',
        unitlist:[],
        UnitRadio:' ',
        paperListData:[],
        dialogVisible: false,
        formInline: {
          user: '',
          region: JSON.parse(window.localStorage.getItem("Userinfo")).userSchoolId
        },
        fullscreenLoading: false,
        detailModels: [],
        diagnosisName: '',
        artType: null,
        examType: 0,
        examTypeList: [
          {id:0,name:'单元测试'},
          {id:1,name:'期中'},
          {id:2,name:'期末'},
          {id:3,name:'模拟考'},
          {id:4,name:'会考'},
          {id:5,name:'周考'},
          {id:6,name:'月考'}
        ],
        diagnosisType: '1',
        submitFlag: true,
      }
    },

    methods: {
      //根据学年获取学科
      getSubject: function () {
        this.submitFlag = true
        this.paperListData = []
        this.$http.post(this.rootUrl + 'groupManager/getSchoolByStageAndArea?requestId=123', {
          "groupAreaDistrictId": JSON.parse(localStorage.getItem('Userinfo')).groupAreaDistrictId,
          "groupPeriod": this.grondRadio.toString().substr(0,1).split(','),
        }).then((res) => {
          if(res.body.code == 'Success' && res.body.httpCode == '200'){
            if(res.body.result.length > 0){
              this.submitFlag = false
              this.$http.post(this.rootUrl + 'teacher/rescours/getSubjectByGradeCode?requestId=123',{"gradeCode":this.grondRadio}).then((res) => {
                this.subjectlist=res.body.result;
                this.subjectRadio = ' ';
                this.bookVersionlist = [];
                this.bookTopBotlist = [];
                this.unitlist = [];
              }, (res) => {
                console.log(res);
              });
            }else {
              this.$message('该年级下没有学校');
            }
          }
        });
      },
      //根据学科获取教材版本
      getBookTypeVersion: function () {
        this.paperListData = []
        if(this.subjectRadio != null && this.subjectRadio != ' '){
          this.$http.post(this.rootUrl + 'teacher/rescours/getBookTypeVersion?requestId=123',
            {
              "gradeCode":this.grondRadio,
              "subjectCode":this.subjectRadio
            }).then((res) => {
            this.bookVersionlist=res.body.result;
            this.bookVersionRadio= ' ';
            this.bookTopBotlist = [];
            this.unitlist = [];
            this.UnitRadio = ' ';
          }, (res) => {
            console.log(res);
          });
        }
      },
      //根据教材版本获取上下册
      getbookTypeVersionAndUnit: function () {
        this.paperListData = []
        if(this.bookVersionRadio != null && this.bookVersionRadio != ' '){
          this.$http.post(this.rootUrl + 'teacher/rescours/getVolume?requestId=123',
            {
              "gradeCode":this.grondRadio,
              "subjectCode":this.subjectRadio,
              "booktypeCode":this.bookVersionRadio,
              "productsIds":"581c1b44f70541fc88f8658041477c6c",
              "code":"0"
            }).then((res) => {
            this.bookTopBotlist=res.body.result;
            this.bookTopBotRadio= ' ';
            this.unitlist = [];
          }, (res) => {
            console.log(res);
          });
        }
      },
      //根据上下册获取单元
      getbookTypeVersionUnit: function () {
        this.paperListData = []
        if(this.bookTopBotRadio != null && this.bookTopBotRadio != ' '){
          this.$http.post(this.rootUrl + 'teacher/rescours/getbookTypeVersionAndUnit?requestId=123',
            {
              "gradeCode":this.grondRadio,
              "subjectCode":this.subjectRadio,
              "booktypeCode":this.bookVersionRadio,
              "productsIds":"581c1b44f70541fc88f8658041477c6c",
              "code":this.bookTopBotRadio
            }).then((res) => {
            this.unitlist=res.body.result;
            this.UnitRadio= ' ';
          }, (res) => {
            console.log(res);
          });
        }
      },
      //根据单元获取试卷
      getPaperByUnit: function () {
        this.paperListData = []
        if(this.UnitRadio == ' '){
          this.$message('请选择单元');
        }else{
          this.$http.post(this.rootUrl + 'manager/teacher/getDiagnosisPaperByPaper?requestId=123',
            {
              "pageNum": 1,
              "pageSize": 100,
              "unitCode": this.UnitRadio
            }).then((res) => {
            this.dialogVisible = true;
            this.paperListData=res.body.result.list
          }, (res) => {
            console.log(res);
          });
        }

      },
      getrowclick:function (row, event, column) {
        if((this.grondRadio == 32 || this.grondRadio == 33) && this.subjectRadio == 2 && this.artType == null)return this.$message('请选择文理类型');
        let flag = false
        this.detailModels.forEach((e,index)=>{
          if(e.subjectCode == this.subjectRadio){
            flag = true
            e.diagnosisPaperCode = row.code
            e.diagnosisPaperName = row.diagnosisPaperName
            e.artType = this.artType||2
            e.paperScore = row.totalScore
            e.startTime = null,
            e.endTime = null
          }
        })
        if(!flag){
          if(this.diagnosisType == '0'){
            this.detailModels = []
          }
          this.detailModels.push({
            "subjectCode": this.subjectRadio,
            "artType": this.artType||2,
            "diagnosisPaperCode": row.code,
            "diagnosisPaperName": row.diagnosisPaperName,
            "startTime": null,
            "endTime": null,
            "paperScore": row.totalScore
          })
        }
        this.dialogVisible = false
        this.artType = null
      },
      onSubmit() {
        let flag = false;
        if(!this.diagnosisName) return this.$message('请输入考试名称');
        this.detailModels.forEach((e)=>{
          e.startTime = Date.parse(new Date(e.startTime))
          e.endTime = Date.parse(new Date(e.endTime))
        })
        flag = this.detailModels.some((e)=>{
          return !e.startTime || !e.endTime || e.startTime > e.endTime || e.startTime < Date.parse(new Date())
        })
        if(flag){
          this.$message('考试时间不能为空且必须大于当前时间');
        }else {
          this.fullscreenLoading = true;
          this.$http.post(this.rootUrl + 'teacher/diagnosis/teachingManagerRelease?requestId=123',
            {
              "gradeCode": this.grondRadio,
              "stageCode": this.grondRadio.toString().substr(0,1),
              "teacherName": JSON.parse(localStorage.getItem('Userinfo')).userName,
              "examType": this.examType,
              "examScope": 4,
              "diagnosisType": this.diagnosisType,
              "diagnosisName": this.diagnosisName,
              "groupAreaDistrictId": JSON.parse(localStorage.getItem('Userinfo')).groupAreaDistrictId,
              "groupAreaDistrictName": JSON.parse(localStorage.getItem('Userinfo')).groupAreaDistrictName,
              "teacherCode": JSON.parse(localStorage.getItem('Userinfo')).userId,
              "detailModels": this.detailModels
            }).then((res) => {
            if(res.body.code == 'Success' && res.body.httpCode == '200'){
              this.$message('创建成功');
              this.fullscreenLoading = false;
              this.$router.push('/areaPaperList')
            }else{
              this.$message('创建失败');
            }
          }, (res) => {
            this.$message('创建失败');
          });
        }

      },
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
  .paper-list {
    /*width: 730px;*/
    text-align: left;
    height: 60px;
    line-height: 60px;
    font-size: 15px;
    /*border-bottom: 1px solid #ccc;*/
    margin: 0 auto;
  }
  /*.addFontSize {*/
    /*font-size: 18px;*/
  /*}*/
  td {
    cursor: pointer;
  }
</style>

