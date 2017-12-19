<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">个人中心>我的收藏</h2>
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
      <fav-question
        :question="report"
        :key="report.code"
        @click-btn="reportClickHandle"
        v-for="report in data.reportList"
      ></fav-question>
      <div v-if="!data.reportList.length">
        暂无数据
      </div>
      <div v-else class="page clear-fix">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="page.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="page.totalNum">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import favQuestion from '../../../common/favQuestion.vue';
  export default {
    components: {
      favQuestion
    },
    data(){
      return {
        page: {
          totalNum: 1000,
          pageSize: 10,
          currentPage: 1
        },
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
            this.getFavouriteQuestion();
          } else {
            this.$message('获取收藏列表失败');
          }
        })
    },
    methods: {
      handleSizeChange(val) {
        this.page.pageSize = val;
      },
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.getFavouriteQuestion();
      },
      selectSubject(index){
        if (this.flag.subjectSelect == index)return;
        this.flag.subjectSelect = index;
        this.getFavouriteQuestion();
      },
      getFavouriteQuestion(){
        let user = this.user;
        let subject = this.data.groundList[this.flag.subjectSelect], subjectCode;
        for (let item in subject) {
          subjectCode = item;
        }
        let sendData = {
          "userCode": user.userId,
          "subjectCode": subjectCode,
          "pageNum": this.page.currentPage,
          "pageSize": this.page.pageSize,
        };
        this.$ajax.getFavouriteQuestion(sendData)
          .then(({httpCode, result}) => {
            this.data.reportList = [];
            if (httpCode == 200) {
              if (result) {
                this.data.reportList = result.list || [];
                this.page.totalNum = result.total;
              }
            } else {
              this.$message('获取收藏列表失败!');
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
            diagnosisStatus:report.diagnosisStatus
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
