<template>
  <div>
    <!--学科列表-->
    <section class="newContent">
      <!--点击查看测试题提示-->
      <div class="alterOuter">
        <!--测试题-->
        <div class="alterBody closBt fintest testall overIsshow">

          <template v-for="(tqu,index) in testQuestions">

              <div class="title titPos">{{testName}}<a @click="overReport" v-show="kezhongS"></a><a @click="goBack" v-show="kezhongH"></a></div>
              <div class="testQuest">
                <ul class="teslist alltli">
                  <li><h3 v-html="tqu.sout + '、' +tqu.baseName"></h3><p v-for="que in tqu.questionOption" v-html="que.optionKey + '.' + que.optionValue"></p></li>
                </ul>
                <div class="checkport clearfix">
                  <a @click="getNext(tqu.baseCode,tqu.sout)" v-show="nextStep">下一题</a><a v-show="overTt" @click="overReport">结束测试</a><a @click="showRight($event,0)" style="width: 175px;" v-show="showra">显示正确答案</a><a style="width: 175px;" @click="showRight($event,1)" v-show="hidera">隐藏正确答案：<span>{{tqu.rightAnswer}}</span></a><a @click="getreSingleReport(tqu.baseCode,tqu.sout)">结束本题并查看报告</a><div>总用时：<span>{{timeAll}}</span></div>
                </div>
              </div>

            <div class="overTest" style="display: none;">
              <h3>测试结束 ，共测试<span>{{testNums}}</span>道题</h3>
              <div class="toti"><p><b>总用时：</b><span>{{timeAll}}</span></p></div>
              <div class="retim"><a @click="goBack">返回课中测</a><a @click="checkReport">立即查看班级报告</a></div>
            </div>
          </template>

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
        <!--结束测试并查看报告-->
        <div class="alterBody fintest testall overFind" style="display: none;">
          <template v-for="sin in singleRes">
            <div class="title middlet titPos"><a @click="returnLast"></a><b>课中测试 > </b><span v-html="testName  +'&nbsp;&nbsp;第'+num+'题 报告'"></span></div>
            <div class="totclas clearfix">
              <div class="coor">
                <a class="curr" @click="getCurrrate($event,0)">全班</a><a @click="getCurrrate($event,1)">正确（{{sin.rightCount}}）</a><a @click="getCurrrate($event,2)">错误（{{sin.wrongCount}}）</a><a @click="getCurrrate($event,3)">未回答（{{sin.notanswerAccount}}）</a>
              </div>
              <div class="showa">
                <a @click="aboutKnow">涉及知识点</a>
              </div>
            </div>
            <div class="allRate">
              <div class="correct">
                <h3>正确率： <span>{{sin.correctRate}}</span></h3>
                <div class="percent clearfix">
                  <ul><li v-for="rina in sin.rightList"><span>{{rina}}</span></li><li class="error" v-for="wro in sin.wrongList"><span>{{wro}}</span></li><li class="nonans" v-for="nonl in sin.notanswerList"><span>{{nonl}}</span></li></ul>
                </div>
                <a class="showName" @click="showName($event,'All')">显示姓名</a>
              </div>
              <div class="correct" style="display: none;">
                <h3>正确率： <span>{{sin.correctRate}}</span></h3>
                <div class="percent clearfix">
                  <ul><li v-for="rina in sin.rightList"><span>{{rina}}</span></li></ul>
                </div>
                <a class="showName" @click="showName($event,'C')">显示姓名</a>
              </div>
              <div class="correct" style="display: none;">
                <h3>错误率： <span>{{sin.wrongRate}}</span></h3>
                <div class="percent clearfix">
                  <ul><li class="error" v-for="wro in sin.wrongList"><span>{{wro}}</span></li></ul>
                </div>
                <a class="showName" @click="showName($event,'W')">显示姓名</a>
              </div>
              <div class="correct" style="display: none;">
                <h3>未答率： <span>{{sin.nonetRate}}</span></h3>
                <div class="percent clearfix">
                  <ul><li class="nonans" v-for="nonl in sin.notanswerList"><span>{{nonl}}</span></li></ul>
                </div>
                <a class="showName" @click="showName($event,'N')">显示姓名</a>
              </div>
            </div>
            <!--查看知识点提示-->
            <div class="alterOuter aboutNew" style="background:rgba(0, 0, 0, 0.3);display: none;">
              <!--点击显示知识点-->
              <div class="alterBody closBt">
                <div class="title">涉及知识点<a @click="closeKnow"></a></div>
                <div class="knowl clearfix">
                  <span v-for="ko in sin.knowledges">{{ko.name}}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

    </section>
  </div>
