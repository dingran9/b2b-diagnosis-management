<template>
  <div class="singleQuestionReport">
    <header>
      <span v-if="false">请选择题目</span>
      <el-select v-model="questionCode.choosed" @change="switchClass"  v-if="$route.query.source != 2">
        <el-option :label="`第${item.sout}题`" :value="index" v-for="(item,index) in questionCode.list"></el-option>
      </el-select>
      <el-select v-model="selection.choosed" @change="switchClass"  v-if="$route.query.source == 2">
        <el-option :label="`第${item.sort}题`" :value="index" v-for="(item,index) in selection.list"></el-option>
      </el-select>
    </header>
    <section class="question-knowledge">
      <div class="question" >
        <analysisQuestions_me :qaseQuestion="qaseQuestion" v-if="qaseQuestion.baseName" :key="Math.random()"></analysisQuestions_me>
      </div>
      <div class="knowledge">
        <p>涉及的知识点 : </p>
        <ul>
          <li v-for="(item,index) in konwledge.list">{{item.name}}</li>
        </ul>
      </div>
    </section>
    <section class="accuracy">
      <ul class="top">
        <li :class="{active:accuracy.choosed==index}" v-for="(item,index) in accuracy.list"
            @click="switchAccuracy(item,index)">{{`${item.typeName}(${item.studentList.length})`}}
        </li>
      </ul>
      <div class="studentScale">
        <p>正确率 : <span>{{accuracy.rightRadio}}</span></p>
        <ul class="student">
          <li v-for="i in accuracy.list[1].studentList" class="right" v-if="accuracy.choosed==0||accuracy.choosed==1">
            {{i==null?'未设名字':i}}
          </li>
          <li v-for="i in accuracy.list[2].studentList" class="wrong" v-if="accuracy.choosed==0||accuracy.choosed==2">
            {{i==null?'未设名字':i}}
          </li>
          <li v-for="i in accuracy.list[3].studentList" class="no" v-if="accuracy.choosed==0||accuracy.choosed==3">
            {{i==null?'未设名字':i}}
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
  import analysisQuestions_me from '../components/analysisQuestions_me.vue'
  export default {
    data() {
      return {
        /*source不为2的数据*/
        accuracy: {//全部正确错误未回答,//单题报告接口返回结果融合
          list: [//count,type暂时没有用
            {typeName: "全班", studentList: [], count: 0, type: "all"},
            {typeName: "正确", studentList: [], count: 0, type: "right"},
            {typeName: "错误", studentList: [], count: 0, type: "wrong"},
            {typeName: "未回答", studentList: [], count: 0, type: "no"},
          ],
          choosed: 0,
        },
        questionCode: {//题目code列表,下拉
          list: [],
          choosed: 0,
        },
        konwledge: {//知识点列表
          list: [],
        },
        qaseQuestion:{},//题目
        singleResult: {},//单题报告接口返回结果
        /*source为2的数据*/
        selection:{
          list:[],
          choosed: 0,
          accuracy:{},
        },
      }
    },
    components: {
      analysisQuestions_me,
    },
    created() {

    },
    mounted() {
      if (this.$route.query.source == 2) {
        this.classTestGodPenRelationSingleReportFrom(()=>{
          this.getResourcePaperFromDB(()=>{

          });
        });
      }else{
        this.baseQuestionCodeListByClassTestCodeFromDB(() => {
          this.classTestRelationSingleReportFromDB();
        });
      }
    },
    methods: {
      switchClass() {
        if (this.$route.query.source == 2){
          this.qaseQuestion=this.selection.list[this.selection.choosed];
          {//正确率
            let id=this.selection.list[this.selection.choosed].id;
            this.accuracy=this.selection.accuracy[id].accuracy;
          }
          {//知识点
            let arr=this.selection.list[this.selection.choosed].tree;
            let arrResult=[];
            arr.forEach((item,index)=>{
              arrResult.push({
                id:"",
                name:item.name,
              })
            })
            this.konwledge.list=arrResult;
          }
        }else{
          this.classTestRelationSingleReportFromDB();
        }
      },
      switchAccuracy(item, index) {
        this.accuracy.choosed = index;
      },
      /*questionCode列表*///稍后正序
      baseQuestionCodeListByClassTestCodeFromDB(nextFn) {
        this.$ajax.baseQuestionCodeListByClassTestCode({inClassTestCode: this.$route.query.inClassTestCode})
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              if (!result || !result.rows) return;
              {//重新排序
                result.rows.sort((a, b) => {
                  return a.sout - b.sout;
                })
              }
              this.questionCode.list = result.rows;
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
      /*单题报告*/
      classTestRelationSingleReportFromDB(nextFn) {
        let sendData = {
          baseCode: this.questionCode.list[this.questionCode.choosed].baseCode,
          inClassTestCode: this.$route.query.inClassTestCode,
          classCode: this.$route.query.classCode,
        }
        this.$ajax.classTestRelationSingleReport(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              if (!result || !result.qaseQuestion) {
                this.accuracy = {
                  list: [
                    {typeName: "全班", studentList: [], count: 0, type: "all"},
                    {typeName: "正确", studentList: [], count: 0, type: "right"},
                    {typeName: "错误", studentList: [], count: 0, type: "wrong"},
                    {typeName: "未回答", studentList: [], count: 0, type: "no"},
                  ],
                  choosed: 0,
                }
                this.konwledge={
                  list: [],
                }
                this.qaseQuestion={};
                return;
              }
              {//与this.accuracy聚合
                this.accuracy.list[0].studentList = [...result.wrongList, ...result.rightList, ...result.notanswerList];
                this.accuracy.list[1].studentList = result.rightList;
                this.accuracy.list[2].studentList = result.wrongList;
                this.accuracy.list[3].studentList = result.notanswerList;
                this.accuracy.rightRadio = ((this.accuracy.list[1].studentList.length / this.accuracy.list[0].studentList.length* 100).toFixed(2))  + '%';
              }
              this.konwledge.list = JSON.parse(result.qaseQuestion.knowledges);
              this.qaseQuestion=result.qaseQuestion;
              this.singleResult = result;
              if (nextFn) {
                nextFn();
              }
//              console.log(JSON.stringify(this.qaseQuestion),"**")
            } else {
              this.$message("通讯异常")
            }
          })
          .catch((error) => {
            console.log(error);
          })
      },
      /*source为2的时候,题目列表*/
      getResourcePaperFromDB(nextFn) {
        this.$ajax.getResourcePaper({
          paperCode: this.$route.query.paperCode,
        })
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              if (!result || !result.paperSystemQusetionType) return;
              {//数据处理
                let arr = [];
                result.paperSystemQusetionType.forEach((item, index) => {
                  if (item.type == 1) {
                    item.typeList.forEach((item2, index2) => {
                      item2.list.forEach((item3, index3) => {
                        item3.baseName=item3.stem;
                        item3.questionOption=item3.quesOption;
                        arr.push(item3);
                      })
                    })
                  }
                })
//                console.log(JSON.stringify(arr));
                this.selection.list = arr;
                {//初始下拉显示
                  this.qaseQuestion=this.selection.list[this.selection.choosed];
                  {//正确率
                    let id=this.selection.list[this.selection.choosed].id;
                    this.accuracy=this.selection.accuracy[id].accuracy;
                  }
                  {//知识点
                    let arr=this.selection.list[this.selection.choosed].tree;
                    let arrResult=[];
                    arr.forEach((item,index)=>{
                      arrResult.push({
                        id:"",
                        name:item.name,
                      })
                    })
                    this.konwledge.list=arrResult;
                  }
                }
              }
              nextFn();
            } else {
              this.$message("通讯异常")
            }
          })
          .catch((error) => {
            console.log(error);
          })
      },
      /*source为2的时候,正确率表*/
      classTestGodPenRelationSingleReportFrom(nextFn){
        this.$ajax.classTestGodPenRelationSingleReport({
          inClassTestCode:this.$route.query.inClassTestCode,
          classCode:this.$route.query.classCode,
        })
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              if (!result || !result.studentTotal) return;
              for(let key in result){
                if(key.length>=32){//如果key是code,
                  if(result[key].rightList==undefined){//坑
                    result[key].rightList=[];
                  }
                  if(result[key].wrongList==undefined){
                    result[key].notanswerList=[];
                  }
                  if(result[key].notanswerList==undefined){
                    result[key].notanswerList=[];
                  }
                  result[key].accuracy={
                    list: [
                      {typeName: "全班", studentList: [], count: 0, type: "all"},
                      {typeName: "正确", studentList: [], count: 0, type: "right"},
                      {typeName: "错误", studentList: [], count: 0, type: "wrong"},
                      {typeName: "未回答", studentList: [], count: 0, type: "no"},
                    ],
                    choosed: 0,
                  };
                  result[key].accuracy.list[0].studentList=[...result[key].wrongList, ...result[key].rightList, ...result[key].notanswerList];
                  result[key].accuracy.list[1].studentList=result[key].rightList;
                  result[key].accuracy.list[2].studentList=result[key].wrongList;
                  result[key].accuracy.list[3].studentList=result[key].notanswerList;
                  result[key].accuracy.rightRadio = ((result[key].accuracy.list[1].studentList.length / result[key].accuracy.list[0].studentList.length* 100).toFixed(2))  + '%';
                }
              }
              this.selection.accuracy=result;
              nextFn();
            } else {
              this.$message("通讯异常")
            }
          })
          .catch((error) => {
            console.log(error);
          })
      }
    },
    computed: {},
    filters: {}

  }
