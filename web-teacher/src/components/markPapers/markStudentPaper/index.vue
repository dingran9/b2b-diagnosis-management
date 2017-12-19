<template>
  <div class="rootViewstyle">
    <!--头视图-->
    <titleview :dataarray="results"></titleview>
    <!--试题view-->

    <all-paper :paperData="paperQuestionQuery" ref="paper"></all-paper>
    <!--全部提交-->
    <div class="allsubmitviewstyle">
      <el-button type="success" class="allsubmitbuttonstyle" @click="commitAllMarkPaper">提交判卷</el-button>
    </div>
  </div>
</template>
<script>
  import titleview from "../thePaperTitleView.vue"
  import allPaper from '../allTypePaperShow.vue';
  import {Loading} from 'element-ui';

  export default {
    components: {titleview, allPaper},
    props: {},
    beforeCreate() {
    },
    created() {
      this.loading = Loading.service();
      this.$ajax.getPaperAndAnswerResult(this.$route.query)
        .then(({result, httpCode}) => {
          this.loading.close();
          if (httpCode === '200') {
            if (result) {
              this.$set(this, 'paperQuestionQuery', this.resolveQuestion(result.paperSystemQusetionType || []));
              this.$set(this, 'results', result);
              this.$nextTick(() => {
                var viewer = new Viewer(this.$refs.paper.$el, {
                  url: 'data-original'
                });
              })
            }
          }
        })
        .catch(() => {
          this.loading.close();
        })
    },
    mounted() {

    },
    data() {
      return {
        results: [],
        paperQuestionQuery: [],
        testInput: ''
      }
    },
    methods: {
      canSend() {
        return !this.paperQuestionQuery.some(allQuestionWrap => {
          return allQuestionWrap.typeList.some(questionType => {
            return questionType.list.some(question => {
              if (allQuestionWrap.type == 6) {
                return question.componentQuestions.some(componentQuestion => {
                  return checkQuestion.bind(this)(componentQuestion)
                })
              } else {
                return checkQuestion.bind(this)(question)
              }
            })
          })
        })

        function checkQuestion(question) {
          //不需要判题
          if (!question.isImg) return false;

          //未打分
          if (question.teacherScore === '') {
            this.$message("请全部打分后再提交");
            return true;
          }
          //未锁定
          if (!question.isLock) {
            this.$message('全部试题锁定后才能提交,请锁定全部判卷!');
            return true;
          }
          //默认
          return false;
        }

      },
      commitAllMarkPaper() {
        if (this.canSend()) {
          let {results: {booktype, totalScore, id}} = this;
          let {studentDiagnosisRecordCode, diagnosisTeacherRecordCode} = this.$route.query;
          let answerWrap = this.getSendAnswer(this.paperQuestionQuery);
          let user = this.$$user();
          answerWrap.forEach(i => {
            i.diagnosisRecordCode = studentDiagnosisRecordCode;
            i.teacherCode = user.userId;
            i.teacherName = user.userName;
          })
          let send = {
            "bookVersionCode": booktype,
            "diagnosisTeacherRecordCode": diagnosisTeacherRecordCode,
            "markQuestionList": answerWrap,
            "paperScore": totalScore,
            "resourcePaperCode": id
          };
          this.loading = Loading.service();
          this.$ajax.saveMarkPaperInfo(send)
            .then(({result, httpCode}) => {
              this.loading.close();
              if (httpCode === '200') {
                this.$message('提交成功');
                this.$router.go(-1)
              } else {
                this.$message('提交失败');
              }
            })
            .catch(() => {
              this.loading.close();
            })
        }
      }
    },
    computed: {},
    filters: {},

  }
</script>
<style scoped>

  .rootViewstyle {
    margin: 20px 20px;
    background-color: white;
    height: auto !important;
    overflow-y: hidden !important;

  }

  .allsubmitviewstyle {
    position: relative;
    height: 60px;

  }

  .allsubmitbuttonstyle {
    position: absolute;
    right: 30px;

  }

</style>
<style>

</style>
