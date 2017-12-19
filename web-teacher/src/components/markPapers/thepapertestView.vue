<template>
  <div class="hello">
    <!--试题-->
    <div class="paperbottomView">
      <h4 class="testnostyle">题号:{{paperdata.questionNo}}</h4>

      <div class="topicofdrystyle"
           v-html="paperdata.stem">
      </div>

      <ul v-for="temp in paperdata.componentQuestions"
          style="margin:0 20px ">
        <li>
          <span v-html="strToUrl(temp.stem)"></span>
        </li>
        <li style="margin-top: 20px">
          <b>解析：</b>
          <a v-for="analyze in temp.quesAnalyze">
            <span v-html="strToUrl(analyze.analyzeValue)"></span>
          </a>
        </li>
      </ul>

      <div class="clear-fix" style="border-bottom:1px solid #e8e8e8;">
        <!--正确答案-->
        <div class="rightexamineeanswers">
          <h4 class="testnostyle">正确答案：</h4>
          <div class="topicofdrystyle"
          >
            <template v-if="Array.isArray(paperdata.answer)">
              <div v-for="(oneAnswer,index) in paperdata.answer">
                第{{index + 1}}空的答案是:
                <span style="color:#13ce66" v-html="oneAnswer.answerValue"></span>
                ,分数值是:
                <span style="color:#13ce66">{{oneAnswer.score}}</span>
                分
              </div>
            </template>
            <template v-else>
              <div v-html="paperdata.answer"></div>
            </template>

          </div>
        </div>
        <!--考生答案-->
        <div class="leftexamineeanswers">
          <h4 class="testnostyle">考生答案：</h4>
          <div class="topicofdrystyle answer">
            <template v-if="typeof paperdata.userAnswerResul == 'string' ">
              <span v-html="paperdata.userAnswerResul || '未作答'"></span>
            </template>
            <template v-else>
              <span v-for="img in paperdata.userAnswerResul" v-html="img "></span>
            </template>
          </div>
        </div>

        <!--虚线-->
        <div class="line_xuxian"></div>

      </div>
      <div>
        <h4 class="testnostyle">本题考察知识点范围：</h4>
        <template v-for="i in paperdata.basetree">
          <button
            v-for="j in i.sons"
            type="success"
            :class="{checked:j.isRight}"
            class="buttonstyle"
            @click="treeChange(paperdata,j)">{{j.nameVo}}
          </button>
        </template>

      </div>
      <!--得分  提交-->
      <div class="scorebuttonstyle">
        <span class="bottomsubmitStyle" style="margin-left: 35px">本题满分：</span>
        <span :disabled="true"
              class="disabledinputsocre"
              style="background-color: #eef1f6"
              readonly="readonly">
        {{paperdata.score}} 分
      </span>
        <span class="bottomsubmitStyle">得分：</span>
        <ge-input
          v-model="paperdata.teacherScore"
          class="disabledinputsocre"
          :max="paperdata.score"
          pointNum="1"
          :disabled="paperdata.type == 2 || paperdata.isLock"></ge-input>
        <el-button type="success"
                   v-if="!paperType"
                   class="submitbuttonpaperstyle "
                   :class="{write:paperdata.isLock}"
                   @click="querstionLock(paperdata)">
          &nbsp;{{paperdata.isLock ? '修改' : '锁定'}}
        </el-button>
      </div>
    </div>


  </div>
</template>

<script>
  import geInput from './input.vue'

  export default {
    components: {geInput},
    props: {
      paperdata: {},
      paperType: {}
    },
    methods: {
      querstionLock(question) {
        if (question.isLock) {
          question.isLock = false;
        } else {
          if (question.teacherScore === '') {
            this.$message('请给本题打分后再锁定');
            return;
          }
          if (question.teacherScore == question.score) {
            //满分
            console.log(question)
            try {
              let flog = question.basetree.some(tree => tree.sons.some(item => !item.isRight));
              if (flog) {
                this.$message('满分应不存在错误知识点,请检查修改后再锁定');
                return;
              }
            } catch (e) {
            }
          }
          if (question.teacherScore == 0) {
            //零分
            console.log(question)
            try {
              let flog = question.basetree.some(tree => tree.sons.find(item => !item.isRight));
              if (!flog) {
                this.$message('零分情况下,知识点应该全部错误,请检查修改后再锁定');
                return;
              }
            } catch (e) {
            }
          }
          question.isLock = true;
        }
      },
      treeChange(question, tree) {
        if (this.paperType) return;
        if (question.isLock) {
          this.$message('本题已被锁定,请点击修改按钮后再进行修改');
        } else {
          tree.isRight = +(!tree.isRight);
        }
      }
    },
    data() {
      return {
        changevalue: ""
      }
    },
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">

  .paperbottomView {
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    margin: 0 30px 20px;
    text-align: left;
    /*相对定位*/
    position: relative;
  }

  .testnostyle {
    font-weight: inherit;
    font-size: 18px;
    margin: 15px 15px;

  }

  .topicofdrystyle {
    margin: 0 15px 15px;
  }

  .leftexamineeanswers {
    float: left;
    display: inline-block;
    width: 50%;
    min-width: 200px;
    margin-top: 20px;
    border-left: .5px solid #e8e8e8;
  }

  .rightexamineeanswers {
    border-right: .5px solid #e8e8e8;
    float: left;
    margin-top: 20px;
    position: relative;
    text-align: left;
    display: inline-block;
    width: 50%;
    vertical-align: top;
    min-width: 200px;

  }

  .line_xuxian {
    border-bottom: 1px solid #ecf1f9;
    margin-top: 20px;

  }

  .buttonstyle {
    cursor: pointer;
    margin-bottom: 15px;
    margin-left: 10px;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 3px;
    border: 1px solid red;
    background-color: white;
    color: red;
    outline: none;
  }

  .scorebuttonstyle {
    margin: 0px 15px 20px;
    padding: 20px 0;
    border-top: 1px solid #ecf1f9;
    position: relative;
    text-align: left;

  }

  .submitbuttonstyle {
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 100px;
  }

  .bottomsubmitStyle {
    font-weight: inherit;
    font-size: 18px;
    margin: 15px 15px;

  }

  .disabledinputsocre {
    font-size: 18px;
    line-height: 35px;
    border: 1px solid #dadada;
    height: 35px;
    width: 100px;
    border-radius: 3px;
    color: black;
    padding: 0 10px;
    display: inline-block;

  }

  .submitbuttonpaperstyle {
    position: absolute;
    right: 0px;
    bottom: 20px;
    width: 100px;
    &.write {
      background: #ccc;
      border-color: #ccc;
    }
  }

  .checked {
    border: 1px solid #13ce66;
    color: #13ce66;
    outline: none;
  }

</style>

<style>
  .topicofdrystyle.answer img {
    /*width: 90%;*/
    max-width: 90% !important;

  }

</style>
