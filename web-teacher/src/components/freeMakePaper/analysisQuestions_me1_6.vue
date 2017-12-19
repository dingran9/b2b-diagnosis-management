<template>
  <div class="analysisType1_me1_6">
    <section class="type1_2" v-if="type==1||type==2" v-show="true">
      <p class="type1_2Stem addFontSize" v-html="sort + '.' + type1_2Stem" v-if="sort!=undefined"></p>
      <p class="type1_2Stem addFontSize" v-html="type1_2Stem" v-if="sort==undefined"></p>
      <slot></slot>
      <p class="type1_2Option addFontSize" v-html="`${item.optionKey} . ${item.optionValue}`"
         v-for="(item,index) in type1_2Option"></p>
    </section>
    <section class="type4_5" v-if="type==5||type==4" v-show="true">
      <p class="type4_5Stem addFontSize" v-html="sort + '.' + type4_5Stem" v-if="sort!=undefined"></p>
      <p class="type4_5Stem addFontSize" v-html="type4_5Stem" v-if="sort==undefined"></p>
      <slot></slot>
    </section>
    <section class="type6" v-if="type==6" v-show="true">
      <div class="type6Stem addFontSize" v-html="sort + '.' + type6Stem" v-if="sort!=undefined"></div>
      <div class="type6Stem addFontSize" v-html="type6Stem" v-if="sort==undefined"></div>
      <slot></slot>
    </section>
  </div>
</template>

<script>
  export default {
    props: ["type", "stem", "quesOption", "subtitle","sort"],
    data() {
      return {
        /*题型1,2*/
        type1_2Stem: "",//题干
        type1_2Option: [],//选项
        /*题型4,5*/
        type4_5Stem: "",//题干
        /*题型6*/
        type6Stem: "",//题干
      }
    },
    components: {},
    mounted() {
      (this.type == 1 || this.type == 2) && this.analysistype1_2();
      (this.type == 5 || this.type == 4) && this.analysistype4_5();
      this.type == 6 && this.analysistype6();
    },
    methods: {
      analysistype1_2() {
        let type1_2Stem = this.stem;
        let type1_2Option = this.quesOption;
        /*数据处理*/
        {
          //if(this.qaseQuestion.source == "1" || this.qaseQuestion.source == "web"){//若是易教题库
          if(type1_2Stem.indexOf('<img>')==-1){//有的返回的是img标签,有的返回的是网络路径.
            type1_2Stem = this.strToUrl(type1_2Stem);
          }
          if(type1_2Option.indexOf('<img>')==-1){
            type1_2Option = this.strToUrl(type1_2Option);
          }

          //}
        }
        this.type1_2Stem = type1_2Stem;
        this.type1_2Option = JSON.parse(type1_2Option);
      },
      analysistype4_5() {
        let type4_5Stem=this.stem;
        if(type4_5Stem.indexOf('<img>')==-1){
          type4_5Stem=this.strToUrl(type4_5Stem);
        }
        this.type4_5Stem = type4_5Stem;
      },
      analysistype6() {
        this.type6Stem = this.stem;//strToUrl放在父组件中
      },
    },
    computed: {},
    filters: {}

  }
</script>


<style lang="scss" scoped>
  .addFontSize {
/*    font-size: 30px;
    line-height: 44px;*/
  }
  .analysisType1_me1_6 {
    .type1_2Option{
      margin-top: 10px;
      margin-bottom: 12px;
    }
  }
</style>
<style lang="scss">
  .analysisType1_me1_6 {
    text-align: left;
    .type1_2 {
      width: 100%;
      p.stem {
        width: 100%;
        /*font-size: 18px;*/
        /*line-height:40px;*/
        * + p {
          display: inline-block;
          margin-right: 10px;
        }
        img {
          width: 100%;
        }
      }
      p.option {
        width: 100%;
        /*font-size:16px;*/
        /*line-height:30px;*/
        /*margin-bottom:10px;*/
        * {
          display: inline-block;
          vertical-align: middle;
        }
        img {
          width: 100%;
        }
      }
    }
  }
</style>
