<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">报告详情 <goback></goback></h2>

    </div>
    <div class="content-right-body-wrap">
      <!-- 分数 -->
      <div class="report-title">
        <div class="time-answer-wrap">
          <div class="tiem">
            考试时间:{{dataParse(result.makePaperTime)}}
          </div>
          <div class="use-time">
            用时:{{result.useTime | userTimeFilter }}
          </div>
          <div class="answer">
            试卷用{{result.wrongCount + result.rightCount}}题,答对{{result.rightCount}}题,答错{{result.wrongCount}}题
          </div>
        </div>
        <div @click="lookPaper"
             class="look-paper">
          查看试卷
        </div>
        <canvas-ground class="canvas" :circle="circleConfig"></canvas-ground>
        <div class="name">
          考试名称:{{result.paperName}}
        </div>
      </div>
      <!-- 知识模块 -->
      <div v-if="result.knowledgeGrasp && result.knowledgeGrasp.length"
           class="report-knowledge report-item">
        <div class="report-item-title">
          <div class="main">
            诊断报告
          </div>
          <span class="fenge">

          </span>
          <div class="tag">
            知识掌握情况表
          </div>

        </div>
        <div class="report-item-body">
          <div class="title">
            <h2>知识掌握情况表</h2>
            <div class="line-wrap">
              <div class="dian"></div>
              <div class="line"></div>
              <div class="dian"></div>
            </div>
            <p>模块知识长板短板分析图</p>
            <p>形成个性化课程的主要依据</p>
          </div>
          <div class="report-knowledge-main">
            <div class="header">
              <div class="ling">
                0%
              </div>
              50%
              <div class="hundred">
                100%
              </div>
            </div>
            <div class="main">
              <div class="line"
                   :style="{left:i*20 + '%'}"
                   v-for="i in 4"></div>
              <div class="dian"></div>
              <div
                v-for="(know,index) in result.knowledgeGrasp"
                class="main-item">
                <div class="main-item-title">
                  {{know.childrenCtbCodeName}}
                </div>
                <div class="main-item-body">
                  <span class="num-total"
                        :style="{width:know.score + '%',backgroundColor:colors[index%colors.length]}"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 知识点排行榜 -->
      <div v-if="result.wrongKnowledgeRank && result.wrongKnowledgeRank.length"
           class="knowledge-seniority report-item">
        <div class="report-item-title">
          <div class="main">
            诊断报告
          </div>
          <span class="fenge">

          </span>
          <div class="tag">
            错误知识点排行榜
          </div>

        </div>
        <div class="report-item-body">
          <div class="title">
            <h2>错误知识点排行榜</h2>
            <div class="line-wrap">
              <div class="dian"></div>
              <div class="line"></div>
              <div class="dian"></div>
            </div>
            <p>知识点错误频次排列</p>
            <p>定位最需提高的知识点的依据</p>
          </div>
          <div class="knowledge-seniority-main">
            <div v-for="rank in result.wrongKnowledgeRank"
                 class="seniority-main-item">
              <div class="title">
                {{rank.knowledgeName}}
              </div>
              <div class="error-wrap">
                错误次数: <span class="error">{{rank.wrongCount}}次</span>
              </div>
              <div class="go-btn" @click="goCaptrue(rank)">去攻克</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 有效增长点结构表 -->
      <div v-if="result.moduleScoreIncrease
      && result.moduleScoreIncrease.length
      &&($route.query.gradeCode == 33 || $route.query.gradeCode == 24)"
           class="report-knowledge report-item">
        <div class="report-item-title">
          <div class="main">
            诊断报告
          </div>
          <span class="fenge">

          </span>
          <div class="tag">
            有效增长点结构表
          </div>

        </div>
        <div class="report-item-body">
          <div class="title">
            <h2>各模块分数上升区间及有效增长点</h2>
            <div class="line-wrap">
              <div class="dian"></div>
              <div class="line"></div>
              <div class="dian"></div>
            </div>
            <p>根据学生各模块实测得分</p>
            <p>对提分空间及分数有效增长点作精准分析</p>
          </div>
          <div class="report-knowledge-main">
            <div class="header">
              <div
                v-for="i in 6"
                :class="{first:i==1,last:i==6}"
                class="percent-num-item">
                {{modelMaxTotalScore / 5 * (i - 1)}}
              </div>

            </div>
            <div class="main ge-por">
              <div class="left-wrap">
                <div class="left-item">
                  <div class="yuan" style="background: #7fcfc6;">

                  </div>
                  较易提升部分
                </div>
                <div class="left-item">
                  <div class="yuan">

                  </div>
                  较难提升部分
                </div>
              </div>
              <div class="line"
                   :style="{left:i*20 + '%'}"
                   v-for="i in 4"></div>
              <div class="dian"></div>
              <div
                v-for="(know,index) in result.moduleScoreIncrease"
                class="main-item">
                <div class="main-item-title">
                  {{know.ctb_Name}}
                </div>
                <div class="main-item-body ge-por" :style="{background:'0 none'}">
                  <span class="num-total"
                        style="background-color: #eaeaea;"
                        :style="{width:(know.blue+know.gray)/modelMaxTotalScore*100 + '%'}">
                  </span>
                  <span class="num-total"
                        style="position: absolute;top: 0;left: 0;height: 30px;"
                        :style="{width:know.blue/modelMaxTotalScore*100 + '%'}">
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 能力达标情况 蜘蛛图 -->
      <div
        class="report-knowledge report-item">
        <div class="report-item-title">
          <div class="main">
            诊断报告
          </div>
          <span class="fenge">

          </span>
          <div class="tag">
            能力达标情况
          </div>

        </div>
        <div class="report-item-body">
          <div class="title">
            <h2>学科能力发展及目标</h2>
            <div class="line-wrap">
              <div class="dian"></div>
              <div class="line"></div>
              <div class="dian"></div>
            </div>
            <p>模块知识综合能力分析图</p>
            <p>形成整体学习方案的重要依据</p>
          </div>
          <div class="report-knowledge-main">

            <div id="subjectAbility"></div>
          </div>
        </div>
      </div>
      <!-- 考试分数波动曲线 -->
      <div class="report-knowledge report-item">
        <div class="report-item-title">
          <div class="main">
            诊断报告
          </div>
          <span class="fenge">

          </span>
          <div class="tag">
            考试分数波动曲线
          </div>

        </div>
        <div class="report-item-body">
          <div class="title">
            <h2>历次考试分数波动曲线</h2>
            <div class="line-wrap">
              <div class="dian"></div>
              <div class="line"></div>
              <div class="dian"></div>
            </div>
          </div>
          <div class="report-knowledge-main">
            <div id="hisScore">
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
  export default {
    components: {
      canvasGround,goback
    },
    data(){
      return {
        result: {},
        colors: ["#27ba9bi", "#5ac6ba", "#99d8ea", "#93aed4", "#ff8585", "#c486d7"],
      }
    },
    mounted(){
      let sendData = {
        url: this.$route.query.code
      }
      if (!sendData.url) {
        this.$router.push('/main/tutoring');
        return;
      }

      this.$ajax.getReportDetail(sendData)
        .then(({httpCode, result}) => {
          if (httpCode == 200) {
            this.result = result;
            this.createHistoricalScore();
            this.createSubjectAbility();
          } else {
            this.$message('获取报告失败,请刷新页面重试!');
          }
        })
    },
    props: {},
    methods: {
      //历史成绩生成图表
      createHistoricalScore(){
        let historicalScore = this.result.historicalScore;
        let examDate = [];
        let score = [];
        for (let i = 0; i < historicalScore.length; i++) {
          examDate.push(`第${1+i}次`);
          score.push(historicalScore[i].score);
        }
        score = score.reverse();
        Highcharts.chart('hisScore', {
          chart: {
            type: 'line'
          },
          title: {
            text: '',
            x: 0
          },
          yAxis: {
            title: "",
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
            max: 150,
            title: {
              text: '考试分数（分)',
            }
          },
          xAxis: {

            title: {
              text: '测验次数',
              align: 'high'
            },
            categories: examDate
          },
          series: [{
            showInLegend: false,
            data: score,
            color: '#ff6666'

          }],
          credits: {enabled: false},
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true // 开启数据标签
              },
              enableMouseTracking: false // 关闭鼠标跟踪，对应的提示框、点击事件会失效
            }
          }
        });
      },
      //蜘蛛图
      createSubjectAbility(){
        console.log(JSON.stringify(this.result.subjectAbility));
        let subjectAbility = this.result.subjectAbility;
        let myRadar_labelChart = [];
        let myRadar_dataChart = [];
        for (let i = 0; i < subjectAbility.length; i++) {
          myRadar_labelChart.push(subjectAbility[i].capacityName);
          myRadar_dataChart.push(parseInt(subjectAbility[i].score));
        }
        Highcharts.chart("subjectAbility", {
          //图表展示容器，与 div 的 id 保持一致
          chart: {
            polar: true,
            type: 'line'
          },
          credits: {
            enabled: false
          },
          title: {
            text: ' ',
          },
          pane: {
            size: '90%'
          },
          xAxis: {
            categories: myRadar_labelChart,
            tickmarkPlacement: 'on',
            lineWidth: 0
          },
          tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}%</b><br/>'
          },
          yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
            max: 100,
            tickInterval: 10,
            minorTickInterval: 10,
            tickmarkPlacement: 'on',
            labels: {}
          },
          legend: {
            align: 'right',
            verticalAlign: 'top',
            y: 70,
            layout: 'vertical'
          },
          series: [{
            name: '能力',
            type: "area",
            data: myRadar_dataChart,
            pointPlacement: 'on',
            showInLegend: false
          }]
        });
      },
      //查看试卷
      lookPaper(){
        if(this.$route.query.needImg){
          this.$alert('本试卷包含主观题,电脑端暂不支持此类试卷展示。如需查看,请在移动端查看试卷。', '提示', {
            confirmButtonText: '确定',
          });
          return;
        }
        let query = {
          "code": this.result.diagnosisPaperCode,
          "studentDiagnosisRecordCode": this.result.makePaperRecordCode
        }
        this.$router.push({
          path: '/main/watchPaperDetail',
          query
        })
      },
      //去练一练
      goCaptrue(rank){

        let result = this.result,
          routeQuery = this.$route.query,
          query = {
            "subjectCode": routeQuery.subjectCode,
            "gradeCode": routeQuery.gradeCode,
            "code": result.makePaperRecordCode,
            "diagnosisStatus": routeQuery.diagnosisStatus || 2,
            "knowledgeCode": rank.knowledgeCode,
            "knowledgeName": rank.knowledgeCode,
            "diagnosisPaperCode": result.diagnosisPaperCode
          }
        this.$router.push({
          path: '/main/capture',
          query
        })
      }
    },
    computed: {
      circleConfig(){
        let result = this.result;
        return {
          totalScore: +result.paperScore || 100,
          width: 120,
          score: result.score || 0
        }
      },
      modelMaxTotalScore(){
        let temp = 0;
        //计算模块分数的相加最大值
        this.result
        && this.result.moduleScoreIncrease
        && this.result.moduleScoreIncrease.forEach(({blue, gray, yellow}) => {
          let num = blue + gray + yellow;
          temp = num > temp ? num : temp;
        })
        return Math.ceil(temp / 5) * 5;
      }
    },
    filters: {
      userTimeFilter(time){
        time = time > 60 ? ((time / 60) >> 0) + "'" + ((time % 60 ) >> 0) + "''" : ((time) >> 0) + "''";
        return time;
      }
    }

  }
