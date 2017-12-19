<template>
  <div class="syncCoach">
    <!--同步辅导，选择学科下拉列表el-select-->
    <section class="header" v-if="true">
      <div class="title">
        <span>单元测</span>


        <el-dropdown>
          <el-button type="primary">
            发布测试<i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/releaseTesting/releaseTesting?resourceType=1">
              <el-dropdown-item style="width: 143px;text-align: center;color:#999;">常规试卷</el-dropdown-item>
            </router-link>
     <!--       <router-link to="/releaseTesting/releaseTesting?resourceType=2">
              <el-dropdown-item style="width: 143px;text-align: center;color:#999;">自组试卷</el-dropdown-item>
            </router-link>-->
          </el-dropdown-menu>
        </el-dropdown>

      </div>
      <div class="choose">
        <p style="font-size: 18px">选择学科:</p>
        <template>
          <el-select v-model="flag.subjectSeleted" placeholder="请选择" class="select" @change="subjectSeleted">
            <el-option class="option"
                       v-for="(item,index) in data.subjectList"
                       :key="commonSubject[item.subjectIden]"
                       :label="commonSubject[item.subjectIden]"
                       :value="index">
            </el-option>
          </el-select>
        </template>
      </div>
    </section>


    <!--试卷列表-->
    <section class="reportContent">
      <div v-if="data.testPaperList.length">
        <reportItem v-for="(item,index) in data.testPaperList" :key="'sss'"
                    :tudos="item"
                    :tudosIndex="index"
                    @watchZi="getDiagnosisDetail(index,item)"
        ></reportItem>
      </div>
      <div v-else class="nodata">
        暂无数据
      </div>
    </section>


    <!--点击查看报告后，弹出的报告列表-->
    <section class="SmallreportList">
      <el-dialog title="选择报告" :visible.sync="flag.dialogVisible" size="large" class="llll">

        <div class="content">
          <div class="everyone"
               v-for="(item,index) in data.smallreportList"
               @click="goReoortDetialPage(item)"
               v-if="(item.classCode!=null)||(item.classCode==null&&data.testPaperSeletedData.subjectCode == windowLocalStorage.getTeacherInfo.userSubject&&data.testPaperSeletedData.type!=2)">
            <p class="head">{{item.className != null ? item.className : "总报告"}}</p>
            <div v-if="item.hasReport">
              <canvas-ground
                class="canvas"
                :circle="{totalScore:item.totalScore||100,width: 80,score: item.average||0}"
                :key="item.diagnosisClassRelationCode"></canvas-ground>
              <p class="foot">班级报告</p>
            </div>
            <div v-else>
              <p class="foot">班级报告</p>
              <img src="../../../static/img/noReport.png" height="60" width="60"/>
              <p class="foot">无报告</p>
            </div>
          </div>

        </div>
      </el-dialog>
    </section>


    <!--分页-->
    <template>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page=data.pageNum
          :page-sizes="[100, 200, 500, 1000]"
          :page-size=data.pageSize
          layout="total, prev, pager, next, jumper"
          :total=data.testPaperData.total>
        </el-pagination>
      </div>
    </template>
  </div>


