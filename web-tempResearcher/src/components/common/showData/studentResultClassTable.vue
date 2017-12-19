<template>
  <div style="overflow:auto;">
    <table v-if="chartData.length" class="self-teble" cellspacing="0" cellpadding="0" border="0">
      <thead>
      <tr>
        <td rowspan="2">
          所属学校
        </td>
        <td rowspan="2">
          班级
        </td>
        <td colspan="2" v-for="cellTitle in chartData[0][0].distributedModels">
          {{cellTitle.segment}}
        </td>

      </tr>
      <tr>
        <template v-for="i in  chartData[0][0].distributedModels.length">
          <td>
            人数
          </td>
          <td>
            百分比
          </td>
        </template>

      </tr>
      <tr>

      </tr>
      </thead>
      <tbody v-for="groupList in chartData">
      <tr v-for=" (cell,index) in groupList">
        <td :rowspan="groupList.length" v-if="!index">
          {{cell.schoolName}}
        </td>
        <td>
          {{cell.className}}
        </td>
        <template v-for="peopleCell in cell.distributedModels">
          <td>
            {{peopleCell.peopleCount}} 人
          </td>
          <td>
            {{+peopleCell.percentage}} %
          </td>
        </template>
      </tr>

      </tbody>
    </table>
    <div v-else style="padding:20px 0 0 ">暂无数据</div>
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
      return {
        tableList1: [{school: '中兴小学', age: 'ssdf '}, {school: '中兴小学', age: '12'}, {
          school: '中兴小学',
          age: '12'
        }, {school: '中兴小学', age: '12'}, {school: '中兴小学', age: '12'}, {school: '中兴小学', age: '15'}, {
          school: '中兴小学',
          age: '12'
        }, {school: '中兴3fdgfdg地方地方地方小学', age: '12'}, {school: '中2兴小学', age: '12'}, {school: '中3兴小学', age: '12'},]
      }
    },
    methods: {},
    computed: {
      tableList() {

        return this.filterListToObjList(this.tableList1, 'school');
      }
    },
    filters: {},
  }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
  @import "../../../../static/css/commonVariable.scss";

  .self-teble {
    table-layout: fixed;
    width: 1200px;
    margin: 50px auto;
    border-collapse: separate;
    thead {
      tr {
        td {
          background: $table_head_bg;
          color: #fff;
          line-height: 50px;
          width: 20px;
          border: {
            bottom: 1px solid #fff;
            left: 1px solid #fff;
          }
        }
      }
    }
    tbody {
      tr {
        width: 100%;
        td {
          height: 50px;
          line-height: 30px;
          background: $table_body_first_bg;
          width: 40px;
          border: {
            bottom: 1px solid #fff;
            left: 1px solid #fff;
          }
        }

      }
      &:nth-child(even) {
        tr {
          td {
            background: $table_body_second_bg;
          }
        }

      }
    }
  }


</style>
