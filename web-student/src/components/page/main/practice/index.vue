<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">阶段检测>报告详情>练一练
        <goback></goback>
      </h2>

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
    <div v-else>暂无试题!</div>
  </div>
</template>
<script>
  import answerCard from '../../../common/answerCard.vue';
  import question from '../../../common/question.vue';
  import goback from '../../../common/goback.vue';
  export default {
    components: {
      answerCard, question, goback
    },
    data(){
      return {
        test: {data: 1},
        result: {},
        data: {
          questionList: []
        },
        curAnswerNum: 0
      }
    },
    mounted(){
      this.$ajax.getknowledgequestion(this.$route.query)
        .then(({httpCode, result}) => {
          if (httpCode == 200) {
            this.beginTime = +new Date();
            //处理数据
            this.data.questionList = function () {
              let questions = (result && result.questionInfo) || [];
              //缓存练一练数据
              this.localData.set('practicePaperDetail', questions);
              for (let item of questions) {
                item.stem = this.strToUrl(item.stem);

                item.studentAnswer = '';
                try {
                  item.quesOption = item.quesOption.length && JSON.parse(item.quesOption);
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
            this.result = result;
          } else {
            this.$message('获取试卷详情失败,请刷新浏览器充重试!');
          }
        })
    },
    methods: {
      chooseQuestion(index){
        this.curAnswerNum = index;
      },
      postAnswers(){
        //拿到缓存数据
        let questions = this.localData.get('practicePaperDetail');
        for (var i = 0; i < this.data.questionList.length; i++) {
          var obj = this.data.questionList[i];
          questions[i].isRight = obj.answer == obj.studentAnswer;
          questions[i].userAnswerResul = obj.studentAnswer;
        }
        this.localData.set('practicePaperDetail', questions);
        this.$router.push({
          path: '/main/practicePaperDetail',

        })

      },
      nextQuestion(){
        this.curAnswerNum += 1;
      }
    },
    computed: {
      answersQuestionHandle(){
        let temp = [];
        for (let item of this.data.questionList) {
          temp.push({
            isAnswer: item.studentAnswer
          })
        }
        return temp;
      },
      curQestion(){
        return this.data.questionList[this.curAnswerNum];
      },

    },
    beforeRouteEnter(to, from, next){
      next(vm => {
        // 通过 `vm` 访问组件实例
        if(from.path ==  "/main/practicePaperDetail"){
            vm.$router.go(-1);
        }
      })
    },
    filters: {}

  }
</script>
<style lang="scss" scoped>
  @import '../../../../../static/css/contentRight.scss';

</style>
