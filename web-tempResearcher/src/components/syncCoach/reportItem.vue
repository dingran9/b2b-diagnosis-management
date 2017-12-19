<template>
  <!--:class="{active:flag.activeClass}"  想想3态-->
  <div class="report" @click="reportActive" >
    <div class="body">
      <p class="name">{{tudos.diagnosisName}}</p>
      <p class="time"><span>{{dataParse(tudos.endTime)}}</span>
        <!--<span class="black">截止，共</span><span>10</span><span class="black">题</span>-->
        <span class="black">截止</span>
      </p>
    </div>
    <div class="bottom">
      <button :class="tudos.isSnapshot==1? 'btnDefault':'btnDisabled'">查看报告</button>
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
        this.flag.activeClass=true;//暂时无用，仅仅用于3态
        this.$emit('watchZi',this.tudosIndex,this.tudos);
      },

    },
    computed: {},
    filters: {}

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
    .body{
      padding-top:25px;
      padding-left:40px;
      padding-right:40px;
      border-bottom:1px solid #e1e5ec;
      height:140px;
      .name{
        /*width:100px;*/
        height:60px;
        overflow: hidden;
        font-size: 20px;
        line-height: 32px;
        margin-bottom:10px;

        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp:2;//2行
        -webkit-box-orient:vertical;
      }
      .time{
        /*background:blue;*/
        color:#ff6666;
        text-align:center;
        .black{
          color:#999999;
        }
      }
    }
    .bottom{
      padding:auto 40px;
      button{
        width:143px;
        height:40px;
        border-radius:20px;
        font-size:18px;
        color:#fff;
        outline:none;
        margin-top: 8px;
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
