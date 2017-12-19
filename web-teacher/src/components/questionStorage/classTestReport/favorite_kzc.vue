<template>
  <div class="favorite_kzc">
    <header>
      <div class="title">
        <div class="left">
          <img src="../../../../static/img/arrle.png" @click="goBack"/>
          <span>班级测试报告></span>
          <span class="green">收藏的报告</span>
        </div>
        <div class="right" @click="sort">
          <span>最近测试</span>
          <img src="../../../../static/img/downArrow.png" v-show="sortBol"/>
          <img
          src="../../../../static/img/upArrow.png" v-show="!sortBol"/>
        </div>
      </div>


    </header>
    <div class="report-container">
      <report v-for="(item,index) in test.list" :item="item"></report>
    </div>
    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page=test.pageNum
      :page-sizes="[100, 200, 500, 1000]"
      :page-size=test.pageSize
      layout="total, prev, pager, next, jumper"
      :total=test.total>
    </el-pagination>
    <!--<div class="gege">{{test.total}}</div>-->
  </div>
</template>

<script>
  import report from './components/report_kzc.vue'

  export default {
    data() {
      return {
        sortBol:true,//最近测试
        classes: {//班级列表
          list: [],
          choosed: 0,
        },
        test: {//报告列表
          pageNum: 1,
          pageSize: 100,
          teacherCode: this.localData.get("getTeacherInfo").userId,
//          timeSort:1,//0倒叙,1正序
//          numSort:1,//0倒叙,1正序
//          testTime:'',//测试时间
//          equipmentType: 0,//设备类型 0手机app，1答题器，2智能手表
          classCode: "",
          list: [],
          total: 1,
        }
      }
    },
    components: {report},
    mounted() {
      this.getClassByTeacherFromDB(() => {
        this.classTestListFromDB();
      });
    },
    methods: {
      fn() {
        console.log(arguments)
      },
      goBack(){
        window.history.go(-1);
      },
      /*排序*/
      sort(){
        this.sortBol=!this.sortBol;
      },
      /*班级列表*/
      getClassByTeacherFromDB(nextFn) {
        this.$ajax.getClassByTeacher({
          userId: this.localData.get("getTeacherInfo").userId,
        })
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              if (!result) return;
              this.classes.list = result;
              nextFn();
            } else {
              this.$message("通讯异常")
            }
          })
          .catch((error) => {
            console.log(error);
          })
      },
      /*选择班级*/
      changeClass() {
        this.classTestListFromDB();
      },
      /*报告列表*/
      classTestListFromDB() {
        console.log("classTestListFromDB");
        let senData = {
          pageNum: this.test.pageNum,
          pageSize: this.test.pageSize,
          teacherCode: this.test.teacherCode,//791
          classCode: this.classes.list[this.classes.choosed].groupId,//1185
          status: 2,
        }
        this.$ajax.classTestList(senData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              if (!result || !result.rows) return;
              this.test.list = result.rows;
              this.test.total = result.total;
            } else {
              this.$message("通讯异常")
            }
          })
          .catch((error) => {
            console.log(error);
          })
      },
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.test.pageSize = val;
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.test.pageNum = val;
        this.classTestListFromDB();
      },

    },
    computed: {},
    filters: {}

  }
</script>


<style lang="scss" scoped>
  .favorite_kzc {
    text-align: left;
    header {
      margin: 20px 16px;
      background-color: rgba(255, 255, 255, 1);
      .title {
        height: 100px;
        line-height: 100px;
        border-bottom: 1px solid rgba(225, 229, 236, 1);
        *{
          vertical-align: middle;
          display: inline-block;
        }
        img{
          width:19px;
          height: 18px;
        }
        .left {
          font-size: 18px;
          display: inline-block;
          color: #4c6175;
          margin-left: 40px;
          float: left;
          img{
            cursor:pointer;
          }
          .green{
            color:#1fd094;
          }
        }
        .right {
          cursor: pointer;
          *{
            display: inline-block;
            vertical-align: middle;
          }
          i {
            display: inline-block;
            margin-right: 10px;
          }
          img{
            width:10px;
          }
          float: right;
          font-size: 18px;
          margin-right: 20px;
        }
      }
    }
    .report-container {
      margin: 50px 40px;
    }

  }
</style>
<style lang="scss">
  .favorite_kzc {
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
</style>
