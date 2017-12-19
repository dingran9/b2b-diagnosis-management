<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">
        <img
          src="../../../../../static/img/back_icon.png"
          style="vertical-align: middle;cursor: pointer;"
          @click="$router.go(-1)"/>
        课中检测报告详情  <!-- ><span class="report-subtitle">{{'3班 27日 课堂测试测试2'}}</span>-->

      </h2>
    </div>
    <div class="content-right-body-wrap">
      <!-- 测试总览 -->
      <div
        class="report-knowledge report-item">
        <div class="report-item-title">
          <div class="main">
            我的测试总览
          </div>

        </div>
        <div class="report-item-body">
          <div class="zonglan-main ge-clearfix">
            <div class="left-body">
              <div class="zonglan-class-wrap">
                {{user.gradeName + user.className}}
                共 <span class="bule">{{$route.query.sutdentNum}}</span> 人
                试卷共 <span class="bule">{{$route.query.questionNum}}</span> 题
                <span class="tag"></span>
                本次测试班级排名 第 : <span class="bule">{{mingci}}</span> 名
              </div>
              <div class="mingci-wrap ge-clearfix">
                <div
                  :class="user.userId == item.studentcode ? 'mine':''"
                  class="mingci-item "
                  v-for="item in ranking.slice(0,3)">
                  {{item.studentName}}
                  <div class="tip">
                    第{{item.num}}名
                  </div>
                </div>
                <div class="mingci-item " v-if="ranking.length > 3">
                  ...
                </div>
                <div class="mingci-item mine" v-if="ranking.length > 3">
                  {{ranking[3].studentName}}
                  <div class="tip">
                    第{{ranking[3].num}}名
                  </div>
                </div>
              </div>
              <div class="test-time">
                <img src="../../../../../static/img/icon/report_time_icon.png" height="26" width="26"
                     style="vertical-align: middle;margin-right:10px;"/>
                测试时间: {{dataParse($route.query.paperTime)}}
              </div>
            </div>
            <div class="right-body">
              <div class="pie-prepent-wrap">
                <div class="pie-prepent-item" v-for="questionStatus in questionsErrorOrRightStatus">
                  <span class="pie-detail">{{questionStatus.text}}</span>:
                  <span style="display: inline-block;width: 50px;"
                        :style="{color:questionStatus.color}">
                    {{questionStatus.percentValue}}%
                  </span>
                </div>
              </div>
              <pie-chart :chart-data="questionsErrorOrRightStatus"></pie-chart>
              <div class="pie-text-wrap">
                <div class="pie-text-item" v-for="questionStatus in questionsErrorOrRightStatus">
                  <span class="fangkuai" :style="{backgroundColor:questionStatus.color}"></span>
                  <span class="pie-detail">{{questionStatus.text}}</span> :
                  <span :style="{color:questionStatus.color}">{{questionStatus.value}}题</span>
                </div>
              </div>
              <div class="ge-clearfix"></div>
              <span class=" watch-report-detail" @click="watchPaper">查看本次测题</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 知识模块 -->
      <div class="report-knowledge report-item" v-if="knowledges.length">
        <div class="report-item-title">
          <div class="main">
            知识点报告
          </div>

        </div>
        <div class="report-item-body">
          <div class="report-knowledge-main">
            <div class="model-title">
              个人知识掌握情况
            </div>
            <line-chart :datalist="knowledges" score="rightRatio" title="knowledgeName"></line-chart>
            <div class="explain-text">
              本次测试题中,涵盖该知识点的,其中正确题数与总题数的百分比。
            </div>
            <div class="model-title">
              知识点占比
            </div>
            <pie-know-chart :datalist="knowledgeProportion"></pie-know-chart>
            <div class="explain-text fix1">
              本次测试中,所有知识点的占比情况。
            </div>
          </div>
        </div>
      </div>

      <!-- 班级正确率报告 -->
      <div
        v-if="questionRightPercentList.length"
        class="report-knowledge report-item">
        <div class="report-item-title">
          <div class="main">
            班级正确率报告
          </div>
        </div>
        <div class="report-item-body">
          <div class="clss-right-main ge-clearfix">
            <div class="left-wrap">
              <div class="right-percent-title">
                每道题正确详细人数:
              </div>
              <div v-for="(item,index) in questionRightPercentList" class="right-percent-item">
                第 {{index + 1}} 题: {{item.rightCount}}人
              </div>
            </div>
            <div class="right-wrap">
              <line-chart :datalist="questionRightPercentList" title="text" score="rightPercent" type="1"></line-chart>
              <div class="ge-clearfix right-footer">
                <div class="ge-pull-left ">
                  <span class="fangkuai"></span>我做对的题
                </div>

                <span class="fangkuai" style="background:#f66;"></span>我做错的题

                <div class="ge-pull-right">
                  <span class="fangkuai" style="background:rgb(179, 205, 230);"></span>我未回答的题
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  import goback from '../../../common/goback.vue';
  import canvasGround from '../../../common/canvasGround.vue';
  import PieChart from './pieChart.vue';
  import PieKnowChart from './pieKnowChart.vue';
  import LineChart from './lineChart.vue';

  export default {
    components: {
      canvasGround, goback, PieChart, PieKnowChart, LineChart
    },
    data() {
      return {
        result: {},
        colors: ["#27ba9bi", "#5ac6ba", "#99d8ea", "#93aed4", "#ff8585", "#c486d7"],
      }
    },
    created() {
      this.user = this.$user().get();
    },
    mounted() {
      this.getReportDetail();
    },
    props: {},
    methods: {
      getReportDetail() {
        this.$ajax.studentClassTestClassReport(this.$route.query)
          .then(({httpCode, result}) => {
            if (httpCode === '200') {
              if (!result) return;
              this.result = result;
              if (this.$route.query.source == 2) {
                this.getQuestionRightStatus();
              }
            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })
      },
      getQuestionRightStatus() {
        let send = {inClassTestCode: this.$route.query.inClassTestCode}
        this.$ajax.getPaperAndAnswer(send)
          .then(({httpCode, result}) => {
            console.log(httpCode, result);
            if (httpCode === '200') {
              if (!result) return;
              let questions = [];
              this.forEachQuestions(result, (question, type) => {
                if (type == 1)
                  questions.push(question);
              })
              console.log(questions);

              this.$ajax.reportByGodPenAccuracy(send)
                .then(({httpCode, result}) => {
                  console.log(httpCode, result);
                  if (httpCode === '200') {
                    if (!result) return;
                    result.accuracy = result.accuracy.sort((a, b) => {
                      return questions.findIndex(item => item.id == a.questionCode) - questions.findIndex(item => item.id == b.questionCode)
                    })
                    if (this.result) {
                      this.$set(this.result, 'accuracy', result.accuracy)
                    }

                  } else {
                    console.log('请求错误,偷偷地找后端沟通吧!');
                  }
                })
            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })
      },
      watchPaper() {
        let {query} = this.$route;
        if (query.source == 2) {
          this.$router.push({
            path: '/main/watchKezhongcePaperDetail2',
            query
          })
          return;
        }
        this.$router.push({
          path: '/main/watchKezhongcePaperDetail',
          query
        })
      }
    },
    computed: {
      ranking() {
        try {
          return this.result.ranking || [];
        } catch (e) {
          return [];

        }
      },
      knowledges() {
        try {
          return this.result.knowledgeReport || [];
        } catch (e) {
          return [];

        }
      },
      knowledgeProportion() {
        try {
          return this.result.knowledgeProportion || [];
        } catch (e) {
          return [];

        }
      },
      mingci() {
        try {
          return this.ranking.find(item => this.user.userId == item.studentcode).num;
        } catch (e) {
          return ''
        }
      },
      questionsErrorOrRightStatus() {
        let temp = [{
          text: '正确',
          color: '#1fd094',
          value: 0
        }, {
          text: '错误',
          color: '#f66',
          value: 0
        }, {
          text: '未作答',
          color: '#b3cde6',
          value: 0
        }];
        try {
          temp[0].value = this.result.right;
          temp[0].percentValue = ((this.result.right / this.$route.query.questionNum) * 100 ).toFixed(2);
          temp[1].value = this.result.wrong;
          temp[1].percentValue = ((this.result.wrong / this.$route.query.questionNum) * 100 ).toFixed(2);
          temp[2].value = this.$route.query.questionNum - this.result.right - this.result.wrong;
          temp[2].percentValue = (100 - temp[0].percentValue - temp[1].percentValue).toFixed(2);

        } catch (e) {
        }
        return temp;
      },
      questionRightPercentList() {
        try {
          return this.result.accuracy.map((item, index) => {
            console.log(item.rightCount, this.$route.query.sutdentNum, ( item.rightCount / this.$route.query.sutdentNum ).toFixed(2));
            if (item.myright !== undefined) {
              item.flag = item.myright;
            }
            return {
              color: item.flag == -1 ? '#b3cde6' : item.flag == 0 ? '#f66' : "#1fd094",
              flag: item.flag,
              rightCount: item.rightCount,
              text: `第${index + 1}题`,
              rightPercent: ( item.rightCount / this.$route.query.sutdentNum * 100 ).toFixed(2),
            }
          })
        } catch (e) {
          return [];
        }
      }
    },
    filters: {
      userTimeFilter(time) {
        time = time > 60 ? ((time / 60) >> 0) + "'" + ((time % 60 ) >> 0) + "''" : ((time) >> 0) + "''";
        return time;
      }
    }

  }
</script>
<style lang="scss" scoped>
  .model-title {
    font-size: 20px;
    font-weight: bold;
    padding: {
      bottom: 50px;
    }
  }

  @import '../../../../../static/css/contentRight.scss', '../../../../../static/css/gemixin.scss';
  .content-right-title-wrap {
    .title {
      font-size: 20px;
    }
    .report-subtitle {
      color: #3cc0fe;
    }
  }

  .zonglan-main {
    $w: 1237px;
    $w_l: 750px;
    $w_r: $w - $w_l;
    width: $w;
    padding: {
      top: 80px;
    }
    margin: auto;
    text-align: left;
    .bule {
      color: #3cc0fe;
    }
    > .left-body {
      max-width: $w_l;
      float: left;
      .zonglan-class-wrap {
        padding: {
          bottom: 45px;
        }
      }
      .mingci-wrap {
        .mingci-item {
          position: relative;
          float: left;
          width: 118px;
          height: 57px;
          line-height: 57px;
          overflow: hidden;
          text-align: center;
          border: 0.5px solid #e6e6e6;
          font-size: 18px;
          + .mingci-item {
            border-left: 0 none;
          }
          &.mine {
            /*transform: scale(1.1, 1.1);*/
            border: 0 none;
            background: #3cc0fe;
            color: #fff;
            .tip {
              color: #3cc0fe;
              background: #fff;
            }
          }
          .tip {
            color: #fff;
            position: absolute;
            top: 0;
            right: 0;
            font-size: 12px;
            width: 100px;
            height: 35px;
            line-height: 50px;
            background: #1fd094;
            transform: translate(35px, -6px) rotate(40deg);
          }
        }
      }
      .test-time {
        padding: {
          top: 100px;
          bottom: 40px;
        }
      }
      .tag {
        display: inline-block;
        width: 40px;
      }
    }
    > .right-body {
      width: $w_r;
      float: right;
      position: relative;
      .pie-prepent-wrap {
        text-align: center;
        width: 160px;
        top: 70px;
        left: 40px;
        position: absolute;
        z-index: 2;
      }
      .pie-text-wrap {
        float: left;
        padding: {
          top: 70px;
          left: 40px;
        }
        .pie-text-item {
          .fangkuai {
            display: inline-block;
            $w: 12px;
            width: $w;
            height: $w;
            background-color: red;
          }

        }
      }
      .pie-detail {
        text-align: justify;
        text-align-last: justify;
        display: inline-block;
        width: 60px;
      }
      .watch-report-detail {

        cursor: pointer;
        display: block;
        margin: auto;
        margin-top: 20px;
        width: 40%;
        text-align: center;
        $h: 40px;
        height: $h;
        line-height: $h;
        border: 1px solid #00B83F;
        color: #00B83F;
        border-radius: 5px;
      }
    }
  }

  .report-knowledge-main {
    max-width: 800px;
    margin: auto;
  }

  .clss-right-main {
    $w: 1065px;
    $w_l: 300px;
    width: $w;
    margin: auto;
    > .left-wrap {
      background: #d6f2ff;
      float: left;
      width: $w_l;
      padding: 48px;
      .right-percent-title {
        font-size: 20px;
        padding: 10px 0;
      }
      .right-percent-item {
        line-height: 40px;
      }
    }
    > .right-wrap {
      width: $w - $w_l;
      float: left;
      padding: {
        left: 50px;
      }
      .right-footer {
        margin: {
          top: 20px;
        }
        line-height: 22px;
      }
      .fangkuai {
        $w: 22px;
        margin: {
          right: 10px;
          top: -3px;
        }
        vertical-align: middle;
        display: inline-block;
        width: $w;
        height: $w;
        background: rgb(31, 208, 148);
      }
    }
  }

  %bg-w {
    background: #fff;
    padding: {
      left: 40px;
      right: 40px;
    }
  }

  .report-item {
    padding: {
      top: 40px;
    }
    .report-item-title {
      @extend %bg-w;
      text-align: left;
      height: 65px;
      line-height: 65px;
      border: {
        bottom: 1px solid #e1e5ec;
      }
      .main {
        display: inline-block;
        font-size: 18px;
        color: #505050;

      }

    }
    .report-item-body {
      @extend %bg-w;
      padding-top: 35px;
      padding-bottom: 80px;
      overflow: auto;
      .explain-text {
        font-size: 18px;
        padding: {
          top: 40px;
          bottom: 150px;
        }
        &.fix1 {
          padding: {
            bottom: 0px;
          }
        }
      }
    }

  }


</style>