</template>
<script>
  import $ from '../../../static/js/jquery-3.2.1.min.js'
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
        totalnum:'',
        singleRes:[],
        isShowAll:true,
        isShowC:true,
        isShowW:true,
        isShowN:true,
        sout:null,
        overTt:false,
        nextStep:true,
        kezhongS:true,
        kezhongH:false,
        studentTotal:'',
        showra:true,
        hidera:false,

        intl:null,            //时间累计
        sec:0,
        day:0,
        hour:0,
        min:0,
        timeAll:'',
        Totquests:'',
        testName:'',
        num:'',
        testNums:''
      }
    },
    mounted(){
      this.data.localData=this.localData.get("webTeacherUser");
      this.data.baseinfo = this.localData.get('baseinfo')
      this.data.deviceType = this.localData.get('equipmentType')
      this.data.devicenum = this.localData.get('devicenum')
      this.data.saveCode = this.localData.get('saveCode')
      this.data.testNum = this.localData.get('testNum')

      this.getTestCode()
    },
    methods: {
      cancleTips(){
        $('.immout').hide()
      },
      goBack(){
        this.$router.push({path:'/questionStorage/questionTest'})
      },
      returnLast(){
        this.singleRes = []
        $('.overIsshow').show()
        $('.overFind').hide()
      },
      checkReport(){
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
      cancle(){
        $('.isBegin').hide()
      },
      overTest(){
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
      rightOvertest(){
        this.end()
        let para = {
          'baseId':this.data.devicenum
        }
        if(this.data.deviceType == 1){
          this.$ajax.getMachinecollect(para)
            .then((resp) => {
              if (resp.code == 'OK') {
                this.overTest()
              } else {
                this.$message('获取单题报告列表失败,请刷新页面重试');
              }
            })
        }
        else{
          this.overTest()
        }
      },
      getCurrrate(event,ind){
        let elc = event.currentTarget
        $(elc).addClass('curr').siblings().removeClass('curr')
        $('.allRate').find('.correct').eq(ind).show().siblings().hide()
      },
      overReport(){
        $('.immout').show()
      },
      aboutKnow(){
        $('.aboutNew').show()
      },
      closeKnow(){
        $('.aboutNew').hide()
      },
      showName(event,suff){
        let elc = event.currentTarget
        let constr = 'isShow'+suff

        if(this.constr || this.constr==undefined){
          $(elc).prev().find('li span').css('opacity',1)
          $(elc).html('隐藏姓名')
          this.constr = false
        }
        else{
          $(elc).prev().find('li span').css('opacity',0)
          $(elc).html('显示姓名')
          this.constr = true
        }
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
            console.log(res)

            if (res.httpCode == 200) {
              this.getTestDetail()
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      getTestDetail(){
        let params2 = {
          "inClassTestCode":this.data.saveCode
        }
        this.$ajax.getContinuetest(params2)
          .then((res) => {
            if (res.httpCode == 200) {
              let currsout = window.location.href.split('?')[1].split('&')[0].split('=')[1]
              this.Totquests = window.location.href.split('?')[1].split('&')[1].split('=')[1]
              this.getStatusdetail(currsout)
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      getStatusdetail(soutval){
        let params = {
          'inClassTestCode':this.data.saveCode,
          'sout':soutval,
          'equipmentType':this.data.deviceType
        }
        let totalnum = {
          'inClassTestCode':this.data.saveCode
        }

        this.$ajax.getByClassTestCode(totalnum)
          .then((resp) => {
            if (resp.httpCode == 200) {

              this.begin()
              this.totalnum = resp.result.rows.length
              this.testNums = soutval
              this.localData.set('testNum',soutval)

              this.$ajax.getByClassTestCode(params)
                .then((res) => {

                  if (res.httpCode == 200) {
                    let quesarr = res.result.rows
                    if(soutval == this.Totquests || this.totalnum == soutval){
                      this.nextStep = false
                      this.overTt = true
                    }

                    quesarr[0].questionOption = eval(this.strToUrl(quesarr[0].questionOption))
                    quesarr[0].baseName = this.strToUrl(quesarr[0].baseName)

                    this.testQuestions = quesarr
                    this.testName = this.localData.get('testName')

                    if (this.data.deviceType == 1) {
                      let params2 = {
                        "baseId": this.data.devicenum,
                        "testCode": this.data.saveCode,
                        "exercisesCode": quesarr[0].baseCode
                      }
                      this.$ajax.getAnswerMachine(params2)
                        .then((res) => {
                          if (res.code == 'OK') {

                          } else {
                            this.$message('输入的S/N码不正确或者未连接到接收器!');
                          }
                        })
                    }
                  } else {
                    this.$message('获取到下一题失败,请刷新页面重试');
                  }
                })
            }
            else {
              this.$message('获取到测试总题数失败！');
            }
        })
      },
      showRight(event,type){
        let elc = event.currentTarget
        if(type ==0){
          this.showra = false
          this.hidera = true
        }
        else{
          this.showra = true
          this.hidera = false
        }
      },
      closeW(event){
        let elc = event.currentTarget
        $(elc).parents('.alterBody').hide().parent().hide()
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
      getNext(code,sout){
        this.end()
        let para = {
          'baseId':this.data.devicenum
        }
        let params = {
          "inClassTestCode": this.data.saveCode,
          "baseCode": code,
          "classCode": null
        }
        if(this.data.deviceType == 1){
          this.$ajax.getMachinecollect(para)
            .then((resp) => {
              if (resp.code == 'OK') {
                this.$ajax.getBasictopic(params)
                  .then((res) => {
                    if (res.httpCode == 200) {
                      if(res.result.outcome == true){
                        this.showra = true
                        this.hidera = false
                        sout++

                        if(this.totalnum == sout){
                          this.getStatusdetail(sout)
                          this.nextStep = false
                          this.overTt = true
                        }
                        else{
                          this.getStatusdetail(sout)
                        }
                      }
                    } else {
                      this.$message('获取单题报告列表失败,请刷新页面重试');
                    }
                  })
              } else {
                this.$message('获取单题报告列表失败,请刷新页面重试');
              }
            })
        }
        else{
          this.$ajax.getBasictopic(params)
            .then((res) => {
              if (res.httpCode == 200) {
                if(res.result.outcome == true){
                  this.showra = true
                  this.hidera = false
                  sout++

                  if(this.totalnum == sout){
                    this.getStatusdetail(sout)
                    this.nextStep = false
                    this.overTt = true
                  }
                  else {
                    this.getStatusdetail(sout)
                  }
                }
              } else {
                this.$message('获取单题报告列表失败,请刷新页面重试');
              }
            })
        }
      },
      getreSingleReport(code,num){
        this.num = num
        if(this.data.deviceType == 1){
          let para = {
            'baseId':this.data.devicenum
          }
          this.$ajax.getMachinecollect(para)
            .then((resp) => {
              if (resp.code == 'OK') {
                  this.getotherDevice(code)
              } else {
                this.$message('获取单题报告列表失败,请刷新页面重试');
              }
            })
        }
        else{
          this.getotherDevice(code)
        }
      },
      getotherDevice(code){
        let params = {
          "inClassTestCode": this.data.saveCode,
          "baseCode": code,
          "classCode": this.data.baseinfo.classCode
        }
        this.$ajax.getBasictopic(params)
          .then((res) => {

            if (res.httpCode == 200) {
              this.end()
              let arr = res.result.singleReport
              this.singleRes.push({
                'baseName':arr.qaseQuestion.baseName,
                'rightCount':arr.rightCount,
                'wrongCount':arr.wrongCount,
                'notanswerAccount':parseInt(arr.notanswerList.length),
                'studentTotalCount':arr.studentTotalCount,
                'wrongList':arr.wrongList,
                'rightList':arr.rightList,
                'notanswerList':arr.notanswerList,
                'knowledges':eval(arr.qaseQuestion.knowledges),
                'correctRate':(arr.rightCount/arr.studentTotalCount).toFixed(4)*100 + '%',
                'nonetRate':(parseInt(arr.notanswerList.length)/arr.studentTotalCount).toFixed(4)*100 + '%',
                'wrongRate':(arr.wrongCount/arr.studentTotalCount).toFixed(4)*100 + '%'
              })
              $('.overIsshow').hide()
              $('.overFind').show()
            } else {
              this.$message('获取单题报告列表失败,请刷新页面重试');
            }
          })
      },
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
    height: 85%;
    margin:30px 18px 0 18px;
    .stepnum{
      width: 500px;
      margin:0 auto;
      a{
        width: 140px;
        @extend .hei;
        background: #1fd094;
        color:#fff;
        display: block;
        border-radius: 20px;
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
    position: absolute;right:40px;bottom:40px;
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
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      margin:-4px 0 0 -4px;
      width: 100.8%;
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
      width: 422px;
      margin:0 auto;
      text-align: center;
      color:#505050;
      span{
        color: $color;
      }
      h3{
        margin-top: 204px;
        font-size:24px;
        letter-spacing: 1px;
      }
      div.toti{
        margin:0 auto;
        b{
          background: url('../../../static/img/time.png') no-repeat left center;
          background-size:22px 22px;
          padding-left:28px;
        }
      }
      p{
        margin:34px 0 89px 0;
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
          border-radius: 20px;
          width: 190px;
          text-align: center;
          &:first-child{
            background: $color;
            color:#fff;
            margin-right: 40px;
          }
          &:last-child{
            border:1px solid #5c5c5c;
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
  .alltli{
    li:first-child{
      height: 520px;
      overflow-y: auto;
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
        .alltli li:first-child{
          height:250px;
        }
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

</style>
