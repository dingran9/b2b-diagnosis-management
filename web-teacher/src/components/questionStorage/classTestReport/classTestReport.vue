<template>
  <div class="classTestReport_kzc">
    <header>
      <div class="title">
        <span class="left">班级测试报告</span>
        <span class="right" @click="toFavorite" v-if="false"><i class="el-icon-menu"></i>收藏的报告</span>
      </div>
      <div class="choose-class">
        <span style="font-size: 18px">筛选班级</span>
        <el-select v-model="classes.choosed" @change="changeClass">
          <el-option :label="item.groupName" :value="index" v-for="(item,index) in classes.list"></el-option>
        </el-select>
      </div>

    </header>
    <div class="report-container" v-if="test.list.length">
      <report v-for="(item,index) in test.list" :item="item" @wathZi="fn"></report>
    </div>
    <div class="nodata" v-else>
      暂无数据
    </div>
    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page=test.pageNum
      :page-sizes="[12, 50, 100, 200]"
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
        classes: {//班级列表
          list: [],
          choosed: 0,
        },
        test: {//报告列表
          pageNum: 1,
          pageSize: 12,
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
      /**/
      toFavorite(){
        this.$router.push({path:'/questionStorage/favorite_kzc'})
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
//        console.log("classTestListFromDB");
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
              if (!result || !result.rows||!result.number) return;
              {//数据组合
                result.rows.forEach((item1,index1)=>{
                  result.number.forEach((item2,index2)=>{
                    if(item1.classCode==item2.classCode){
                      item1.studentCount=item2.studentCount;
                    }
                  })
                })
              }
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
  .classTestReport_kzc {
    text-align: left;
    header {
      margin: 20px 16px;
      background-color: rgba(255, 255, 255, 1);
      .title {
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid rgba(225, 229, 236, 1);
        .left {
          font-size: 24px;
          display: inline-block;
          color: #4c6175;
          margin-left: 40px;
          float: left;
        }
        .right {
          cursor: pointer;
          i {
            display: inline-block;
            margin-right: 10px;
          }
          float: right;
          font-size: 18px;
          margin-right: 20px;
        }
      }
      .choose-class {
        height: 92px;
        line-height: 92px;
        & > span {
          width: 72px;
          font-size: 16px;
          color: #505050;
          margin-left: 40px;
          margin-right: 20px;
        }
      }
    }
    .report-container {
      margin: 50px 40px;
      .report_kzc{
        margin-bottom:20px;
      }
    }
    .nodata{
      margin: 20px 16px;
      background-color: rgba(255, 255, 255, 1);
      text-align: center;
      padding: 100px;
      font-size: 20px;
    }
  }
</style>
<style lang="scss">
  .classTestReport_kzc {
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
