<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">试卷详情
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
  import goback from '../../../common/goback.vue';
  import answerCard from '../../../common/answerCard.vue';
  import question from '../../../common/kezhongceQuestion.vue';
  import {Loading} from 'element-ui'

  export default {
    components: {
      answerCard, question, goback
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
      this.loading = Loading.service();

      setTimeout(() => {
        this.loading.close();
      }, 1)

    },
    props: {},
    methods: {
      //选择题号
      chooseQuestion(index) {
        this.curAnswerNum = index;
      },
      //下一题
      nextQuestion() {
        this.curAnswerNum += 1;
      },
      getPaperDetial() {
        this.$ajax.getKezhongcePaperDetail(this.$route.query)
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
      }
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
    beforeRouteLeave(to, from, next) {
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