</script>
<style lang="scss" scoped>

  @import '../../../../../static/css/contentRight.scss', '../../../../../static/css/gemixin.scss';

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
      .fenge {
        @include wh(2px, 16px);
        display: inline-block;
        vertical-align: middle;
        background: $color1;
        margin: 0 10px;
      }
      .tag {
        display: inline-block;
        font-size: 18px;
        color: #7b94b6;
      }

    }
    .report-item-body {
      @extend %bg-w;
      padding-top: 35px;
      padding-bottom: 80px;
      .title {
        text-align: left;
        padding-bottom: 60px;
        h2 {
          color: #7b94b6;
          font-size: 18px;
        }
        p {
          line-height: 27px;
          color: #999999;
          font-size: 16px;

        }
        .line-wrap {
          position: relative;
          width: 210px;
          height: 3px;
          margin: 10px 0;
          .line {
            width: 100%;
            border-bottom: 3px dashed #e0e0e0;
          }
          .dian {
            position: absolute;
            top: -1.5px;
            $h: 6px;
            @include wh($h, $h);
            border-radius: $h/2;
            background-color: #cccccc;
            overflow: hidden;
            &:first-child {
              left: 0;
            }
            &:last-child {
              right: 0;
            }
          }
        }
      }
    }

  }

  .report-title {
    @extend %bg-w;
    padding: {
      top: 150px;
    }
    position: relative;
    .time-answer-wrap {
      text-align: left;
      font-size: 16px;
      color: #666666;
      line-height: 30px;
      position: absolute;
      left: 35px;
      top: 45px;
      .tiem {

      }
    }
    .look-paper {
      @include ge-btn(160px, 40px);
      position: absolute;
      right: 40px;
      top: 45px;
    }
    .canvas {
      @include wh(120px, 120px);
      @include margin-center;
    }
    .name {
      text-align: center;
      color: #7b94b6;
      font-size: 18px;
      padding: {
        top: 50px;
        bottom: 76px;
      }
    }
  }

  .report-knowledge {
    .report-knowledge-main {
      max-width: 650px;
      @include margin-center;
      .header {
        position: relative;
        height: 40px;
        line-height: 40px;
        .ling {
          display: inline-block;
          position: absolute;
          top: 0;
          left: 0;
        }
        .hundred {
          display: inline-block;
          position: absolute;
          top: 0;
          right: 0;
        }
        .percent-num-item {
          width: 20%;
          display: inline-block;
          float: left;
          &.first {
            width: 10%;
            text-align: left;
          }
          &.last {
            width: 10%;
            text-align: right;
          }
        }
      }
      .main {
        $color2: #7fcfc6;
        padding: 40px 0;
        position: relative;
        border: {
          top: 3px solid $color2;
          left: 3px solid $color2;
          right: 1px solid $color2;
          bottom: 1px solid $color2;
        }
        .left-wrap {
          position: absolute;
          left: 110%;
          width: 200px;
          text-align: left;
          font-size: 16px;
          color: #808080;
          .left-item {
            line-height: 40px;
            .yuan {
              $w: 20px;
              width: $w;
              height: $w;
              background: #ccc;
              margin-right: 20px;
              vertical-align: middle;
              display: inline-block;
              border-radius: $w/2;
              overflow: hidden;
            }
          }
        }
        .line {
          position: absolute;
          height: 100%;
          top: 0;
          width: 1px;
          background: $color1;
          opacity: 0.2;
        }
        .dian {
          position: absolute;
          $w: 15px;
          left: -$w/2;
          top: -$w/2;
          @include wh($w, $w);
          overflow: hidden;
          border-radius: $w/2;
          background: $color2;
        }
        .main-item {
          position: relative;
          text-align: left;
          &-title {
            line-height: 40px;
            color: #666;
            font-size: 16px;
            padding: 0 10px;
          }
          &-body {
            $h: 30px;
            height: $h;
            width: 100%;
            border-radius: $h/2;
            background: #eaeaea;
            .num-total {
              display: inline-block;
              height: 100%;

              border-radius: $h/2;
              background: #7fcfc6;
              width: 100px;
            }
          }
        }
      }
    }

  }

  .knowledge-seniority {
    .knowledge-seniority-main {
      max-width: 650px;
      text-align: left;
      @include margin-center;
      .seniority-main-item {
        padding: 40px 0;
        position: relative;
        border-bottom: 1px solid #d9d9d9;
        .title {
          color: #333333;
          font-size: 18px;
          padding-bottom: 20px;
        }
        .error-wrap {
          font-size: 16px;
          color: #666666;
          .error {
            color: #ff6666;
          }
        }
        .go-btn {
          position: absolute;
          right: 0;
          top: 50px;
          @include ge-btn(100px, 40px);
        }
      }

    }
  }

</style>
