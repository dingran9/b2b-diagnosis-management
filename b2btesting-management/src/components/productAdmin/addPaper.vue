<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 试卷管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加试卷</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <hr>
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
      <!--<p class="comflter-p" style="height: 36px">-->
        <!--<el-button type="primary" @click="getPaperByUnit" style="float: right">查询</el-button>-->
      <!--</p>-->
    </div>
    <hr>
    <div style="margin-top: 15px">
      <el-form  label-width="80px" :model="formInline" class="demo-form-inline">
        <el-form-item label="选择试卷">
          <el-input v-model="formInline.resourcePaperName" :disabled="true" placeholder="选择试卷" style="width: 60%"></el-input>
        </el-form-item>
        <el-form-item :inline="true" label="试卷名称">
          <el-input v-model="formInline.name2" placeholder="试卷名称" style="width: 60%"></el-input>
        </el-form-item>
        <el-form-item :inline="true" label="作者">
          <el-input v-model="formInline.region" placeholder="作者" style="width: 60%"></el-input>
          <el-button :disabled="((!formInline.resourcePaperName) || (!formInline.name2) || (!formInline.region))" style="float: right" type="primary" @click="onSubmit">保存试卷</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="试卷列表" v-model="dialogVisible" size="small">
      <el-table :data="paperListData" highlight-current-row @row-click="getrowclick">
        <el-table-column property="name" label="试卷名称" min-width='600'></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
      name:'addPaper',
    data() {
      return {
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
//        paperListData: [
//            {
//          "pageSize": null,
//          "pageNum": null,
//          "id": "8a2a74685acc4b52015b0ed86bcf3a9b",
//          "name": "九年级数学人教版下册第二十六章 反比例函数学科能力测评（1）",
//          "code": null,
//          "gradeCode": null,
//          "subjectCode": null
//        }, {
//          "pageSize": null,
//          "pageNum": null,
//          "id": "8a2a74685b469551015b46dc459d06c4",
//          "name": "九年级数学人教版下册第二十六章 反比例函数学科能力测评（2）",
//          "code": null,
//          "gradeCode": null,
//          "subjectCode": null
//        }],
        dialogVisible: false,
        radio3: '上海',
        formInline: {
          user: '',
          region: JSON.parse(window.localStorage.getItem("Userinfo")).userSchoolId
        },
        fullscreenLoading: false
      }
    },

    methods: {
      //根据学年获取学科
      getSubject: function () {
        this.$http.post(this.rootUrl + 'teacher/rescours/getSubjectByGradeCode?requestId=123',{"gradeCode":this.grondRadio}).then((res) => {
          this.subjectlist=res.body.result;
          this.subjectRadio = ' ';
          this.bookVersionlist = [];
          this.bookTopBotlist = [];
          this.unitlist = [];
        }, (res) => {
          console.log(res);
        });
      },
      //根据学科获取教材版本
      getBookTypeVersion: function () {
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
            if(this.bookVersionRadio != null && this.bookVersionRadio != ' '){
            this.$http.post(this.rootUrl + 'teacher/rescours/getbookTypeVersionAndUnit?requestId=123',
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
          if(this.UnitRadio == ' '){
            this.$message('请选择单元');
          }else{
            this.$http.post(this.rootUrl + 'teacher/rescours/getPaperByUnit?requestId=123',
              {
                "unitCode":this.UnitRadio
              }).then((res) => {
              this.dialogVisible = true;
              this.paperListData=res.body.result
            }, (res) => {
              console.log(res);
            });
          }

      },
      getrowclick:function (row, event, column) {
        this.formInline.resourcePaperName = row.name;
        this.formInline.resourcePaperCode = row.id;
        this.formInline.paperType = row.paperType;
        this.formInline.totalScore = row.paperScore;
        this.formInline.paperDifficult = row.paperDifficult;
        this.dialogVisible = false
      },
      onSubmit() {
        if(this.formInline.name2 == ''){
            this.$message('请填写试卷名称');
            return
        }
        if(this.formInline.name2.length > 20){
          this.$message('试卷名称过长');
          return
        }
        if(this.formInline.resourcePaperName.length <= 1){
          this.$message('请选择试卷');
          return
        }
        this.fullscreenLoading = true;
          let rootThis = this;
          let unitName,bookVersion;
          this.bookVersionlist.forEach(function (e) {
            if(e.ctb_code == rootThis.bookVersionRadio) {
              bookVersion = e.book_type
            }
          });
        this.unitlist.forEach(function (e) {
          if(e.code == rootThis.UnitRadio) {
            unitName = e.name
          }
        })
        this.$http.post(this.rootUrl + 'manager/teacher/saveDiagnosisPaper?requestId=123',
          {
            "diagnosisPaperName": this.formInline.name2,
            "resourceType": 1,
            "resourcePaperCode": this.formInline.resourcePaperCode,
            "resourcePaperName": this.formInline.resourcePaperName,
            "coverUrl": "http////////",
            "unitName":unitName,
            'bookVersion':bookVersion,
            "operator": this.formInline.region,
            "stageCode": parseInt(this.grondRadio/10),
            "gradeCode": this.grondRadio,
            "subjectCode": this.subjectRadio,
            "difficultStar": 1,
            "platform": "5184",
            "unitCode": this.UnitRadio,
            "paperType": this.formInline.paperType,
            "paperDifficult": this.formInline.paperDifficult,
            "totalScore":this.formInline.totalScore
          }).then((res) => {
          if(res.body.code == 'Success' && res.body.httpCode == '200'){
            this.$message('创建成功');
            this.formInline.name2 = ''
            this.formInline.resourcePaperCode = ''
            this.formInline.resourcePaperName = ''
            this.fullscreenLoading = false;
            this.$router.push('/paperMange')
          }else{
            this.$message('创建失败');
          }
        }, (res) => {
          this.$message('创建失败');
        });
        console.log(JSON.stringify());
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

