<template>
  <div class="main-answer-wrap">
    <div class="cur-question-num">
      {{questionInfo.curAnswerNum + 1}}
    </div>
    <div class="question">

      <div class="question-title" v-html="questionInfo.data.baseName"></div>
      <div class="qustion-body">
        <div v-for="questionChoose in questionInfo.data.questionOption"
             v-if="questionInfo.data.questionOption.length"
             v-html="questionChoose.optionKey + '&nbsp;&nbsp;&nbsp;&nbsp;' + questionChoose.optionValue"
             class="qustion-body-answer-item">

        </div>
      </div>
    </div>
    <div class="sellect-answer-wrap ge-por clear-fix" v-if="questionInfo.data.questionOption.length">
      <span style="display: inline-block;width: 40px; float:left;">选项:</span>
      <div style="float:left;">
        <div
          v-for="questionChoose in questionInfo.data.questionOption"
          @click="selectAnswer(questionChoose.optionKey)"
          :class="{act:questionInfo.data.rightAnswer == questionChoose.optionKey,
                   error:type
                    && questionInfo.data.studentAnswer == questionChoose.optionKey
                    && questionInfo.data.studentAnswer != questionInfo.data.rightAnswer
                  }"
          class="sellect-answer-item">
          {{questionChoose.optionKey}}
        </div>
      </div>

    </div>
    <!-- 答案 -->
    <div v-if="type"
         class="analyze-wrap">
      <div class="answer-wrap">
        <span class="left-title">
          答案:
        </span>
        正确答案是 <span v-html="questionInfo.data.rightAnswer"></span>,你的答案是 <span v-html="questionInfo.data.studentAnswer || '未作答'"></span>
      </div>
      <div class="main-analyze">
        <span class="left-title">
          解析:
        </span>
        <template  v-if="Array.isArray(questionInfo.data.questionAnalyze)">
           <span class="analyze"
                 v-for="quesAnalyzeItem in questionInfo.data.questionAnalyze"
                 v-html="filterNull(quesAnalyzeItem.analyzeKey) + quesAnalyzeItem.analyzeValue "></span>
        </template>
        <span class="analyze"
              v-else-if="!Array.isArray(questionInfo.data.questionAnalyze) && typeof questionInfo.data.questionAnalyze == 'object'"
              v-html="filterNull(questionInfo.data.questionAnalyze.analyzeKey) + questionInfo.data.questionAnalyze.analyzeValue "></span>
        <span class="analyze" v-else-if="questionInfo.data.questionAnalyze">{{questionInfo.data.questionAnalyze}}</span>
        <span class="analyze" v-else>无解析</span>
      </div>
      <!--<div style="padding:10px 0 30px 0;">-->
        <!--语音解析:-->
        <!--<radioPlayer-->
          <!--v-show="questionInfo.data.audioAnalyzePath"-->
          <!--:audio-is-play.sync="isPlay"-->
          <!--:audio-src="questionInfo.data.audioAnalyzePath"></radioPlayer>-->
        <!--<span v-show="!questionInfo.data.audioAnalyzePath">-->
          <!--暂无语音解析-->
        <!--</span>-->
      <!--</div>-->
    </div>
    <div
      v-show="questionInfo.curAnswerNum != questionInfo.totalNum - 1"
      class="next-question-wrap">
      <div class="next-question-btn" @click="nextQuestion">
        下一题
      </div>

    </div>
  </div>
</template>
<script>
  import radioPlayer from './radioPlayer.vue';
  export default {
    components: {
      radioPlayer
    },
    data(){
      return {
        isPlay: false
      }
    },
    mounted(){
      console.log(this.questionInfo);
    },
    props: {
      questionInfo: {},
      type: {
        default: 0
      }
    },
    watch: {
      "questionInfo.curAnswerNum"(){
        this.isPlay = false;
      }
    },

    methods: {
      nextQuestion(){
        this.$nextTick(() => {
          this.$emit('next');
        })
      },
      filterNull(str){
        return !!str ? str : '';
      },
      selectAnswer(optionKey){
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
