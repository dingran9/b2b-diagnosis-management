<template>
  <div>
    <div class="report-item">
      <div class="report-header">
        {{gradeName}}年级各班{{subjectName}}原始分数
      </div>
      <div class="report-body">
        <el-table
          :data="tableRow"
          border
          style="width: 100%">
          <el-table-column :label="gradeName+'年级各班级'+subjectName+'原始分数'">
            <template v-for="(item,index) in tableData">
              <el-table-column
                :label="tableData[index].className"
              >
                <el-table-column label="姓名">
                  <template scope="scope">
                    <!-- 区分0分和undefined -->
                    <span v-if="item.studentScoreDtos[scope.$index]">
                    {{item.studentScoreDtos[scope.$index].score == 'undefined' ? '' : item.studentScoreDtos[scope.$index].studentName}}
                  </span>
                  </template>
                </el-table-column>
                <el-table-column label="名次">
                  <template scope="scope">
                    <!-- 区分0分和undefined -->
                    <span v-if="item.studentScoreDtos[scope.$index]">
                    {{item.studentScoreDtos[scope.$index].score == 'undefined' ? '' : '第' + (scope.$index + 1) + '名'}}
                  </span>
                  </template>
                </el-table-column>
                <el-table-column label="分数">
                  <template scope="scope">
                    <!-- 区分0分和undefined -->
                    <span v-if="item.studentScoreDtos[scope.$index]">
                    {{item.studentScoreDtos[scope.$index].score == 'undefined' ? '' : (item.studentScoreDtos[scope.$index]).score + '分'}}
                  </span>
                  </template>
                </el-table-column>

              </el-table-column>
            </template>

          </el-table-column>


        </el-table>
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        tableData: [],
        subjectName: this.commonSubject[this.$route.query.subjectCode],
        gradeName: this.commonGrond[this.$route.query.gradeCode],
      }
    },
    components: {},
    mounted() {
      this.getData();
    },
    methods: {
      //生成发送的url
      creatUrl(str) {
        return `${this.rootUrl}principalSingleReport/${str}/${this.$route.query.releaseExamCode}/${this.$route.query.subjectCode}?requestId=1111`;
      },
      getData() {
        let url = this.creatUrl('getsClassStudentOriginalScore');
        this.$http.get(url)
          .then(res => {
            if (res.body.message == "Success") {
              let data = res.body.result || [];
              data.map(classData => {
                let studentScoreDtos = classData.studentScoreDtos;
                classData.studentScoreDtos = classData.studentScoreDtos.sort((a, b) => ( b.score - a.score))
              })
              this.tableData = data;
              console.log(this.tableData)
            }
          }, res => {
            console.log(rs);
          })
      },
    },
    watch: {},
    props: [],
    computed: {
      tableRow() {
        let row = 0;
        this.tableData.forEach(item => {
          item.studentScoreDtos && (row = item.studentScoreDtos.length > row ? item.studentScoreDtos.length : row);

        });
        var arr = [];
        for (; row; row--) {
          arr.push({})
        }
        console.log(this.tableData, arr)
        return arr;
      }
    }
  }
</script>
<style>
  table .cell {
    text-align: center;
  }
</style>
