<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 试卷组卷管理</el-breadcrumb-item>
        <el-breadcrumb-item>组织全科试卷</el-breadcrumb-item>
      </el-breadcrumb>
      <!--<el-button type="primary" style="position: absolute;right:0;top: 48px;" @click="searchSubject()">搜索科目</el-button>-->
    </div>
    <paperFormFilter v-on:increment="listenToMyChild"></paperFormFilter>
    <el-form ref="form" :model="form" label-width="80px" style="position: relative; margin: 20px 0">
      <!--<span style="position: absolute;top: -56px;left: 210px;color: red;font-size: 14px">(请慎重选择上下册)</span>-->
      <el-form-item label="试卷名称">
        <el-input v-model="form.name" style="width: 500px"></el-input>
      </el-form-item>
      <el-form-item label="考试类型">
        <el-select v-model="form.paperType" placeholder="考试类型">
          <el-option label="期中" value="1"></el-option>
          <el-option label="期末" value="2"></el-option>
          <el-option label="模拟考" value="3"></el-option>
          <el-option label="会考" value="4"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <ul class="a-p-f-ul">
      <li v-for="item in subjectlist" class="a-p-ul-li">
        <span class="sub-name"><span>{{item.subjectId | subjectFilter}}</span>试卷<span
          v-if="item.subjectId==2 && (childWords.grondRadio==32||childWords.grondRadio==33 )">(理)</span>:</span><span
        class="sub-p-name">{{item.diagnosisPaperName}}</span>
        <!--<el-button type="primary" class="sub-ele">预览</el-button>-->
        <el-button :disabled="Boolean(item.diagnosisPaperName)" type="primary" class="sub-ele"
                   @click="openChoisePaper(item.subjectId,1)">选择
        </el-button>
      </li>
      <li v-for="item in subjectlist"
          v-if="item.subjectId==2 && (childWords.grondRadio==32||childWords.grondRadio==33 )" class="a-p-ul-li">
        <span class="sub-name"><span>{{item.subjectId | subjectFilter}}</span>试卷<span>(文)</span>:</span><span
        class="sub-p-name">{{diagnosisWPaperName}}</span>
        <!--<el-button type="primary" class="sub-ele">预览</el-button>-->
        <el-button :disabled="Boolean(diagnosisWPaperName)" type="primary" class="sub-ele"
                   @click="openChoisePaper(item.subjectId,0)">选择
        </el-button>
      </li>
      <li class="a-p-ul-li">
        <el-button  type="primary" class="sub-ele" @click="submitFormP()">确 定
        </el-button>
      </li>
    </ul>
    <el-dialog title="选择试卷" v-model="dialogFormVisible">
      <paperFormDialog :group="toChildGroupId" :subjectId="toChildSubjectId" :toArtsType="toArtsType"
                       v-on:getrowclick="listenToMyDialog"></paperFormDialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import paperFormFilter from '../common/paperFormFilter.vue';
  import paperFormDialog from '../common/paperFormDialog.vue';
  export default {
    name: 'addPaperForm',
    data() {
      return {
        form: {
          name: '',
          paperType: "3"
        },
        childWords: {},
        subjectlist: [],
        dialogFormVisible: false,
        toChildSubjectId: '',
        toChildGroupId: '',
        diagnosisPaperModelsList: [],
        toArtsType: '',
        diagnosisWPaperName: '',
        showFlag: true
      }
    },
    components: {
      paperFormFilter, paperFormDialog
    },
    created: function () {
      this.$store.state.paperFormFilter_data.grondRadio = ''
    },
    mounted: function () {
      this.$store.state.paperFormFilter_data.provinceValue = ''
    },
    methods: {
      listenToMyChild: function (somedata) {
        this.childWords = somedata;
        this.searchSubject()
      },
      searchSubject: function () {
        this.subjectlist = []
        this.diagnosisPaperModelsList = []
        if (this.childWords.grondRadio) {
          this.$http.post(this.rootUrl + 'groupManager/getSubjectByGradeId?requestId=123', {
            "groupIden": this.childWords.grondRadio,
            "groupParentId": this.childWords.schoolValue,
          }).then((res) => {
            this.subjectlist = res.body.result;
          }, (res) => {
            console.log(res);
          });
        }
      },
      listenToMyDialog: function (somedata) {
        let rootThis = this
        this.subjectlist.forEach((item) => {
          if ((item.subjectId == somedata.data.subjectCode) && (somedata.data.artsType == 1)) {
            item.diagnosisPaperName = somedata.data.diagnosisPaperName
          }
          if ((item.subjectId == somedata.data.subjectCode) && (somedata.data.artsType == 0)) {
            rootThis.diagnosisWPaperName = somedata.data.diagnosisPaperName
          }
        })
        this.diagnosisPaperModelsList.push(somedata.data)
        this.dialogFormVisible = somedata.dialogFormVisible
      },
      openChoisePaper(subject, ArtsType) {
        this.toChildSubjectId = subject
        this.toChildGroupId = this.childWords.grondRadio
        this.toArtsType = ArtsType
        this.dialogFormVisible = !this.dialogFormVisible
      },
      submitFormP(){
        if (!this.form.name) {
          this.$message('请填写试卷名称')
          return
        }
        if (this.form.name.length > 20) {
          this.$message('试卷名称过长')
          return
        }
        if (this.childWords.topFloor.length == 0) {
          this.$message('请选择上下册')
          return
        }
        if(this.diagnosisPaperModelsList.length < 1){
          this.$message('请检查单科卷试卷个数');
          return
        }
        let parm = {
          "diagnosisPaperModelsList": this.diagnosisPaperModelsList,
          "coverUrl": "-----",
          "diagnosisPaperName": this.form.name,
          "difficultStar": 1,
          "gradeCode": this.childWords.grondRadio,
          "operator": "易教空间",
          "paperType": this.form.paperType,
          "volumeType": this.childWords.topFloor,
          "platform": "1",
          "schoolCode": this.childWords.schoolValue,
          "schoolName": this.childWords.schoolName,
          "stageCode": parseInt(this.childWords.grondRadio / 10)
        }
        this.$http.post(this.rootUrl + 'manager/teacher/saveDiagnosisComplexPaper?requestId=123', parm).then((res) => {
          if (res.body.code == 'Success' && res.body.httpCode == '200') {
            this.$message('创建成功');
            this.$router.push('paperFormMange')
          } else {
            this.$message('创建失败');
          }
        }, (res) => {
          this.$message('创建失败');
        });
      }
    },
  }
</script>
<style>
  .a-p-f-ul {
    list-style: none;
  }

  .a-p-f-ul li {
    width: 900px;
    color: #48576a;
    font-size: 18px;
    line-height: 50px;
    border-top: 1px solid #bfcbd9;
    border-left: 1px solid #bfcbd9;
    border-right: 1px solid #bfcbd9;
  }

  /*.a-p-f-ul li:last-child{*/
  /*!*border-bottom: 1px solid #bfcbd9*!*/
  /*}*/
  .sub-ele {
    float: right;
    margin-top: 7px;
    margin-right: 10px;
  }

  .sub-name {
    margin-left: 20px;
  }

  .sub-p-name {
    margin-left: 10px;
  }

  .comflter-p .demand {
    position: absolute;
    top: -10px;
    right: 0px;
  }
</style>
