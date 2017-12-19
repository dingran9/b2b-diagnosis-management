<template>
  <div class="answers-card">

    <div class="header">
      答题卡
    </div>
    <div class="body">
      <div v-for="(i,index) in answers"
           :class="{act:i.isAnswer || i.isRight,
           error:type == 1 && !i.isRight,
           'no-answer':showNoAnswer && i.noAnswer,
           'kezhongce':showNoAnswer,
           cur:currentNum == index}"
           @click="selectQuestion(index)"
           class="answer-item">
        {{index + 1}}
      </div>
    </div>
    <div v-if="!type" class="foot">
      <div class="btn"
           @click="postAnswers">提交
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    components: {},
    data(){
      return {}
    },
    mounted(){
console.log(this.answers);
    },
    props: {
      answers: {},
      currentNum: {
        default: 0
      },
      type:{
          default:0
      },
      showNoAnswer:{
        default:false
      }
    },
    methods: {
      selectQuestion(index){
        this.$emit('select-Question', index)
      },
      postAnswers(){
        if (this.canPost) {
          this.$emit('post-answers');
        } else {
          this.$message('请答完全部题目后提交');
        }
      }
    },
    computed: {
      canPost(){
        let flag = true;
        for (let item of this.answers) {
          if (!item.isAnswer) {
            flag = false;
            break;
          }
        }
        return flag;
      }
    },
    filters: {}

  }
</script>
<style lang="scss" scoped>
  .answers-card {
    width: 310px;
    position: absolute;
    left: 0;
    top: 0;
    text-align: center;
    background: #fff;
    border:1px solid #ccc;
    .header {
      $h: 60px;
      line-height: $h;
      height: $h;
      color: #fb7d7d;
      font-size: 24px;
      border-bottom: 1px solid #e1e5ec;
    }
    .body {
      text-align: left;
      .answer-item {
        text-align: center;
        display: inline-block;
        $wh: 40px;
        width: $wh;
        height: $wh;
        line-height: $wh;
        color: #3cccfe;
        margin: 10px;
        border-radius: 3px;
        border: 1px solid #d3d3d3;
        transition: .4s all;
        cursor: pointer;
        &.act {
          color: #fff;
          background-color: #3cccfe;
        }
        &.act.kezhongce {
          color: #fff;
          background-color: #1fd094;
        }
        &.cur {
          opacity:.3;
        }
        &.error{
          color: #fff;
          background-color: #fb7d7d;

        }
        &.no-answer{
          background-color: rgb(179, 205, 230);
        }
      }
    }
    .foot {
      padding: 40px 0;
      .btn {
        $h: 40px;
        width: 140px;
        height: $h;
        line-height: $h;
        margin: auto;
        border-radius: $h/2;
        color: #fff;
        background-color: #3cccfe;
        cursor: pointer;
      }
    }
  }

</style>
