<template>
  <div class="main-answer-wrap">
    <div class="cur-question-num">
      {{questionInfo.curAnswerNum + 1}}
    </div>
    <div class="question">

      <div class="question-title" v-html="questionInfo.data.stem"></div>
      <div class="qustion-body">
        <div v-for="questionChoose in questionInfo.data.quesOption"
             v-if="questionInfo.data.quesOption.length"
             v-html="questionChoose.optionKey + '&nbsp;&nbsp;&nbsp;&nbsp;' + questionChoose.optionValue"
             class="qustion-body-answer-item">

        </div>
      </div>
    </div>

    <div v-if="type"
         class="analyze-wrap">
      <div class="answer-wrap">
        <span class="left-title">
          答案:
        </span>
        正确答案是 <span v-html="questionInfo.data.answer"></span>,你的答案是
        <a v-if="questionInfo.data.godpenAnswer && questionInfo.data.type != 4" :href="questionInfo.data.godpenAnswer"
           target="_blank">查看详情</a>
        <span v-else v-html="questionInfo.data.userAnswerResul || questionInfo.data.godpenAnswer || '未作答'"></span>
      </div>
      <div class="main-analyze">
        <span class="left-title">
          解析:
        </span>
        <template v-if="Array.isArray(questionInfo.data.quesAnalyze)">
           <span class="analyze"
                 v-for="quesAnalyzeItem in questionInfo.data.quesAnalyze"
                 v-html="filterNull(quesAnalyzeItem.analyzeKey) + quesAnalyzeItem.analyzeValue "></span>
        </template>
        <span class="analyze"
              v-else-if="!Array.isArray(questionInfo.data.quesAnalyze) && typeof questionInfo.data.quesAnalyze == 'object'"
              v-html="filterNull(questionInfo.data.quesAnalyze.analyzeKey) + questionInfo.data.quesAnalyze.analyzeValue "></span>
        <span class="analyze" v-else-if="questionInfo.data.quesAnalyze">{{questionInfo.data.quesAnalyze}}</span>
        <span class="analyze" v-else>无解析</span>
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    components: {},
    data() {
      return {
        isPlay: false
      }
    },
    mounted() {
      console.log(this.questionInfo);
    },
    props: {
      questionInfo: {},
      type: {
        default: 0
      }
    },
    watch: {
      "questionInfo.curAnswerNum"() {
        this.isPlay = false;
      }
    },

    methods: {
      nextQuestion() {
        this.$nextTick(() => {
          this.$emit('next');
        })
      },
      filterNull(str) {
        return !!str ? str : '';
      },
      selectAnswer(optionKey) {
        if (this.type == 1) {

        } else if (this.type == 0) {
          this.questionInfo.data.studentAnswer = optionKey;
        }
      }
    },
    computed: {},
    filters: {}

  }
</script>
<style lang="scss" scoped>
  .main-answer-wrap {
    position: absolute;
    top: 0;
    left: 336px;
    right: 0;
    padding: 35px 0 0 0;
    background: #fff;
    %pad {
      padding-left: 90px !important;
      padding-right: 90px !important;
    }
    .cur-question-num {
      position: absolute;
      top: 35px;
      left: 0;
      $h: 35px;
      width: 60px;
      height: $h;
      line-height: $h;
      text-align: center;
      background-color: #eaeaea;
    }
    .question {
      @extend %pad;
      color: #4c4c4c;
      font-size: 18px;
      text-align: left;
      .question-title {
        line-height: 35px;
      }
      .qustion-body-answer-item {
        color: #999999;
        font-size: 16px;
        padding: 5px 0;
        line-height: 25px;

      }
    }
    .sellect-answer-wrap {
      @extend %pad;
      text-align: left;
      background-color: #fafafa;
      padding: {
        top: 30px;
        bottom: 30px;
      }
      $h: 40px;
      line-height: 40px;
      .sellect-answer-item {
        width: 100px;
        height: $h + 2;
        line-height: $h;
        border: 1px solid #d6d6d6;
        border-radius: 3px;
        display: inline-block;
        text-align: center;
        font-size: 18px;
        cursor: pointer;
        color: #666666;
        margin-left: 50px;
        margin-bottom: 10px;

        &.error {
          background: #fb7d7d;
          color: #fff;
        }
        &.act {
          background-color: #3cc0fe;
          border-color: #3cc0fe;
          color: #fff;
        }
      }
    }
    .analyze-wrap {
      padding: {
        top: 30px;
      }
      font-size: 16px;
      line-height: 35px;
      @extend %pad;
      text-align: left;
      .left-title {
        float: left;
        display: inline-block;
        width: 50px;
        height: 100%;
      }
      .main-analyze {
        position: relative;
        .left-title {
          position: absolute;
          left: 0;
          top: 0;
        }
      }
      .analyze {
        display: inline-block;
        padding: {
          left: 60px;
        }
      }

    }
    .next-question-wrap {
      @extend %pad;
      padding: {
        top: 110px;
        bottom: 50px;
      }
      .next-question-btn {
        width: 400px;
        $h: 50px;
        height: $h;
        line-height: $h;
        border-radius: $h/2;
        color: #fff;
        font-size: 18px;
        cursor: pointer;
        background: url('../../../static/img/btn_bg.png');
        background-size: 100% 100%;
        margin: auto;
      }
    }
  }

</style>
