<template>
  <div>
    <!--学科列表-->
    <section class="newContent">
      <!--点击查看测试题提示-->
      <div class="alterOuter">
        <!--测试题-->
        <div class="alterBody closBt fintest testall overIsshow" :class="{isFull:isFullScreen}" style="display: block;">

          <div class="outerAll" :class="{heightstyle:isFullScreen}">

            <div class="firstSta" style="display: none; height: 80%">

              <div class="title titPos">{{testName}}（考试号：<label style="font-size: 50px;font-weight: bold">{{record}}</label>）<a @click="overReport" v-show="kezhongS"></a><a @click="goBack" v-show="kezhongH"></a>
                  <div id="casetouchFullScreen_style" @click="casefullScreen"></div>
                </div>
                <div class="testQuest" style=" height: 99%; overflow: hidden; overflow-Y:scroll">

                  <ul class="teslist alltli">
                    <li v-for="(pa,index) in testQuestions">
                      <h3 v-html="index+1 + '、'+ pa.stem" style="font-size:40px; margin-bottom: 15px;"></h3>
                      <template v-show="pa.componentQuestions.length==0">
                        <p v-for="que in pa.quesOption" v-html="que.optionKey + '、' + que.optionValue" style="font-size:40px; margin:0 10px 15px 15px; line-height: 40px;"></p>
                      </template>
                      <template v-show="pa.componentQuestions.length!=0">
                        <template v-for="(comp,ind) in pa.componentQuestions">
                          <h3 v-html="comp.stem" style="text-indent: 15px;font-size:40px;"></h3>
                          <p v-for="cod in comp.quesOption" v-html="cod.optionKey +'、' + cod.optionValue" style="font-size:40px; margin:0 10px 15px 15px; line-height: 40px;"></p>
                        </template>
                      </template>
                    </li>
                  </ul>
                  <div :class="{ checkport: true, clearfix:true, 'positionf': fixedP }">
                    <!--<a @click="getNext()" v-show="nextStep">下一题</a>--><a v-show="overTt" @click="rightOvertest" style="width: 300px; height: 60px; line-height: 60px; border-radius: 50px;">结束测试</a><div style="height: 60px; line-height: 60px; ">总用时：<span>{{timeAll}}</span></div>
                  </div>
                </div>
                <div class="overTest" style="display: none;">
                  <h3>测试结束 ，共测试<span>{{testNums}}</span>道题</h3>
                  <div class="toti"><p><b>总用时：</b><span>{{timeAll}}</span></p></div>
                  <div class="retim"><a @click="goBack">返回课中测</a><a @click="checkReport">立即查看班级报告</a></div>
                </div>
            </div>
          </div>

          <div class="immout" style="display: none;">
            <!--点击开始测试提示-->
            <div class="alterBody closBt isBegin">
              <div class="title">提示<a @click="cancleTips"></a></div>
              <p>结束测试？</p>
              <div>
                <button @click="cancleTips">取消</button>
                <button @click="rightOvertest">立即结束</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>
