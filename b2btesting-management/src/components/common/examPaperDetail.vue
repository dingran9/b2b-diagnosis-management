<template>
  <div>
    <div class="crumbs" style="position: relative">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>试卷详情</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" style="position: absolute;right:0;top: -10px;" onclick="window.history.go(-1)">返回</el-button>
    </div>
    <hr>
    <div style="margin: 15px 0">
      <el-radio-group v-model="subjectId" @change="getPaper(subjectId)">
        <el-radio v-for="(item,index) in subjectlist" :key = 'item.code' class="radio"  v-bind:label=item.resourcePaperCode>{{item.subjectCode|subjectFilter}}<span v-if="item.subjectCode == 2&&item.artsType==0&&(item.gradeCode ==32 || item.gradeCode ==33)">(文)</span><span v-if="item.subjectCode == 2&&item.artsType ==1&&(item.gradeCode ==32 || item.gradeCode ==33)">(理)</span></el-radio>
      </el-radio-group>
    </div>
    <examDetailddd :code="toChildCode"></examDetailddd>
  </div>
</template>
<script>
  import examDetailddd from '../common/examDetailddd.vue';
  export default {
    data(){
      return {
        code: this.$route.query.code,
        subjectId:'',
        subjectlist:[],
        toChildCode:''
      }
    },
    components:{
      examDetailddd
    },
    mounted(){
      this.getAllPaper()
    },
//    activated:function(){
//      this.initDate()
//    },
    methods: {
        initDate(){
          this.code = this.$route.query.code
          this.getAllPaper()
        },
      getAllPaper(){
        this.$http.post(this.rootUrl + 'manager/teacher/getDiagnosisPaperListByComplexPaperCode?requestId=123', {"code": this.code}).then((res) => {
          this.subjectlist = res.body.result;
        }, (res) => {
          console.log(res);
        });
      },
      getPaper(code){
        console.log(1);
        this.toChildCode = code
      }
    }
  }
</script>
