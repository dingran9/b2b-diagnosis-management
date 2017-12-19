
<template>
  <div>
    <div class="report-item">
      <div class="report-header">
        阶段检测
      </div>
      <div class="report-body">
        <span class="grade-title" style="float: left;height: 40px;">年级:</span>
        <div
          class="tab-item"
          :class="{'router-link-active':grondRadio == index}"
          @click="getDiagnosticReport(index)"
          v-for="(item,index) in groundCode"
        >
          {{item.groupName}}
        </div>
      </div>
    </div>

    <div class="card-wrap">
      <div class="card-item-wrap"
           v-for=" (item,index) in reportData"
           :key="item.code"
           @click="getSubject(index)">
        <div class="card-item">
          <h2 class="title">阶段检测</h2>
          <div class="body">
            <div class="report-name" :title="item.diagnosisName">
              {{item.diagnosisName}}
            </div>
            <div class="reort-state">{{item.isSnapshot ? '已生成报告' : '未生成报告'}}</div>
            <!--<br>-->

          </div>
          <div class="tack">
            {{item.examType | examTypeFilter}}
          </div>
        </div>
      </div>
      <div v-show="!reportData.length" style="text-align: center;">暂无阶段检测报告</div>
    </div>

    <el-dialog
      title="选择一个学科"
      v-model="dialog"
      size="tiny"
    >

      <el-button
        v-for="subject in subjectList"
        :key="subject"
        @click="checkDiagnosticReport(subject)"
        v-bind:key="subject"
        type="info"
      >
        {{commonSubject[subject]}}
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    mounted(){
      this.getGrade();
    },
    data() {
      return {
        groundCode: [],
        subjectList: [],
        grondRadio: 0,
        subjectRadio: '',
        currentDate: new Date(),
        userSchoolId: JSON.parse(window.localStorage.getItem("Userinfo")).userSchoolId,
        reportData: [],
        schoolCode: JSON.parse(localStorage.getItem('Userinfo')).userSchoolId,
        dialog: false,
      }
    },
    methods: {
      //获取年级
      getGrade(){
        this.$http.post(this.rootUrl + 'groupManager/getGradeList?requestId=123',
          {"groupId": this.userSchoolId}
        ).then((res) => {
          this.groundCode = res.body.result;
          this.$nextTick(() => {
            this.getDiagnosticReport(0);
          })
        }, (res) => {
          console.log(res);
        });
      },
      //获取报告
      getDiagnosticReport(val){
        this.grondRadio = val;
        let gradeInfo = this.groundCode[val];
        var url = this.rootUrl + 'teacher/diagnosis/getDiagnosisListForMaster?requestId=123';
        this.$http.post(url, {
            "pageNum": 1,
            "pageSize": 1000,
            "schoolCode": this.schoolCode,
            "gradeCode": gradeInfo.groupIden
          }
        )
          .then(res => {
            if (res.body.message == "Success") {
              this.reportData = res.body.result.list;
            }
          }, res => {
            console.log(res)
          });


      },
      //获取学科
      getSubject(index){
        let report = this.reportData[index];
        this.report = report;
        if (!report.isSnapshot)return;
        console.log(report.diagnosisPaperCode)
        this.$http.post(this.rootUrl + 'teacher/diagnosis/getSubjectsForExam?requestId=123', {
          "code": report.code
        }).then((res) => {
          this.dialog = true;
          this.subjectList = res.body.result;
        }, (res) => {
          this.$notify({
            title: '警告',
            message: '没有获取到学科信息',
            type: 'warning'
          });
          console.log(res);
        });
      },
      //选择报告
      checkDiagnosticReport(index){
          this.dialog = false;
        let report = this.reportData[index];
        this.dialog = false;
        this.$router.push({
          path: 'aloneSubjectReport',
          query: {
            releaseExamCode: this.report.code,
            subjectCode: index,
            "gradeCode": this.groundCode[this.grondRadio].groupIden,
            schoolCode: this.schoolCode
          }

        })

      }
    },
    filters: {
      examTypeFilter(val){
        //0单元测试 1期中2期末3模拟考4会考
        switch (val) {
          case 0:
            return '0单元测试';
          case 1:
            return '期中测试';
          case 2:
            return '期末测试';
          case 3:
            return '模拟考';
          case 4:
            return '会考';
          default:
            return '未知考试';

        }
      }
    }
  }
</script>
<style lang="scss">
  @import "~static/css/diagnosticReport.scss";

</style>

