<template>
  <div class="questionList">
    <section class="header">
      <div class="title">
        <span>试卷管理</span>
        <button @click.prev.stop="creatNewPaper">新建试卷</button>
      </div>
      <div class="listType">
        <el-input
          placeholder="搜索试卷"
          icon="search"
          v-model="searchText"
          :on-icon-click="searchPaper"
          @keyup.enter.native="searchPaper">
        </el-input>
      </div>
    </section>

    <section class="questionContent">
      <template v-if="paperList.length">
        <div class="my-table">
          <div class="my-table-title">
            <div class="paper-cell paper-name">
              试卷名称
            </div>
            <div class="paper-cell paper-controll">

            </div>
            <div class="paper-cell paper-totol-scroe">
              试卷总分
            </div>
            <div class="paper-cell paper-difficulty">
              难度
            </div>
            <div class="paper-cell paper-detail">
              试卷详情
            </div>
            <div class="paper-cell paper-status">
              状态
            </div>
            <div class="paper-cell paper-time">
              修改日期
            </div>
          </div>
          <div class="my-table-body">
            <div class="paper-body-item"
                 v-for="paper in paperList">
              <div class="paper-cell paper-name" @click="watchPaper(paper)">
                {{paper.paperName}}
              </div>
              <div class="paper-cell paper-controll">
                <img @click="showDeleteDialog(paper)"
                     v-show="paper.isDel ==1 ||paper.isDel ==2 "
                     src="../../../static/img/icon/delete_icon.png"
                     title="删除"
                     style="vertical-align: middle;cursor: pointer;margin-right:10px;"/>
                <img @click="writePaper(paper)"
                     v-show="paper.isDel ==2 "
                     title="编辑"
                     src="../../../static/img/self_paper_write.png"
                     style="vertical-align: middle;cursor: pointer;"/>
              </div>
              <div class="paper-cell paper-totol-scroe">
                {{paper.totalScore}}分
              </div>
              <div class="paper-cell paper-difficulty">
                {{paper.difficultStar == 1 ? '易' : paper.difficultStar == 2 ? '中' : '难'}}
              </div>
              <div class="paper-cell paper-detail">
                <el-popover
                  @show="getSelfPaperDetail(paper)"
                >
                  <div class="pop-detail">
                    <div class="time-wrap">
                      考试总分: <span class="color-green">{{paper.totalScore}}分</span>
                      <div class="ge-pull-right">
                        达标分: <span class="color-green">{{paperDetail.standardScore}}分</span>
                      </div>
                      <br>
                      考试时间: <span class="color-green">{{paperDetail.totalTime}}分钟</span>
                    </div>
                    <hr>
                    <div>
                      <div class="version">
                        {{paper.bookVersion}}
                        {{commonSubject[paper.sbujectCode]}}
                        {{paper.semester}}
                        {{paperDetail.unitName}}
                      </div>
                      <div class="knows-wrap">
                        <div class="know" v-for="know in paperDetail.nodeList">
                          {{know.knowledgeName}}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div slot="reference" class="cp" :style="{color:'#1fd094'}">
                    详情
                  </div>
                </el-popover>
              </div>
              <div class="paper-cell paper-status">
                <span class="status-btn delete"
                      v-show="paper.isDel == 3 "
                      @click="changePaperStatus(paper,1)">
                  弃 用
                </span>
                <span class="status-btn use"
                      @click="changePaperStatus(paper,3)"
                      v-show="paper.isDel == 1 ||paper.isDel == 2 ">
                  发 布
                </span>
                <span class="text">
                  {{paper.isDel == 3 ? '已发布' : paper.isDel == 2 ? '未发布' : '已弃用'}}
                </span>
              </div>
              <div class="paper-cell paper-time cp" :title="moment(paper.updateTime).format('YYYY-MM-DD a h:mm')">
                {{paper.updateTime | diffTime}}
              </div>
            </div>
          </div>
        </div>
        <!--分页-->
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page=page.personalPageNum
          :page-size=page.size
          layout="total, prev, pager, next, jumper"
          :total=page.total>
        </el-pagination>
      </template>
      <div class="nodata" v-else>
        <img src="../../../static/img/no_paper.png"/>
      </div>
    </section>


    <delete-pop
      @delete="changePaperStatus(willDeletePaper,0)"
      :visible.sync="isShowDeletePop"
      :prop-data="willDeletePaper"></delete-pop>
  </div>
