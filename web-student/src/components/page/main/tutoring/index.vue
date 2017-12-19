<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">单元检测</h2>
      <div class="body">
        <div class="body-title">
          学科:
        </div>
        <div v-for='(subject,index) in data.groundList'
             :class="{act:flag.subjectSelect == index}"
             class="body-btn"
             @click="selectSubject(index)"
        >
          <template v-for="(value,key,index2) in subject">
            {{commonSubject[key]}}
          </template>

        </div>
      </div>
    </div>
    <div class="content-right-body-wrap clear-fix">
      <div v-if="!data.reportList.length">
        暂无数据
      </div>
      <report-item
        :report="report"
        :key="report.code"
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
        }
      }
    },
    mounted(){
      this.user = this.$user().get();
      let user = this.user;

      var sendData = {
        "userId": user.userId,
        "gradeCode": user.gradeIden,
        "stageCode": parseInt(user.gradeIden.toString()[0]),
        "schoolCode": user.schoolId,
        classCode: user.classId,
      };

      this.$ajax.getSubjects(sendData)
        .then(({httpCode, result}) => {
          if (httpCode == 200) {
            this.data.groundList = result;
            this.getTestList();
          } else {
            this.$message('获取学生学科列表失败,请刷新页面重试');
          }
        })
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
          "classCode":user.classId
        };
        this.$ajax.getTestList(sendData)
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
        if (report.diagnosisStatus == 0) {
          //跳转答题

          if (new Date().getTime() >= new Date(report.startTime).getTime()) {
            let query = {
              "code": report.diagnosisPaperCode,
              "studentCode": this.user.userId,
              subjectCode:report.subjectCode,
              code2:report.code,
              gradeCode:report.gradeCode,
              diagnosisTeacherRecordCode:report.diagnosisTeacherRecordCode,
              diagnosisStatus:report.diagnosisStatus
            };
            this.$router.push({
              path: '/main/answerQuestion',
              query: query
            })
          } else {
            this.$message('答题时间未到,请稍后答题');
          }
        } else if (report.diagnosisStatus == 2) {
          //查看报告
          let query = {
            code:report.code,
            subjectCode:report.subjectCode,
            gradeCode:report.gradeCode,
            diagnosisStatus:report.diagnosisStatus,
            needImg: report.needImg

          };
          this.$router.push({
            path:'/main/reportDetail',
            query:query
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
