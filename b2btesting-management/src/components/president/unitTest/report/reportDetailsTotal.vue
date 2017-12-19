<template>
  <div class="reportDetailsTotal">
    <section class="header" v-if="true">
      <div class="title">
        <span>{{data.titleList[flag.titleSelect]}}</span>
        <button @click="goBack">返回上一级</button>
      </div>
      <div class="choose">

      </div>
    </section>
    <section class="content_">
      <div class="body">
        <!--班级列表-->
        <div v-for='(item,index) in data.titleList'
             class="classListItem"
             :class="{active:flag.titleSelect==index}"
             @click="titleClass(index)"
        >
          <p class="circle" :class="{active:flag.titleSelect==index}"></p>{{item}}
        </div>
      </div>
      <div class="reportCont">
        <div class="pad">
          <router-view></router-view>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
  // import reportItem from '../../../common/reportItem.vue';
  export default {
    props:[],
    components: {

    },
    data(){
      return {
//        ,"班级学科能力历史发展表"
        data: {
          titleList:["班级知识掌握情况","各知识点错误率","各题出错情况","标准分平均分","班级成绩表","班级合格率表","班级达标率表","班级学生平均能力分布"],
/*          titleList:["班级成绩表","班级合格率表","班级达标率表","各题出错情况","班级知识掌握情况","各知识点出错（个数）情况","班级学生平均能力分布","班级学科能力历史发展表"],*/
        },
        flag: {
          titleSelect:0,
        },
        query:this.$route.query,
      }
    },
    mounted(){
        if(window.localStorage.page=="syncCoach"){
          this.data.titleList.splice(8,1)
        }
      /*选中路由对应的title*/
      let str=this.$route.path;
      str=str.charAt(str.length - 1);
      this.flag.titleSelect=Number(str)-1;
    },
    methods: {
      goBack(){
        this.$router.push({path:'/unitTest'})
      },
      titleClass(index){
        this.flag.titleSelect=index;
        this.$router.push({path:"class"+(index+1)})
      }
    },
    computed: {},
    filters: {},
  }
</script>
<style lang="scss" scoped>
  /*@import '../../../../static/css/contentRight';*/
  .reportDetailsTotal{
    .header{
      /*margin-right:20px;*/
      .title{
        overflow:hidden;
        /*margin-top: 20px;*/
        /*margin-left:18px;*/
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
          border-width: 0;
        }
      }
    }
    .content_{
      margin-top: 20px;
      /*margin-left:18px;*/
      text-align: center;
      position:relative;
      display:flex;
      .body{
        vertical-align: top;
        padding-right:0px;
        background: white;
        /*display: inline-block;*/
        width:272px;
        padding-bottom:10px;
        text-align: left;
        margin-right:20px;
        position:absolute;
        min-height:860px;
        top:0;
        bottom:0;
        z-index: 2;
        .classListItem{
          /*width: 180px;*/
          font-size: 18px;
          height: 50px;
          line-height: 50px;
          vertical-align: middle;
          cursor: pointer;
          transition: all .3s;
          background-color: #fff;
          color: #000;
          .circle{
            width:10px;
            height:10px;
            background:#2cd39a;
            border-radius: 50%;
            display: inline-block;
            margin-left:10px;
            margin-right:10px;
            &.active{
              background-color: #ffffff;
            }
          }
          &:hover {
            background-color: #d3f2e5;
            color: #000;
          }
          &.active {
            background-color: #1fd094;
            color: #fff;
          }
        }
      }
      .reportCont{
        padding-left:272+18px;
        width:100%;
        box-sizing: border-box;
        /*padding-right:20px;*/
        .pad{
          width:100%;
          background:white;
          display: inline-block;
          overflow: hidden;
          min-height:860px;
        }



      }
    }
  }


</style>
