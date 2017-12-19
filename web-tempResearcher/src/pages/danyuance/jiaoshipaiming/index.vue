<template>
  <div style="background-color: #fff;padding:50px 20px;">
    <el-table
      class="self-table"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="sort"
        label="序号"
      >
      </el-table-column>
      <el-table-column
        prop="teacherName"
        label="教师姓名"
      >
      </el-table-column>
      <el-table-column
        prop="biaozhunfen"
        label="标准分"
      >
      </el-table-column>
      <el-table-column
        prop="pingjunfen"
        label="平均分"
      >
      </el-table-column>
      <el-table-column
        prop="nandu"
        label="试卷难度"
      >
      </el-table-column>
      <el-table-column
        prop="schoolName"
        label="所属学校"
      >
      </el-table-column>
    </el-table>
  </div>
</template>
<script>

  import fakeData from './fakeData'

  export default {
    components: {},
    props: {},
    created() {
      this.tableData = fakeData[this.localData.get('tempUnit').name]
    },
    mounted() {
    },

    data() {
      return {
        knowModuleVisible: false,
        nengliModuleVisible: false,
        tableData: fakeData,
        knowChartData: null,
        nengliChartData: []
      }
    }
    ,
    methods: {
    }
    ,
    computed: {}
    ,
    filters: {}
    ,
  }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
  @import "../../../../static/css/commonVariable.scss";

  .self-table {
    @import "../../../../static/css/modificationTable";
  }
</style>
