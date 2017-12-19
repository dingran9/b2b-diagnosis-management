<template>
  <div class="report" @click="reportActive" >
    <div class="head">
      <span class="titleLeft">诊断报告</span><span class="titleRight">{{tudos.examType|examType}}</span>
      <div class="oval"></div>
    </div>
    <div class="body">
      {{tudos.diagnosisName}}
    </div>
    <div class="bottom">
      <span v-if="tudos.isSnapshot==1">已出报告</span>
      <span v-else>未出报告</span>
      <button :class="tudos.isSnapshot==1? 'btnDefault':'btnDisabled'">查看报告</button>
    </div>
  </div>
</div>
</template>
<script>
  export default {
    props:["tudos","tudosIndex"],
    components: {

    },
    data(){
      return {
        data: {

        },
        flag: {
          activeClass:false,
        }
      }
    },
    mounted(){


    },
    methods: {
      reportActive(){
        if(this.tudos.isSnapshot==0){
          return;
        }
        this.flag.activeClass=true;//暂时无用，仅仅用于3态
        this.$emit('watchZi',this.tudosIndex,this.tudos);
      },

    },
    computed: {},
    filters: {
      examType(value){
        switch(value)
        {
          case 1:return "期中";  break;
          case 2:return "期末";  break;
          case 3:return "模拟考";  break;
          case 4:return "会考";  break;
          default: return n;
        }
      }
    }

  }
</script>
<style lang="scss" scoped>
  @import '../../../static/css/contentRight';
  .report{
    width:360px;
    height:200px;
    background:#fff;
    margin-left:20px;
    margin-top:50px;
    float:left;
    cursor: pointer;
    border:4px solid #ffffff;
    &:hover{
      border:4px solid  #d3f2e5;
    }
    &:active{
      border:4px solid #1fd094;
    }
    .head{
      border-bottom:1px solid #e1e5ec;
      height:60px;
      text-align:left;
      position:relative;
      overflow:hidden;
      padding-left:40px;
      padding-top:20px;
      .titleLeft{
        color:#1fd094;
        font-size:20px;
      }
      .titleRight{
        color:#ffffff;
        font-size:16px;
        position:absolute;
        z-index:2;
        right:6px;
        top:6px;
      }
      .oval{
        width:140px;
        height:80px;
        background:#1fd094;
        border-radius:50%;
        position:absolute;
        right:-60px;
        top:-40px;
      }
    }
    .body{
      height:60px;
      margin:10px 30px 15px 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp:2;//2行
      -webkit-box-orient:vertical;
      line-height:32px;
      font-size:20px;
    }
    .bottom{
      text-align:left;
      margin:0 40px;
      span{
        color:#88d8bd;
      }
      button{
        margin-left:60px;
        width:143px;
        height:40px;
        border-radius:20px;
        font-size:18px;
        color:#fff;
        background:#1fd094;
        outline:none;
        cursor: pointer;
      }
      .btnDefault{
        background:#1fd094;
      }
      .btnDisabled{
        background:#cccccc;
      }
    }

  }
</style>