</template>
<script>
  import reportItem from "./reportItem.vue"
  import canvasGround from '../common/canvasGround.vue';

  export default {
    components: {
      reportItem, canvasGround
    },
    data() {
      return {
        data: {
          localData: null,//从localstorage得到的数据
          subjectList: [{subjectIden: 1}],//学科列表
          pageNum: 1,
          pageSize: 100,
          classCodes: [],//某个接口所需参数
          testPaperList: [],//试卷列表
          testPaperData: {total: 0},
          smallreportList: [],//由接口getDiagnosisDetail获得的报告列表
          testPaperSeletedData: '',//选中的试卷数据，用于组合数据传给报告详情页
        },
        flag: {
          subjectSeleted: 0,//选中的学科
          testPaperSeleted: 0,//选中的试卷序号
          dialogVisible: false,
        },
        windowLocalStorage: {
          reportData: null,
          testDetail: null,
          getTeacherInfo: null,
          webUser: null,
        }
        /*下面都是临时数据*/

      }
    },
    mounted() {
      window.localStorage.page = "syncCoach";
      this.data.localData = this.localData.get("webTeacherUser");


      this.windowLocalStorage.getTeacherInfo = this.localData.get("getTeacherInfo");


      this.getSubject();
      /*获取试卷，所需数据准备*/
      //[
      let classCodesArr = [];
      this.data.localData.classBeanList.forEach(function (item) {
        classCodesArr.push(item.classId);
      })
      this.data.classCodes = classCodesArr;
      //]
    },
    methods: {
      fn(item) {
        console.log(item)
      },
      getSubject() {
        //【
        let groupArts = new Set();
        for (let item of this.data.localData.classBeanList) {
          groupArts.add(item.groupArt == null ? 2 : item.groupArt);
        }
        groupArts = [...groupArts].join(',');
        let sendData = {groupArts, "gradeId": this.data.localData.userGradeId}
        //】
        this.$ajax.getSchoolSubjectList(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.data.subjectList = result;
              let initialIndex = 0;//应测试要求，初始显示老师的学科，没有老师的学科则显示第一个学科。
              for (let index in result) {
                if (result[index].subjectIden == this.localData.get("getTeacherInfo").userSubject) {//this.localData.get("getTeacherInfo").userSubject
                  initialIndex = index;
                }
              }
              this.flag.subjectSeleted = initialIndex * 1;
              this.getTestPaper(this.data.subjectList[this.flag.subjectSeleted]);
            } else if (httpCode != "600002") {
              this.$message('获取学科列表失败,请刷新页面重试');
            }
          })
      },
      subjectSeleted(index) {
//        this.flag.subjectSeleted=index;//可以省略，element自己做到了
        this.getTestPaper(this.data.subjectList[this.flag.subjectSeleted]);
      },
      getTestPaper() {
        //【
        let sendData = {
          "pageNum": this.data.pageNum,
          "pageSize": this.data.pageSize,
          "classCodes": this.data.classCodes,
          "teacherCode": this.data.localData.userId,
          "schoolCode": this.data.localData.userSchoolId,
          "subjectCode": this.data.subjectList[this.flag.subjectSeleted].subjectIden,
        }
        //】
        this.$ajax.getTeacherDiagnosisListV2(sendData)
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              this.$set(this.data, 'testPaperList', result.list);
              this.$set(this.data, 'testPaperData', result);
            } else {
              this.$message('获取试卷列表失败,请刷新页面重试');
            }
          })
      },
      getDiagnosisDetail(index, item) {//对应testPaperSeleted()更名为此，然后加了功能//index仅仅是为了3态

        this.flag.testPaperSeleted = index;
        this.data.testPaperSeletedData = item;
        //【
        if (item.isSnapshot == 1) {
          item.type = 1;
          item.subjectCode = this.data.subjectList[this.flag.subjectSeleted]['subjectIden'];//科目
          //【
          let groups = [];
          if (!item.groupId) {
            let classBeanList = this.data.localData.classBeanList;
            classBeanList.forEach(function (item) {
              groups.push(item.classId);
            })
          } else {
            groups.push(item.groupId);
          }
          let sendData = {
            "code": item.code,
            "gradeCode": item.gradeCode,
            "classCodes": groups,
            "subjectCode": item.subjectCode || this.data.localData.userSubject,//this.routeSource.subjectCode,
            "pageSize": 100,
            "pageNum": 1,
            "teacherCode": this.localData.get('webTeacherUser').userId,
            "diagnosisType": 0,
          }
          //】
          this.$ajax.getDiagnosisDetail(sendData)
            .then(({httpCode, result}) => {
              if (httpCode == 200) {
                this.data.smallreportList = result;
//                this,data,smallreportList.
                this.$nextTick(function () {
                  this.flag.dialogVisible = true;
                })

              } else {
                this.$message('获取报告列表失败,请刷新页面重试');
              }
            })
        } else {
          this.$message('报告未生成');
          return
        }
        //】
      },
      goReoortDetialPage(item) {
        this.data.testPaperSeletedData.classCode = item.classCode;
        this.data.testPaperSeletedData.className = item.className;
        window.localStorage.reportData = JSON.stringify(this.data.testPaperSeletedData);
        if (item.hasReport == false) {
          return;
        }
        if (item.classCode == null) {
          this.$router.push({path: '/showData/reportDetailsTotal/class1'});
        } else {
          this.$router.push({path: '/showData/reportDetailsSingleClass'});
        }
//        this.$router.push({path:'/showData/reportDetailsTotal/class1',query:item})

      },
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.data.pageSize = val;
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.data.pageNum = val;
        this.getTestPaper();
      },
    },
    computed: {
      /*      circleConfig(){//组件canvasGround需要参数/
              return {
                totalScore: 100,//+result.paperScore || 100,
                width: 120,
                score: 60//result.score || 0
              }
            },*/
    },
    filters: {}

  }