</script>


<style lang="scss" scoped>
  .singleQuestionReport {
    text-align: left;
    padding-bottom: 64px;
    header {
      height: 70px;
      line-height: 70px;
      border-bottom: 1px solid rgba(225, 229, 236, 1);
      padding-left: 40px;
      & > span {
        width: 72px;
        font-size: 16px;
        color: #505050;
        margin-left: 40px;
        margin-right: 20px;
      }
      .el-select {
        width: 180px;
        height: 40px;
      }
    }
    section.question-knowledge {
      font-size: 0;
      padding-top: 38px;
      & > * {
        font-size: 16px;
        display: inline-block;
        vertical-align: top;
      }
      .question {
        width: 55%;
        min-height: 100px;
        padding-left:40px;
        padding-right:20px;
        word-wrap: break-word;
        word-break:break-all;
        /*background: #000;*/
      }
      .knowledge {
        width: 45%;
        min-height: 100px;
        text-align: left;
        /*background: #ffff00;*/
        & > p {
          font-size: 18px;
          line-height: 32px;
          letter-spacing: 0.7px;
          color: #505050;
          margin-bottom:10px;
        }
        ul {
          li {
            box-sizing: border-box;
            display: inline-block;
            padding:10px 20px;
            margin-right:10px;
            margin-bottom: 10px;
            height: 31px;
            line-height:31-10*2px;
            background-color: rgba(211, 242, 229, 1);
            border-radius: 15px 15px 15px 15px;
          }
        }
      }
    }
    section.accuracy {
      width: 940px;
      box-sizing: border-box;
      /*height: 594px;*/
      background-color: rgba(255, 255, 255, 1);
      border-radius: 3px 3px 3px 3px;
      border: solid 4px rgba(235, 240, 244, 1);
      margin: 64px auto 0;
      padding: 0px 64px 38px;
      ul.top {
        font-size: 0;
        border-bottom: 2px solid rgba(235, 240, 244, 1);
        padding: 10px 0px;
        * {
          font-size: 16px;
          display: inline-block;
        }
        li {
          width: 120px;
          height: 41px;
          line-height: 41px;
          border-radius: 20px 20px 20px 20px;
          text-align: center;
          margin-right: 15px;
          cursor: pointer;
          &:hover {
            background-color: #d3f2e5;
            color: #000;
          }
          &.active {
            background-color: #1fd094;
            color: #fff;
          }
        }
      }
      .studentScale {
        text-align: center;
        /*width: 880px;*/
        /*height: 470px;*/
        background-color: rgba(242, 249, 254, 1);
        margin-top: 26px;
        padding: 0px 80px 34px;
        box-sizing: border-box;
        & > p {
          height: 76px;
          font-size: 18px;;
          line-height: 76px;
          letter-spacing: 0.7px;
          color: #505050;
          span {
            color: #1fd094;
          }
        }
        ul.student {
          text-align: left;
          font-size: 0;
          * {
            font-size: 16px;
            display: inline-block;
            vertical-align: middle;
          }
          li {
            width: 104px;
            height: 43px;
            background-color: rgba(31, 208, 148, 1);
            margin-right: 2px;
            margin-bottom: 2px;
            text-align: center;
            line-height: 43px;
            font-size: 18px;
            color: #fff;
            &.right {
              background: #1fd094;
            }
            &.wrong {
              background: #ff6666;
            }
            &.no {
              background: #b3cde6;
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .singleQuestionReport {

  }
</style>
