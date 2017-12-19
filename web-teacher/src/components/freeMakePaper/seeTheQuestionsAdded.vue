<template>
  <div class="seeTheQuestionsAdded">
    <div class="app-title">
      <div class="head">
        学业质量提升平台
      </div>
    </div>
    <div class="container" v-if="numberCollect.total!=0">
      <div>
        <div class="section head grail">
          <ul class="grailLeft">
            <li>
              <el-checkbox v-model="checkBoxFirst" @change="checkFirst($event)" class="">全选</el-checkbox>
            </li>
          </ul>
          <ul class="grailRight">
            <li>难度</li>
            <li>设置分值</li>
            <li>操作</li>
          </ul>
        </div>
        <div class="section content">
          <div v-for="(bigQuestion,bigIndex) in bigQuestionList">
            <div class="bigQuestion grail">
              <ul class="grailLeft">
                <li>
                  <el-checkbox v-model="bigQuestion.isCheck" @change="checkSecond(bigQuestion,$event)" class="">
                    {{bigQuestion.itemContent}}
                  </el-checkbox>
                </li>
              </ul>
              <ul class="grailRight">
                <li></li>
                <li>总分<span class="color1fd094">{{numberCollect.typeScore[bigQuestion.itemType]}}</span>分</li>
                <li class="color1fd094 adjustBig" @click="adjustBig">调整题型顺序</li>
              </ul>
            </div>
            <!--非复合套,即type1-5-->
            <div class="smallQuestion grail"
                 v-for="(smallQuestion,smallIndex) in  bigQuestion.diagnosisSmallQuestionDtosList"
                 v-if="smallQuestion.questionType!=6"
            >
              <ul class="left_ grailLeft">
                <li>
                  <el-checkbox v-model="smallQuestion.isCheck" @change="checkThird(bigQuestion)" class="">
                    {{smallIndex + 1}}
                  </el-checkbox>
                  <analysisQuestions
                    :type="smallQuestion.questionType"
                    :stem="smallQuestion.questionStem"
                    :quesOption="smallQuestion.quesionOption"
                    :subtitle="smallQuestion.subtitle"
                    :key="Math.random()"
                  >
                  </analysisQuestions>
                </li>
              </ul>
              <ul class="right_ grailRight">
                <li>
                  <p style="margin-bottom: 10px;">{{nandu[smallQuestion.difficultStar]}}</p>
                  <el-rate v-model="smallQuestion.difficultStar" :max="3" disabled></el-rate>
                </li>
                <li>
                  <el-input-number v-model="smallQuestion.questionScore" @change="" :min="1" :max="100"
                                   label="描述文字"></el-input-number>
                </li>
                <li class="handle">
                  <p @click="deleteSmallFn(bigQuestion,bigIndex,smallIndex)">删除</p>
                  <p @click="adjustSmallFn(bigQuestion,bigIndex,smallIndex)">调整顺序</p>
                </li>
              </ul>
            </div>
            <!--复合套,即type6-->
            <div class="smallQuestion grail type6"
                 v-for="(smallQuestion,smallIndex) in  bigQuestion.diagnosisSmallQuestionDtosList"
                 v-if="smallQuestion.questionType==6"
            >
              <!--复合题的小题-->
              <div class="small-parent">
                <ul class="left_ grailLeft">
                  <li :style="{paddingLeft:(smallQuestion.levelLong==3?'60px':'25px')}">
                    <el-checkbox
                      v-model="smallQuestion.isCheck"
                      @change="checkThird(bigQuestion)"
                    >
                      {{smallIndex + 1}}
                    </el-checkbox>
                    <analysisQuestions
                      :type="smallQuestion.questionType"
                      :stem="smallQuestion.questionStemUrl"
                      :quesOption="smallQuestion.quesionOption"
                      :key="Math.random()"
                    >
                    </analysisQuestions>
                  </li>
                </ul>
                <ul class="right_ grailRight">
                  <li>
                    <p style="margin-bottom: 10px;">{{nandu[smallQuestion.difficultStar]}}</p>
                    <el-rate
                      v-model="smallQuestion.difficultStar"
                      :max="3"
                      disabled
                    ></el-rate>
                  </li>
                  <li>
                    <el-input-number
                      v-model="smallQuestion.questionScore"
                      @change=""
                      :min="1"
                      :max="100"
                      label="描述文字"
                      v-if="false"
                    ></el-input-number>
                  </li>
                  <li class="handle">
                    <p @click="deleteSmallFn(bigQuestion,bigIndex,smallIndex)">删除</p>
                    <p @click="adjustSmallFn(bigQuestion,bigIndex,smallIndex)">调整顺序</p>
                  </li>
                </ul>
              </div>
              <!--复合题的小小题-->
              <div class="small-son" v-for="(smallSon,smallSonIndex) in smallQuestion.subtitle">
                <ul class="left_ grailLeft">
                  <li>
                    <analysisQuestions
                      :type="smallSon.type"
                      :stem="smallSon.stemUrl"
                      :quesOption="smallSon.quesOption"
                      :key="Math.random()"
                    >
                    </analysisQuestions>
                  </li>
                </ul>
                <ul class="right_ grailRight">
                  <li>
                    <p style="margin-bottom: 10px;" v-if="false">{{nandu[smallQuestion.difficultStar]}}</p>
                    <el-rate
                      v-model="smallSon.difficultStar"
                      :max="3"
                      disabled
                      v-if="false"
                    ></el-rate>
                  </li>
                  <li>
                    <el-input-number
                      v-model="smallSon.score"
                      @change=""
                      :min="1"
                      :max="100"
                      label="描述文字"
                    ></el-input-number>
                  </li>
                  <li class="handle" v-if="false">
                    <p @click="deleteSmallFn(bigQuestion,bigIndex,smallIndex)">删除</p>
                    <p @click="adjustSmallFn(bigQuestion,bigIndex,smallIndex)">调整顺序</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
        <el-dialog
          title=""
          :visible.sync="dialog.isShow"
          size="tiny"
          custom-class="dialog"
        >
          <div v-if="dialog.adjustWho=='small'">
            <div class="headDialog">{{'调整' + '' + '顺序'}}</div>
            <el-select v-model="dialog.adjustSmallIndex" placeholder="请选择" popper-class="seeThsQuestionAddedElselect">
              <el-option
                v-for="(item,index) in bigQuestionList[dialog.bigIndex].diagnosisSmallQuestionDtosList"
                :key="item.repositoryQuestionCode"
                :label="'第'+(index+1)+'题'"
                :value="index">
              </el-option>
            </el-select>
            <div class="buttons">
              <el-button class="cancel" @click="cancelFn">取消</el-button>
              <el-button class="confirm" @click="confirmFn">确定</el-button>
            </div>
          </div>
          <div v-else>
            <div class="headDialog">调整题型顺序</div>
            <ul>
              <li v-for="(item,index) in bigQuestionList">
                <span>{{`${order[index]}、${item.itemContent}`}}</span>
                <span class="toTop to" @click="toBottomFn(index)"></span>
                <span class="toBottom to" @click="toTopFn(index)"></span>
              </li>
            </ul>
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="emptyBox" v-if="numberCollect.total==0">
      <div>
        <img src="../../../static/img/empty.png"/>
        <p>空空如也,点击<span @click="preFn">添加试题</span></p>
      </div>
    </div>
    <footer>
      <ul>
        <li>
          <el-checkbox v-model="checkBoxFirst" @change="checkFirst($event)" class="" v-if="numberCollect.total!=0">全选
          </el-checkbox>
        </li>
        <li @click="deleteChoosed" v-if="numberCollect.total!=0">删除选中题目</li>
        <li v-if="numberCollect.total!=0">当前选中<span class="color1fd094">{{numberCollect.chooseNum}}</span>道题</li>

        <li @click="nextFn" :class="{disabled:numberCollect.total==0}">提交试卷</li>
        <li @click="preFn" style="cursor: pointer;">返回上页</li>
        <li>
          <p v-if="numberCollect.total!=0">当前总分 :<span class="color1fd094">{{numberCollect.totalScore}}</span></p>
          <p v-else>当前总分 : <span class="color1fd094">--</span> 分</p>
        </li>
        <li>
          <p v-if="numberCollect.total!=0">共<span class="color1fd094">{{numberCollect.total}}</span>题</p>
          <p v-else>共 <span class="color1fd094">--</span> 题</p>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
  //  import {xxx} from "./试卷展示.js";
  import analysisQuestions from './analysisQuestions_me1_6.vue';

  export default {
    data() {
      return {
        bigQuestionList: [{diagnosisSmallQuestionDtosList: []}],//各种题目集合
        checkBoxFirst: true,//一级checkbox
        dialog: {
          isShow: false,
          bigIndex: 0,
          smallIndex: 0,
          adjustWho: 'big',//small为调整小题,big为调整大题
          adjustSmallIndex: 0,//调整小题为第n个
          adjustBigIndex: 0,//调整大题为第n个
        },
        order: "一二三四五六七八九十",
        nandu: ["", "简单难度", "中等难度", "困难难度"],
      }
    },
    components: {analysisQuestions},
    mounted() {
      this.handleData();

    },
    methods: {
      /*数据处理*/
      handleData() {

        let data = JSON.parse(window.localStorage.questionAdded);
        //如果之前处理过数据了,就不需要重新处理了data[0].isCheck==undefined&&

        //data[0].isCheck == undefined &&
        data.forEach((item,indexd) => {

          if (item.diagnosisSmallQuestionDtosList.length == 0) {
            data.splice(indexd, 1)
          }
          else{

            item.isCheck = true;//二级checkbox
            item.diagnosisSmallQuestionDtosList.forEach((item2, index2) => {

              item2.isCheck = true;//三级checkbox
  //            item2.itemType = item.itemType;//不自己加了,改用杨森传的questionType
              item2.difficultStar *= 1;
              item2.questionScore *= 1;
              item2.sort = index2;
              if (item2.questionType == 6) {
  //              item2.questionStem=this.strToUrl(item2.questionStem);
                item2.questionStemUrl = this.strToUrl(item2.questionStem);
              }

              if (item2.subtitle.length) {
                if (typeof(item2.subtitle) == 'string') item2.subtitle = JSON.parse(item2.subtitle);//防止代码回头,前方代码为string
                let score = 0;
                item2.subtitle.forEach((item3, index3) => {
                  item3.difficultStar = 0;
                  score += item3.score * 1;
  //                item3.stem=this.strToUrl(item3.stem);
                  item3.stemUrl = this.strToUrl(item3.stem);
                })
                item2.questionScore = score;
              }

            })
          }
        })

        this.bigQuestionList = data;
      },
      /*checkbox的三级事件*/
      checkFirst() {
        this.bigQuestionList.forEach((item) => {
          item.isCheck = event.target.checked;//2
          item.diagnosisSmallQuestionDtosList.forEach((item2) => {
            item2.isCheck = event.target.checked;//3
          })
        })
        this.updateLocalstorage();
      },
      checkSecond(item, event) {
        item.diagnosisSmallQuestionDtosList.forEach((item2, index2) => {
          item2.isCheck = event.target.checked;//3
        })
        let bol = true;
        this.bigQuestionList.forEach((item) => {
          bol = bol && item.isCheck;
        })
        this.checkBoxFirst = bol;//1
        this.updateLocalstorage();
      },
      checkThird(item) {
        let bol = true;
        item.diagnosisSmallQuestionDtosList.forEach((second) => {
          bol = bol && second.isCheck;
        })
        item.isCheck = bol;//2

        let bol2 = true;
        this.bigQuestionList.forEach((first) => {
          bol2 = bol2 && first.isCheck;
        })
        this.checkBoxFirst = bol2;//1
        this.updateLocalstorage();

      },
      deleteSmallFn(bigQuestion, bigIndex, smallIndex) {
        bigQuestion.diagnosisSmallQuestionDtosList.splice(smallIndex, 1);
        if (bigQuestion.diagnosisSmallQuestionDtosList.length == 0) {
          try{
            this.bigQuestionList.splice(bigIndex, 1);//搁置
          }catch(error){
            console.log(error);
          }
        }
        this.updateLocalstorage();
      },
      adjustBig() {
        this.dialog.adjustWho = 'big';
//        this.bigQuestionList
        this.dialog.isShow = true;
      },
      adjustSmallFn(bigQuestion, bigIndex, smallIndex) {
        this.dialog.adjustWho = 'small';
        this.dialog.isShow = true;
        this.dialog.bigIndex = bigIndex;
        this.dialog.smallIndex = smallIndex;
//        console.log("adjustSmallFn")
      },
      cancelFn() {
        this.dialog.isShow = false;
//        console.log("cancelFn")
      },
      confirmFn() {
//        console.log("confirmFn")
        this.dialog.isShow = false;
        let changeBigArr = this.bigQuestionList[this.dialog.bigIndex].diagnosisSmallQuestionDtosList;
        let changeSmallArr = changeBigArr[this.dialog.smallIndex];
        changeBigArr.splice(this.dialog.smallIndex, 1);
        changeBigArr.splice(this.dialog.adjustSmallIndex, 0, changeSmallArr);
        this.updateLocalstorage();
      },
      toBottomFn(index) {
        if (index == this.bigQuestionList.length) return;
        let changeBigArr = this.bigQuestionList[index];
        this.bigQuestionList.splice(index, 1);
        this.bigQuestionList.splice(index + 1, 0, changeBigArr);
        this.updateLocalstorage();
      },
      toTopFn(index) {
        if (index == 0) return;
        let changeBigArr = this.bigQuestionList[index];
        this.bigQuestionList.splice(index, 1);
        this.bigQuestionList.splice(index - 1, 0, changeBigArr);
        this.updateLocalstorage();
      },
      deleteChoosed() {
        this.bigQuestionList.forEach((item, index) => {
           item.diagnosisSmallQuestionDtosList = item.diagnosisSmallQuestionDtosList.filter((item2) => item2.isCheck == false)
        })
        this.updateLocalstorage();
      },
      preFn() {
        history.go(-1);
      },
      nextFn() {
        if (this.numberCollect.total == 0) return;
        this.xuhaoFn();
        this.updateLocalstorage();
        this.$router.push({path: "perfectTestInformation", query: {code: this.$route.query.code}});
      },
      /*序号重置*/
      xuhaoFn() {
        let isHaveSmallQuestion = true;
        this.bigQuestionList.forEach((item, index) => {
          item.sort = index;//大题题号
          item.diagnosisSmallQuestionDtosList.forEach((item2, index2) => {
            item2.sort = index2;//小题题号
          })
          isHaveSmallQuestion = isHaveSmallQuestion && item.diagnosisSmallQuestionDtosList.filter((item) => {
            return item.isCheck == true;
          }).length;
        })
        //        if (!isHaveSmallQuestion) {
//          this.$message("请确保每个大题中都有题目");
//          return;
//        }
//        console.log(JSON.stringify(this.bigQuestionList));
//        this.updateLocalstorage();
      },
      /*改变localstorage*/
      updateLocalstorage() {
        window.localStorage.questionAdded = JSON.stringify(this.bigQuestionList);
      },
    },
    computed: {
      numberCollect() {
//        console.log("numberCollect");
        let chooseNum = 0;//当前选中n道题
        let total = 0;//共n道题
        let totalScore = 0;//当前总分n分
        let typeScore = {};//各题型分数
        this.bigQuestionList.map((item) => {
          typeScore[item.itemType] = 0;
          item.diagnosisSmallQuestionDtosList.forEach((item2) => {
            if (item2.isCheck) {
              chooseNum++;
              if (item.itemType == 6) {
                item2.questionScore = 0;
                item2.subtitle.forEach((item3, index3) => {
                  item2.questionScore += item3.score;
                })
              }
              totalScore += item2.questionScore * 1;
              typeScore[item.itemType] += item2.questionScore * 1;
            }
            total++;
          })
          /*存入*/
          item.score = typeScore[item.itemType];
        })
        return {
          chooseNum: chooseNum,
          total: total,
          totalScore: totalScore,
          typeScore: typeScore,
        };
      },
    },
    filters: {}

  }
