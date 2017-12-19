<template>
  <div style="background-color: #f0f4fb;min-height: 100%">
    <div class="app-title">
      <div class="head">
        学业质量提升平台
      </div>
    </div>

    <div class="paper-container">
      <paper class="paper-wrap" :paper-data="paperData">
        <template slot="head" scope="scope">
          <div class="paper-head">
            <h1>{{commonGrond[scope.gradeCode]}} {{commonSubject[scope.subjectCode]}} {{scope.paperName}}</h1>
            <p>{{commonSubject[scope.subjectCode]}} 总分{{scope.totalScore}}分 时间{{scope.totalTime}}分钟</p>
          </div>
        </template>
        <template slot="questionTypeHead" scope="scope">
          <div>
            <div class="question-type">
              {{scope.index + 1}}. {{scope.type | questionTypeEnum}}
            </div>
          </div>
        </template>
        <template slot="questionBody" scope="scope">
          <div class="question-item ge-clearfix">
            <div class="left-wrap">
              <div class="question-num">
                {{scope.question.sort }}
              </div>
              <div class="question-score">
                {{scope.question.score}}分
              </div>
            </div>
            <div class="right-wrap">
              <!--{{ scope.question.quesOption}}-->
              <div class="question-title" v-html="scope.question.stem">
              </div>
              <div class="question-option-wrap" v-if="Array.isArray(scope.question.quesOption)">
                <div class="question-option-item"
                     v-for="option in scope.question.quesOption"
                     v-html="option.optionKey + ' ' + option.optionValue">
                </div>
              </div>
            </div>
          </div>
        </template>
        <template slot="componentQuestionBody" scope="scope">
          <div class="question-item ge-clearfix">
            <div class="left-wrap">
              <div class="question-score">
                共{{scope.question.score}}分
              </div>
            </div>
            <div class="right-wrap">
              <div class="question-title" v-html="scope.question.stem">
              </div>
            </div>
          </div>
        </template>
      </paper>
    </div>
  </div>
</template>
<script>
  //  import tempData from './mokeData'
  import Paper, {resolver} from '../../components/paper.vue';

  export default {
    components: {Paper},
    props: {},
    creted() {
    },
    mounted() {
      this.getPaperData();
    },
    data() {
      return {
        paperData: {}
      }
    },
    methods: {
      getPaperData() {
        let {query} = this.$route;
        this.$ajax.showPaper(query.code)
          .then(({httpCode, result}) => {
//            result = tempData;
            console.log(httpCode, result);
            if (httpCode === '200') {
              if (!result) return;
              this.paperData = resolver(result, this.strToUrl);

            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })
      }
    },
    computed: {},
    filters: {
      questionTypeEnum(type) {
        var questionTypeEnumStr = {
          '1': '单选题',
          '2': '多选题',
          '3': '判断题',
          '4': '填空题',
          '5': '主观题',
          '6': '复合题',
        }
        return questionTypeEnumStr[type];
      }
    },
  }
</script>
<style lang="scss" scoped>
  .app-title {
    z-index: 101;
    top: 0;
    left: 0;
    $h: 70px;
    height: $h;
    width: 100%;
    min-width: 640px;
    line-height: $h;
    background: #4c6175;
    color: #fff;
    .head {
      width: 240px;
      float: left;
      font-size: 24px;
      border-right: 1px solid #324353;
      line-height: 40px;
      margin: ($h - 40 )/2 0;
      padding-left: 30px;
    }
  }

  .paper-container {
    margin: 40px auto 0;
    width: 1200px;
    .paper-wrap {
      background-color: #fff;
      .paper-head {
        text-align: center;
        h1 {
          padding: 50px 0 25px 0;
        }
        p {
          padding: 0 0 20px;
          border: {
            bottom: 1px solid #f0f4fb;
          }
        }
      }
      .question-type {
        width: 140px;
        height: 41px;
        font: bold 18px/41px '宋体';
        color: #505050;
        background-color: #fed83e;
      }
      .question-item {
        padding: {
          top: 40px;
        }
        &:last-child {
          padding-bottom: 40px;
          border-bottom: 1px solid #e1e5ec;
        }

        > .left-wrap {
          float: left;
          width: 70px;
        }
        > .right-wrap {
          float: left;
          width: 1130px;
          padding: 0 40px 0;
          text-align: left;
          line-height: 26px;
          img {
            max-width: 100%;
          }
        }
        .question- {
          &score, &num {
            width: 70px;
            height: 40px;
            line-height: 40px;
            display: inline-block;
            font-size: 16px;
          }
          &num {
            background-color: #e8e8e8;
            color: #505050;
          }
          &score {
            background-color: #1fd094;
            color: #fff;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .paper-container {
    img{
      vertical-align: middle;
    }
  }
</style>
