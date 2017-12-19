<template>
  <div class="duoheyi">
    <section class="top_">
      <header>本次测试结果</header>
      <div class="chart" v-if="true">
        <p class="title">参加测试人数`${}/${}`</p>
        <!--<p class="title">正确率{{}}</p>-->
        <table border="0" cellspacing="0" cellpadding="0" v-if="zhengquelv.length">
          <tr>
            <th>题号</th>
            <th v-for="(item,index) in zhengquelv">{{item.sortZhanshi}}</th>
          </tr>
          <tr>
            <td>正确人数</td>
            <td v-for="(item,index) in zhengquelv">{{item.rightList.length}}</td>
          </tr>
          <tr>
            <td>错题人数</td>
            <td v-for="(item,index) in zhengquelv">{{item.wrongList.length}}</td>
          </tr>
          <tr>
            <td>未答人数</td>
            <td v-for="(item,index) in zhengquelv">{{item.notanswerList.length}}</td>
          </tr>
        </table>
      </div>
      <div class="nodata" v-else>
        暂无数据
      </div>
    </section>
    <section class="body_">
      <div class="test item_" :class="{default:true,fangda:false,suoxiao:false}">
        <div class="container_" v-if="bigBol">
          <header>测试试题</header>
          <!--<div class="hidden_"></div>-->
          <div v-if="true">
            <div class="shiti">
              <div v-for="(item1,index1) in bigQuestionList">
                <div class="dati"
                     v-for="(item2,index2) in item1.typeList"
                     v-if="item1.type!=6"
                >
                  <div class="datiTitile">{{item2.itemContent}}</div>
                  <div class="xiaoti" v-for="(item3,index3) in item2.list">
                    <div class="xiaotCont">
                      <div class="xiaotiTitle">{{item3.sort}}、</div>
                      <div class="xiaotiStem" v-html="item3.stem2"></div>
                    </div>
                    <!--<shiti
                      :type="item3.type"
                      :stem="item3.stem"
                      :quesOption="item3.quesOption"
                      :key="Math.random()"
                    >
                    </shiti>-->
                    <div class="menu">
                      <p class="left1">
                        <span>正确 :{{6 + 9}}人</span>
                        <span>错误 :{{6 + 9}}人</span>
                        <span>未答题 :{{6 + 9}}人</span>
                      </p>
                      <p class="right1"  >
                        <span @click="showKey(item3)">答案</span>
                        <span @click="showYuanti(item3,index3)">原题</span>
                      </p>
                    </div>
                    <div class="answer" v-if="item3.isShow" >
                      <p class="answer-title">答案:</p>
                      <p class="answer-con" v-html="item3.answer2"></p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
          <div class="nodata" v-if="!true">
            暂无数据
          </div>
        </div>
        <div class="small" v-if="!bigBol">
          测试试题
        </div>
      </div>
      <div class="rank item_" :class="{default:true,fangda:false,suoxiao:false}">
        <div class="container_">
          <header>成绩排行榜</header>
          <div v-if="true">
            <ul>
              <li v-for="(item,index) in rinking">
                <span>第{{item.rank}}名</span>
                <span>{{item.studentName}}</span>
              </li>
            </ul>
          </div>
          <div class="nodata" v-if="!true">
            暂无数据
          </div>
        </div>
      </div>
      <div class="details item_" :class="{default:true,fangda:false,suoxiao:false}">
        <div class="container_">
          <header>试题详情</header>
          <div v-if="true">

          </div>
          <div class="nodata" v-if="!true">
            暂无数据
          </div>
        </div>
      </div>
      <div class="kushebi item_" :class="{default:true,fangda:false,suoxiao:false}">
        <div class="container_">
          <header>酷神笔</header>
          <div v-if="true">

          </div>
          <div class="nodata" v-if="!true">
            暂无数据
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
  import shiti from '../../../freeMakePaper/analysisQuestions_me1_6.vue';
  import errorData from './errorData.js';

  export default {
    data() {
      return {
        "result": {
          "knowledgeRanking": [
            {
              "knowledgeCode": "779600040001",
              "knowledgeName": "语言表达的连贯性",
              "soutCount": 1
            },
            {
              "knowledgeCode": "779600020002",
              "knowledgeName": "近义词辨析",
              "soutCount": 1
            },
            {
              "knowledgeCode": "779600020001",
              "knowledgeName": "词语使用",
              "soutCount": 1
            }
          ]
        },
        zhengquelv: [],
        /*题目*/
        bigQuestionList:[],
        /*排行榜*/
        rinking:[],
        bigBol:true,
      }
    },
    components: {shiti},
    mounted() {
//      this.getTeacherClassTestReportFromDB();
      this.zhengquelvCHULI();
    },
    methods: {
      getTeacherClassTestReportFromDB(nextFn) {
        this.$ajax.getTeacherClassTestReport(
          {
            "inClassTestCode": "65A42FEC17BA47D0A7E314A414014346",
            "paperCode": "ff8080815f70531c015f8ff48f9f0015"
          }
        )
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              if (!result || !result.roport) return;
              this.resultFromDB = result;
              this.resultFromDB = errorData.result;//接口通了注释此处
              /*数据处理*/
              {
                //接口通了就复制zhengquelvCHULI函数内容
              }
              if (nextFn) {
                nextFn();
              }
            } else {
              this.$message("通讯异常")
            }
          })
          .catch((error) => {
            console.log(error);
          })

      },
      showKey(item3){
        console.log(item3.isShow);
        item3.isShow=!item3.isShow;
      },
      showYuanti(){
        this.bigBol=false;
      },
      zhengquelvCHULI() {
        let result = errorData.result;//接口通了注释此处
        /*表格*/
        {
          let tihaoList = [];//题号列表
          result.paper.paperSystemQusetionType.forEach((item1, index1) => {
            item1.typeList.forEach((item2, index2) => {
              item2.list.forEach((item3, index3) => {
                if(item3.stem.indexOf('<img>')==-1){
                  item3.stem2 = this.strToUrl(item3.stem.split("\n")[0]);
                }
                if(item3.stem.indexOf('<img>')==-1){
                  item3.answer2=this.strToUrl(item3.answer);
                }
                item3.isShow=false;
                tihaoList.push({
                  id: item3.id,
                  sort: item3.sort,
                  sortZhanshi: item2.sort + '.' + item3.sort,
                })
              })
            })
          })
          tihaoList.forEach((item1, index1) => {
            for (let i in  result.roport) {
              if (i.length >= 32) {
                if (i == item1.id) {
                  Object.assign(item1, result.roport[i], {isZibu: false});
                } else {
                  Object.assign(item1, {
                    isZibu: true,//isZibu表明数据是前端自己补充的
                    notanswerCount: 0,
                    wrongCount: 0,
                    wrongList: [],
                    rightCount: 0,
                    rightList: [],
                    notanswerList: [],
                  });
                }
              }
            }
          })
//          console.log(JSON.stringify(tihaoList));
          this.zhengquelv = tihaoList;
        }
        /*题目*/
        this.bigQuestionList=result.paper.paperSystemQusetionType;
        this.rinking=result.rinking;
      }
    },
    computed: {},
    filters: {}

  }
