<template>
  <div>
    <section class="thisContent" v-loading="loading2">
      <p v-show="zanwushuju">暂无数据</p>
      <template v-for="questions in data.dataList">
        <!-- 1 - 5 结构类似 -->
        <template v-if="questions.type != 6">
          <div v-for="questionTypeWrap in questions.typeList">
            <div v-for="(item,index) in questionTypeWrap.list">
              <div class="question_title">
                <h3>
                  <span class='stem' v-html="item.stem "></span>
                </h3>
                <span v-for="(option,index) in item.quesOption">
               <span style="padding-left:.7rem;" v-html="(option.optionKey)"></span>
                <span v-html="option.optionValue"></span>
               <br/>
             </span>
                <p class="diff">
                  难度：
                  <el-rate
                  v-model="item.difficultStar"
                  disabled
                  text-color="#ff9900"
                >
                </el-rate>
                </p>
              </div>
              <br/>
            </div>
          </div>

        </template>
        <template v-else-if="questions.type == 6">
          <div class="complex-item" v-for="complex in questions.typeList">
            <div class="complex-total-title">{{complex.itemContent}}</div>
            <div v-for="(list,index1) in complex.list">
              <div v-html="list.stem" class="complex-title"></div>
              <div v-for="(item,index) in list.componentQuestions">
                <div class="question_title">
                  <h3>
                    <span class='stem' v-html="item.stem"></span>
                  </h3>
                  <div v-for="(option,index) in item.quesOption">
                    <span style="padding-left:.7rem;">{{option.optionKey}}</span>
                    <span v-html="option.optionValue"></span>
                  </div>
                  <p class="diff" v-if="index == list.componentQuestions.length - 1">
                    难度：
                    <el-rate
                    v-model="list.difficultStar"
                    disabled
                    text-color="#ff9900"
                  >
                  </el-rate>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </section>
  </div>
</template>

<script type="text/javascript">
  import {strToUrl} from '../../main'
  export default {
    data (){
      return {
        results: [],
        loading2:false,
        data: {
          reportList: [],
          groundList: [],
          dataList: [],
        },
        flag: {

        },
        query:this.$route.query,
        result: [],//试卷详情返回结果
        testInfo:this.$route.query,//试卷信息(name,id),
        zanwushuju: false
      }
    },
    props: ['code'],
    mounted: function () {
//      this.paperDetail();
    },
    watch:{
      code:'paperDetail'
    },
    methods: {
      paperDetail: function () {
        this.results = []
        this.loading2 = true
        this.zanwushuju = false
        this.$http.post(this.rootUrl + 'teacher/rescours/getResourcePaper?requestId=' + Math.random(),
          {
            "paperCode":this.code//resourcePaperCode,
          }).then((response) => {
          if(response.body.httpCode=='200'){
              this.loading2 = false
            console.log(response.body.result);
            if(Boolean(response.body.result)){
              this.data.dataList = this.resolveQuestion(response.body.result.paperSystemQusetionType);
            }else {
              this.data.dataList = []
              this.zanwushuju = true
            }

          }
        }, (response) => {
          console.log(response);
        });
      },
      preDealQuestions:function(qList){
          let thatthis = this;
        qList.forEach(function(t){
          t.typeList.forEach(function(ttt){
            ttt.list.forEach(function(tttt){
              tttt.stem=thatthis.strToUrl(tttt.stem);
              try{
                tttt.quesOption = JSON.parse(tttt.quesOption) //eval('('+tttt.quesOption+')');
                tttt.quesAnalyze = eval('('+tttt.quesAnalyze+')');
                tttt.quesOption.forEach(function(question){
                  question.optionValue=thatthis.strToUrl(question.optionValue);
                })

                tttt.quesAnalyze.forEach(function(que){
                  que.analyzeValue=thatthis.strToUrl(que.analyzeValue);
                })
              }catch(e){
                console.log(e);
                // tttt.quesOption=[];
               // tttt.quesAnalyze=[];
              }
              tttt.componentQuestions.forEach(function(component){
                try{
                  component.quesAnalyze = eval('('+component.quesAnalyze+')');
                  component.quesAnalyze.forEach(function(que){
                    que.analyzeValue=thatthis.strToUrl(que.analyzeValue);
                  })
                  component.stem=thatthis.strToUrl(component.stem);
                  component.answer=thatthis.strToUrl(component.answer);

                  component.quesOptions = eval('('+component.quesOption+')');
                  component.quesOptions.forEach(function(question){
                    question.optionValue=thatthis.strToUrl(question.optionValue);
                  });

                }catch(e){
                  console.log(e);
                  //component.quesOptions = [];
                  //component.quesAnalyze=[];
                  //;component.userAnswerResul=[];
                }
              })
            })
          })
        });

      }
    }
  }
</script>
<style lang="scss" scoped>
  .testDetail{
    .header{
      padding:0;
      .title{
        overflow:hidden;
        margin-top: 20px;
        margin-left:18px;
        box-sizing:border-box;
        padding:10px 40px;
        background:white;
        span{
          color:#000000;
          font-size:18px;
          float:left;
          display:inline-block;
          height:40px;
          line-height:40px;
        }
        button{
          float:right;
          width:143px;
          height:40px;
          border-radius:20px;
          font-size:18px;
          color:#fff;
          background:#1fd094;
          outline:none;
          cursor: pointer;
        }
      }
    }
    .thisContent{
      margin-left:18px;
      margin-top:30px;
      text-align:left;
      background:white;
      padding: 10px 40px;
      /*以下是题型解析相关加*/
      h3{
        /*color:red;*/
        font-weight: 100;
      }
      .complex-title{
        display:inline-block;
        margin-top:10px;
      }
    }
    .foot{
      margin-bottom:50px;
      button{
        width:143px;
        height:40px;
        border-radius:20px;
        font-size:18px;
        color:#fff;
        background:#1fd094;
        outline:none;
        cursor: pointer;
      }
    }

  }
  .complex-item{
    line-height: 30px;
  }
</style>