</script>
<style lang="scss">
  @import '../../../static/css/contentRight';

  .syncCoach {
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
          font-size: 18px;
          float: left;
          display: inline-block;
          height: 40px;
          line-height: 40px;
        }
        .el-dropdown {
          float: right;

          border-radius: 20px;
          font-size: 18px;
          color: #fff;
          /*background: #1fd094;*/
          outline: none;
          cursor: pointer;
          .el-button{
            padding:0;
            width: 143px;
            height: 40px;
            text-align: center;
            background: #1fd094;
            span{
              display: inline-block;
              float: none;
              color:#fff;
            }
          }
        }
      }
      .choose {
        /*margin-left:18px;*/
        box-sizing: border-box;
        padding: 10px 40px;
        background: white;
        text-align: left;
        p {
          display: inline-block;
        }
        .select {
          input {
            background: #f0f4fb;
            border: 0px;
          }
        }
      }
    }
    .reportContent {
      overflow: hidden;
      .nodata {
        height: 100px;
        line-height: 100px;
        font-size: 20px;
        background: #fff;
        margin: 20px;
      }
      /*    .report{
            border:4px solid #ffffff;
            &:hover{
              border:4px solid #00d1b2;
            }
            &.active{
              border:4px solid #1fd094;
            }
          }*/

    }

    .SmallreportList {
      .content {
        overflow: hidden;
        background: #ecf2f7;
        padding: 40px;
        .everyone {
          width: 130px;
          /*height:60px;*/
          background: #ffffff;
          float: left;
          margin-left: 40px;
          /*margin-top:20px;*/
          margin-bottom: 40px;
          cursor: pointer;
          .head {
            background: #1fd094;
            height: 30px;
            color: #fff;
            line-height: 30px;
          }
          .canvas {
            height: 80px;
            width: 80px;
            margin-top: 10px;
          }
          .foot {
            /*background:blue;*/
            height: 30px;
            line-height: 30px;
          }
        }
      }
      .el-dialog { //单独设定，不考虑与content的层级关系
        width: 50%;
        height: 50%; //相对于浏览器的比例，因为其遮罩是浏览器的100%
        .el-dialog__header {
          background: #d3f2e5;
          padding: 0;
          height: 60px;
          line-height: 60px;
          position: relative;
          button {
            position: absolute;
            right: 24px;
            top: 22px;
            cursor: pointer;
          }
        }
        .el-dialog__body {
          padding: 0px;
          height: 90%;
          background: #ecf2f7;
          overflow: auto;

        }
        .el-dialog__footer {
          height: 0px;
          text-align: center;
          padding-top: 20px;
          button:nth-last-child(1) {
            margin-left: 50px;
          }
        }
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