</script>


<style lang="scss">
  .seeTheQuestionsAdded {
    text-align: left;
    background: #f0f4fb;
    width: 100%;
    height: 100%;
    position: relative;
    /*height: 100%;*/
    .app-title {
      z-index: 101;
      top: 0;
      left: 0;
      $h: 70px;
      height: $h;
      width: 100%;
      min-width: 640px;
      line-height: $h;
      background: #4c6175;
      color: #fff;
      margin-bottom: 40px;
      .head {
        width: 240px;
        float: left;
        font-size: 24px;
        border-right: 1px solid #324353;
        line-height: 40px;
        margin: ($h - 40 )/2 0;
        padding-left: 30px;
      }
    }
    .container {
      width: 100%;
      /*height: 100%;*/
      background: #f0f4fb;
      & > div {
        width: 1200px;
        margin: 0 auto;
        padding-bottom: 60px; //footer高60
        min-height: 100%;
        background: #ffffff;
        .grail {
          position: relative;
          .grailLeft {
            width: 100%;
            padding-right: 172+176+168px;
            vertical-align: middle;
            .el-checkbox__label {
              font-size: 18px;
            }
            /*background: red;*/
            li {
              padding-left: 25px;
              font-size: 18px;
            }
          }
          .grailRight {
            position: absolute;
            width: 172+176+168px;
            right: 0;
            top: 0;
            /*background: orange;*/
            font-size: 0;
            * {
              font-size: 18px;
            }
            li {
              display: inline-block;
              text-align: center;
              &:nth-of-type(1) {
                width: 172px;
              }
              &:nth-of-type(2) {
                width: 176px;
              }
              &:nth-of-type(3) {
                width: 168px;
              }
            }
          }
        }

        .section.head {
          background: #fff;
          li {
            height: 60px;
            line-height: 60px;
          }
        }
        .section.content {
          margin-top: 10px;
          background: #fff;
          .bigQuestion {
            height: 60px;
            line-height: 60px;
            background: #fffbeb;
            .adjustBig {
              cursor: pointer;
            }
          }
          .smallQuestion {
            min-height: 100px;
            padding-top: 40px;
            padding-bottom: 50px;
            border-bottom: 1px solid #f0f4fb;
            ul.left_ {
              li {
                font-size: 0;
                & > * {
                  display: inline-block;
                  vertical-align: top;
                  font-size: 16px;
                }
                .el-checkbox {
                  width: 12%;
                  .el-checkbox__label {
                    width: 40px;
                    height: 34px;
                    line-height: 34px;
                    background-color: #f0f4fb;
                    display: inline-block;
                    text-align: center;
                    margin-left: 10px;
                    margin-right: 10px;
                    padding-left: 0;
                  }
                }
                .analysisType1_me1_6 {
                  width: 88%;
                  margin-top: 4px;
                  * {
                    word-wrap: break-word;
                    word-break: break-all;
                  }
                }
              }
            }
            ul.right_ {
              top: 40px;
              .el-input-number {
                width: 120px;
                height: 36px;
                .el-input {
                  .el-input__inner {
                    text-align: center;
                  }
                }
              }
              li {
                vertical-align: middle;
                &:nth-of-type(3) {
                  line-height: 36px;
                  p:nth-of-type(1) {
                    cursor: pointer;
                    &:hover {
                      color: red;
                    }
                  }
                  p:nth-of-type(2) {
                    cursor: pointer;
                    &:hover {
                      color: #1fd094;
                    }
                  }
                }
              }
            }
          }
          .smallQuestion.type6 {
            .small-son {
              position: relative;
              min-height: 60px;
              border-bottom: 1px dashed #f0f4fb;
              padding-top: 15px;
              padding-bottom: 15px;
              .grailLeft {
                padding-left: 100px;
              }
              .grailRight {
                top: 15px;
              }
            }
            .small-son:nth-last-of-type(1) {
              border-bottom: 0;
            }
          }
        }
        .el-dialog__wrapper {
          text-align: left;
          .el-dialog {
            width: 630px;
            height: 340px;
            border-radius: 10px;
          }
          .el-dialog__header { //设header高为0
            padding: 0;
            height: 0px;
            background: red;
            position: relative;
            .el-dialog__headerbtn { //改变关闭按钮位置
              position: absolute;
              right: 10px;
              top: 10px;
            }
          }
          .el-dialog__body { //全部由body撑起
            padding: 0;
            height: 390px;
            /*background:green;*/
            text-align: center;
            .headDialog { //自定义填充内容
              height: 68px;
              line-height: 68px;
              background-color: #d3f2e5;
              font-size: 18px;
              color: #313944;
            }
            .el-select {
              width: 491px;
              height: 51px;
              background-color: #eff3fb;
              border-radius: 4px;
              /*border: solid 1px #bfcbd9;*/
              margin-top: 80px;
              margin-bottom: 50px;
              .el-input {
                height: 100%;
                .el-input__inner {
                  height: 100%;
                  font-size: 16px;
                }
              }
            }
            .buttons {
              .el-button {
                color: #fff;
                border: 0;
                width: 141px;
                height: 40px;
                border-radius: 20px;
                font-size: 18px;
                &:hover {
                  border: 0;
                }
              }
              .cancel {
                background: #afb1b3;
              }
              .confirm {
                background: #1fcc95;
              }
            }
            ul {
              margin-top: 20px;
              li {
                font-size: 0;
                margin-bottom: 10px;
                &:hover {
                  color: #1fd094;
                }
                * {
                  font-size: 16px;
                  display: inline-block;
                  vertical-align: middle;
                }
                .to {
                  width: 30px;
                  height: 30px;
                  background-size: 100% 100%;
                  cursor: pointer;
                  border-radius: 8px;
                }
                .toBottom {
                  margin-left: 25px;
                  background-image: url("../../../static/img/adjust4.png");
                  &:hover {
                    background-image: url("../../../static/img/adjust3.png");
                  }
                }
                .toTop {
                  margin-left: 15px;
                  background-image: url("../../../static/img/adjust2.png");
                  &:hover {
                    background-image: url("../../../static/img/adjust1.png");
                  }
                }

              }
            }
          }
        }
      }
    }
    .emptyBox {
      width: 100%;
      height: 100%;
      background: #fff;
      text-align: center;
      font-size: 20px;
      & > div {
        width: 300px;
        height: 300px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        img {
          margin-bottom: 35px;
        }
        p {
          color: #dddddd;
          span {
            color: #1fd094;
            font-weight: bold;
            cursor: pointer;
          }
        }
      }

    }
    footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      background: #fff;
      box-shadow: 0px 0px 20px 0px rgba(39, 113, 170, 0.23);
      z-index: 99999;
      ul {
        width: 1200px;
        margin: 0 auto;
        background: #fff;
        overflow: hidden;
        li {
          float: left;
          height: 60px;
          line-height: 60px;
          &:nth-of-type(1) {
            width: 94px;
            margin-left: 25px;
            .el-checkbox__label {
              font-size: 16px;
              padding-left: 5px;
            }
          }
          &:nth-of-type(2) {
            width: 128px;
            cursor: pointer;
            &:hover {
              /*color: red;*/
            }
          }
          &:nth-of-type(3) {
            width: 120px;
          }
          &:nth-last-of-type(1) {
            float: right;
            width: 111px;
          }
          &:nth-last-of-type(2) {
            float: right;
            width: 156px;
          }
          &:nth-last-of-type(3) {
            float: right;
            width: 121px;
            text-align: center;
            background-color: #d3f2e5;
            margin-right: 10px;
            color: #505050;
          }
          &:nth-last-of-type(4) {
            float: right;
            width: 121px;
            text-align: center;
            background-color: #1fd094;
            color: #fff;
            cursor: pointer;
            &.disabled {
              background: #e1e5ec;
              cursor: not-allowed;
            }
          }
          .color1fd094 {
            font-size: 18px;
            font-weight: bold;
            vertical-align: top;
          }
        }

      }
    }
    .analysisType1_me1_6{
      line-height: 30px;
    }
  }

  .color1fd094 {
    color: #1fd094;
  }

  .seeThsQuestionAddedElselect {
    .el-select-dropdown__item.selected {
      background: #1fd094;
    }
    .el-select-dropdown__item.selected.hover {
      background: #1fd094;
    }
  }

</style>
