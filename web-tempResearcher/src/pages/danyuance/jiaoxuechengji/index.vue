<template>
  <div style="background-color: #fff;padding:50px 20px;">
    <el-table
      class="self-table"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="schoolName"
        label="学校"
      >
      </el-table-column>
      <el-table-column
        prop="score"
        label="单元得分"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template scope="scope">
          <el-button @click="showKnowModule(scope.row)">
            查看知识模块
          </el-button>
          <el-button @click="showNengliModule(scope.row)">
            查看能力分析
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="知识模块"
      :visible.sync="knowModuleVisible"
    >

      <knowledge-table :chart-data="knowChartData"></knowledge-table>
      <el-button
        type="primary"
        @click="knowModuleVisible = false"
        class="ge-pull-right"
        style="margin-bottom: 20px;">关 闭
      </el-button>

    </el-dialog>
    <el-dialog
      title="能力分析"
      :visible.sync="nengliModuleVisible"
    >
      <spider-chart :chart-data="nengliChartData" v-if="nengliChartData.length"></spider-chart>
      <el-button
        type="primary"
        @click="nengliModuleVisible = false"
        class="ge-pull-right"
        style="margin-bottom: 20px;">关 闭
      </el-button>

    </el-dialog>
  </div>
</template>
<script>
  import KnowledgeTable from '../../../components/knowledgeTable.vue'
  import SpiderChart from '../../../components/spiderChart.vue'
  import fakeData from './fakeData'

  export default {
    components: {KnowledgeTable, SpiderChart},
    props: {},
    created() {
      this.tableData = fakeData[this.localData.get('tempUnit').name]
    },
    mounted() {
      console.log(this.localData.get('tempUnit').name);
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
      showKnowModule(data) {
        this.knowModuleVisible = true;
        this.knowChartData = data.know;
      },
      showNengliModule(data) {
        this.nengliModuleVisible = true;
        this.nengliChartData = data.nengli;
      },
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
