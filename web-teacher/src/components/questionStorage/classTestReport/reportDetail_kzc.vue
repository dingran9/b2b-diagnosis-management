<template>
  <div class="reportDetail_kzc">
    <header>
      <div class="title">
        <div class="left">
          <img src="../../../../static/img/arrle.png" @click="goBack"/>
          <span @click="goBack">班级测试报告></span>
          <span class="green">{{fromQuery.inClassTestName}}</span>
        </div>
        <div class="right" @click="sort" v-if="false">
          <ul>
            <li>查看本次试题</li>
            <li><img src="../../../../static/img/downArrow.png" v-show="sortBol"/>
              <img
                src="../../../../static/img/upArrow.png" v-show="!sortBol"/>
              <span>收藏该报告</span></li>
          </ul>
        </div>
      </div>


    </header>
    <div class="report-container">
      <div class="left">
        <ul>
          <li v-for="(item,index) in columns" @click="switchReport(item,index)" :class="{active:whichReport==index}">
            <i class="circle"></i>
            {{item.title}}
          </li>
        </ul>
      </div>
      <div class="right">
        <div>
          <reportOverview v-if="columns[whichReport].fileName=='reportOverview'"></reportOverview>
          <accuracyReport v-if="columns[whichReport].fileName=='accuracyReport'"></accuracyReport>
          <knowledgePointReport v-if="columns[whichReport].fileName=='knowledgePointReport'"></knowledgePointReport>
          <singleQuestionReport v-if="columns[whichReport].fileName=='singleQuestionReport'"></singleQuestionReport>
          <rank v-if="columns[whichReport].fileName=='banjipaihangbang'"></rank>
          <duoheyi v-if="columns[whichReport].fileName=='duoheyi'"></duoheyi>

        </div>
      </div>
    </div>
    <!--<div class="gege">{{test.total}}</div>-->
  </div>
</template>

<script>
  import reportOverview from './reports/reportOverview.vue'
  import accuracyReport from './reports/accuracyReport.vue'
  import knowledgePointReport from './reports/knowledgePointReport.vue'
  import singleQuestionReport from './reports/singleQuestionReport.vue'
  import duoheyi from './reports/duoheyi.vue'
  import Rank from './rank.vue'

  export default {
    data() {
      return {
        sortBol: true,//最近测试
        columns: [//左右栏对应
          {title: '报告', fileName: 'duoheyi'},
          {title: '报告总览', fileName: 'reportOverview'},
          {title: '正确率报告', fileName: 'accuracyReport'},
          {title: '知识点报告', fileName: 'knowledgePointReport'},
          {title: '单题报告', fileName: 'singleQuestionReport'},
          {title: '班级排行榜', fileName: 'banjipaihangbang'},

        ],
        whichReport: 0,//当前报告
        fromQuery: this.$route.query,
      }
    },
    components: {reportOverview, accuracyReport, knowledgePointReport, singleQuestionReport, Rank,duoheyi},
    mounted() {
//        console.log(this.$route.query)
    },
    methods: {
      fn() {
//        console.log(arguments)
      },
      goBack() {
//        window.history.go(-1);
        this.$router.push({path: "/questionStorage/classTestReport"})
      },
      /*排序*/
      sort() {
        this.sortBol = !this.sortBol;
      },
      /*点击左侧,切换右侧报告*/
      switchReport(item, index) {
        this.whichReport = index;
      }

    },
    computed: {},
    filters: {}

  }
</script>


<style lang="scss" scoped>
  .reportDetail_kzc {
    text-align: left;
    * {
      padding: 0;
      margin: 0;
    }
    header {
      margin: 20px 16px;
      background-color: rgba(255, 255, 255, 1);
      .title {
        height: 100px;
        line-height: 100px;
        border-bottom: 1px solid rgba(225, 229, 236, 1);
        * {
          vertical-align: middle;
          display: inline-block;
        }
        img {
          width: 19px;
          height: 18px;
        }
        .left {
          font-size: 18px;
          display: inline-block;
          color: #4c6175;
          margin-left: 40px;
          float: left;
          & > span:nth-of-type(1) {
            cursor: pointer;
          }
          img {
            cursor: pointer;
          }
          .green {
            color: #1fd094;
          }
        }
        .right {
          * { //多处用此
            display: inline-block;
            vertical-align: middle;
          }
          ul {
            li {
              cursor: pointer;
              margin-left: 10px;
              font-size: 18px;
              color: #505050;
            }
          }
          i {
            display: inline-block;
            margin-right: 10px;
          }
          img {
            width: 10px;
          }
          float: right;
          font-size: 18px;
          margin-right: 20px;
        }
      }
    }
    .report-container {
      margin: 20px 16px;
      /*background: #fff;*/
      font-size: 0;
      position: relative;
      * {
        font-size: 16px;
      }
      & > div {
        display: inline-block;
      }
      $w: 270px;
      .left {
        width: $w;
        min-height: 800px;
        background: #fff;
        position: absolute;
        top: 0;
        bottom: 0;
        ul {
          li {
            height: 50px;
            line-height: 50px;
            font-size: 18px;
            letter-spacing: 0.7px;
            color: #505050;
            padding-left: 40px;
            cursor: pointer;
            &:hover {
              background-color: #d3f2e5;
              color: #000;
            }
            &.active {
              background-color: #1fd094;
              color: #fff;
              i {
                background-color: #fff;
              }
            }
            i {
              display: inline-block;
              width: 10px;
              height: 10px;
              background-color: rgba(31, 208, 148, 1);
              border-radius: 100%;
            }
          }
        }
      }
      .right {
        width: 100%;

        padding-left: $w+10;
        & > div {
          background: #fff;
        }
      }
    }

  }

  @media (max-width: 1530px) {
    .reportDetail_kzc {
      $media-w: 160px;
      .report-container {
        .left {
          width: $media-w;
          ul {
            li {
              padding-left: 10px;
            }
          }
        }
        .right {
          padding-left: $media-w+10;
        }
      }
    }
  }

  ;

</style>
<style lang="scss">
  .reportDetail_kzc {
    .gege {
      position: absolute;
      right: 0;
      top: 0;
      border: 1px solid red;
    }
    .el-pagination {
      margin-top: 30px;
      margin-bottom: 30px;
      text-align: center;
      * {
        display: inline-block;
        vertical-align: middle;
      }
      .el-pager li {
        font-size: 20px;
        min-width: 40px;
        height: 40px;
        line-height: 40px;
      }
      .el-pager li.active {
        background: #1fd094;
      }
      .btn-next, .btn-prev {
        height: 40px;
      }
      .el-select .el-input {
        width: 142px;
      }
      .el-select .el-input input {
        height: 40px;
        font-size: 20px;
      }
      .el-select {
        vertical-align: top;
      }
      button, span {
        height: 40px;
        line-height: 40px;
        font-size: 20px;
      }
      .el-pagination__editor {
        height: 40px;
        min-width: 40px;
        font-size: 20px;
        vertical-align: top;
      }
    }
  }

  .el-tooltip__popper.is-light.reports10 {
    border: 1px solid #eee;
    padding: 10px;
  }
</style>
