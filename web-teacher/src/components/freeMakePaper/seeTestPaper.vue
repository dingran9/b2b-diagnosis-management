<template>
  <div class="seeTestPaper">
    seeTestPaper
    <div class="type1_6" v-for="item in paperSystemQusetionType">
      <div class="typeList" v-for="typeList in item">
        <div class="item2" v-for="item2 in typeList">
          <div class="list" v-for="list in item2">
            <div class="question" v-for="question in list">
              <analysisQuestions
                :type="question.type"
                :stem="question.stem"
                :quesOption="question.quesOption"
                :stars="question.difficultStar"
                :componentQuestions="question.componentQuestions"
              ></analysisQuestions>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {xxx} from "./试卷展示.js";
  import analysisQuestions from './analysisQuestions_me1_6.vue';
  export default {
    data() {
      return {
        paperSystemQusetionType: [],//result.paperSystemQusetionType
      }
    },
    components: {analysisQuestions},
    mounted() {
      this.showPaperFromDB();
    },
    methods: {
      showPaperFromDB(){
        this.$ajax.showPaper('A2BEE8EA3ACD1669A6D2F1F77633EA05')
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              if(!result||!result.paperSystemQusetionType){
                return;
              }
              this.paperSystemQusetionType = xxx.result.paperSystemQusetionType;
            } else {
              this.$message('获取试题失败,请刷新重试')
            }

          }, (res) => {
            console.log(res);
          });
      }
    },
    computed: {},
    filters: {}

  }
</script>


<style lang="scss" scoped>
  .seeTestPaper {

  }
</style>
<style lang="scss">
  .seeTestPaper {

  }
</style>
