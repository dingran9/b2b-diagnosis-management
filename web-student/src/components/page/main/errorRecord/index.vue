<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">个人中心>错题记录</h2>
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
        type="1"
        @click-handle="reportClickHandle"
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
            this.getWrongQuestions();
          } else {
            this.$message('获取学生学科列表失败,请刷新页面重试');
          }
        })
    },
    methods: {
      handleSizeChange(val) {
        this.page.pageSize = val;
      },
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.getWrongQuestions();
      },
      selectSubject(index){
        if (this.flag.subjectSelect == index)return;
        this.page.currentPage = 1;
        this.flag.subjectSelect = index;
        this.getWrongQuestions();
      },
      getWrongQuestions(){
        let user = this.user;
        let subject = this.data.groundList[this.flag.subjectSelect], subjectCode;
        for (let item in subject) {
          subjectCode = item;
        }
        let sendData = {
          "userId": user.userId,
          "subjectCode": subjectCode,
          "pageNum": this.page.currentPage,
          "pageSize": this.page.pageSize,
        };
        this.$ajax.getWrongQuestions(sendData)
          .then(({httpCode, result}) => {
            this.data.reportList = [];
            if (httpCode == 200) {
              if (result) {
                this.data.reportList = result.list || [];
                this.page.totalNum = result.total;
              }
            } else {
              this.$message('获取学生阶段检测列表失败,请刷新页面重试');
            }
          })
      },
      reportClickHandle(query){
        try{
          for(let item of query.questionAnalyzes){
            item.analyzeValue = this.strToUrl(item.analyzeValue)
          }
        }catch (e){

        }
        this.localData.set('errorDetail',query);
        this.$router.push({
          path: '/main/errorDetail',
        })
      }


    }
    ,
    computed: {},
    filters: {}

  }
</script>
<style lang="scss">
  @import '../../../../../static/css/contentRight.scss';

</style>
