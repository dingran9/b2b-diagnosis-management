<template>
  <div class="rp-div">
    <el-tabs type="border-card">
      <el-tab-pane label="区域">
        <div class="getab-body-item">
          <div class="tab-title">
            学生成绩分布
          </div>
          <result-chart style="margin:50px;" :chart-data="area.chartListData"></result-chart>
        </div>
      </el-tab-pane>
      <el-tab-pane label="学校">
        <div class="getab-body-item">
          <div class="tab-title">
            学生成绩分布
          </div>

          <student-table :chart-data="school.chartListData"></student-table>

        </div>
      </el-tab-pane>
      <el-tab-pane label="班级">
        <div class="getab-body-item">
          <div class="tab-title">
            学生成绩分布
          </div>
          <student-class-table :chart-data="theclass.chartListData" :keyword="theclass.keyword"></student-class-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import geTabel from "../../geTeble.vue"
  import ResultChart from '../../resultDistributionChart.vue'
  import StudentTable from './studentResultTable.vue'
  import StudentClassTable from './studentResultClassTable.vue'

  export default {
    data() {
      return {
        types: ['area', 'school', "theclass"],
        area: {
          chartListData: [],
        },
        school: {
          chartListData: [],
        },
        theclass: {
          chartListData: [],
          keyword: 'resultsClassModels'
        },
      }
    },
    mounted() {
      this.$store.state.loading = true;
      for (let i = 1; i <= 3; i++) {
        this.unitResultsDistribution(i);
      }
    },
    methods: {
      unitResultsDistribution(type = 1) {
        this.$ajax.unitResultsDistribution({type})
          .then(({httpCode, result}) => {
            this.$store.state.loading = false;
            if (httpCode === '200') {
              let chartListData = result;
              let typeName = this.types[type - 1];
              if (type == 3) {
                chartListData = chartListData.map(schoolModel =>{
                  return this.mopObj(schoolModel,'resultsClassModels');
                })
              }
              this.$set(this[typeName], 'chartListData', chartListData);
              console.log(chartListData);
            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })

      },
    },
    components: {
      geTabel, StudentTable, StudentClassTable, ResultChart
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .rp-div {
    justify-content: center;

    .titlePc {
      font-size: 20px;
      text-align: center;
      border-bottom: 1px solid #e1e5ec;
      padding: 10px 40px;
      .titleLeft {
        /*border-right:1px solid #1fd094;*/
        width: 174px;
        display: inline-block;
        text-align: center;
      }
      .titleRight {
        @extend .titleLeft;
        border: 0px;
      }
    }
    .left {
      display: inline-block;
      width: 45%;
      /*background:red;*/
    }
    .right {
      @extend .left;
      /*background:green;*/
      margin-left: 5%;
    }
  }

</style>
<style lang="scss">
  .rp-div {
    @import "../../../../static/css/selfTab.scss";
  }
</style>
