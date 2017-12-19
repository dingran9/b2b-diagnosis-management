<template>
  <div>
    <template v-for="questionWrap in paperData">
      <template v-if="questionWrap.type == 6">
        <template v-for="questionType in questionWrap.typeList">
          <h1 style="margin:20px;" v-if="topWrapIsShow(questionType)">{{questionType.itemContent}}</h1>
          <template v-for="questions in questionType.list" v-if="wrapIsShow(questions.componentQuestions)">
            <div class="fuheti-title" v-html="questions.stem"></div>
            <template v-for="question in questions.componentQuestions">
              <question-view :paperdata="question" v-if="isShowQuestion(question)" :type="questionWrap.type" :paper-type="type"></question-view>
            </template>
          </template>
        </template>
      </template>
      <template v-else-if="questionWrap.type">
        <template v-for="questionType in questionWrap.typeList" v-if="wrapIsShow(questionType.list)">
          <h1 style="margin:20px;">{{questionType.itemContent}}</h1>
          <template v-for="questions in questionType.list">
            <question-view :paperdata="questions" v-if="isShowQuestion(questions)" :type="questionWrap.type" :paper-type="type"></question-view>
          </template>
        </template>
      </template>
    </template>
  </div>
</template>
<script>
  import questionView from './thepapertestView.vue'

  export default {
    components: {questionView},
    props: {
      paperData: {},
      type:{
        default:0
      }
    },
    beforeCreate() {
    },
    created() {
    },
    mounted() {

    },
    data() {
      return {}
    },
    methods: {
      wrapIsShow(list) {
        if (this.type == 1) return true;
        return list.some(item => item.isImg)
      },
      topWrapIsShow(topList) {
        if(this.type == 1) return true;
        return topList.list.some((list) => this.wrapIsShow(list.componentQuestions))
      },
      isShowQuestion(questions){
        return this.type || questions.isImg;
      }

    },
    computed: {},
    filters: {},
  }
</script>
<style scoped>
  .fuheti-title {
    padding: 20px 40px;
    line-height: 30px;
    text-align: left;
  }
</style>
<style>

</style>
