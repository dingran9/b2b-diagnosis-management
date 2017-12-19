<!-- 布局 --> 
<template>
  <!--根部视图-->
  <div>

    <heard-view @requestParameters="getsTheChildViewData"></heard-view>

    <!--试卷列表-->
    <section class="reportContent">
      <div v-if="dataObj.list && dataObj.list.length">
        <unitTestItem v-for="(item,index) in dataObj.list" :key="'sss'"
                      :tudos="item"
                      @touchreport="checkReport(index,item)"
        ></unitTestItem>
      </div>
      <div v-else class="nodata">
        暂无数据
      </div>
    </section>

    <!--点击查看报告后，弹出的报告列表-->
    <section class="SmallreportList">
      <el-dialog title="选择报告" :visible.sync="flag.dialogVisible" size="large" >
        <div class="content">
          <div class="everyone"
               v-for="(item,index) in data.smallreportList"
               @click="goReoortDetialPage(item)">
            <p class="head">{{item.isGradeAverage ? "总报告" : item.className}}</p>
            <div v-if="item.hasReport">
              <canvas-ground
                class="canvas"
                :circle="{totalScore:item.totalScore||100,width: 80,score: item.average||0}"
                :key="item.diagnosisClassRelationCode"></canvas-ground>
              <p class="foot">班级报告</p>
            </div>
            <div v-else>
              <p class="foot">班级报告</p>
              <img src="../../../../static/img/noReport.png" class="noreport-img"/>
              <p class="foot">无报告</p>
            </div>
          </div>

        </div>

      </el-dialog>
    </section>

    <!--分页-->
    <template>
      <div class="block" v-if="dataObj.list && dataObj.list.length">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page=dataObj.currPage
          :page-sizes="[100, 200, 300, 400, 500]"
          :page-size=params.pageSize
          layout="total, sizes, prev, pager, next, jumper"
          :total=dataObj.total>
        </el-pagination>
      </div>
    </template>

  </div>

</template>

  <!-- vue -->
<script>
  import heardView from './unitTestHeardView.vue'
  import {getUser} from '../../../config/utils'
  import unitTestItem from "./unitTestItem.vue"
  import canvasGround from './canvasGround.vue';

  export default {
    data() {
      return {

        dataObj: {},

        params: {
          pageNum: 1,
          pageSize: 100,
          schoolCode: '',
          subjectCode: '',
          teacherCode: '',
          examYear: '',
          classCodes: [],
        },

        oReport: {
          releaseExamCode:'',// 试卷code
          examType:'',
        },

        teacherObj:{},

        flag: {
          subjectSeleted: 0,//选中的学科
          testPaperSeleted: 0,//选中的试卷序号
          dialogVisible: false,
        },

        data: {

          smallreportList: [],//由接口getDiagnosisDetail获得的报告列表
          testPaperSeletedData: '',//选中的试卷数据，用于组合数据传给报告详情页

        }

      }
    },

    components: {heardView, unitTestItem,canvasGround},

    methods: {

      /// 校验那个数据没有填写
      promptBox() {

        let array = [this.params.schoolCode == 0,
          this.params.subjectCode == 0,
          this.params.teacherCode == 0,
          this.params.examYear == 0,
          this.params.classCodes.length == 0]

        var tempa = $.grep(array, (value) => {
          return value
        })

        return tempa.length == 0

      },

      /// 调用是否可以刷新
      checkTheRefresh() {

        if (!this.promptBox()) {
          this.dataObj = {};
          return
        }

        this.getTeacherDiagnosisList()

      },

      /// 获取子视图数据
      getsTheChildViewData(learnYear, grade, subject, teacher) {

        this.teacherObj = teacher
        this.params.schoolCode = getUser().userSchoolId
        this.params.subjectCode = subject.subjectId
        this.params.teacherCode = teacher.userId
        this.params.examYear = learnYear + ''
        let classC = teacher.classBeanList ? teacher.classBeanList.map(function (item) {
          return item.classId
        }) : []

        this.params.classCodes = classC

        this.checkTheRefresh()

      },

      /// 获取列表数据
      getTeacherDiagnosisList() {

        var url = this.rootUrl + 'teacher/diagnosis/getTeacherDiagnosisListV2?requestId=123';

        this.$http.post(url, this.params)
          .then(res => {

            (res.body.result);

            if (res.body.message == "Success") {

              this.$set(this, "dataObj", res.body.result)

            }

          }, res => {

            console.log(res)

          });

      },

      /// 选取每页多少条数据得时候调用
      handleSizeChange(val) {
        this.params.pageSize = val
        this.checkTheRefresh()
      },

      /// 选取第几页的时候调用
      handleCurrentChange(val) {
        this.params.pageNum = val
        this.checkTheRefresh()
      },

      /// 查看报告
      checkReport(index, item) {

        this.flag.testPaperSeleted = index;
        this.data.testPaperSeletedData = item;

        switch (item.isSnapshot) {
          case 1:
            this.constructTheBulletBoxData(index, item)
            break
          default:
            this.$message('报告未生成11');
        }

      },

      /// 构造弹框数据
      constructTheBulletBoxData(index, item) {

        this.oReport.releaseExamCode = item.code

        this.oReport.examType = item.examType

        let array = []

        this.teacherObj.classBeanList.map(value => {
          array.push(value.classId)
        })

        let requestData = {
          "code": item.code,
          "gradeCode": this.teacherObj.userGradeIden,
          "classCodes": array,
          "subjectCode": this.teacherObj.userSubjectId,
          "pageSize": 1000,
          "pageNum": 1,
          "teacherCode": this.teacherObj.userId,
          "diagnosisType": item.diagnosisType,

        }

        var url = this.rootUrl + 'teacher/diagnosis/getDiagnosisDetail?requestId=123';

        this.$http.post(url, requestData)
          .then(res => {

            if (res.body.message == "Success") {

              this.data.smallreportList = res.body.result;

              this.flag.dialogVisible = true

            }

          }, res => {

            console.log(res)

          });

      },

      /// 点击报告查看
      goReoortDetialPage(item) {

        if (!item.hasReport) return

        this.flag.dialogVisible = false

        this.data.testPaperSeletedData.classCode = item.classCode;

        this.data.testPaperSeletedData.className = item.className;

        this.data.testPaperSeletedData.subjectCode = this.params.subjectCode;

        this.data.testPaperSeletedData.teacherCode = this.params.teacherCode;

        this.data.testPaperSeletedData.releaseExamCode = this.oReport.releaseExamCode;

        this.data.testPaperSeletedData.examType = this.oReport.examType

        window.localStorage.reportData = JSON.stringify(this.data.testPaperSeletedData);

        /// 总报告
        if (item.isGradeAverage) {

          console.log('总报告');

          this.$router.push({path: '/class1'});

          return

        }

        /// 班级报告
        this.$router.push({path: '/reportDetailsSingleClass'});

      }

    }

  }

</script>

<style lang="scss">
  @import "../../../../static/css/diagnosticReport.scss";
</style>
