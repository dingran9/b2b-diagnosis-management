<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 试卷组卷管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑全科试卷</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <hr>
    <el-form ref="form" :model="form" label-width="80px" style="position: relative; margin: 20px 0">
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
        <span class="sub-name"><span>{{item.subjectCode|subjectFilter}}</span>试卷<span v-if="item.subjectCode==2 && item.artsType == 1">(理)</span><span v-if="item.subjectCode==2 && item.artsType == 0">(文)</span>:</span><span class="sub-p-name">{{item.diagnosisPaperName}}</span>
        <!--<el-button type="primary" class="sub-ele">预览</el-button>-->
        <el-button type="primary" class="sub-ele" @click="openChoisePaper(item.subjectCode,item.artsType,item.code)">选择</el-button>
      </li>
    </ul>
    <el-dialog title="选择试卷" v-model="dialogFormVisible">
      <paperFormDialog :group="toChildGroupId" :subjectId="toChildSubjectId" :toArtsType="toArtsType" :tocode="toChildCode"
                       v-on:getrowclick="listenToMyDialog"></paperFormDialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-button type="primary" @click="submitFormP()" style="margin-top: 15px;float: right">确 定</el-button>
  </div>
</template>

<script>
  import paperFormDialog from '../common/paperFormDialog.vue';
  export default {
    data() {
      return {
        form: {
          name: '',
          paperType: "3"
        },
        gradeCode:null,
        subjectlist:[],
        dialogFormVisible: false,
        toChildSubjectId: '',
        toChildGroupId: '',
        toChildCode: '',
        diagnosisPaperModelsList:[],
        toArtsType:'',
        diagnosisWPaperName:''
      }
    },
    components:{
      paperFormDialog
    },
    mounted: function () {
        this.searchFormPaper()
    },
    methods: {
      searchFormPaper: function () {
        this.$http.post(this.rootUrl + 'manager/teacher/getDiagnosisComplexPaperList?requestId=123', {
          "code": this.$route.query.code
        }).then((res) => {
          this.form.name = res.body.result[0].diagnosisPaperName;
          this.form.paperType = res.body.result[0].paperType;
          this.subjectlist = res.body.result[0].diagnosisComplexPaperRelationDtoList;
          this.gradeCode = res.body.result[0].gradeCode;
        }, (res) => {
          console.log(res);
        });
      },
      listenToMyDialog: function (somedata) {
        let rootThis = this
        this.subjectlist.forEach((item)=> {
          if (item.code == somedata.data.id) {
            item.diagnosisPaperName = somedata.data.diagnosisPaperName
            item.diagnosisPaperCode = somedata.data.code
            item.totalScore = somedata.data.totalScore
          }
        })
        this.dialogFormVisible = somedata.dialogFormVisible

      },
      openChoisePaper(subject,ArtsType,code) {
        this.toChildSubjectId = subject
        this.toChildGroupId = this.gradeCode
        this.toArtsType = ArtsType
        this.toChildCode = code
        this.dialogFormVisible = !this.dialogFormVisible
      },
      submitFormP(){
        if(!this.form.name){
          this.$message('请填写试卷名称');
          return
        }
        if(this.subjectlist.length !=document.getElementsByClassName('a-p-ul-li').length){
          this.$message('请检查单科卷试卷个数');
          return
        }
        let parm = {
          "code": this.$route.query.code,
          "diagnosisPaperName": this.form.name,
          "diagnosisComplexPaperRelationModelList": this.subjectlist
        }
        this.$http.post(this.rootUrl + 'manager/teacher/updateDiagnosisComplexPaper?requestId=123',parm).then((res) => {
          this.$message('修改成功');
          this.$router.push('paperFormMange')
        }, (res) => {
          console.log(res);
        });
      }
    },
  }
</script>
<style>
  .a-p-f-ul{
    list-style: none;
  }
  .a-p-f-ul li{
    width: 900px;
    color: #48576a;
    font-size: 18px;
    line-height: 50px;
    border-top: 1px solid #bfcbd9;
    border-left: 1px solid #bfcbd9;
    border-right: 1px solid #bfcbd9;
  }
  .a-p-f-ul li:last-child{
    border-bottom: 1px solid #bfcbd9
  }
  .sub-ele {
    float: right;
    margin-top: 7px;
    margin-right: 10px;
  }
  .sub-name{
    margin-left: 20px;
  }
  .sub-p-name{
    margin-left: 10px;
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
