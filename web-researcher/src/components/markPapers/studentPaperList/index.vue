<template>
  <div class="table-wrap-student">

    <div class="controll-title">
      是否判卷:
      <el-select v-model="search.isPanjuan" @change="getData" style="width: 105px;margin-right:20px;">
        <el-option label="全部" :value="null"></el-option>
        <el-option label="未判卷" :value="0"></el-option>
        <el-option label="已判卷" :value="1"></el-option>
      </el-select>
      <el-input placeholder="请输入内容" v-model="search.text" style="width: 300px;" v-if="false">
        <el-select v-model="search.type" slot="prepend" placeholder="请选择" @change="search.text=''" style="width:105px">
          <el-option label="学生姓名" value="studentName"></el-option>
          <el-option label="试卷名称" value="diagnosisName"></el-option>
        </el-select>
        <el-button slot="append" icon="search" @click="getData"></el-button>
      </el-input>
      <el-button style="float: right;" @click="$router.go(-1)">返回</el-button>
    </div>
    <paper-table class="paper-table" :tableData="paperList" @mark-paper="paperClick"
                 @watch-paper="watchPaper"></paper-table>

  </div>
</template>
<script>
  import paperTable from './table.vue';

  export default {
    components: {paperTable},
    props: {},
    beforeCreate() {
    },
    created() {
      this.getData();
    },
    mounted() {

    },
    data() {
      return {
        paperList: [],
        search: {
          text: '',
          type: 'studentName',
          isPanjuan: 0
        }
      }
    },
    methods: {
      paperClick(index, rowData) {
        this.$router.push({
          path: '/markStudentPaper',
          query: {
            code: rowData.diagnosisPaperCode,
            studentDiagnosisRecordCode: rowData.code,
            diagnosisTeacherRecordCode: rowData.diagnosisTeacherRecordCode
          }
        })


      },
      watchPaper(index, rowData) {
        this.$router.push({
          path: '/teacherMarkDetail',
          query: {
            code: rowData.diagnosisPaperCode,
            studentDiagnosisRecordCode: rowData.code,
          }
        })
      },
      getData() {
        let {code} = this.$route.query;
        let {text, type, isPanjuan} = this.search;
        console.log(this.$$user(),1)
        let send = {"pageNum": 1, code, "markStatus": isPanjuan, "pageSize": 10, subjectCode: this.$$user().userSubject};
        if (text) {
          send[type] = text;
        }
        this.$ajax.getStudentExamList(send)
          .then(({result, httpCode}) => {
            if (httpCode === '200') {
              this.$set(this, 'paperList', result ? result.list : []);
            }
          })
      }
    },
    computed: {},
    filters: {},

  }
</script>
<style scoped lang="scss">
  .table-wrap-student {
    padding: 40px;
    height: 100%;
    background: #fff;
    .controll-title {
      padding: 10px 0;
      text-align: left;
    }
  }

</style>
<style>

</style>
