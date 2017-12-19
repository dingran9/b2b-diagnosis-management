<template>
  <div class="testDetail">
    <section class="header" v-if="true">
      <div class="title">
        <span>单元测>发布测试>试卷详情</span>
        <button @click="goBack">返回上一级</button>
      </div>
    </section>
    <div v-if="data.dataList.length">
      <section class="content">
        <template v-for="questions in data.dataList">
          <!-- 1 - 5 结构类似 -->
          <template v-if="questions.type != 6">
            <div v-for="questionTypeWrap in questions.typeList">
              <div v-for="(item,index) in questionTypeWrap.list">
                <div class="question_title">
                  <h3>
                    <span class='stem' v-html="item.stem"></span>
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
      <section class="foot" v-if="true">
        <router-link :to="{path:'/main/sendTestPaper', query:$route.query}">
          <button>下一步</button>
        </router-link>
      </section>
    </div>
    <div class="nodata" v-else>
      暂无数据
    </div>
  </div>
</template>
<script>
  //  import favQuestion from './testPaperAnalysis';
  export default {
    props: [],
    components: {
//      favQuestion
    },
    data() {
      return {
        data: {
          reportList: [],
          groundList: [],
          dataList: [],
        },
        flag: {},
        query: this.$route.query,
        result: [],//试卷详情返回结果
        testInfo: this.$route.query,//试卷信息(name,id)
      }
    },
    mounted() {
      this.initData();
    },
    methods: {
      goBack() {
        this.$router.push({path: "/releaseTesting/releaseTesting", query: this.$route.query})
      },
      initData() {
        this.$ajax.paperDetail({
          code: JSON.parse(window.localStorage.testDetail).code,
          resourceType: this.$route.query.resourceType
        })
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              if (!result || !result.paperSystemQusetionType) {
                return;
              }
              this.data.dataList = this.resolveQuestion(result.paperSystemQusetionType);
            } else {
              this.$message('获取试题失败,请刷新重试')
            }

          }, (res) => {
            console.log(res);
          });
      },

    },
    computed: {},
    filters: {},
  }
</script>
<style lang="scss" scoped>
  .testDetail {
    .header {
      padding: 0;
      margin-right: 20px;
      .title {
        overflow: hidden;
        margin-top: 20px;
        margin-left: 18px;
        box-sizing: border-box;
        padding: 10px 40px;
        background: white;
        span {
          color: #000000;
          font-size: 18px;
          float: left;
          display: inline-block;
          height: 40px;
          line-height: 40px;
        }
        button {
          float: right;
          width: 143px;
          height: 40px;
          border-radius: 20px;
          font-size: 18px;
          color: #fff;
          background: #1fd094;
          outline: none;
          cursor: pointer;
        }
      }
    }
    .content {
      margin-left: 18px;
      margin-right: 20px;
      margin-top: 30px;
      text-align: left;
      background: white;
      padding: 10px 40px;
      /*以下是题型解析相关加*/
      h3 {
        /*color:red;*/
        font-weight: 100;
      }
      .complex-title {
        display: inline-block;
        margin-top: 10px;
      }
    }
    .foot {
      margin-bottom: 30px;
      margin-top: 30px;
      button {
        width: 143px;
        height: 40px;
        border-radius: 20px;
        font-size: 18px;
        color: #fff;
        background: #1fd094;
        outline: none;
        cursor: pointer;
      }
    }
    .nodata {
      overflow: hidden;
      margin-top: 20px;
      margin-left: 18px;
      margin-right: 20px;
      box-sizing: border-box;
      padding: 300px 40px;
      background: white;
      font-size: 20px;
    }
  }

  .complex-item {
    line-height: 30px;
  }
</style>
