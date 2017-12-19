<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div class="content-right-title-wrap">
      <h2 class="title">阶段检测</h2>

    </div>
    <div
      v-if="data.questionList.length"
      class="content-right-body-wrap ge-por">
      <answer-card
        :answers="answersQuestionHandle"
        :currentNum="curAnswerNum"
        @post-answers="postAnswers"
        @select-Question="chooseQuestion"></answer-card>
      <question
        :test="test"
        :question-info="{
          curAnswerNum:curAnswerNum,
          data:data.questionList[curAnswerNum],
          totalNum:data.questionList.length
        }"
        @next="nextQuestion"
      ></question>

    </div>
  </div>
</template>
<script>
  import answerCard from '../../../common/answerCard.vue';
  import question from '../../../common/question.vue';

  export default {
    components: {
      answerCard, question
    },
    data() {
      return {
        test: {data: 1},
        result: {},
        data: {
          questionList: []
        },
        curAnswerNum: 0,
        fullscreenLoading: false
      }
    },
    mounted() {
      this.$ajax.getPaper(this.$route.query)
        .then(({httpCode, result}) => {
          if (httpCode == 200) {
            if (result.needImg) {
              this.$alert('本试卷包含主观题,需要用到拍照功能,故电脑端暂不支持此类试卷答题。如需答题,请下载移动端回答试卷。', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$router.go(-1);
                }

              });
              return;
            }
            this.beginTime = +new Date();
            //处理数据
            this.resolveQuestion(result.paperSystemQusetionType);
            this.data.questionList = function () {
              let questions = [];
              try {
                for (let paperSystemQusetionType of result.paperSystemQusetionType) {
                  if (paperSystemQusetionType.type == 1) {
                    questions.push(...(paperSystemQusetionType.typeList[0].list));
                  } else if (paperSystemQusetionType.type == 6) {
                    for (let typeList of paperSystemQusetionType.typeList) {
                      for (let list of typeList.list) {
                        for (let one of list.componentQuestions) {
                          one.titleStem = list.stem;
                          one.logicType = '6';
                          one.isComplex = 1;
                          one.complexQuestionCode = one.id;
                          one.id = list.id;

                          one.itemContent = typeList.itemContent;
                          questions.push(one)
                        }
                      }
                    }

                  }
                }
              } catch (e) {
              }
              for (let item of questions) {
                item.studentAnswer = '';
              }
              return questions;
            }();

            //缓存返回结果
            this.result = result;
          } else {
            this.$message('获取试卷详情失败,请刷新浏览器充重试!');
          }
        })
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (from.path == "/main/reportDetail") {
          vm.$router.go(-1);
        }
      })
    },
    methods: {
      chooseQuestion(index) {
        this.curAnswerNum = index;
      },
      postAnswers() {
        this.fullscreenLoading = true;
        this.$ajax.commitAnswer(this.getSendAnswersData())
          .then(({httpCode, result}) => {
            this.fullscreenLoading = false;
            if (httpCode == 200) {
              this.$message('提交成功');
              let tempQuery = this.$route.query;
              let query = {
                code: tempQuery.code2,
                subjectCode: tempQuery.subjectCode,
                gradeCode: tempQuery.gradeCode
              };
              this.$router.push({
                path: '/main/reportDetail',
                query: query
              })
            } else {
              this.$message('提交试卷失败!');
            }

          })

      },
      getSendAnswersData() {
        let result = this.result,
          user = this.$user().get(),
          query = this.$route.query;
        console.log(user)
        let sendData = {
          answerSheetQuestionDtos: [],
          artType: user.artType,
          classCode: user.classId,
          className: user.className,
          code: query.code2,
          diagnosisPaperCode: query.code,
          diagnosisPaperName: result.paperName,
          diagnosisTeacherRecordCode: query.diagnosisTeacherRecordCode,
          gradeCode: user.gradeIden,
          istopic: result.istopic,
          needMark: 0,
          paperCode: result.id,
          resourceType: 0,
          schoolCode: user.schoolId,
          schoolName: user.schoolName,
          stageCode: user.gradeIden.toString()[0],
          startDate: this.beginTime,
          studentCode: user.userId,
          studentName: user.userName,
          subjectCode: query.subjectCode,
          totalScore: result.totalScore,
          useTime: ((new Date() - this.beginTime) / 1000) >> 0,
        };
        let index = 1;
        for (let item of  this.data.questionList) {
          let tempData = {
            "isComplex": item.isComplex || 0,
            "isImg": 0,
            complexQuestionCode: item.complexQuestionCode || null,
            "isRight": +(item.answer == item.studentAnswer),
            "itemContent": item.itemContent || "单选题",
            "logicType": item.logicType || "1",
            "questionCode": item.id,
            "questionScore": item.score,
            "questionSn": index++,
            "rightAnswer": item.answer,
            "studentAnswer": item.studentAnswer,
            "isMark": null,

          };
          sendData.answerSheetQuestionDtos.push(tempData);
        }
        return sendData;
      },
      nextQuestion() {
        this.curAnswerNum += 1;
      }
    },
    computed: {
      answersQuestionHandle() {
        let temp = [];
        for (let item of this.data.questionList) {
          temp.push({
            isAnswer: item.studentAnswer
          })
        }
        return temp;
      },
      curQestion() {
        return this.data.questionList[this.curAnswerNum];
      },

    },
    filters: {}

  }
</script>
<style lang="scss" scoped>
  @import '../../../../../static/css/contentRight.scss';

</style>
