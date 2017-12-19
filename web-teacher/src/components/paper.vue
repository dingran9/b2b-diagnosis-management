<template>
  <div v-if="paperData">
    <slot name="head"
          :totalTime="paperData.totalTime"
          :unitCode="paperData.unitCode"
          :unitName="paperData.unitName"
          :paperName="paperData.paperName"
          :booktype="paperData.booktype"
          :gradeCode="paperData.gradeCode"
          :subjectCode="paperData.subjectCode"
          :totalScore="paperData.totalScore"
          :standardScore="paperData.standardScore"
    ></slot>

    <div v-for="(questionCollection, indexOfQuestionCollection) in paperData.paperSystemQusetionType">
      <slot name="questionTypeHead" :type="questionCollection.type" :index="indexOfQuestionCollection"></slot>
      <div v-for="(questionType, indexOfQuestionType) in questionCollection.typeList">
        <div v-for="(question, indexOfQuestin) in questionType.list">
          <template v-if="questionCollection.type != 6">
            <slot name="questionBody" :question="question" :type="questionCollection.type"></slot>
          </template>
          <template v-else>
            <slot name="componentQuestionBody" :question="question" :type="questionCollection.type"></slot>
            <template v-for="(lolLevelQuestion, indexOfLolLevelQuestion) in question.componentQuestions">
              <slot name="questionBody" :question="lolLevelQuestion" :type="questionCollection.type"></slot>
            </template>
          </template>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    components: {},
    props: ['paperData'],
    creted() {
    },
    mounted() {

    },
    data() {
      return {}
    },
    methods: {},
    computed: {},
    filters: {},
    resolver(paperData, strToUrl, fields = ['stem', 'quesOption', 'quesAnalyze', 'answer', 'audioAnalyzePath', 'userAnswerResul']) {
      function parseJSON(str) {
        try {
          return (eval("(" + str + ")"));
        } catch (e) {
          return str;
        }
      }

      function strToObj(str) {
        return parseJSON(strToUrl(str));
      }

      function filterQuestion(question, type) {
        fields.map(key => {
          question[key] = strToObj(question[key]);
        })
      }

      try {
        paperData.paperSystemQusetionType.map((questionCollection, indexOfQuestionCollection) => {
          questionCollection.typeList.map((questionType, indexOfQuestionType) => {
            questionType.list.map((question, indexOfQuestin) => {
              if (questionCollection.type != 6) {
                filterQuestion(question, questionCollection.type)
              } else {
                filterQuestion(question, questionCollection.type)
                question.componentQuestions.map((lolLevelQuestion, indexOfLolLevelQuestion) => {
                  filterQuestion(lolLevelQuestion, questionCollection.type)
                })
              }
            })
          });

        })
      } catch (e) {
        console.log(e);
      } finally {
        return paperData;
      }
    }
  }

</script>
<style lang="scss" scoped>

</style>
<style lang="scss">

</style>
