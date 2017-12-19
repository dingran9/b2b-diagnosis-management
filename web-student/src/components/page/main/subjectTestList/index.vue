<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">阶段检测>{{$route.query.name}}

        <goback></goback>

      </h2>
    </div>
    <div class="content-right-body-wrap clear-fix">
      <div v-if="!data.reportList.length">
        暂无数据
      </div>
      <report-item
        :report="report"
        :key="report.code"
        type="2"
        @click-btn="reportClickHandle"
        v-for="report in data.reportList"
      ></report-item>


    </div>
  </div>
</template>
<script>
  import reportItem from '../../../common/reportItem.vue';
  import goback from '../../../common/goback.vue';

  export default {
    components: {
      reportItem,
      goback
    },
    data() {
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
    mounted() {
      this.user = this.$user().get();
      this.getTestList();
    },
    methods: {
      selectSubject(index) {
        if (this.flag.subjectSelect == index) return;
        this.flag.subjectSelect = index;
        this.getTestList();
      },
      getTestList() {
        let user = this.user;
        let sendData = {
          "studentCode": user.userId,
          "code": this.$route.query.code,
          "classCode": user.classId
        };
        this.$ajax.complexSubjectExamList(sendData)
          .then(({httpCode, result}) => {
            this.data.reportList = [];
            if (httpCode == 200) {
              if (result) {
                //2017年10月19日,老董让取当前接口返回的时间,所以注释掉
//                try {
//                  for (let item of result) {
//                    item.endTime = this.$route.query.endTime;
//                  }
//                } catch (e) {
//
//                }
                this.data.reportList = result || [];
              }
            } else {
              this.$message('获取学生阶段检测列表失败,请刷新页面重试');
            }
          })
      },
      reportClickHandle(report) {
        if (report.diagnosisStatus == 0 || report.diagnosisStatus == 4) {
          if (report.needImg) {
            this.$alert('本试卷包含主观题,需要用到拍照功能,故电脑端暂不支持此类试卷答题。如需答题,请下载移动端回答试卷。', '提示', {
              confirmButtonText: '确定',
            });
            return;
          }
          let query = {
            subjectCode: report.subjectCode,
            "code": report.diagnosisPaperCode,
            "studentCode": this.user.userId,
            code2: report.code,
            gradeCode: report.gradeCode,
            diagnosisTeacherRecordCode: report.diagnosisTeacherRecordCode,
            examStatus: report.examStatus,
          };
          this.$router.push({
            path: '/main/answerQuestion',
            query
          })
        }
        if (report.diagnosisStatus == 2) {
          //查看报告
          let query = {
            code: report.code,
            subjectCode: report.subjectCode,
            gradeCode: report.gradeCode,
            diagnosisStatus: report.diagnosisStatus,
            needImg:report.needImg
          };
          this.$router.push({
            path: '/main/reportDetail',
            query: query
          })
        }


      }
    },
    computed: {},
    filters: {}

  }
</script>
<style lang="scss">
  @import '../../../../../static/css/contentRight.scss';

</style>
