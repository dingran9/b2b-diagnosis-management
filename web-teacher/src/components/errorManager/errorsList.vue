<template>
  <div>
    <div class="content-right-title-wrap">
      <h2 class="title">{{userName}}错题列表</h2>
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
  import favQuestion from '../common/favQuestion.vue';
  export default {
    components: {
      favQuestion
    },
    data(){
      return {
        userName: decodeURI(this.$route.params.userName),
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
      this.getWrongQuestions();
    },
    methods: {
      handleSizeChange(val) {
        this.page.pageSize = val;
      },
      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.getWrongQuestions();
      },
      getWrongQuestions(){
        let userId = decodeURI(this.$route.params.id);
        let subjectCode = this.$user().get().userSubject;
        let sendData = {
          "userId": userId,
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
        try {
          for (let item of query.questionAnalyzes) {
            item.analyzeValue = this.strToUrl(item.analyzeValue)
          }
        } catch (e) {

        }
        this.localData.set('errorDetail', query);
        this.$router.push({name: "errorDetail", params: {userName: decodeURI(this.$route.params.userName)}})
      }


    }
  }
</script>
<style lang="scss">
  @import '../../../static/css/contentRight.scss';

</style>