</script>


<style lang="scss" scoped>
  .duoheyi {
    background: #f0f4fb;
    * {
      background: #fff;
    }
    min-height: 800px;
    header {
      height: 60px;
      line-height: 60-10px;
      padding: 10px 38px 0 38px;
      font-size: 18px;
      letter-spacing: 0.7px;
      color: #505050;
      border-bottom: 1px solid rgba(225, 229, 236, 1);
      font-weight:bold;
    }
    .top_ {
      .chart {
        /*width: 50%;*/
        overflow: auto;
        min-width: 600px;
        /*padding: 0 20px;*/
        /*padding-bottom:100px;*/
        text-align: center;
        margin: 0 auto;
        margin-top: 30px;
        position: relative;
        $w: 120px;
        $h: 50px;
        p.title {
          line-height: 30px;
        }

        table {
          min-width: 718px;
          margin: 0 auto;
          margin-top: 10px;
          th, td {
            text-align: center;
            height: 39px;
            border: 1px solid #fff;
          }
          th {
            background: #e1edf1;
          }
          td {
            background: #eff4f6;
          }
          th:nth-of-type(1) {
            border-top-left-radius: 15px;
            background: #8bb6c4;
          }
          th:nth-last-of-type(1) {
            border-top-right-radius: 15px;
          }
        }
      }
      .nodata {
        margin: 20px 16px;
        background-color: rgba(255, 255, 255, 1);
        text-align: center;
        padding: 100px;
        font-size: 20px;
      }
    }

    .body_ {
      font-size: 0;
      padding: 15px;
      .item_ {
        font-size: 0px;
        border:1px solid #e1e5ec;
        display: inline-block;
        /*width: 50%;*/
        min-height: 600px;
        vertical-align: top;
        position: relative;
        * {
          font-size: 16px;
        }
        padding-left: 20px;
        padding-right: 20px;
        &:nth-of-type(2n+1) {
          border-right: 1px solid #e1e5ec;
          .container_ {
            /*padding-left: 20px;*/
            /*padding-right: 10px;*/
          }
        }
        &:nth-of-type(2n) {
          .container_ {
            /*padding-left: 10px;*/
            /*padding-right: 20px;*/
          }
        }
        .container_ {
          width: 1000px;
          header {
            text-align: center;
            font-size: 18px;
            font-weight:bold;
          }
/*          .hidden_{
            position: absolute;
            width: 0px;
            height: 0px;
            border:10px solid transparent;
            top:50%;
            transform: translate(0,-50%);
            right: 0;
            cursor: pointer;
          }*/
          .menu {
            overflow: hidden;
            padding-bottom: 10px;
            .left1 {
              font-size: 16px;
              float: left;
              span {
                margin-right: 5px;
              }
            }
            .right1 {
              font-size: 16px;
              float: right;
              color: #1fd094;
              span {
                margin-left: 5px;
                cursor: pointer;
              }
            }
          }
          .answer{

/*            &>*{
              vertical-align: top;
              display: inline-block;
            }*/
            .answer-title{
              margin-bottom: 6px;
            }
            .answer-con{
              border:1px solid #e1e5ec;
              padding: 5px 2px;
            }
          }
        }

      }
      .test{
        width: 75%;
        .container_{
/*          .hidden_{
            border-right:10px solid red;
          }*/
          .shiti{
            .dati{
              .datiTitile{
                font-size: 18px;
                font-weight:bold;
                margin-bottom: 6px;
              }
              .xiaoti{
                border-bottom:1px solid #e1e5ec;
                padding-bottom: 20px;
                padding-top: 10px;
                .xiaotCont{
                  font-size: 0;
                  white-space: nowrap;
                  margin-bottom: 8px;
                  &>*{
                    font-size: 16px;
                    vertical-align: top;
                    white-space: normal;
                    display: inline-block;
                  }
                  .xiaotiTitle{
                    width: 2%;
                  }
                  .analysisType1_me1_6{
                    width: 98%;
                    margin-bottom: 12px;
                  }
                }

              }



            }
          }
        }
        .small{
          width: 30px;
          /*background: #000;*/
          min-height: 600px;
        }
        .menu{
          /*margin-bottom: 20px;*/
        }
      }
      .rank{
        width: 25%;
        .container_{
          ul{
            line-height: 30px;
            padding:15px;
            li{
              font-size: 18px;
              span:nth-of-type(1){
                width: 70px;
                display: inline-block;
              }
              span:nth-of-type(2){
                cursor: pointer;
                &:hover{
                  color: dodgerblue;
                }
              }
            }
          }
        }
      }
    }

  }
</style>
<style lang="scss">
  .duoheyi {
    .shiti_h {
      margin-top: 10px;
      padding-bottom: 40px;

      .nodata {
        margin: 20px 16px;
        background-color: rgba(255, 255, 255, 1);
        text-align: center;
        padding: 100px;
        font-size: 20px;
      }
    }
  }
</style>
