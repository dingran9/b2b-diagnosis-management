<template>
  <div style="max-width: 1400px;margin:100px auto;">
    <div class="content-right-title-wrap">
      <h2 class="title">
        课中测报告详情  <!-- ><span class="report-subtitle">{{'3班 27日 课堂测试测试2'}}</span>-->
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
                <!--共 <span class="bule">{{$route.query.sutdentNum}}</span> 人-->
                试卷共 <span class="bule">{{questionNum}}</span> 题
                <span class="tag"></span>
                本次测试班级排名 第 : <span class="bule">{{mingci}}</span> 名
              </div>
              <div class="mingci-wrap ge-clearfix">
                <div
                  :class="$route.query.userId == item.studentCode ? 'mine':''"
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
              <!--<div class="test-time">-->
              <!--<img src="../../../static/img/icon/report_time_icon.png" height="26" width="26"-->
              <!--style="vertical-align: middle;margin-right:10px;"/>-->
              <!--测试时间: {{dataParse($route.query.paperTime)}}-->
              <!--</div>-->
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
              <!--<div class="ge-clearfix"></div>-->
              <!--<span class=" watch-report-detail" @click="watchPaper">查看本次测题</span>-->
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
            <hr style="margin-bottom: 30px;">
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


    </div>
  </div>
</template>
<script>
  import PieChart from './pieChart.vue';
  import PieKnowChart from './pieKnowChart.vue';
  import LineChart from './lineChart.vue';

  export default {
    components: {
      PieChart, PieKnowChart, LineChart
    },
    data() {
      return {
        result: {},
        colors: ["#27ba9bi", "#5ac6ba", "#99d8ea", "#93aed4", "#ff8585", "#c486d7"],
      }
    },
    created() {
      this.user = this.$user().get();
      console.log(this.user);
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
            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })
      },
      watchPaper() {
        this.$router.push({
          path: '/main/watchKezhongcePaperDetail',
          query: this.$route.query
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
      questionNum() {
        try {
          return this.result.accuracy.length || this.$route.query.questionNum;
        } catch (e) {
          return this.$route.query.questionNum;

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
          return this.ranking.find(item => this.$route.query.userId == item.studentCode).num;
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
          temp[0].percentValue = ((this.result.right / this.questionNum) * 100 ).toFixed(2);
          temp[1].value = this.result.wrong;
          temp[1].percentValue = ((this.result.wrong / this.questionNum) * 100 ).toFixed(2);
          temp[2].value = this.questionNum - this.result.right - this.result.wrong;
          temp[2].percentValue = (100 - temp[0].percentValue - temp[1].percentValue).toFixed(2);

        } catch (e) {
        }
        return temp;
      },
      questionRightPercentList() {
        try {
          return this.result.accuracy.map((item, index) => {
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
