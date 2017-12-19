<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">阶段检测</h2>
    </div>
    <div class="content-right-body-wrap clear-fix">
      <div v-if="!data.reportList.length">
        暂无数据
      </div>
      <report-item
        :report="report"
        :key="report.code"
        type="1"
        @click-btn="reportClickHandle"
        v-for="report in data.reportList"
      ></report-item>

    </div>
  </div>
</template>
<script>
  import reportItem from '../../../common/reportItem.vue';
  export default {
    components: {
      reportItem
    },
    data(){
      return {
        data: {
          reportList: [],
          groundList: []
        },
        flag: {
          subjectSelect: 0
        },
      }
    },
    mounted(){
      this.user = this.$user().get();
      this.getTestList();
    },
    methods: {
      selectSubject(index){
        if (this.flag.subjectSelect == index)return;
        this.flag.subjectSelect = index;
        this.getTestList();
      },
      getTestList(){
        let user = this.user;
        let subject = this.data.groundList[this.flag.subjectSelect], subjectCode;
        for (let item in subject) {
          subjectCode = item;
        }
        let sendData = {
          "userId": user.userId,
          "gradeCode": user.gradeIden,
          "stageCode": parseInt(user.gradeIden.toString()[0]),
          "subjectCode": subjectCode,
          "pageNum": 1,
          "pageSize": 100,
          "classCode": user.classId
        };
        this.$ajax.complexExamList(sendData)
          .then(({httpCode, result}) => {
            this.data.reportList = [];
            if (httpCode == 200) {
              if (result) {
                this.data.reportList = result.list || [];
              }
            } else {
              this.$message('获取学生阶段检测列表失败,请刷新页面重试');
            }
          })
      },
      reportClickHandle(report){
        console.log(report)
        /*//全科考试的考试状态 0未开始 1已开始 2已结束*/
        if (report.examStatus != 0) {
          let query = {
            "code": report.diagnosisPaperCode,
            "studentCode": this.user.userId,
            code2: report.code,
            gradeCode: report.gradeCode,
            diagnosisTeacherRecordCode: report.diagnosisTeacherRecordCode,
            examStatus: report.examStatus,
            endTime: report.endTime,
            startTime: report.startTime,
            code: report.diagnosisCode,
            name:report.diagnosisName
          };
          console.log(query)
          this.$router.push({
            path: '/main/subjectTestList',
            query
          })

        }
//        if (report.diagnosisStatus == 0) {
//          //跳转答题
//          if (new Date().getTime() >= new Date(report.startTime).getTime()) {
//            let temp = {"code": "AFBB3A6969934881A566CDA4C4FC8468", "studentCode": 410, "classCode": 1032};
//
//          } else {
//            this.$message('答题时间未到,请稍后答题');
//          }
//        } else if (report.diagnosisStatus == 2) {
//          //查看报告
//          let query = {
//            code: report.code,
//            subjectCode: report.subjectCode,
//            gradeCode: report.gradeCode,
//            diagnosisStatus: report.diagnosisStatus
//          };
//          this.$router.push({
//            path: '/main/reportDetail',
//            query: query
//          })
//        }


      }
    },
    computed: {},
    filters: {}

  }
</script>
<style lang="scss">
  @import '../../../../../static/css/contentRight.scss';

</style>
