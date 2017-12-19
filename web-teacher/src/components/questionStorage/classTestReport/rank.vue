<template>
  <div class="rank-wrap">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="rank"
        label="名次"
      >
        <template scope="scope">
          第{{scope.row.rank}}名
        </template>
      </el-table-column>
      <el-table-column
        prop="studentName"
        label="学生姓名"
      >
      </el-table-column>
      <el-table-column
        prop="rightNumber"
        label="正确题数"
      >
        <template scope="scope">
          {{scope.row.rightNumber === null ? '未作答':scope.row.rightNumber}}
        </template>
      </el-table-column>
      <el-table-column
        prop="tag"
        label="做题详情"
      >
        <template scope="scope">
          <el-button
            @click="watchPaper(scope.row)"
            close-transition>
            查看试卷
          </el-button>
          <el-button
            @click="watchStudentReport(scope.row)"
            close-transition>
            查看报告
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    components: {},
    props: {},
    creted() {
    },
    mounted() {
      this.inClassTestCode = this.$route.query.inClassTestCode;
      this.$ajax.getStudentRank({"inClassTestCode": this.inClassTestCode})
        .then(({httpCode, result}) => {
          console.log(httpCode, result);
          if (httpCode === '200') {
            if (!result) return;
            this.$set(this, 'tableData', result.rinking)
          } else {
            console.log('请求错误,偷偷地找后端沟通吧!');
          }
        });

    },
    data() {
      return {
        tableData: []
      }
    },
    methods: {
      watchStudentReport(student) {
        if (this.$route.query.source == 2) {
          this.$ajax.getResourcePaper({
            paperCode: this.$route.query.paperCode,
          })
            .then(({httpCode, result}) => {
              if (httpCode == 200) {
                let questionNum = 0;
                if (!result || !result.paperSystemQusetionType) return;
                result.paperSystemQusetionType.forEach(item1 => {
                  if(item1.type == 1){
                    console.log(item1.typeList);
                    item1.typeList.forEach(item2 => {
                      console.log(item2);
                      questionNum += item2.list.length;
                    })
                  }
                })
                console.log(questionNum);
                window.open(`#/kezhongceReportDetail?inClassTestCode=${this.inClassTestCode}&studentCode=${student.studentCode}&questionNum=${questionNum}&userId=${student.studentCode}`);
              } else {
              }
            })
        } else {
          window.open(`#/kezhongceReportDetail?inClassTestCode=${this.inClassTestCode}&studentCode=${student.studentCode}&questionNum=12&userId=${student.studentCode}`);
        }
      },
      watchPaper(student){
        if (this.$route.query.source == 2) {
          window.open(`#/watchKezhongcePaperDetail2?inClassTestCode=${this.inClassTestCode}&studentCode=${student.studentCode}&type=1`);
        }else{
          window.open(`#/watchKezhongcePaperDetail?inClassTestCode=${this.inClassTestCode}&studentCode=${student.studentCode}`);

        }
        }

    },
    computed: {},
    filters: {},
  }
</script>
<style lang="scss" scoped>
  .rank-wrap {
    padding: 20px;
  }
</style>
<style lang="scss">

</style>
