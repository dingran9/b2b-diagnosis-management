<template>
  <div class="rp-div">
    <el-tabs type="border-card">
      <el-tab-pane label="区域">
        <div class="getab-body-item">
          <div class="tab-title">
            区域参与情况
          </div>
          <ge-tabel class="tab-body" :titleDataList="areaTitle" type="1" :tableData="area.chartListData">
            <template scope="scope" slot="body">
              {{scope.title.keyword == 'avgAnswerTime' ?  scope.text: +scope.text + ' %' }}
            </template>
          </ge-tabel>
        </div>
      </el-tab-pane>
      <el-tab-pane label="学校">
        <div class="getab-body-item">
          <div class="tab-title">
            各学校参与情况
          </div>

          <ge-tabel class="tab-body" :titleDataList="schoolTitle" type="1" :tableData="school.chartListData">
            <template scope="scope" slot="body">
              {{scope.title.keyword == 'attendanceRate' ||  scope.title.keyword == 'avgResponseRate' ?  +scope.text + ' %': scope.text  }}
            </template>
          </ge-tabel>

        </div>
      </el-tab-pane>
      <el-tab-pane label="班级">
        <div class="getab-body-item">
          <div class="tab-title">
            各校各班级参与情况
          </div>
          <ge-tabel class="tab-body" :titleDataList="classTitle" type="0"
                    :tableData="theclass.chartListData">
            <template scope="scope" slot="body">
              {{scope.title.keyword == 'attendanceRate' ||  scope.title.keyword == 'avgResponseRate' ?  +scope.text + ' %': scope.text  }}
            </template>
          </ge-tabel>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import geTabel from "../../geTeble.vue"

  let areaTitle = [
      {text: '出勤率', keyword: 'attendanceRate',},
      {text: '平均作答时间（分钟）', keyword: 'avgAnswerTime'},
      {text: '平均作答率', keyword: 'avgResponseRate'},
    ],
    schoolTitle = [
      {text: '学校', keyword: 'schoolName',},
      {text: '出勤率', keyword: 'attendanceRate',},
      {text: '平均作答时间（分钟）', keyword: 'avgAnswerTime'},
      {text: '平均作答率', keyword: 'avgResponseRate'},
    ],
    classTitle = [
      {text: '学校', keyword: 'schoolName',},
      {text: '班级', keyword: 'className', children: true},
      {text: '出勤率', keyword: 'attendanceRate', children: true},
      {text: '平均作答时间（分钟）', keyword: 'avgAnswerTime', children: true},
      {text: '平均作答率', keyword: 'avgResponseRate', children: true},
    ];
  export default {
    data() {
      return {
        areaTitle, schoolTitle, classTitle,
        types: ['area', 'school', "theclass", "teacher"],
        teacher: {
          chartListData: [],
        }, area: {
          chartListData: [],
        }, school: {
          chartListData: [],
        }, theclass: {
          chartListData: [],

        },
      }
    },
    mounted() {
      this.$store.state.loading = true;
      for (let i = 1; i <= 3; i++) {
        this.unitAreaHappening(i);
      }
    },
    methods: {
      unitAreaHappening(type = 1) {
        this.$ajax.unitAreaHappening({type})
          .then(({httpCode, result}) => {
            this.$store.state.loading = false;
            if (httpCode === '200') {
              if (!result) return;
              let chartListData = result;
              let typeName = this.types[type - 1];
              if (type != 3)
                this.$set(this[typeName], 'chartListData', Array.isArray(chartListData) ? chartListData : [chartListData]);
              else {
                chartListData = chartListData.map(item => {
                  let temp = [];
                  Array.isArray(item.happenModels) && item.happenModels.map(modle => {
                    temp.push(Object.assign(modle, {schoolId: item.schoolId, schoolName: item.schoolName}))
                  })
                  return temp;
                });
                this.$set(this[typeName], 'chartListData', chartListData);
              }

              console.log(chartListData);
            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })

      },
    },
    components: {
      geTabel
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
