<template>
  <div>
    <div class="table-wrap-student">
      <paper-table class="paper-table" :tableData="paperList" @row-click="paperClick"></paper-table>
      <!--分页-->
      <el-pagination
        style="margin-top:20px;"
        v-if="page.total"
        @current-change="handleCurrentChange"
        :current-page=page.personalPageNum
        :page-size=page.size
        layout="total, prev, pager, next, jumper"
        :total=page.total>
      </el-pagination>
    </div>
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
      this.type = this.$route.query.type || 1;

      this.getData();

    },
    mounted() {
    },
    data() {
      return {
        paperList: [],
        page: {
          size: 10,
          curNum: 1,
          total: 0
        },
      }
    },
    methods: {
      handleCurrentChange(num) {
        this.page.curNum = num;
        this.getData();
      },
      paperClick(index, rowData) {
        this.$router.push({
          path: '/studentPaperList',
          query: {
            code: rowData.code
          }
        })

      },
      getData() {
        let send = {"pageNum": this.page.curNum, "pageSize": this.page.size};
        if (this.type == 1) {
          markData.bind(this)(this.$ajax.getTeacherDiagnosisListV2(send));

        } else {
          markData.bind(this)(this.$ajax.getDiagnosisListForMaster(send));

        }

        function markData(promiseObj) {
          promiseObj.then(({result, httpCode}) => {
            console.log(result, httpCode);
            if (httpCode === '200') {
              this.$set(this, 'paperList', result.list || []);
              this.page.total = result.total;
            }
          })
        }

      }
    },
    computed: {},
    watch: {
      $route() {
        this.type = this.$route.query.type || 1;
        this.getData();
      }
    },
    filters: {},

  }
</script>
<style scoped lang="scss">
  .table-wrap-student {
    padding: 40px;
    height: 100%;
    background: #fff;
  }
</style>
<style>

</style>
