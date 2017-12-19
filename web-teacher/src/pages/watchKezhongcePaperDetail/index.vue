<template>
  <div style="width: 1200px;margin:100px auto;">
    <div class="content-right-title-wrap">
      <h2 class="title">试卷详情
      </h2>

    </div>
    <div
      v-if="questionList.length"
      class="content-right-body-wrap ge-por">
      <answer-card
        @select-Question="chooseQuestion"
        :answers="answersQuestionHandle"
        :currentNum="curAnswerNum"
        :show-no-answer="true"
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
  import answerCard from './answerCard.vue';
  import question from './kezhongceQuestion.vue';
  import {Loading} from 'element-ui'

  export default {
    components: {
      answerCard, question,
    },
    data() {
      return {
        result: {},
        isPlay: false,
        curAnswerNum: 0,
        questionList: []
      }
    },
    mounted() {
      this.getPaperDetial();
    },
    props: {},
    methods: {
      //选择题号
      chooseQuestion(index) {
        this.curAnswerNum = index;
      },
      filterStrToUrlData(str) {
        return this.parseJSON(this.strToUrl(str));
      },
      //下一题
      nextQuestion() {
        this.curAnswerNum += 1;
      },
      getPaperDetial() {
        //试题来源于试卷中
        this.$ajax.getStudentQuestionDetail(this.$route.query)
          .then(({httpCode, result}) => {
            if (httpCode === '200') {
              if (!result) return;
              if (result.rows) {
                this.questionList = result.rows.map(item => {
                  ['baseName', 'knowledges', 'questionAnalyze', 'questionOption'].map(key => {
                    item[key] = this.filterStrToUrlData(item[key]);
                  });
                  console.log(item);
                  return item;
                })
              }

            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })

      },
    },
    computed: {

      answersQuestionHandle() {

        let temp = [];
        this.questionList.forEach(item => {
          temp.push({
            isRight: item.rightAnswer == item.studentAnswer,
            noAnswer: !item.studentAnswer
          })
        })
        return temp;
      }
    },
    filters: {},

  }
</script>
<style lang="scss" scoped>
</style>
