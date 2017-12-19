<template>
  <div class="reportDetail_duoheyi">
    <section class="rank-student-question">
      <div class="rank-container">
        <img class="allcreen" src="../../../../static/img/allScreen.png" @click="allcreen"/>
        <img class="close" src="../../../../static/img/close.png" @click="goback"/>
        <div class="question_" v-if="bigBol">
          <p class="title">参加测试人数{{joinCount}}/{{$route.query.studentCount}}</p>
          <div class="chart" v-if="true">
            <table border="0" cellspacing="0" cellpadding="0" v-if="zhengquelv.length">
              <tr>
                <th>题号</th>
                <th>错题人数</th>
              </tr>
              <tr v-for="(item,index) in zhengquelv" @click.stop="hoverFn(item,index)" style="cursor: pointer;">
                <td>{{item.xuhao}}</td>
                <td v-if="item.type==1" style="color: #ff6666;">{{item.wrongCount}}</td>
                <td v-if="item.type!=1">--</td>
              </tr>

            </table>
          </div>
          <div class="nodata" v-else>
            暂无数据
          </div>
        </div>
        <div class="rank item_" v-show="bigBol" :class="{default:true,fangda:false,suoxiao:false}">
          <header>成绩排行榜</header>
          <div class="container_">
            <div v-if="true">
              <ul>
                <li
                  v-for="(item,index) in rinking"
                  @click.stop="toStudent(item,index)"
                  :class="{choosed:!studentBol&&item.studentCode==studentItem.studentCode}"
                >
                  <span>第{{item.rank}}名</span>
                  <span
                    :class="{isAnswer:item.isAnswer,choosed:item.studentCode==studentItem.studentCode}">{{item.studentName}}</span>
                </li>
              </ul>
            </div>
            <div class="nodata" v-if="!true">
              暂无数据
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="acceryContainer" v-show="hoverBol" @click.stop>
      <img class="close" src="../../../../static/img/close.png" @click="hoverBol=false"/>
      <div class="accuracy"
           v-if="hoverBol&&allQuestionList[currentQuestion].type==1">
        <ul class="top">
          <li :class="{active:allQuestionList[currentQuestion].accuracy.choosed==index}"
              v-for="(item,index) in allQuestionList[currentQuestion].accuracy.list"
              @click="switchAccuracy(item,index)"
              v-if="index!=4"
          >{{`${item.typeName}(${item.studentList.length})`}}
          </li>
        </ul>
        <div class="studentScale">
          <ul v-if="allQuestionList[currentQuestion].quesOptionList" class="quesOptionList">
            <li v-for="item in allQuestionList[currentQuestion].quesOptionList">选{{item.optionKey}}：{{item.peopleNum}}人</li>
          </ul>
          <p>正确率 : <span>{{allQuestionList[currentQuestion].accuracy.rightRadio}}</span></p>
          <ul class="student">
            <li
              v-for="i in allQuestionList[currentQuestion].accuracy.list[1].studentList"
              class="right"
              v-if="allQuestionList[currentQuestion].accuracy.choosed==0||allQuestionList[currentQuestion].accuracy.choosed==1"
            >
              {{i == null ? '未设名字' : i}}
            </li>
            <li
              v-for="i in allQuestionList[currentQuestion].accuracy.list[2].studentList"
              class="wrong"
              v-if="allQuestionList[currentQuestion].accuracy.choosed==0||allQuestionList[currentQuestion].accuracy.choosed==2"
            >
              {{i == null ? '未设名字' : i}}
            </li>
            <li
              v-for="i in allQuestionList[currentQuestion].accuracy.list[3].studentList"
              class="no"
              v-if="allQuestionList[currentQuestion].accuracy.choosed==0||allQuestionList[currentQuestion].accuracy.choosed==3"
            >
              {{i == null ? '未设名字' : i}}
            </li>
          </ul>
        </div>
      </div>
      <div class="accuracy"
           v-if="hoverBol&&allQuestionList[currentQuestion].type!=1">
        <ul class="top">
          <li :class="{active:allQuestionList[currentQuestion].accuracy.choosed==index}"
              v-for="(item,index) in allQuestionList[currentQuestion].accuracy.list"
              @click="switchAccuracy(item,index)"
              v-if="index==0||index==3||index==4"
          >{{`${item.typeName}(${item.studentList.length})`}}
          </li>
        </ul>
        <div class="studentScale">
          <!--<p>正确率 : <span>{{allQuestionList[currentQuestion].accuracy.rightRadio}}</span></p>-->
          <p></p>
          <ul class="student">
            <li
              v-for="i in allQuestionList[currentQuestion].accuracy.list[3].studentList"
              class="wrong"
              v-if="allQuestionList[currentQuestion].accuracy.choosed==0||allQuestionList[currentQuestion].accuracy.choosed==3"
            >
              {{i == null ? '未设名字' : i}}
            </li>
            <li
              v-for="i in allQuestionList[currentQuestion].accuracy.list[4].studentList"
              class="right"
              v-if="allQuestionList[currentQuestion].accuracy.choosed==0||allQuestionList[currentQuestion].accuracy.choosed==4"
            >
              {{i == null ? '未设名字' : i}}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <section class="middle_" :class="{big_:!bigBol}">
      <div class="body_">
        <div class="test item_" :class="{default:true,fangda:false,suoxiao:false}" v-show="bigBol&&studentBol" style="width: 100%">
          <div class="container_">
            <header style="position: fixed;width: calc(100% - 637px);top: 50px;">测试试题
              <span class="send" @click="sendFn" v-if="!sendBol">发送作业</span>
              <span class="send disalbed" @click="sendFn" v-if="sendBol">已发送作业</span>
            </header>
            <!--<div class="hidden_"></div>-->
            <div v-if="true" style="margin-top: 90px">
              <div class="shiti">
                <div v-for="(item1,index1) in bigQuestionList">
                  <div class="datiTitile">{{questionTypeCode[item1.type]}}</div>
                  <div class="datiTitile" v-if="!questionTypeCode[item1.type]">单选题</div>
                  <div class="dati"
                       v-for="(item2,index2) in item1.typeList"
                       v-if="item1.type!=6"
                  >
                    <div class="xiaoti" v-for="(item3,index3) in item2.list">
                      <!--<div class="xiaotCont">-->
                      <!--<div class="xiaotiTitle">{{item3.sort}}、</div>-->
                      <!--<div class="xiaotiStem" v-html="item3.stem2"></div>-->
                      <!--</div>-->
                      <!--<div class="xiaotiTihao">{{item2.sort}}</div>-->
                      <shiti
                        :sort="item3.xuhao"
                        :type="item3.type"
                        :stem="item3.stem"
                        :quesOption="item3.quesOption"
                        :key="Math.random()"
                      >
                        <div class="menu">
                          <p class="left1" v-if="item3.type==1">
                            正确 :<span class="zq">{{item3.rightList.length}}</span>人
                            错误 :<span class="cw">{{item3.wrongList.length}}</span>人
                            未答题 :<span class="wd">{{item3.notanswerList.length}}</span>人
                          </p>
                          <p class="left1" v-if="item3.type!=1">
                            答题人数 :<span class="dt">{{item3.answerCount}}</span>人
                            未答题人数 :<span>{{item3.notanswerCount}}</span>人
                          </p>
                          <p class="right1">
                            <span @click="showKey(item3)" class="aq-button">答案</span>
                            <span @click.stop="showYuanti(item1,index1,item2,index2,item3,index3)"
                                  class="yt-button">原题</span>
                          </p>
                        </div>
                      </shiti>
                      <div class="answer" v-if="item3.isShow">
                        <p class="answer-title">答案:</p>
                        <p class="answer-con checkWrong" v-html="item3.answer"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div class="nodata" v-if="!true">
              暂无数据
            </div>
          </div>
        </div>
        <div class="testSmall" v-show="!bigBol" @click="showSmall">
          <span>测试试题</span>
        </div>
        <div class="student item_" v-show="bigBol&&!studentBol">
          <div class="container_">
            <header style="position: fixed;width: calc(100% - 637px);top: 50px;">测试试题({{studentItem.studentName}}答
              <img class="close" src="../../../../static/img/close.png" @click="studentBol=true;"/>)
            </header>

            <!--<div class="hidden_"></div>-->
            <div v-if="true" style="margin-top: 90px;">
              <div class="shiti">
                <div v-for="(item1,index1) in studentQuestionList">
                  <div class="datiTitile">{{questionTypeCode[item1.type]}}</div>
                  <div class="dati"
                       v-for="(item2,index2) in item1.typeList"
                       v-if="item1.type!=6"
                  >
                    <!--<div class="datiTitile">{{item2.itemContent}}</div>-->
                    <div class="xiaoti" v-for="(item3,index3) in item2.list">
                      <!--<div class="xiaotCont">-->
                      <!--<div class="xiaotiTitle">{{item3.sort}}、</div>-->
                      <!--<div class="xiaotiStem" v-html="item3.stem2"></div>-->
                      <!--</div>-->
                      <shiti
                        :sort="item3.xuhao"
                        :type="item3.type"
                        :stem="item3.stem"
                        :quesOption="item3.quesOption"
                        :key="Math.random()"
                      >
                        <p style="margin-top: 15px;"></p>
                      </shiti>
                      <div class="student-answer" v-if="true">
                        <div class="xingshi1" v-if="item3.godpenAnswer.length==0">
                          <p class="answer-con">
                            <span>正确答案:</span>
                            <span class="right-answer" v-html="item3.answer"></span>
                            <span>{{studentItem.studentName}}的答案:</span>
                            <span class="wrong-answer"
                                  v-if="item3.answer != item3.userAnswerResul ">{{item3.userAnswerResul ? item3.userAnswerResul : '未答'}}</span>
                            <span class="wrong-answer checkWrong"
                                  v-if="item3.answer == item3.userAnswerResul">{{item3.userAnswerResul ? item3.userAnswerResul : '未答'}}</span>
                          </p>
                          <p class="analyz-title" v-show="false">答案解析:</p>
                          <p class="analyz-con" v-show="false" v-html="item3.quesAnalyze"></p>
                        </div>
                        <div class="xingshi2" v-if="item3.godpenAnswer.length!=0">
                          <p class="answer-con">
                            <span>正确答案:</span>
                            <span class="right-answer" v-html="item3.answer"></span>{{typeof(item3.answer)}}
                            <span>{{studentItem.studentName}}的答案:</span>
                            <span class="wrong-answer"
                                  v-if="item3.godpenAnswer.indexOf('http')!=-1"
                                  style="cursor: pointer"
                                  @click="kushenbiFn(item3)"
                            >点击查看详情</span>
                            <span class="wrong-answer"
                                  v-if="item3.godpenAnswer.indexOf('http')==-1">{{item3.godpenAnswer}}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
            <div class="nodata" v-if="!true">
              暂无数据
            </div>
          </div>
        </div>
        <div class="details item_" v-show="!bigBol" :class="{default:true,fangda:false,suoxiao:false}">
          <div class="container_" :key="Math.random()">
            <header>试题详情</header>
            <span class="nextshiti aq-button" @click="nextshiti"
                  :class="{disabled:currentQuestion==allQuestionList.length-1}">下一题</span>
            <img class="allcreen" src="../../../../static/img/allScreen.png" @click="allcreen"/>
            <img class="close" src="../../../../static/img/close.png" @click="bigBol=true;"/>
            <div v-if="!bigBol">
              <div class="shiti-menu">
                <p class="right1">
                <span class="aq-button"
                      @click="allQuestionList[currentQuestion].isShow=!allQuestionList[currentQuestion].isShow">答案</span>
                </p>
                <shiti
                  :sort="allQuestionList[currentQuestion].xuhao"
                  :type="allQuestionList[currentQuestion].type"
                  :stem="allQuestionList[currentQuestion].stem"
                  :quesOption="allQuestionList[currentQuestion].quesOption"
                >
                  <div class="menu" style="color:#1fd094">
                    <p class="left1" v-if="allQuestionList[currentQuestion].type==1"
                       v-show="allQuestionList[currentQuestion].isShow">
                      正确 :<span class="zq">{{allQuestionList[currentQuestion].rightList.length}}</span>人
                      错误 : <span class="cw">{{allQuestionList[currentQuestion].wrongList.length}}</span>人
                      未答题 :<span class="wdt">{{allQuestionList[currentQuestion].notanswerList.length}}</span>人
                    </p>
                    <p class="left1" v-if="allQuestionList[currentQuestion].type!=1"
                       v-show="allQuestionList[currentQuestion].isShow">
                      答题人数 :<span class="dt">{{allQuestionList[currentQuestion].answerCount}}</span>人
                      未答题人数 :<span>{{allQuestionList[currentQuestion].notanswerCount}}</span>人
                    </p>
                  </div>
                </shiti>
              </div>
              <!--<hr style="height:1px;border:none;border-top:1px solid #e1e5ec;">-->
              <div class="jiexi"
                   v-html="'<span style=color:black>答案:</span>'+allQuestionList[currentQuestion].answer"
                   v-show="allQuestionList[currentQuestion].isShow"
              ></div>
              <!--<hr style="height:1px;border:none;border-top:1px solid #e1e5ec;">-->
              <div class="datiqingkuang">
                <p
                  class="detailMenu"
                  @click="showDatiQingKuang"
                >
                  学生答题情况
                </p>
                <div class="accuracy"
                     v-if="allQuestionList[currentQuestion].isShow2&&allQuestionList[currentQuestion].type==1">
                  <ul class="top">
                    <li :class="{active:allQuestionList[currentQuestion].accuracy.choosed==index}"
                        v-for="(item,index) in allQuestionList[currentQuestion].accuracy.list"
                        @click="switchAccuracy(item,index)"
                        v-if="index!=4"
                    >{{`${item.typeName}(${item.studentList.length})`}}
                    </li>
                  </ul>
                  <div class="studentScale">
                    <ul v-if="allQuestionList[currentQuestion].quesOptionList" class="quesOptionList">
                      <li v-for="item in allQuestionList[currentQuestion].quesOptionList">选{{item.optionKey}}：{{item.peopleNum}}人</li>
                    </ul>
                    <p>正确率 : <span>{{allQuestionList[currentQuestion].accuracy.rightRadio}}</span></p>
                    <ul class="student">
                      <li
                        v-for="i in allQuestionList[currentQuestion].accuracy.list[1].studentList"
                        class="right"
                        v-if="allQuestionList[currentQuestion].accuracy.choosed==0||allQuestionList[currentQuestion].accuracy.choosed==1"
                      >
                        {{i == null ? '未设名字' : i}}
                      </li>
                      <li
                        v-for="i in allQuestionList[currentQuestion].accuracy.list[2].studentList"
                        class="wrong"
                        v-if="allQuestionList[currentQuestion].accuracy.choosed==0||allQuestionList[currentQuestion].accuracy.choosed==2"
                      >
                        {{i == null ? '未设名字' : i}}
                      </li>
                      <li
                        v-for="i in allQuestionList[currentQuestion].accuracy.list[3].studentList"
                        class="no"
                        v-if="allQuestionList[currentQuestion].accuracy.choosed==0||allQuestionList[currentQuestion].accuracy.choosed==3"
                      >
                        {{i == null ? '未设名字' : i}}
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="accuracy"
                     v-if="allQuestionList[currentQuestion].isShow2&&allQuestionList[currentQuestion].type!=1">
                  <ul class="top">
                    <li :class="{active:allQuestionList[currentQuestion].accuracy.choosed==index}"
                        v-for="(item,index) in allQuestionList[currentQuestion].accuracy.list"
                        @click="switchAccuracy(item,index)"
                        v-if="index==0||index==3||index==4"
                    >{{`${item.typeName}(${item.studentList.length})`}}
                    </li>
                  </ul>
                  <div class="studentScale">
                    <!--<p>正确率 : <span>{{allQuestionList[currentQuestion].accuracy.rightRadio}}</span></p>-->
                    <p></p>
                    <ul class="student">
                      <li
                        v-for="i in allQuestionList[currentQuestion].accuracy.list[3].studentList"
                        class="wrong"
                        v-if="allQuestionList[currentQuestion].accuracy.choosed==0||allQuestionList[currentQuestion].accuracy.choosed==3"
                      >
                        {{i == null ? '未设名字' : i}}
                      </li>
                      <li
                        v-for="i in allQuestionList[currentQuestion].accuracy.list[4].studentList"
                        class="right"
                        v-if="allQuestionList[currentQuestion].accuracy.choosed==0||allQuestionList[currentQuestion].accuracy.choosed==4"
                      >
                        {{i == null ? '未设名字' : i}}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="nodata" v-if="!true">
              暂无数据
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="kushebi item_" v-if="kushebiBol" :class="{default:true,fangda:false,suoxiao:false}">
      <img class="close" src="../../../../static/img/close.png" @click="kushebiBol=false;"/>
      <div class="container_">
        <div class="KushenbiShiti">
          <shiti
            :type="kushenbiItem.type"
            :stem="kushenbiItem.stem"
            :quesOption="kushenbiItem.quesOption"
            :key="Math.random()"
          >
          </shiti>
          <p class="answer-con">
            <span class="colorGreen">正确答案:</span>
            <span class="right-answer" v-html="kushenbiItem.answer"></span>
          </p>
          <p class="analyz-title colorGreen" v-show="false">答案解析:</p>
          <p class="analyz-con" v-show="false" v-html="kushenbiItem.quesAnalyze"></p>
        </div>
        <div class="tanchuang">
          <iframe :src="kusenbiSrc" width="1200px" height="800px" frameborder="0" scrolling="no">点击查看详情</iframe>
        </div>
        <div class="nodata" v-if="!true">
          暂无数据
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import shiti from '../../freeMakePaper/analysisQuestions_me1_6.vue';
  //  import errorData from './reports/errorData.js';
  //  import errorData2 from './reports/errorData2.js';
  export default {
    data() {
      return {
        "result": {
          "knowledgeRanking": [
            {
              "knowledgeCode": "779600040001",
              "knowledgeName": "语言表达的连贯性",
              "soutCount": 1
            },
            {
              "knowledgeCode": "779600020002",
              "knowledgeName": "近义词辨析",
              "soutCount": 1
            },
            {
              "knowledgeCode": "779600020001",
              "knowledgeName": "词语使用",
              "soutCount": 1
            }
          ]
        },
        /*参加测试人数*/
        joinCount: 0,
        /*发送作业*/
        sendBol: false,
        zhengquelv: [],
        /*题目*/
        bigQuestionList: [],
        bigchoosed: 0,
        smallChoosed: 0,
        currentQuestion: 0,//当前
        questionNum: 0,
        allQuestionList: [],
        /*全屏*/
        fullScreeBol: true,
        /*总人数*/
        studentTotalList: [],
        /*选中的学生*/
        studentItem: {},
        studentQuestionList: [],
        /*酷神笔*/
        kusenbiSrc: "",
        kushenbiItem: {},
        /*hover事件*/
        hoverBol: false,
        /*排行榜*/
        rinking: [],
        bigBol: true,//true展示测试试题(总览)+排行榜,false展示原题
        studentBol: true,//true展示测试试题(学生),false展示展示测试试题(总览)
        kushebiBol: false,
        /*学生答题情况*/
        accuracy: {//全部正确错误未回答,//单题报告接口返回结果融合
          list: [//count,type暂时没有用
            {typeName: "全班", studentList: [], count: 0, type: "all"},
            {typeName: "正确", studentList: [], count: 0, type: "right"},
            {typeName: "错误", studentList: [], count: 0, type: "wrong"},
            {typeName: "未回答", studentList: [], count: 0, type: "no"},
          ],
          choosed: 0,
        },
      }
    },
    components: {shiti},
    mounted() {
      this.getTeacherClassTestReportFromDB();
      $(document).click(() => {
        this.hoverBol = false;
      })
    },
    methods: {
      allcreen() {
        if (this.fullScreeBol) {
          this.fullscreen();
        } else {
          this.exitFullscreen();
        }
      },
      fullscreen(elem) {
        elem = document.body;
        if (elem.webkitRequestFullScreen) {
          elem.webkitRequestFullScreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.requestFullScreen) {
          elem.requestFullscreen();
        } else {
          //浏览器不支持全屏API或已被禁用
        }
        this.fullScreeBol = false;
      },
      exitFullscreen() {
        var elem = document;
        if (elem.webkitCancelFullScreen) {
          elem.webkitCancelFullScreen();
        } else if (elem.mozCancelFullScreen) {
          elem.mozCancelFullScreen();
        } else if (elem.cancelFullScreen) {
          elem.cancelFullScreen();
        } else if (elem.exitFullscreen) {
          elem.exitFullscreen();
        } else {
          //浏览器不支持全屏API或已被禁用
        }
        this.fullScreeBol = true;
      },
      toStudent(item, index) {
        this.hoverBol = false;
        if (!item.isAnswer) {
          return;
        }
        this.studentItem = item;
        this.getStudentsAnswerQuestionsDetailsFromDB(() => {
          this.studentBol = false;
        });
      },
      switchAccuracy(item, index) {
        this.currentQuestion++;
        this.currentQuestion--;
        this.$set(this.allQuestionList[this.currentQuestion].accuracy, "choosed", index);
      },
      getTeacherClassTestReportFromDB(nextFn) {
        let sendata = {
          "inClassTestCode": this.$route.query.inClassTestCode,
        }
        if (this.$route.query.paperCode != undefined) {
          sendata.paperCode = this.$route.query.paperCode;
        }
        this.$ajax.getTeacherClassTestReport(sendata)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              if (!result || !result.roport) return;
              this.resultFromDB = result;
//              this.resultFromDB = errorData.result;//接口通了注释此处
              if (result.isRelease == 1) {
                this.sendBol = true;
              }
              this.studentTotalList = result.roport.studentTotal;
              /*数据处理*/
              {
                /*排名处理,加入是否一道题没答*/
                result.rinking.forEach((item) => {
                  item.isAnswer = false;
                  result.roport.joinList.forEach((item2) => {
                    if (item.studentCode == item2) {
                      item.isAnswer = true;
                    }
                  })
                })
                /*表格*/
                let tihaoList = [];//题号列表
                this.rinking = result.rinking;
                let allQuestionList = [];//所有题目
                let typeNum = [];
                let xuhao = 0;
                if(!this.$route.query.source){
                  let lingshiArray = []
                  result.topicPaper.forEach((item3, index3) => {
                    item3.xuhao = ++xuhao;
                    if (typeof(item3.baseName) == 'string' && item3.baseName.indexOf('<img>') == -1) {
                      item3.baseName = this.strToUrl(item3.baseName);
                    }
                    if (typeof(item3.rightAnswer) == 'string' && item3.rightAnswer.indexOf('<img>') == -1) {
                      item3.rightAnswer = this.strToUrl(item3.rightAnswer);
                      try {
                        item3.rightAnswer = JSON.parse(item3.rightAnswer);
                        if (Array.isArray(item3.rightAnswer)) {
                          item3.rightAnswer = item3.rightAnswer[0].answerValue;
                        }
                      } catch (e) {

                      }
                    }
                    if (typeof(item3.quesOption) == 'string' && item3.quesOption.indexOf('<img>') == -1) {
                      item3.quesOption = this.strToUrl(item3.quesOption);
                    }
                    if (typeof(item3.quesAnalyze) == 'string' && item3.quesAnalyze.indexOf('<img>') == -1) {
                      if ((JSON.parse((item3.quesAnalyze || item3.questionAnalyze)) || "[]")[0]) {
                        item3.quesAnalyze = this.strToUrl((JSON.parse((item3.quesAnalyze || item3.questionAnalyze)) || "[]")[0].analyzeValue);
                      } else {
                        item3.quesAnalyze = "";
                      }
                    }
                    item3.isShow = false;
                    item3.isShow2 = false;
                    item3.type = item3.questionType;
                    item3.stem = item3.baseName;
                    item3.quesOption = item3.questionOption;
                    item3.rightList = [];
                    item3.wrongList = [];
                    item3.answer = item3.rightAnswer;
                    item3.notanswerList = [];
                    tihaoList.push({
                      id: item3.id,
                      sort: item3.sort,
                      sortZhanshi: item3.sort,
                      xuhao: item3.xuhao,
                      type: item3.type,
                    })
                    allQuestionList.push(item3);
                    lingshiArray.push(item3);
                  })
                  let obj = {'typeList': []}
                  let theObject = {"list": lingshiArray }
                  obj.typeList.push(theObject)
                  result.paper = {}
                  result.paper.paperSystemQusetionType = []
                  result.paper.paperSystemQusetionType.push(obj);
//                  console.log(result.paper.paperSystemQusetionType[0].typeList.push(theObject));
//                  result.paper.paperSystemQusetionType[0].typeList.push(theObject);
                }else {
                  result.paper.paperSystemQusetionType.forEach((item1, index1) => {
                    item1.typeList.forEach((item2, index2) => {
                      typeNum.push({
                        type: item1.type,
                        num: item2.list.length,
                      })
                      /*融入正确人,错误人,未答人*/
                      item2.list.forEach((item3, index3) => {
                        item3.xuhao = ++xuhao;
                        if (typeof(item3.stem) == 'string' && item3.stem.indexOf('<img>') == -1) {
                          item3.stem = this.strToUrl(item3.stem);
                        }
                        if (typeof(item3.answer) == 'string' && item3.answer.indexOf('<img>') == -1) {
                          item3.answer = this.strToUrl(item3.answer);
                          try {
                            item3.answer = JSON.parse(item3.answer);
                            if (Array.isArray(item3.answer)) {
                              item3.answer = item3.answer[0].answerValue;
                            }
                          } catch (e) {

                          }
                        }
                        if (typeof(item3.quesOption) == 'string' && item3.quesOption.indexOf('<img>') == -1) {
                          item3.quesOption = this.strToUrl(item3.quesOption);
                        }
                        if (typeof(item3.quesAnalyze) == 'string' && item3.quesAnalyze.indexOf('<img>') == -1) {
                          if ((JSON.parse((item3.quesAnalyze || item3.questionAnalyze)) || "[]")[0]) {
                            item3.quesAnalyze = this.strToUrl((JSON.parse((item3.quesAnalyze || item3.questionAnalyze)) || "[]")[0].analyzeValue);
                          } else {
                            item3.quesAnalyze = "";
                          }
                        }
                        item3.isShow = false;
                        item3.isShow2 = false;
                        tihaoList.push({
                          id: item3.id,
                          sort: item2.sort,
                          sortZhanshi: item2.sort + '.' + item3.sort,
                          xuhao: item3.xuhao,
                          type: item3.type,
                        })
                        /*1205添加各选项答题人数*/
                        if(item3.type==1){
                          let quesOptionList=[];
                          JSON.parse(item3.quesOption).map((item)=>{
                            let optionKey_peopleNum={
                              "optionKey":item.optionKey,
                              "peopleNum":0,
                            }

                            for(let i in result.roport){
                              if(i==item3.id){
                                result.roport[i].answerweights.map((item4)=>{
                                  if(optionKey_peopleNum.optionKey==item4.answer)optionKey_peopleNum.peopleNum=item4.answercount;
                                })
                              }
                            }
                            quesOptionList.push(optionKey_peopleNum)
                          })

                          item3.quesOptionList=quesOptionList;
                        }
                        allQuestionList.push(item3);
                      })
                    })
                  })
                }
                tihaoList.forEach((item1, index1) => {
                  if (item1.notanswerCount == undefined) {
                    item1.notanswerCount = 0
                  }
                  if (item1.answerCount == undefined) {
                    item1.answerCount = 0
                  }
                  if (item1.rightCount == undefined) {
                    item1.rightCount = 0
                  }
                  if (item1.answerList == undefined) {
                    item1.answerList = [];
                  }
                  if (item1.rightList == undefined) {
                    item1.rightList = [];
                  }
                  if (item1.wrongList == undefined) {
                    item1.wrongList = [];
                  }
                  if (item1.notanswerList == undefined) {
                    item1.notanswerList = [];
                  }
                  for (let i in  result.roport) {
                    if (i.length >= 32) {
                      if (i == item1.id) {
                        Object.assign(item1, result.roport[i], {isZibu: false});
                      }
                    }
                  }
                })
                this.zhengquelv = tihaoList;
//                console.log(JSON.stringify(allQuestionList));
//
//                console.clear()
//                console.log(JSON.parse(JSON.stringify(allQuestionList)));
                /*融入正确率*/
                allQuestionList.forEach((item1, index) => {
//                  Object.assign(item1, {isZibu: true}, {accuracy: accuracy});


                  let accuracy = {
                    list: [
                      {typeName: "全班", studentList: [], count: 0, type: "all"},
                      {typeName: "正确", studentList: [], count: 0, type: "right"},
                      {typeName: "错误", studentList: [], count: 0, type: "wrong"},
                      {typeName: "未回答", studentList: [], count: 0, type: "no"},
                      {typeName: "答题人数", studentList: [], count: 0, type: "no"},
                    ],
                    choosed: 0,
                  }
                  for (let i in  result.roport) {
                    if (i.length >= 32) {
                      if (i == item1.id) {
                        if (result.roport[i].notanswerCount == undefined) {
                          result.roport[i].notanswerCount = 0
                        }
                        if (result.roport[i].answerCount == undefined) {
                          result.roport[i].answerCount = 0
                        }
                        if (result.roport[i].rightCount == undefined) {
                          result.roport[i].rightCount = 0
                        }
                        if (result.roport[i].answerList == undefined) {
                          result.roport[i].answerList = [];
                        }
                        if (result.roport[i].rightList == undefined) {
                          result.roport[i].rightList = [];
                        }
                        if (result.roport[i].wrongList == undefined) {
                          result.roport[i].wrongList = [];
                        }
                        if (result.roport[i].notanswerList == undefined) {
                          result.roport[i].notanswerList = [];
                        }
//                        console.log(result.roport[i].wrongList);
                        accuracy.list[0].studentList = result.roport.studentTotal;
                        accuracy.list[1].studentList = result.roport[i].rightList;
                        accuracy.list[2].studentList = result.roport[i].wrongList;
                        accuracy.list[3].studentList = result.roport[i].notanswerList;
                        accuracy.list[4].studentList = result.roport[i].answerList;
                        accuracy.rightRadio = ((accuracy.list[1].studentList.length / accuracy.list[0].studentList.length * 100).toFixed(2)) + '%';

                        Object.assign(item1, {isZibu: false}, result.roport[i], {accuracy: accuracy});
                      }
                    }
                  }
                })
                this.allQuestionList = allQuestionList;
                this.typeNum = typeNum;
              }
              this.joinCount = result.roport.joinCount;
              this.bigQuestionList = result.paper.paperSystemQusetionType;
//              console.log(JSON.stringify(this.bigQuestionList));
              if (nextFn) {
                nextFn();
              }
            } else {
              this.$message("通讯异常")
            }
          })
          .catch((error) => {
            console.log(error);
          })

      },
      hoverFn(item, index) {
        this.currentQuestion = index;
        this.hoverBol = true;
      },
      showDatiQingKuang() {
        this.currentQuestion++;
        this.currentQuestion--;
        this.allQuestionList[this.currentQuestion].isShow2 = !this.allQuestionList[this.currentQuestion].isShow2;
      },
      goback() {
        this.$router.push({
          path: "/questionStorage/questionTest"
        })
      },
      showKey(item3) {
        console.log(item3.isShow);
        item3.isShow = !item3.isShow;
      },
      showSmall() {
        this.bigBol = true;
      },
      nextshiti() {
        if (this.currentQuestion < this.allQuestionList.length - 1) {
          this.currentQuestion++;
        }
      },
      showYuanti(item1, index1, item2, index2, item3, index3) {
//        console.log(item3);
        this.bigBol = false;
        this.hoverBol = false;
        /*        this.bigchoosed = index2;
                this.smallChoosed = index3;
                let currentQuestion = 0;
        //        console.log(index1,index3);
                this.typeNum.forEach((item, index) => {
                  if (index < index2) {
                    currentQuestion += item.num;
                  }
                })
                currentQuestion += index3;*/
        this.currentQuestion = item3.xuhao - 1;
//        console.log(currentQuestion);
      },
      kushenbiFn(item) {
        console.log(item);
        this.kushenbiItem = item;
        this.kusenbiSrc = item.godpenAnswer;
        this.kushebiBol = true;
      },
      sendFn() {
        if (this.sendBol) {
          return;
        }
        this.$ajax.saveTask({
          taskName: this.$route.query.inClassTestName + '作业',
          teacherCode: this.localData.get("webTeacherUser").userId,
          teacherName: this.localData.get("webTeacherUser").userName,
          subjectCode: this.localData.get("webTeacherUser").userSubject,
          subjectName: this.commonSubject[this.localData.get("webTeacherUser").userSubject],
          classId: this.$route.query.classCode,
          inClassTestCode: this.$route.query.inClassTestCode,
        })
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.$message("发送成功");
              this.sendBol = true;
            } else {
              this.$message("发送失败");
            }
          })
          .catch((error) => {
            console.log(error);
          })
      },
      getStudentsAnswerQuestionsDetailsFromDB(nextFn) {
        let sendata = {
          inClassTestCode: this.$route.query.inClassTestCode,
          studentCode: this.studentItem.studentCode,
          source: this.$route.query.source,//卷子=2 ，自组题 null
        }
        this.$ajax.getStudentsAnswerQuestionsDetails(sendata)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              if (!result || !result.paper) return;
//              this.resultFromDB = result;
              /*数据处理*/
              {
                let xuhao = 0;
                result.paper.paperSystemQusetionType.forEach((item1, index1) => {
                  item1.typeList.forEach((item2, index2) => {
                    item2.list.forEach((item3, index3) => {
                      item3.xuhao = ++xuhao;
                      if (typeof(item3.stem) == 'string' && item3.stem.indexOf('<img>') == -1) {
                        item3.stem = this.strToUrl(item3.stem);
                      }
                      if (typeof(item3.answer) == 'string' && item3.answer.indexOf('<img>') == -1) {
                        item3.answer = this.strToUrl(item3.answer);
                        try {
                          item3.answer = JSON.parse(item3.answer);
                          if (Array.isArray(item3.answer)) {
                            item3.answer = item3.answer[0].answerValue;
                          }
                        } catch (e) {

                        }
                      }
                      if (typeof(item3.quesOption) == 'string' && item3.quesOption.indexOf('<img>') == -1) {
                        item3.quesOption = this.strToUrl(item3.quesOption);
                      }
                      if (typeof(item3.quesAnalyze) == 'string' && item3.quesAnalyze.indexOf('<img>') == -1) {
                        if ((JSON.parse((item3.quesAnalyze || item3.questionAnalyze)) || "[]")[0]) {
                          item3.quesAnalyze = this.strToUrl((JSON.parse((item3.quesAnalyze || item3.questionAnalyze)) || "[]")[0].analyzeValue);
                        } else {
                          item3.quesAnalyze = "";
                        }

                      }
                      {//处理null
                        if (item3.godpenAnswer == null) {
                          item3.godpenAnswer = "";
                        }

                      }
                      item3.isShow = false;
                      item3.isShow2 = false;
                    })
                  })
                })
//                console.log(JSON.stringify(result.paper.paperSystemQusetionType),88888);
                this.studentQuestionList = result.paper.paperSystemQusetionType;
              }
              if (nextFn) {
                nextFn();
              }
            } else {
              this.$message("通讯异常")
            }
          })
          .catch((error) => {
            console.log(error);
          })
      },
      zhengquelvCHULI() {
        let result = errorData.result;//接口通了注释此处


      }
    },
    computed: {},
    filters: {}

  }
