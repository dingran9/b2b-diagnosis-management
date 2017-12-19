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
      let query = this.$route.query;
      if (!query || !query.code || !query.studentDiagnosisRecordCode) {
        this.$message('缺失参数,请正确操作后重试!');
        this.$router.push('/main/tutoring');
        return;
      }
      this.loading = Loading.service();
      this.$ajax.getPaperDetial(query)
        .then(({httpCode, result}) => {
          this.loading.close();
          if (httpCode == 200) {
            //处理数据
            this.resolveQuestion(result.paperSystemQusetionType);
            console.log(JSON.parse(JSON.stringify(result.paperSystemQusetionType[2].typeList[0].list[2])));
            this.questionList = function () {
              let questions = [];
              try {
                for (let paperSystemQusetionType of result.paperSystemQusetionType) {
                  if (paperSystemQusetionType.type != 6) {
                    questions = questions.concat(...(paperSystemQusetionType.typeList.map(questionList =>questionList.list)));
                  } else if (paperSystemQusetionType.type == 6) {
                    for (let typeList of paperSystemQusetionType.typeList) {
                      for (let list of typeList.list) {
                        for (let one of list.componentQuestions) {
                          one.titleStem = list.stem;
                          console.log(JSON.parse(JSON.stringify(one.quesOption)));
                          questions.push(one)
                        }
                      }
                    }

                  }
                }
              } catch (e) {
              }
//              for (let item of questions) {
//                item.quesAnalyze = item.quesAnalyze[0];
//              }
//              console.log(questions)
              return questions;

            }.bind(this)();

            //缓存返回结果
            this.result = result;
          } else {
            this.$message('获取试卷详情失败,请刷新页面重试!');
          }
        })
        .catch(() => {
          this.loading.close();
        })
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
      }
    },
    computed: {

      answersQuestionHandle() {

        let temp = [];
        this.questionList.forEach(item => {
          temp.push({
            isRight:item.markQuestionResult || item.userAnswerResul == item.answer

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
