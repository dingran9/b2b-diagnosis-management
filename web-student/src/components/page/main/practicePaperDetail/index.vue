<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">阶段检测>报告详情>练一练解析
        <goback></goback>
      </h2>

    </div>
    <div
      v-if="questionList.length"
      class="content-right-body-wrap ge-por">
      <answer-card
        @select-Question="chooseQuestion"
        :answers="answersQuestionHandle"
        :currentNum="curAnswerNum"
        type="1"
      ></answer-card>
      <question
        :question-info="{
          curAnswerNum:curAnswerNum,
          data:questionList[curAnswerNum],
          totalNum:questionList.length,
          isPlay:isPlay
        }"
        @next="nextQuestion"
        type="1"
      ></question>
    </div>
  </div>
</template>
<script>
  import goback from '../../../common/goback.vue';
  import answerCard from '../../../common/answerCard.vue';
  import question from '../../../common/question.vue';

  export default {
    components: {
      answerCard, question, goback
    },
    data(){
      return {
        isPlay: false,
        curAnswerNum: 0,
        questionList: []
      }
    },
    mounted(){


      this.questionList = function () {
        //拿到缓存数据
        let questions = this.localData.get('practicePaperDetail');
        console.log(questions)
        for (let item of questions) {
          item.stem = this.strToUrl(item.stem);
          item.studentAnswer = '';
          try {
            item.quesOption = item.quesOption.length && JSON.parse(item.quesOption);
            item.quesAnalyze = item.quesAnalyze.length && JSON.parse(item.quesAnalyze)[0];
            item.quesAnalyze.analyzeValue = this.strToUrl(item.quesAnalyze.analyzeValue);
            for (let tempItem of item.quesOption) {
              tempItem.optionValue = this.strToUrl(tempItem.optionValue);
            }
          } catch (e) {
            console.log('试卷解析有问题,使劲怼后台的!!!');
          }
        }
        return questions;
      }.bind(this)();
      //缓存返回结果
    },
    props: {},
    methods: {
      //选择题号
      chooseQuestion(index){
        this.curAnswerNum = index;
      },
      //下一题
      nextQuestion(){
        this.curAnswerNum += 1;
      }
    },
    computed: {

      answersQuestionHandle(){

        let temp = [];
        this.questionList.forEach(item => {
          temp.push({
            isRight: item.userAnswerResul == item.answer

          })
        })
        return temp;
      }
    },
    filters: {},
    beforeRouteLeave(to, from, next){
      //没用vuex 解决视频播放问题
      this.curAnswerNum = this.curAnswerNum == 0 ? 1 : 0;
      this.$nextTick(() => {
        next();
      })

    }

  }
</script>
<style lang="scss" scoped>
  @import '../../../../../static/css/contentRight.scss';
</style>