</script>


<style lang="scss" scoped>
  /*非结构性*/
  .reportDetail_duoheyi {
    * {
      background: #fff;
      box-sizing: border-box;
      font-size: 26px;
    }
    .checkWrong {
      color: #1fd094 !important;
    }
    .zq {
      color: #1fd094;
    }
    .cw {
      color: #ff6666 !important;
    }
    .wdt {

    }
    .dt {
      color: #2c3e50 !important;
      /*font-weight:bold;*/
    }
    .aq-button, .yt-button {
      width: 100px;
      height: 45px;
      font-size: 24px !important;
      text-align: center;
      line-height: 45px;
      background: #1ed195 !important;
      display: inline-block;
      border-radius: 15px;
      color: #fff;
    }
    .yt-button {
      background: #ffaa46 !important;
    }
    .analysisType1_me1_6 {
      font-size: 40px;
      line-height: 50px;
    }
    .acceryContainer {
      position: fixed;
      right: 643px;
      top: 120px;
      width: 600px;
      height: 100px;
      z-index: 16;
      .close {
        position: absolute;
        right: -295px;
        top: 20px;
        z-index: 9;
        width: 22px;
        cursor: pointer;
      }
      .accuracy {
        float: left;
        /*width: 770px;*/
        box-sizing: border-box;
        /*height: 594px;*/
        background-color: rgba(255, 255, 255, 1);
        border-radius: 15px;
        /*border: solid 2px rgba(235, 240, 244, 1);*/
        padding-top: 10px;
        border: 1px solid #6d6d6d;
        ul.top {
          font-size: 0;
          /*border-bottom: 2px solid rgba(235, 240, 244, 1);*/
          /*padding: 6px 0px;*/
          * {
            font-size: 40px;
            display: inline-block;
          }
          li {
            width: 160px;
            height: 40px;
            line-height: 40px;
            font-size: 24px;
            border-radius: 12px;
            text-align: center;
            margin-right: 15px;
            cursor: pointer;
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
        .studentScale {
          text-align: center;
          /*width: 880px;*/
          /*height: 470px;*/
          background-color: rgba(242, 249, 254, 1);
          margin-top: 10px;
          padding: 0px 80px 34px;
          box-sizing: border-box;

          & > p {
            height: 76px;
            font-size: 30px;;
            line-height: 76px;
            letter-spacing: 0.7px;
            color: #505050;
            background: #f2f9fe;
            span {
              background: #f2f9fe;
              color: #1fd094;
            }
          }
          ul.student {
            text-align: left;
            font-size: 0;
            background: #f2f9fe;
            width: 760px;
            min-height: 208px;
            * {
              font-size: 40px;
              display: inline-block;
              vertical-align: middle;
            }
            li {
              width: 120px;
              height: 50px;
              line-height: 50px;
              background-color: rgba(31, 208, 148, 1);
              margin-right: 2px;
              margin-bottom: 2px;
              text-align: center;
              font-size: 40px;
              color: #fff;
              &.right {
                background: #1fd094;
              }
              &.wrong {
                background: #ff6666;
              }
              &.no {
                background: #b3cde6;
              }
            }
          }
        }
      }
    }

  }

  /*结构性*/
  .reportDetail_duoheyi {
    background: #f0f4fb;
    position: relative;
    min-height: 800px;
    $w: 300px;
    .rank-student-question {
      width: $w;
      height: 100%;
      position: fixed;
      right: 19px;
      top: 0;
      z-index: 2;
      .rank-container {
        /*background: red;*/
        height: 100%;
        padding-top: 80px;
        padding-right: 10px;
        $h: 264px;
        position: relative;
        .allcreen {
          position: absolute;
          right: 57px;
          top: 57px;
          z-index: 9;
          width: 23px;
          cursor: pointer;
        }
        .close {
          position: absolute;
          right: 15px;
          top: 58px;
          z-index: 9;
          width: 22px;
          cursor: pointer;
        }
        .question_ {
          /*background: orange;*/
          height: $h;
          width: 100%;
          header {
            font-size: 32px;
            padding-top: 20px;

            z-index: 5999;
          }
          .chart {
            overflow: auto;
            text-align: center;
            margin: 0 auto;
            padding-top: 10px;
            width: 100%;
            height: 209px;
            overflow: auto;
            table {
              width: 100%;
              margin: 0 auto;
              th, td {
                text-align: center;
                height: 50px;
                border: 1px solid #fff;
                font-size: 32px;
              }
              th {
                background: #e1edf1;
              }
              td {
                background: #eff4f6;
              }
              th:nth-of-type(1) {
                border-top-left-radius: 15px;
                /*background: #8bb6c4;*/
              }
              th:nth-last-of-type(1) {
                border-top-right-radius: 15px;
              }
            }
          }
          .nodata {
            margin: 20px 16px;
            background-color: rgba(255, 255, 255, 1);
            text-align: center;
            padding: 100px;
            font-size: 20px;
          }
          position: relative;
          z-index: 2;
        }
        .rank {
          position: absolute;
          top: 0;
          z-index: 1;
          padding-top: $h+58;
          width: 100%;
          height: 100%;
          overflow: hidden;
          text-align: center;
          padding-bottom: 20px;
          /*box-sizing: content-box;*/
          header {
            height: 70px;
          }
          .container_ {
            height: 100%;
            padding-bottom: 50px;
            overflow: auto;
            ul {
              line-height: 40px;
              padding: 15px;
              li {
                font-size: 26px;
                text-align: left;
                padding-left: 45px;
                &.choosed {
                  background: #1fd094;
                  span:nth-of-type(1) {
                    background: #1fd094;
                  }
                  span:nth-of-type(2) {
                    background: #1fd094;
                  }
                }
                span:nth-of-type(1) {
                  font-size: 24px;
                  width: 81px;
                  display: inline-block;
                }
                span:nth-of-type(2) {
                  font-size: 26px;
                  color: #929292;
                  &.isAnswer {
                    cursor: pointer;
                    color: dodgerblue;
                  }
                }
              }
            }
          }
        }
      }

    }
    header {
      height: 70px;
      line-height: 70px;
      /*padding: 10px 38px 0 38px;*/
      font-size: 32px;
      letter-spacing: 0.7px;
      color: #505050;
      border-bottom: 1px solid rgba(225, 229, 236, 1);
      font-weight: bold;
    }
    .middle_ {
      padding-right: $w;
      width: 100%;
      &.big_ {
        padding-top: 30px;
        padding-bottom: 30px;
        position: relative;
        padding-right: 0;
        z-index: 8;
        height: 100%;
        .body_ {
          .details {
            width: 100%;
            padding-right: 30px;
            border-right: 1px solid transparent;
          }
        }
      }
    }
    .body_ {
      font-size: 0;
      min-width: 1000px;
      padding: 0 20px;
      margin: 0 auto;
      text-align: left;
      position: relative;
      .item_ {

        text-align: left;
        font-size: 0px;
        border: 1px solid #e1e5ec;
        display: inline-block;
        /*width: 50%;*/
        height: 100%;
        /*min-height: 600px;*/
        vertical-align: top;
        position: relative;
        * {
          font-size: 40px;
        }
        padding-left: 20px;
        padding-right: 20px;
        &:nth-of-type(2n+1) {
          border-right: 1px solid #e1e5ec;
          .container_ {
            /*padding-left: 20px;*/
            /*padding-right: 10px;*/
          }
        }
        &:nth-of-type(2n) {
          .container_ {
            /*padding-left: 10px;*/
            /*padding-right: 20px;*/
          }
        }
        .container_ {
          /*width: 800px;*/
          min-height: 600px;
          header {
            text-align: center;
            font-size: 40px;
            font-weight: bold;
          }
          /*          .hidden_{
                      position: absolute;
                      width: 0px;
                      height: 0px;
                      border:10px solid transparent;
                      top:50%;
                      transform: translate(0,-50%);
                      right: 0;
                      cursor: pointer;
                    }*/
          .menu {
            overflow: hidden;
            padding-bottom: 10px;
            .left1 {
              font-size: 40px;
              float: left;
              color: #929292;
              margin-top: 10px;
              span {
                margin-right: 5px;
              }
            }
            .right1 {
              font-size: 40px;
              float: right;
              color: #1fd094;
              span {
                margin-left: 5px;
                cursor: pointer;
              }
            }
          }
          .answer {

            /*            &>*{
                          vertical-align: top;
                          display: inline-block;
                        }*/
            .answer-title {
              margin-bottom: 6px;
            }
            .answer-con {
              /*border: 1px solid #e1e5ec;*/
              padding: 5px 5px;

            }
          }
        }

      }
      .test, .student {
        .container_ {
          /*          .hidden_{
                      border-right:10px solid red;
                    }*/
          .shiti {
            .datiTitile {
              font-size: 32px;
              font-weight: bold;
              margin-top: 10px;
              margin-bottom: 6px;
            }
            .dati {
              .xiaoti {
                border-bottom: 1px solid #e1e5ec;
                padding-bottom: 20px;
                padding-top: 10px;
                .xiaotCont {
                  font-size: 0;
                  white-space: nowrap;
                  margin-bottom: 8px;
                  & > * {
                    font-size: 40px;
                    vertical-align: top;
                    white-space: normal;
                    display: inline-block;
                  }
                  .xiaotiTitle {
                    width: 2%;
                  }
                  .xiaotiStem {
                    width: 98%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    * {
                      width: 0 !important;
                      height: 0 !important;
                      display: inline-block;
                    }
                  }
                  .analysisType1_me1_6 {
                    width: 98%;
                    margin-bottom: 12px;
                  }
                }

              }

            }
          }
        }
        .menu {
          /*margin-bottom: 20px;*/
        }
      }
      .test {
        .send {
          position: absolute;
          top: 9px;
          right: 15px;
          width: 160px;
          height: 50px;
          line-height: 46px;
          text-align: center;
          border-radius: 10px;
          cursor: pointer;
          font-size: 24px;
          background: #1fd094;
          color: white;
          &.disalbed {
            background: darkgray;
            cursor: not-allowed;
            /*color: #f5f5f5;*/
          }
        }
      }
      .student {
        .container_ {
          position: relative;
          img.close {
            position: absolute;
            right: 10px;
            top: 20px;
            cursor: pointer;
          }
          .student-answer {
            .answer-con {
              font-size: 0px;
              margin-top: 10px;
              margin-bottom: 10px;

              * {
                font-size: 40px;
                display: inline-block;
                vertical-align: top;
              }
              .right-answer {
                font-size: 35px;
                margin-right: 30px;
                margin-left: 15px;
                color: #1fd094;
              }
              .wrong-answer {
                font-size: 20px;
                color: #ff6666;
                margin-left: 15px;
              }
            }
            .analyz-title {
              margin-bottom: 10px;
            }
            .analyz-con {
              border: 1px solid #e1e5ec;
              font-size: 28px;
              padding: 10px;
            }
          }
        }
      }

      .testSmall {
        width: 30px;
        min-height: 600px;
        font-size: 40px;
        border: 1px solid #e1e5ec;
        display: inline-block;
        min-height: 600px;
        text-align: center;
        vertical-align: top;
        top: 0;
        bottom: 0;
        position: absolute;
        z-index: 2;
        span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .details {
        width: 970px;
        min-height: 600px;
        padding-left: 30px;
        position: relative;
        border: 0px solid #e1e5ec;
        /*background: red;*/
        .container_ {
          position: relative;
          margin-left: 15px;
          font-size: 0;
          height: 100%;
          border: 1px solid #e1e5ec;
          & > div > * {
            font-size: 40px;
            vertical-align: top;
          }
          .nextshiti {
            position: absolute;
            right: 207px;
            top: 13px;
            width: 150px;
            height: 45px;
            text-align: center;
            line-height: 45px;
            background: #50bfff !important;
            border-radius: 15px;
            cursor: pointer;
            font-size: 24px;
            &.disabled {
              background: #e1e5ec;
            }
          }
          .allcreen {
            width: 30px;
            position: absolute;
            right: 111px;
            top: 18px;
            cursor: pointer;
          }
          .close {
            position: absolute;
            right: 38px;
            top: 20px;
            cursor: pointer;
            width: 25px;
          }
          .shiti-menu {
            position: relative;
            .analysisType1_me1_6 {
              width: 1200px;
              display: inline-block;
              margin-top: 12px;
              margin-left: 15px;
            }
            .right1 {
              position: absolute;
              right: 24px;
              top: 12px;
              font-size: 40px;
              color: #1fd094;
              cursor: pointer;
            }
            .menu {
              margin-top: 10px;
            }
          }

          .jiexi {
            margin-top: 20px;
            min-height: 100px;
            max-width: 1200px;
            padding-left: 15px;
            padding-top: 15px;
            /*border: 1px solid #e1e5ec;*/
            font-size: 28px !important;
            color: #1fd094;
            p {
              font-size: 28px !important;
              color: #ff6666;
            }
          }
          .datiqingkuang {
            overflow: hidden;
            border-top: 1px solid #e1e5ec;
            margin-top: 20px;
            padding-top: 20px;
            .accuracy {
              float: left;
              /*width: 770px;*/
              box-sizing: border-box;
              /*height: 594px;*/
              background-color: rgba(255, 255, 255, 1);
              border-radius: 3px 3px 3px 3px;
              /*border: solid 2px rgba(235, 240, 244, 1);*/
              margin-left: 15px;
              padding: 0px 64px 38px;
              margin-top: 60px;
              ul.top {
                font-size: 0;
                /*border-bottom: 2px solid rgba(235, 240, 244, 1);*/
                /*padding: 6px 0px;*/
                margin-bottom: 10px;
                * {
                  font-size: 40px;
                  display: inline-block;
                }
                li {
                  width: 160px;
                  height: 40px;
                  line-height: 40px;
                  font-size: 24px;
                  border-radius: 12px;
                  text-align: center;
                  margin-right: 15px;
                  cursor: pointer;
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
              .studentScale {
                text-align: center;
                /*width: 880px;*/
                /*height: 470px;*/
                background-color: rgba(242, 249, 254, 1);
                margin-top: 26px;
                padding: 0px 80px 34px;
                box-sizing: border-box;

                & > p {
                  height: 76px;
                  font-size: 30px;;
                  line-height: 76px;
                  letter-spacing: 0.7px;
                  color: #505050;
                  background: #f2f9fe;
                  span {
                    background: #f2f9fe;
                    color: #1fd094;
                  }
                }
                ul.student {
                  text-align: left;
                  font-size: 0;
                  background: #f2f9fe;
                  width: 760px;
                  * {
                    font-size: 40px;
                    display: inline-block;
                    vertical-align: middle;
                  }
                  li {
                    width: 120px;
                    height: 50px;
                    line-height: 50px;
                    background-color: rgba(31, 208, 148, 1);
                    margin-right: 2px;
                    margin-bottom: 2px;
                    text-align: center;
                    font-size: 40px;
                    color: #fff;
                    &.right {
                      background: #1fd094;
                    }
                    &.wrong {
                      background: #ff6666;
                    }
                    &.no {
                      background: #b3cde6;
                    }
                  }
                }
              }
            }
            .detailMenu {
              font-size: 24px;
              height: 45px;
              line-height: 45px;
              width: 200px;
              float: right;
              cursor: pointer;
              margin-right: 24px;
              text-align: center;
              background: #1ed195 !important;
              display: inline-block;
              border-radius: 15px;
              color: #fff;
              margin-bottom: 30px;
            }
          }
        }
      }

    }
    .kushebi {
      box-sizing: border-box;
      position: fixed;
      padding-left: 240px;
      padding-top: 70px;
      width: 100%;
      height: 100%;
      top: -20px;
      left: 0;
      z-index: 99;
      background: #000;
      .close {
        position: absolute;
        right: 35px;
        top: 85px;
        width: 27px;
        cursor: pointer;
      }
      .container_ {
        width: 100%;
        height: 100%;
        padding-top: 10px;
        overflow: auto;
        .KushenbiShiti {
          width: 900px;
          margin: 0 auto;
          text-align: left;
          .answer-con {
            /*border-top: 1px solid #e1e5ec;*/
            padding-top: 10px;
            margin-top: 60px;
            margin-bottom: 10px;
          }
          .colorGreen {
            color: #1fd094;
          }
        }
        .tanchuang {
          margin-top: 20px;
        }
      }

    }
    .studentScale{
      ul.quesOptionList{
        background: transparent;
        text-align: left;
        li{
          background: transparent;
          display: inline-block;
          margin-right: 78px;
        }
      }
    }
  }

</style>
<style lang="scss">
  .reportDetail_duoheyi {
    .jiexi {
      p {
        font-size: 28px !important;
      }
    }
    .checkWrong, .right-answer, .wrong-answer {
      font-size: 40px !important;
    }
    .shiti_h {
      margin-top: 10px;
      padding-bottom: 40px;

      .nodata {
        margin: 20px 16px;
        background-color: rgba(255, 255, 255, 1);
        text-align: center;
        padding: 100px;
        font-size: 20px;
      }
    }
  }
</style>
