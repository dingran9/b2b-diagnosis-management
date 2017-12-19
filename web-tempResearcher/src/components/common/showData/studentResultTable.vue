<template>
  <div>

    <el-table
      v-if="chartData.length"
      class="HSDLFDJSLF"
      :style="{'max-width':'1200px',margin:'50px auto'}"
      :data="chartData"
      border
      style="width: 100%">
      <el-table-column
        prop="schoolName"
        label="学校名称"
        width="150">
      </el-table-column>
      <template v-if="chartData.length">
        <template v-if="chartData[0].distributedModels" v-for="(model,index) in chartData[0].distributedModels">
          <el-table-column :label="model.segment">
            <el-table-column
              prop="schoolName"
              label="人数"
            >
              <template scope="scope">
                {{scope.row.distributedModels[index].peopleCount}} 人
              </template>
            </el-table-column>
            <el-table-column
              prop="schoolName"
              label="百分比">
              <template scope="scope">
                {{+scope.row.distributedModels[index].percentage.toFixed(4)}} %
              </template>
            </el-table-column>
          </el-table-column>
        </template>
      </template>

    </el-table>
    <div v-else style="padding:20px 0 0 ;">
      暂无数据
    </div>
  </div>
</template>
<script>
  export default {
    components: {},
    props: {
      chartData: {
        default() {
          return []
        },
      }
    },
    creted() {
    },
    mounted() {
    },
    data() {
      return {}
    },
    methods: {},
    computed: {},
    filters: {},
  }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
  @import "../../../../static/css/commonVariable.scss";

  .HSDLFDJSLF {
    @import "../../../../static/css/modificationTable";
  }


</style>