<script>
  import $ from '../../../static/js/jquery-3.2.1.min.js'
  import colseScreen from '../../../static/img/colseScreen.png';
  import allScreen from '../../../static/img/allScreen.png';
  export default {
    props:[],
    components: {

    },
    data(){
      return {
        data: {
          localData:null,
          baseinfo:null
        },
        testQuestions:[],
        pageSize:1,
        pageNum:1,
        overTt:true,
        nextStep:true,
        kezhongS:true,
        kezhongH:false,
        studentTotal:'',

        intl:null,            //时间累计
        sec:0,
        day:0,
        hour:0,
        min:0,
        timeAll:'',
        testName:'',
        num:'',
        testNums:'',

        nextNum:0,
        record:'',
        // 控制开启全屏还是关闭全屏
        isFullScreen: true,
        // 控制全屏开个 开始测试
        caseFullScreen: false,
        fixedP:true
      }
    },
    mounted(){

      this.data.localData=this.localData.get("webTeacherUser");
      this.data.baseinfo = this.localData.get('baseinfo')
      this.data.deviceType = this.localData.get('equipmentType')
     // this.data.devicenum = this.localData.get('devicenum')
      this.data.saveCode = this.localData.get('saveCode')
      this.data.testNum = this.localData.get('testNum')
      this.data.paperC = this.localData.get('paperCode')
      this.record = this.localData.get('record')

      this.getTestCode()

    },
    methods: {
      cancleTips(){
        $('.immout').hide()
      },
      goBack(){
        this.caseFullScreen = true
        this.casefullScreen()
        this.$router.push({path:'/questionStorage/questionTest'})
      },
      checkReport(){

        this.caseFullScreen = true
        this.casefullScreen()

        let para = {
          'inClassTestCode':this.data.saveCode
        }
        this.$ajax.reportVerification(para)
          .then((res) => {

            if (res.httpCode == 200) {
              if(res.result == true){
                let params = {
                  'inClassTestCode':this.data.saveCode,
                  'classCode':this.data.baseinfo.classCode,
                  'studentCount':this.studentTotal,
                  'paperCode':this.data.paperC,
                  'source':2,
                  'inClassTestName':this.testName
                }
                this.$router.push({path:'/questionStorage/reportDetail_duoheyi',query:params})
              }
              else {
                this.$message('尚未有人答题！');
              }
            } else {
              this.$message('结束测试失败,请刷新页面重试');
            }
          })
      },
      rightOvertest(){
        this.end()
        let params1 = {
          "inClassTestCode": this.data.saveCode,
          "teacherCode": this.data.localData.userId,
          "status": 2,
          "equipmentType":this.data.deviceType,
          'classCode':this.data.baseinfo.classCode,
        }
        this.$ajax.getTeststepone(params1)
          .then((res) => {

            if (res.httpCode == 200) {
              this.kezhong = false
              this.kezhongH = true
              this.studentTotal = res.result.studentCount

              $('.alterOuter').find('.alterBody').hide()
              $('.alterOuter').find('.alterBody').eq(0).show().find('.testQuest').hide().next().show()
              $('.immout').hide()
            } else {
              this.$message('结束测试失败,请刷新页面重试');
            }
          })

      },
      overReport(){
        $('.immout').show()
      },
      getTestCode(){
        let params1 = {
          "inClassTestCode": this.data.saveCode,
          "teacherCode": this.data.localData.userId,
          "status": 1,
          "equipmentType":this.data.deviceType
        }
        this.$ajax.getTeststepone(params1)
          .then((res) => {
            if (res.httpCode == 200) {
              this.getTestDetail()
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      getTestDetail(){

        let params2 = {
          "paperCode":this.data.paperC
        }
        this.$ajax.getResourcePaper(params2)
          .then((res) => {
            if (res.httpCode == 200) {

              /*
              for(let i in arr) {
                let arrPa = arr[i].typeList
                for (let j in arrPa) {
                  let arrList = arrPa[j].list
                  for (let k in arrList) {
                    let comlist = arrList[k].componentQuestions
                    arrList[k].stem = this.strToUrl(arrList[k].stem)
                    if (comlist.length == 0) {
                      arrList[k].quesOption = eval(this.strToUrl(arrList[k].quesOption))
                      newarr.push(arrList[k])
                    }
                    else {
                      for (let m in comlist) {
                        comlist[m].stem = this.strToUrl(comlist[m].stem)
                        comlist[m].quesOption = eval(this.strToUrl(comlist[m].quesOption))
                        distra.push({
                          'stem':arrList[k].stem,
                          //'stemNum':m,
                          //'stemChild':comlist[m].stem,
                          'quesOption':comlist[m].quesOption
                        })
                      }
                    }
                  }
                }
              }
              let unique = newarr.concat(distra)
              this.testQuestions = newarr.concat(distra)
*/

              let newarr = []
              let arr = res.result.paperSystemQusetionType
              console.log(arr);
              for (let i in arr) {
                let arrPa = arr[i].typeList
                if (arr[i].type == 1) {
                  this.localData.set('questionCount', arr[i].typeList[0].list.length)
                }
                for (let j in arrPa) {
                  let arrList = arrPa[j].list

                  for (let k in arrList) {
                    let comlist = arrList[k].componentQuestions
                    arrList[k].stem = this.strToUrl(arrList[k].stem)
                    if (comlist.length == 0) {
                      arrList[k].quesOption = eval(this.strToUrl(arrList[k].quesOption))
                    }
                    else {
                      for (let m in comlist) {
                        comlist[m].stem = this.strToUrl(comlist[m].stem)
                        comlist[m].quesOption = eval(this.strToUrl(comlist[m].quesOption))
                      }
                    }
                    newarr.push(arrList[k])
                  }
                }

              }
              this.testQuestions = newarr;

              this.testNums = this.testQuestions.length

              this.$nextTick(() => {
                this.testName = this.localData.get('testName')
                $('.outerAll').find('.firstSta').eq(this.nextNum).show().siblings().hide()
                this.begin()
//
//                this.testNums = this.nextNum+1
//                if(this.nextNum == this.testQuestions.length-1){
//                  this.nextStep = false
//                  this.overTt = true
//                }



              });
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      begin(){
        let self = this
        this.intl = window.setInterval(function(){
          self.sec++;
          if(self.sec==60){//判断是否等于60秒
            self.min++;//分钟加1
            self.sec=0;//重置秒针
            if(self.min==60){
              self.hour++;
              self.min=0;
              if(self.hour==24){
                self.day++;
              }
            }
          }
          if(self.hour == 0){
            self.timeAll = self.min+"分"+self.sec+"秒"
          }
          else{
            self.timeAll = self.hour+"时"+self.min+"分"+self.sec+"秒"
          }
        },1000);
      },
      end(){
        window.clearInterval(this.intl)
      },
      // 全屏 开始测试
      casefullScreen() {

        if (!this.caseFullScreen) {

          this.caseFullScreen = true
          $("#casetouchFullScreen_style").attr("style", "background-image:url("+colseScreen+")");
          this.clonsefullScreen()
        } else {

          this.caseFullScreen = false
          $("#casetouchFullScreen_style").attr("style", "background-image:url("+allScreen+")");

          this.openfullScreen()
        }
      },
      /// 关闭全屏
      openfullScreen() {

        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        //FireFox
        else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        }
        //Chrome等
        else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
        //IE11
        else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }

      },
      /// 开启全屏
      clonsefullScreen() {
console.log('开启全屏');
        var docElm = document.documentElement;

        //W3C
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        }

        //FireFox
        else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        }

        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        }

        //IE11
        else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }

      }
//      getNext(){
//        this.end()
//        this.nextNum++
//        this.getTestDetail()
//      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../static/css/contentRight';
  @import "../../../static/css/findselected";
  a{ cursor: pointer;}
  .lef{ float: left;}
  .rig{float:right;}
  b{font-weight: normal;}
  .back{
    background: #fff;
  }
  .fos{
    font-size:18px;
  }
  .hei{
    height:40px;
    line-height:40px;
  }
  h2,h3{
    font-weight: normal;
  }
  $color:#1fd094;
  .let{
    letter-spacing: .6px;
  }
  .clearfix:after { clear:both; content:' '; display:block; font-size:0; line-height:0; visibility:hidden; width:0; height:0}
  .knowl{
    margin:40px;
    text-align: center;
    height:200px;
    span{
      display: inline-block;
      font-size:16px;
      color:#505050;
      background: #d3f2e5;
      border-radius: 16px;
      height: 30px;
      line-height: 30px;
      padding:0 14px;
      margin:0 10px 10px 0;
    }
  }
  .header{
    overflow:hidden;
    margin:20px 18px;
    box-sizing:border-box;
    padding:25px 40px;
    @extend .back;
    color:#4c6175;
    span{
      font-size:18px;
      @extend .lef;
      @extend .hei;
      label:last-child{
        color:#1fd094;
      }
    }
    a{
      @extend .lef;
      background: url('../../../static/img/arrle.png') no-repeat left center;
      width: 19px;
      height: 40px;
      margin-right: 18px;
    }
  }
  .newContent{
    @extend .back;
    height: 100%;
    //margin:30px 18px 0 18px;
    .stepnum{
      width: 500px;
      margin:0 auto;
      a{
        width: 140px;
        @extend .hei;
        background: #1fd094;
        color:#fff;
        display: block;
        border-radius: 40px;
        margin:0 auto;
      }
    }
  }
  .tiku{
    @extend .fos;
    border-bottom: 1px solid  #e1e5ec;
    padding:13px 48px 13px 40px;
    h3{
      @extend .lef;
      @extend .fos;
      @extend .hei;
      color: $color;
      @extend .let;
    }
    p{
      @extend .rig;
      @extend .hei;
      overflow: hidden;
      a{
        @extend .lef;
        width: 140px;
        border-radius: 20px;
        margin-left:58px;
        @extend .let;
        span{
          color:$color;
        }
      }
      a:nth-child(2){
        background: #d3f2e5;
      }
      a:last-child{
        background: $color;
        color:#fff;
      }
    }

  }
  .chooseT{
    height: 92%;
  }
  .tlists{
    height:100%;
  }
  .letil{
    @extend .lef;
    width: 270px;
    border-right:1px solid #e1e5ec;
    height:100%;
    a{
      display: block;
      height: 50px;
      line-height: 50px;
      padding-left:59px;
      text-align: left;
      position: relative;
      &:first-child{
        background: #d3f2e5;
      }
      &:before{
        content: '';
        position: absolute;
        left:39px;
        top:20px;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        background: $color;
      }
    }
  }
  .tidetail{
    overflow-Y:scroll;
    height:100%;

    li{
      padding:34px 0;
      text-align: left;
      border-top:5px solid #f0f4fb;
      overflow: hidden;
      &:first-child{
        border-top:none;
      }
    }
    .tinum{
      @extend .lef;
      width: 48%;
      margin-left: 37px;

      h3{
        @extend .fos;
        margin-bottom: 8px;
      }
      p{
        padding-left:15px;
      }

    }
    .acknow{
      @extend .rig;
      width: 38%;
      margin-right: 35px;
    }
  }
  .acknow{
    span{
      @extend .lef;
      height: 30px;
      line-height: 30px;
      background: #d3f2e5;
      padding:0 16px;
      margin:0 10px 10px 0;
      border-radius: 20px;
    }
    a{
      display: block;
      clear:both;
      @extend .hei;
      width: 140px;
      background: $color;
      color:#fff;
      font-size:18px;
      text-align: center;
      border-radius: 20px;
      margin:90px auto 0 auto;
      @extend .let;
      &.cancle{
        background: #f66;
      }
    }
  }
  .operaB{
    text-align: right;
    position: relative;
    *{
      width: 140px;
      @extend .hei;
      display: inline-block;
      text-align:center;
      background: #f66;
      color:#fff;
      border-radius: 20px;
      letter-spacing: .5px;
    }
    span{
      position: absolute;
      right:185px;
      top:0;
      background: $color;
      z-index: 20;
    }
    a{
      margin-left:40px;
    }
  }
  .checkport{
    width: 1000px;
    position: absolute;right:40px;bottom:30px;
    span{color:$color;}
    div{
      @extend .rig;
      @extend .hei;
    }
    a{
      @extend .rig;
      border:1px solid #ecf1f5;
      border-radius: 20px;
      @extend .hei;
      color:#505050;
      padding:0 12px;
      margin-left: 39px;
      &:first-child,&:nth-child(2){
        background: $color;
        color:#fff;
        width: 140px;
      }
    }
  }
  .positionf{
    position: fixed;
    font-size:30px;
  }
  .testall{
    .title{
      span{
        color: $color;
        overflow: hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
        width: 900px;
        display: inline-block;
      }
      b{
        @extend .lef;
      }
    }
  }
  .alterOuter{
    background: #fff;
    top:70px;

  }
  .alterOuter .alterBody{
    border:4px solid #ebf0f4;
    border-radius: 12px;

    .titPos{
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      margin:-4px 0 0 -4px;
      width: 100.8%;
      font-size:28px;
    }
    .middlet{
      text-align: left;
      a{
        width: 19px;
        height: 68px;
        float: left;
        margin:0 18px;
        background:#d3f2e5 url("../../../static/img/arrle.png") no-repeat left center;
      }
    }
    .correct{
      width: 880px;
      background: #f2f9fe;
      margin:58px auto 0 auto;
      height: 470px;
      position: relative;
      .showName{
        position: absolute;
        right:-32px;
        top:-99px;
        font-size:16px;
        color:#505050;
      }
      h3{
        @extend .fos;
        color:#505050;
        height: 72px;
        line-height:72px;
        span{
          color:$color;
        }
      }
      ul{
        width: 716px;
        margin: 0 auto;

      }
      li{
        @extend .lef;
        width: 116px;
        height: 42px;
        line-height: 42px;
        text-align: center;
        margin:0 4px 4px 0;
        background: $color;
        color:#fff;
        letter-spacing: .5px;
        &:nth-child(6n+6){
          margin-right: 0;
        }
        &.error{
          background: #f66;
        }
        &.nonans{
          background: #b3cde6;
        }
        span{
          opacity: 0;
        }
      }

    }
    .totclas{
      padding:10px 17px;
      text-align: left;
      font-size: 16px;
      color:#505050;
      border-bottom: 1px dashed #e1e5ec;
      margin:0 22px;
      div{
        overflow: hidden;
      }
      a{
        @extend .lef;
        @extend .hei;
        width: 119px;
        text-align: center;
        letter-spacing: 1px;
        margin-right: 10px;
        &.curr{
          background: $color;
          color:#fff;
          border-radius: 20px;
        }
      }
      .coor{
        @extend .lef;

      }
      .showa{
        @extend .rig;
        a{
          margin-right:119px;

        }
      }

    }
    .overTest{
      width: 1022px;
      margin:0 auto;
      text-align: center;
      color:#505050;
      span{
        color: $color;
      }
      h3{
        margin-top: 30%;
        font-size:60px;
        letter-spacing: 1px;
      }
      div.toti{
        margin:0 auto;
        font-size:50px;
        p{
          height: 60px;
          line-height: 60px;
        }

        b{
          background: url('../../../static/img/time.png') no-repeat left center;
          padding-left:68px;
        }
      }
      p{
        margin:24px 0 89px 0;
        vertical-align: middle;

        span{
          color: $color;
          display: inline-block;
        }
        b{
          display: inline-block;
        }
        img{
          width: 24px;
          height: 24px;
          margin-top:-5px;
          vertical-align: middle;
        }
      }
      div.retim{
        text-align: center;
        a{
          display: inline-block;
          @extend .hei;
          border-radius: 50px;
          font-size:50px;
          width: 380px;
          text-align: center;
          &:first-child{
            background: $color;
            color:#fff;
            margin-right: 80px;
            height: 90px;
            line-height: 90px;
          }
          &:last-child{
            border:1px solid #5c5c5c;
            height: 90px;
            line-height: 90px;
            width: 490px;
          }
        }
      }
    }
  }
  .immout,.aboutNew{
    .alterBody{
      border:none;
      border-radius: 4px;
    }
  }
  @media (max-height: 768px) {
    .alterOuter {
      .alterBody{
        .overTest h3{
          margin-top:50px;
        }
        .correct{
          width: 600px;
          margin:20px auto 0 auto;
          height: 220px;
          .showName{
            top:-62px
          }
          li{
            height: 32px;
            line-height: 32px;
            font-size:16px;
            width: 80px;
            &:nth-child(6n+6){
              margin-right:4px;
            }
          }
          .percent{
            width: 500px;
            margin:0 auto;
            height:140px;
            overflow:auto;
            //overflow-Y:auto;
          }
        }
        .totclas a{
          width: 90px;
        }
      }
      .testall{
        width: 700px;
        margin-left:-350px;
        height:400px;
        margin-top:-250px;

        .title span{
          width: 300px;
        }
        .checkport{
          width: 700px;
          font-size: 14px;
          bottom:10px;
          right:10px;
          a {
            margin-left:8px;
            padding:0 10px;
          }
        }
      }
    }
  }
  #casetouchFullScreen_style {
    width: 20px;
    height: 20px;
    float: right;
    margin-top: 24px;
    margin-right: 65px;
    line-height: 40px;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url("../../../static/img/allScreen.png");
    cursor: pointer;
  }
  .isFull {
    top: -70px !important;
    left: 0 !important;
    width: 100% !important;
    height: 110% !important;
    margin-top: 0 !important;
    margin-left: 0 !important;
    bottom: 0 !important;
    right: 0 !important;
  }
  .heightstyle {
    height: 100% !important;
    //padding-bottom: 70px !important;
  }

</style>

