<template>
  <div class="rp-div">
    <el-tabs type="border-card">
      <el-tab-pane label="区域">
        <div class="getab-body-item">
          <div class="tab-title">
            教学成绩分析
          </div>
          <div style="padding:40px;">
            <el-table class=" sdfsdf"
                      v-if="area.chartListData.orgs"
                      :data="area.chartListData.orgs">
              <el-table-column
                prop="date"
                label="年级"
              >
                <template scope="scope">
                  {{scope.row.name}}
                </template>
              </el-table-column>
              <template v-if="Array.isArray(area.chartListData.units)">
                <template v-for="unit in area.chartListData.units">
                  <el-table-column
                    prop="name"
                    :label="unit.unitName"
                  >
                    <template scope="scope">
                      {{getScore(area.chartListData.datas, unit.unitCode, scope.row.code)}}
                    </template>
                  </el-table-column>
                </template>
              </template>

            </el-table>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="学校">
        <div class="getab-body-item">
          <div class="tab-title">
            教学成绩分析
          </div>

          <div style="padding:40px;">
            <el-table class=" sdfsdf"
                      v-if="school.chartListData.orgs"
                      :data="school.chartListData.orgs">
              <el-table-column
                prop="date"
                label="学校"
              >
                <template scope="scope">
                  {{scope.row.name}}
                </template>
              </el-table-column>
              <template v-if="Array.isArray(school.chartListData.units)">
                <template v-for="unit in school.chartListData.units">
                  <el-table-column
                    prop="name"
                    :label="unit.unitName"
                  >
                    <template scope="scope">
                      {{getScore(school.chartListData.datas, unit.unitCode, scope.row.code)}}
                    </template>
                  </el-table-column>
                </template>
              </template>

            </el-table>
          </div>

        </div>
      </el-tab-pane>
      <el-tab-pane label="班级">
        <div class="getab-body-item">
          <div class="tab-title">
            教学成绩分析
          </div>
          <ge-tabel class="tab-body" :titleDataList="classTitle" type="1"
                    :tableData="theclass.chartListData"></ge-tabel>
        </div>
      </el-tab-pane>
      <el-tab-pane label="教师">
        <div class="getab-body-item">
          <div class="tab-title">
            教学成绩分析
          </div>
          <ge-tabel class="tab-body" :titleDataList="teacherTitle" type="1"
                    :tableData="teacher.chartListData"></ge-tabel>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import geTabel from "../../geTeble.vue"

  let areaTitle = [
      {text: '最高分', keyword: 'maxScore',},
      {text: '最低分', keyword: 'minScore'},
      {text: '分数平均值', keyword: 'aveScore'},
      {text: '标准差', keyword: 'stand'},
    ],
    schoolTitle = [
      {text: '学校名称', keyword: 'schoolName',},
      {text: '最高分', keyword: 'maxScore',},
      {text: '最低分', keyword: 'minScore'},
      {text: '分数平均值', keyword: 'aveScore'},
      {text: '标准差', keyword: 'stand'},
    ],
    classTitle = [
      {text: '学校名称', keyword: 'schoolName',},
      {text: '班级名称', keyword: 'className',},
      {text: '平均分', keyword: 'aveScore'},
      {text: '标准差', keyword: 'stand'},
    ],
    teacherTitle = [
      {text: '所属学校', keyword: 'schoolName',},
      {text: '教师名称', keyword: 'teacherName',},
      {text: '分数平均值', keyword: 'aveScore'},
      {text: '标准差', keyword: 'stand'},
    ]
  export default {
    data() {
      return {
        areaTitle, schoolTitle, classTitle, teacherTitle,
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
      for (let i = 1; i <= 4; i++) {
        this.getStageTeachineAchievement(i);
      }

    },
    methods: {
      getStageTeachineAchievement(type = 1) {
        this.$ajax.getStageTeachineAchievement(Object.assign(this.getContrastType(type), {type}))
          .then(({httpCode, result}) => {
            this.$store.state.loading = false;
            if (httpCode === '200') {
              let chartListData = result;

              if (type == 3 || type == 4) {
                chartListData = chartListData.sort((a, b) => b.aveScore - a.aveScore)
              }
              if (type == 2) console.log(chartListData);
              let typeName = this.types[type - 1];
              this.$set(this[typeName], 'chartListData', chartListData);
              console.log(chartListData);
            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })

      },
      getScore(datas, key, key2) {
        try {
          return datas.find(item => item.orgDto.code == key2 && item.unitModel.unitCode == key).score + '分'

        } catch (e) {
          return '--';
        }
      }
    },
    components: {geTabel}
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
<style lang="scss">

  @import "../../../../static/css/commonVariable.scss";

  .sdfsdf {
    @import "../../../../static/css/modificationTable";
  }
</style>
