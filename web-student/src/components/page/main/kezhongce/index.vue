<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">
        课中检测
        <span class="ge-pull-right bind-answer"
              v-if="bindAnswerStatus != 0"
              @click="flag.bindAnswer = true">
          {{bindAnswerStatus == 1 ? '绑定答题器' : '已绑定:' + mainBindAnswerCode }}
        </span>
      </h2>
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
    <el-dialog v-model="flag.bindAnswer" size="tiny" :show-close=false>
      <el-input
        style="width: 100%;"
        v-model="bindAnswerCode"
        placeholder="请输入答题器设备码"
      >
      </el-input>
      <el-tooltip placement="right" style="position: absolute;right: 30px;top:38px;" effect="light">
        <div slot="content">
          <img src="../../../../../static/img/datiqi.png" height="292" width="442"/>
        </div>
        <i class="el-icon-warning" style="font-size: 20px;"></i>
      </el-tooltip>
      <p class="changeP" style="text-align: right; padding-top:20px;">
        <el-button type="primary" class="changeP-b" @click="bindAnswerClick">确 定</el-button>
        <el-button @click="flag.bindAnswer = false" class="changeP-b">取 消</el-button>
      </p>
    </el-dialog>
  </div>
</template>
<script>
  import reportItem from '../../../common/kezhongceReportItem.vue';

  export default {
    components: {
      reportItem
    },
    data() {
      return {
        bindAnswerCode: '',
        mainBindAnswerCode: '',
        bindAnswerStatus: '0',// 0未请求 1未绑定 2已绑定
        data: {
          reportList: [],
          groundList: []
        },
        flag: {
          subjectSelect: 0,
          bindAnswer: false
        }
      }
    },
    mounted() {
      this.user = this.$user().get();
      let user = this.user;
      this.getBindAnswerStatus();

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
      getBindAnswerStatus() {
        this.$ajax.studentBindAnsweringMachineList()
          .then(({httpCode, result}) => {
            if (httpCode === '200') {
              if (!result) return;
              if (result.rows && result.rows[0]) {
                this.mainBindAnswerCode = result.rows[0].machineCode;
                this.bindAnswerStatus = 2;
              } else {
                this.bindAnswerStatus = 1;
              }
            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })
      },
      bindAnswerClick() {
        if (!this.bindAnswerCode) {
          this.$message('请输入答题器设备码');
          return;
        }
        if(!/^\d+$/.test(this.bindAnswerCode)){
          this.$message('答题器设备码只能是数字!')
          return;
        }
        this.$ajax.studentBindAnsweringMachineSave({
          machineCode: this.bindAnswerCode
        })
          .then(({httpCode, result}) => {

            if (httpCode === '200') {
              if (!result) return;
              this.$message('绑定答题器成功');
              this.mainBindAnswerCode = this.bindAnswerCode;
              this.bindAnswerCode = '';
              this.bindAnswerStatus = 2;
              this.flag.bindAnswer = false;
            } else if (httpCode == '40007') {
              this.$message('该答题器已被其他用户绑定!');
              return;

            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })
      },
      selectSubject(index) {
        if (this.flag.subjectSelect == index) return;
        this.flag.subjectSelect = index;
        this.getTestList();
      },
      getTestList() {
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
          "classCode": user.classId,
          status: null
        };

        this.$ajax.getClassTestList(sendData)
          .then(({httpCode, result}) => {
            this.data.reportList = [];
            if (httpCode == 200) {
              if (result) {
                this.sutdentNum = result.studentTotalCount;
                this.data.reportList = result.rows || [];
              }
            } else {
              this.$message('获取学生阶段检测列表失败,请刷新页面重试');
            }
          })
      },
      reportClickHandle(report) {
        console.log(report);
        if (report.status == 1) {
          //跳转答题
          this.$message('请在手机端或者答题器上作答!');
          return;
          let query = {
            inClassTestCode:''
          };
          this.$router.push({
            path: '/main/answerQuestion',
            query: query
          })

        } else if (report.status == 2) {
          console.log('查看报告');
          //查看报告
          let query = {
            inClassTestCode:report.inClassTestCode,
            sutdentNum:this.sutdentNum,
            questionNum:report.questionCount,
            paperTime:report.updateTime,
            source:report.source
          };
          console.log(query);
          this.$router.push({
            path: '/main/kezhongceReportDetail',
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

  .bind-answer {
    font-size: 18px;
    cursor: pointer;
  }

  .el-dialog__body {
    position: relative;
  }
</style>
