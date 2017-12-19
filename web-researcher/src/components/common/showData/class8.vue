<template>
  <div class="rp-div">
    <el-tabs type="border-card">
      <el-tab-pane label="学校">
        <div class="getab-body-item">
          <div class="tab-title">
            各学校标准分平均分变化
          </div>

          <div style="padding:40px;">
            <el-table class=" sdfsdf"
                      :data="school.list">
              <el-table-column
                prop="date"
                label="学校"
              >
                <template scope="scope">
                  {{scope.row.val[0].schoolName}}
                </template>
              </el-table-column>
              <template v-if="Array.isArray(school.chartListData.progressModels)">
                <template v-for="ceshi in school.chartListData.progressModels">
                  <el-table-column
                    prop="name"
                    :label="'第' +ceshi.sn + '次测试' "
                  >
                    <template scope="scope">
                      {{getScore(school.chartListData.stageStandardScoreDtos, ceshi.releaseCode, 'schoolCode',scope.row.val[0].schoolCode)}}
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
            各班级标准分平均分变化
          </div>
          <div style="padding:40px;">
            <el-table class=" sdfsdf"
                      :data="theclass.list">
              <el-table-column
                prop="date"
                label="班级"
              >
                <template scope="scope">
                  {{scope.row.val[0].schoolName + scope.row.val[0].className}}
                </template>
              </el-table-column>
              <template v-if="Array.isArray(theclass.chartListData.progressModels)">
                <template v-for="ceshi in theclass.chartListData.progressModels">
                  <el-table-column
                    prop="name"
                    :label="'第' +ceshi.sn + '次测试' "
                  >
                    <template scope="scope">
                      {{getScore(theclass.chartListData.stageStandardScoreDtos, ceshi.releaseCode, 'classCode',scope.row.val[0].classCode)}}
                    </template>
                  </el-table-column>
                </template>
              </template>

            </el-table>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="教师">
        <div class="getab-body-item">
          <div class="tab-title">
            教师标准分平均分变化
          </div>
          <div style="padding:40px;">
            <el-table class=" sdfsdf"
                      :data="teacher.list">
              <el-table-column
                prop="date"
                label="班级"
              >
                <template scope="scope">
                  {{scope.row.val[0].schoolName + scope.row.val[0].teacherName}}
                </template>
              </el-table-column>
              <template v-if="Array.isArray(teacher.chartListData.progressModels)">
                <template v-for="ceshi in teacher.chartListData.progressModels">
                  <el-table-column
                    prop="name"
                    :label="'第' +ceshi.sn + '次测试' "
                  >
                    <template scope="scope">
                      {{getScore(teacher.chartListData.stageStandardScoreDtos, ceshi.releaseCode, 'teacherCode',scope.row.val[0].teacherCode)}}
                    </template>
                  </el-table-column>
                </template>
              </template>

            </el-table>
          </div>
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
      {text: '标准分', keyword: 'stand'},
    ],
    classTitle = [
      {text: '学校名称', keyword: 'schoolName',},
      {text: '班级名称', keyword: 'className',},
      {text: '最高分', keyword: 'maxScore',},
      {text: '最低分', keyword: 'minScore'},
      {text: '分数平均值', keyword: 'aveScore'},
      {text: '标准差', keyword: 'stand'},
      {text: '标准分', keyword: 'stand'},
    ],
    teacherTitle = [
      {text: '教师名称', keyword: 'teacherName',},
      {text: '最高分', keyword: 'maxScore',},
      {text: '最低分', keyword: 'minScore'},
      {text: '分数平均值', keyword: 'aveScore'},
      {text: '标准差', keyword: 'stand'},
      {text: '标准分', keyword: 'stand'},
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
      for (let i = 2; i <= 4; i++) {
        this.getStandardScoreChange(i);
      }

    },
    methods: {
      getScore(array, key, key2,val) {
        try {
          return array.find(i => i.releaseCode == key && i[key2] == val).standardScore
        } catch (e) {
          return '--';
        }

      },
      getStandardScoreChange(type = 1) {
        this.$ajax.getStandardScoreChange(Object.assign(this.getContrastType(type), type))
          .then(({httpCode, result}) => {
            this.$store.state.loading = false;
            if (httpCode === '200') {
              if (!result) return;
              let chartListData = result;
              let typeName = this.types[type - 1];
              this.$set(this[typeName], 'chartListData', chartListData);
              let key = type == 2 ? 'schoolCode' : type == 3 ? 'classCode' : 'teacherCode';
              this.$set(this[typeName], 'list', this.filterListToObjList(chartListData.stageStandardScoreDtos, key));

            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })

      },
    },
    components: {geTabel}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

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
