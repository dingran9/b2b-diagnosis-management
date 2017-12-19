<template>
    <div class="question" @click="clickHandle">
      <div class="title">
        <span>{{num+1}}、</span><span  v-html="question.stem"></span>
      </div>
      <div class="body">
        <div
          v-for="item in question.questionOptions"
          v-html="item.optionKey + '&nbsp;&nbsp;&nbsp;&nbsp;' + item.optionValue"
          class="body-item">
        </div>
      </div>
      <div class="foot">
        <!--在用-->
        <template v-if="type == 0">
          <span class="foot-caption">难度 :</span>
          <img src="../../../static/img/xing.png"
               v-for="i in question.stageCode"
               height="22"
               width="21"
               style="vertical-align: middle;margin-right:10px;"/>
        </template>
        <!--暂时没有用到-->
        <template v-if="type == 1">
          <img src="../../../static/img/error_icon.png" height="22" width="23"/>
          错误次数: <span style="color:#ff6666;">{{question.times}}</span>次
          <span class="ge-pull-right" style="color:#808080;">
            最新:{{dataParse(question.lastTime)}}
          </span>
        </template>
      </div>
    </div>
</template>
<script>
    export default {
        components: {},
        data: () => {
            return {
                result: {}
            }
        },
        mounted(){
          try{
                let {questionOptions,questionStem,stageCode} = this.question;
                for(let value of questionOptions){
                    value.optionValue = this.strToUrl(value.optionValue);
                }
            this.question.questionStem = this.strToUrl(questionStem);
            this.question.stem = this.strToUrl(this.question.stem);
            this.question.stageCode = +stageCode;
          }catch(e){

          }
        },
        methods: {
          clickHandle(){
              this.$emit('click-handle',this.question);
          }
        },
        props: {
            num:0,
            question:{

            },
          type:{
                default:0
          }
        },
        computed: {},
        watch: {},
        filters: {}
    }
</script>
<style scoped lang="scss">
  @import "../../../static/css/gemixin";
  .question{
    text-align: left;
    background: #fff;
    $padding:40px;
    line-height:38px;
    margin-bottom: 20px;
    .title {
      padding: $padding $padding 20px;
      font-size: 18px;
      color: #4c4c4c;
    }
    .body{
      padding:{
        left:$padding;
        right:$padding;
      }
      font-size: 16px;
      color: #999999;
      border-bottom:1px solid #ddd;
    }
    .foot{
      $h:60px;
      height: $h;
      line-height:$h;
      padding:0 $padding;
      font-size:18px;
      .foot-caption{
        width: 60px;
        display: inline-block;
        color: #505050;
      }

    }
  }
</style>