</template>
<script>
  import moment from 'moment';
  import DeletePop from './deletePaperPoper.vue'

  moment.locale('zh-cn');
  export default {
    components: {DeletePop},
    data() {
      return {
        searchText: '',
        paperList: [],
        page: {
          size: 10,
          curNum: 1,
          total: 0
        },
        paperDetail: {},
        isShowDeletePop: false,
        willDeletePaper: null
      }
    },
    mounted() {
      console.clear();
      this.getSelfPaperList();
    },
    methods: {
      showDeleteDialog(paper) {
        this.willDeletePaper = paper;
        this.isShowDeletePop = true;
      },
      moment,
      watchPaper(paper) {
        open(`#/watchPaper?code=${paper.code}`);
      },
      changePaperStatus(paper, status) {
        this.$ajax.changeSelfPaperStatus({
          id: paper.code,
          toStatus: status
        })
          .then(({httpCode, result}) => {
            console.log(httpCode, result);
            if (httpCode === '200') {
              if (!result) return;
              if (!status) {
                this.isShowDeletePop = false;
                this.$message('删除成功')
              }
              this.getSelfPaperList();
            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })
      },
      getSelfPaperDetail(paper) {
        //已请求过
        if (paper.paperDetail) {
          this.$set(this, 'paperDetail', paper.paperDetail)
          return;
        }
        this.$ajax.getSelfPaperDetail(paper.code)
          .then(({httpCode, result}) => {
            if (httpCode === '200') {
              paper.paperDetail = result || {};
              this.$set(this, 'paperDetail', result || {})
            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })
      },
      getSelfPaperList() {
        let {page} = this;
        this.$ajax.getSelfPaperList({
          "paperName": this.searchText,
//          "operatorCode": "薛高举",
          "pageNum": page.curNum,
          "pageSize": page.size
        })
          .then(({httpCode, result}) => {
            if (httpCode === '200') {
              if (!result) return;
              this.page.total = result.total;
              console.log(JSON.parse(JSON.stringify(result.list)));
              console.log(result.list);
              this.$set(this, 'paperList', result.list || []);
            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })
      },
      creatNewPaper() {
        console.log('新建试卷');
        localStorage.setItem("questionAdded", "");
        localStorage.setItem("updatePaperData", "");
        this.$router.push('/questionStorage/createNewPaper');
      },
      searchPaper() {
        console.log('搜索试卷');
        this.getSelfPaperList();
      },
      handleCurrentChange(num) {
        this.page.curNum = num;
        this.getSelfPaperList();
      },
      writePaper(paper) {
        this.$router.push({
          path: '/questionStorage/createNewPaper',
          query: {
            code: paper.code
          }
        })
      }
    },
    computed: {},
    filters: {
      diffTime(val) {
        return moment(val).fromNow();
      }
    }

  }
</script>
<style lang="scss">
  @import '../../../static/css/contentRight';

  .questionList {
    .header {
      margin: 20px;
      margin-bottom: 0px;
      .title {
        overflow: hidden;
        margin-top: 20px;
        /*margin-left:18px;*/
        box-sizing: border-box;
        padding: 10px 40px;
        background: white;
        border-bottom: 1px solid #e1e5ec;
        span {
          color: #000000;
          font-size: 21px;
          font-weight: bold;
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
      .listType {
        background: white;
        /*height: 90px;*/
        min-height: 90px;
        overflow: hidden;
        padding-left: 20px;
        button {
          margin-top: 25px;
          margin-left: 20px;
          float: left;
          width: 143px;
          height: 40px;
          border-radius: 20px;
          font-size: 18px;
          outline: none;
          cursor: pointer;
          background: transparent;
          &:hover {
            background: #d3f2e5;
          }
        }
        button.active {
          background: #1fd094;
          color: #fff;
        }
        .sortCondition {
          margin-right: 40px;
          margin-top: 35px;
          float: right;
          .sortConItem {
            padding-right: 5px;
          }
          .sortConItem img {
            display: none;
          }
          .sortConItem.active {
            color: #1fd094;
          }
          .sortConItem.active img {
            display: initial;

          }
        }
        .el-input {
          margin-top: 27px;
          margin-right: 40px;
          float: right;
          width: 300px;
          height: 40px;

        }
      }
    }
    .questionContent {
      margin: 20px;
      overflow: auto;
      .nodata {
        position: relative;
        height: 600px;
        line-height: 100px;
        font-size: 20px;
        /*background: #fff;*/
        margin: 20px;
        img {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
        }
      }

    }
    .eduQuestionContent {
      min-width: 1120px;
      margin: 20px;
      margin-bottom: 0px;
      height: 100%;
      box-sizing: border-box;
      position: relative;

      .selectConditions {
        min-width: 100%;
        overflow: hidden;
        background: #FFFFFF;
        /*height: 70px;*/
        border-bottom: 1px solid #e1e5ec;
        .conditionItem {
          margin-left: 40px;
          margin-top: 15px;
          margin-bottom: 10px;
          float: left;
          color: #505050;
          .el-input {

            width: 180px;
            height: 40px;
            .el-input__inner:focus, .el-input__inner:hover {
              border-color: #1FD094;
            }
          }
        }
      }

      .eduLeftContent {
        position: absolute;
        width: 312px;
        height: 100%;
        background: #FFFFFF;
        left: 0;
        top: 66px;
        overflow-y: scroll;
        .selectPoint {
          font-size: 18px;
          color: #505050;
          text-align: left;
          height: 70px;
          line-height: 70px;
          border-bottom: 1px solid #e5e5e5;
          padding-left: 30px;
          box-sizing: border-box;
          span {
            margin: 0 10px;
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #1fd094;
          }
        }
        .el-tree {
          text-align: left;
          border: none;
          padding-top: 20px;
          padding-left: 25px;
          .el-tree-node__expand-icon {
            border: none;
            display: inline-block;
            background: url(../../../static/img/folder.png) no-repeat;
            width: 20px;
            height: 20px;
          }
          .el-tree-node__expand-icon.expanded {
            transform: rotate(0);
          }
          .el-tree-node__expand-icon.is-leaf {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #1FD094;
          }
          .el-tree-node.is-current {
            & > .el-tree-node__content {
              background: #d3f2e5;
            }
          }
        }
      }
      .eduRightContent {
        background: #FFFFFF;
        position: absolute;
        width: calc(100% - 312px);
        min-width: 1120px;
        top: 66px;
        left: 312px;
        height: 100%;

        .eduQuestionList {
          background: #FFFFFF;
          text-align: left;
          padding: 0 40px;
          box-sizing: border-box;
          width: 100%;
          height: calc(100% - 100px);
          border-bottom: 1px solid #e1e5ec;
          overflow-x: hidden;
          overflow-y: scroll;
        }
      }

      .el-pagination {
        margin-top: 40px;
      }
    }

    .el-pagination {
      margin-top: 30px;
      margin-bottom: 30px;
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
      .el-input {
        width: 142px;
      }
      .el-input input {
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

  .el-select-dropdown {
    .el-select-dropdown__item.hover {
      background-color: #d3f2e5;
    }
    .el-select-dropdown__item.selected {
      background-color: #1fd094;
    }
  }

</style>
<style lang="scss">
  @mixin temp_clear_fix() {
    &::after {
      content: "";
      clear: both;
      display: table;
    }
  }

  @mixin cp {
    cursor: pointer;
  }

  .cp {
    @include cp;
  }

  .my-table {
    min-width: 1606px;
    background: #fff;
    @include temp_clear_fix;
    .my-table-title {
      color: #999;
      border: {
        bottom: 1px solid #ddd;
      }
      @include temp_clear_fix;
    }
    .paper- {
      &cell {
        $h: 60px;
        height: $h;
        line-height: $h;
        text-align: center;
        float: left;
      }
      &name {
        text-align: left;
        width: 605px;
        padding-left: 20px;
      }
      &time {
        width: 200px;
      }
      &status {
        width: 250px;
        .status-btn {
          width: 100px;
          display: inline-block;
          cursor: pointer;
          color: white;
          $h: 30px;
          height: $h;
          line-height: $h;
          border-radius: $h /2;
          &.delete {
            background-color: red;
          }
          &.use {
            background-color: #1fd094;
          }

        }
        .text {
          font-size: 14px;
          color: #666;
        }
      }
      &detail {
        width: 150px;
      }
      &difficulty {
        width: 150px;
      }
      &totol-scroe {
        width: 130px;
      }
      &controll {
        width: 100px;
        img {
          display: none;
        }
      }
    }

  }

  .paper-body-item {
    @include temp_clear_fix;
    &:hover {
      background-color: #d3f2e5;
      .paper-controll {
        img {
          display: inline-block;
        }
      }
    }
  }

  .pop-detail {
    padding: 14px;
    width: 280px;
    .color-green {
      color: #00B83F;
    }
    .time-wrap {
      line-height: 25px;
    }
    .knows-wrap {
      margin-top: 10px;
    }
    .know {
      padding: 2px 10px;
      margin-right: 10px;
      margin-bottom: 3px;
      display: inline-block;
      border-radius: 10px;
      border: solid 1px #1fd094;
    }
  }
</style>
