<template>

  <div class="report" @click="checkTheReport" >
    <div class="body">
      <p class="name">{{tudos.diagnosisName}}</p>
      <p class="time"><span>{{dataParse(tudos.endTime)}}</span>
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
    props:["tudos"],
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

      /// 查看报告
      checkTheReport(){
        this.flag.activeClass=true;//暂时无用
        this.$emit('touchreport');
      },

    },
    computed: {},
    filters: {}

  }
</script>
<style lang="scss" scoped>
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
      height:120px;
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
        text-align: center;
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

      button{
        width:143px;
        height:40px;
        border-radius:20px;
        font-size:18px;
        color:#fff;
        outline:none;
        margin: 8px auto 0;
        cursor: pointer;
        display: block;
        border: none;
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
