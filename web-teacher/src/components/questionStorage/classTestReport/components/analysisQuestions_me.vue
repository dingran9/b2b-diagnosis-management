<template>
  <div class="analysisQuestions_me">
    <p class="stem" v-html="stem"></p>
    <p class="option" v-html="`${item.optionKey} : ${item.optionValue}`" v-for="(item,index) in option"></p>
  </div>
</template>

<script>
  export default {
    props: ["qaseQuestion"],
    data() {
      return {
        stem: "",//题干
        option:[],//选项

      }
    },
    components: {},
    mounted() {
      this.analysisQuestions();
    },
    methods: {
      analysisQuestions() {
        let stem=this.qaseQuestion.baseName;
        let option=this.qaseQuestion.questionOption;
        /*数据处理*/
        {
//          if(this.qaseQuestion.source == "1" || this.qaseQuestion.source == "web"){//若是易教题库
            stem=this.strToUrl(stem);
            option=this.strToUrl(option);
//          }
        }
        this.stem = stem;
        this.option=JSON.parse(option);
      },
    },
    computed: {},
    filters: {}

  }
</script>


<style lang="scss" scoped>
  .analysisQuestions_me {

  }
</style>
<style lang="scss">
  .analysisQuestions_me {
    width:100%;
    p.stem {
      width:100%;
      font-size: 18px;
      line-height:40px;
      *+p{
        display: inline-block;
        margin-right:10px;
      }
      img{
        max-width:100%;
      }
    }
    p.option{
      width:100%;
      font-size:16px;
      line-height:30px;
      margin-bottom:10px;
      *{
        display: inline-block;
        vertical-align: middle;
      }
      img{
        max-width:100%;
      }
    }
  }
</style>
