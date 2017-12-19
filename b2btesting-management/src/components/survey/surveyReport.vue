<!-- 布局 --> 
<template>
  <!--根部视图-->
  <div>
    <div class="report-item">
      <div class="report-header">概览</div>
      <div class="report-body">
        <span style="margin-left: 0" class="p_style">年级:&nbsp; </span>
        <template>
          <el-select v-model="value" placeholder="value" @change="handleGrade">
            <el-option
              v-for="item in learnYearS"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </template>
        <span class="p_style" style="margin:0 0 0 50px;">学科:&nbsp; </span>
        <template>
          <el-select v-model="value2" placeholder="语文" @change="handleSubject">
            <el-option
              v-for="item in gradeS"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </template>
      </div>
    </div>
    <div class="backG">
      <averageClass :subStasto="subStas"></averageClass>
      <standardDiff :subStasto="subStas"></standardDiff>
      <div style="clear: both"></div>
    </div>
    <div class="backG">
      <standardteacherDiff :subStasto="subStas"></standardteacherDiff>
      <totalScore :subStasto="subStas"></totalScore>
      <div style="clear: both"></div>
    </div>
  </div>
</template>

<script>
  import averageClass from './averageClass.vue'
  import standardDiff from './standardDiff.vue'
  import standardteacherDiff from './standardteacherDiff.vue'
  import totalScore from './totalScore.vue'
  export default {
    components:{
      averageClass,standardDiff,standardteacherDiff,totalScore
    },
    data() {
      return {
        learnYearS: null,
        value2:'语文',
        value:null,
        gradeS: ['语文','数学','英语'],
        subStas:null
      }
    },
    mounted() {
      this.getmasterGrade()

    },
    methods: {
      getmasterGrade(){
        let schoolS = localStorage.getItem('schoolSection')
        if(schoolS == 1){
          this.learnYearS = ['一年级','二年级','三年级','四年级','五年级','六年级']
          this.value = '一年级'
          this.subStas = ['一年级','语文']
        }
        else if(schoolS == 2){
          this.learnYearS = ['初一','初二','初三']
          this.value = '初一'
          this.subStas = ['初一','语文']
        }
        else{
          this.learnYearS = ['高一','高二','高三']
          this.value = '高一'
          this.subStas = ['高一','语文']
        }
      },
      handleGrade(val){
        this.subStas = []
        this.subStas.push(val)
        this.subStas.push(this.value2)
        this.subStas.push(Math.round(Math.random()*9+1))
      },
      handleSubject(val){
        this.subStas = []
        this.subStas.push(this.value)
        this.subStas.push(val)
        this.subStas.push(Math.round(Math.random()*9+1))
      }
    }
  }
</script>
<style lang="scss">
  .clearfix{
    content: ".";
    display: block;
    clear: both;
    visibility: hidden;
    line-height: 0;
    height: 0;
    font-size:0;
  }
  .lef{
    //float:left;
  }
  a{
    display: inline-block;
    font-size:14px;
    width: 80px;
    height: 37px;
    line-height: 37px;
    border-radius: 21px;
    text-align: center;
    margin-top:12px;
    cursor:pointer;
    &.curr{
      background: #7fbed0;
      color:#fff;
    }
  }
  .backG{
    background: #fff;
    margin-bottom: 20px;
    overflow: hidden;
    overflow-x: auto;
    min-width: 1460px;
    background:#fff url("../../../static/img/thread.gif") no-repeat center 23px;
  }
  .subtitle{
    padding-bottom: 30px;
  }
</style>

