<template>
  <div class="rp-div">
    <el-tabs type="border-card">
      <el-tab-pane label="区域">
        <div class="getab-body-item">
          <div class="tab-title">
            区域教学进度
          </div>
          <ge-tabel class="tab-body" :titleDataList="areaTitle" type="1" :tableData="area.chartListData"></ge-tabel>
        </div>
      </el-tab-pane>
      <el-tab-pane label="学校">
        <div class="getab-body-item">
          <div class="tab-title">
            各学校教学进度
          </div>

          <ge-tabel class="tab-body" :titleDataList="schoolTitle" type="1" :tableData="school.chartListData"></ge-tabel>

        </div>
      </el-tab-pane>
      <el-tab-pane label="班级">
        <div class="getab-body-item">
          <div class="tab-title">
            各班级教学进度
          </div>
          <ge-tabel class="tab-body" :titleDataList="classTitle" type="0"
                    :tableData="theclass.chartListData"></ge-tabel>
        </div>
      </el-tab-pane>
      <el-tab-pane label="教师">
        <div class="getab-body-item">
          <div class="tab-title">
            教师教学进度
          </div>
          <ge-tabel class="tab-body" :titleDataList="teacherTitle" type="0"
                    :tableData="teacher.chartListData"></ge-tabel>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import geTabel from "../../geTeble.vue"

  let areaTitle = [{text: '第一单元', keyword: 'grade1'}],
    schoolTitle = [
      {text: '学校', keyword: 'schoolName'}
    ],
    classTitle = [
      {text: '学校', keyword: 'schoolName'},
      {text: '班级', keyword: 'classlName',},
    ],
    teacherTitle = [
      {text: '学校', keyword: 'schoolName'},
      {text: '老师', keyword: 'classlName', children: true}
    ];
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
        this.teachingProgress(i);
      }
    },
    methods: {
      teachingProgress(type = 1) {
        this.$ajax.teachingProgress({type})
          .then(({httpCode, result}) => {
            this.$store.state.loading = false;
            if (httpCode === '200') {
              let chartListData = result;
              let typeName = this.types[type - 1];
              //后端提供这样的数据 没办法
              if (type == 1) {
                this.areaTitle = chartListData.map((item, index) => ({
                  text: item.unitName,
                  keyword: `grade${index}`
                }));
                chartListData = [chartListData.reduce((temp, item, index) => {
                  temp[`grade${index}`] = item.startTime ?  this.dateParse(item.startTime) : '--';;
                  return temp;
                }, {})];
              } else if (type == 2) {
                chartListData = result.map(item => {
                  item.teachingProgressModels.map((danyuan, index) => {
                    item[`grade${index}`] = danyuan.startTime ?  this.dateParse(danyuan.startTime) : '--';
                  })
                  return item;
                });
                if (chartListData.length) {
                  this.$set(this, 'schoolTitle', [{text: '学校', keyword: 'schoolName'}]);
                  chartListData[0].teachingProgressModels.map((item, index) => {
                    this.schoolTitle.push({
                      text: item.unitName,
                      keyword: `grade${index}`,
                      children: true
                    })
                  })
                }
              }
              else if (type == 3) {
                chartListData = result.map(item => {
                  let temp = item.classTeachingProgressModels.map((theclass, index) => {
                    let temp = {};
                    temp.classCode = theclass.classCode;
                    temp.classlName = theclass.classlName;
                    theclass.teachingProgressModels.map((danyuan, index) => {
                      temp[`grade${index}`] = danyuan.startTime ?  this.dateParse(danyuan.startTime) : '--';
                    })
                    return temp;
                  });
                  temp.forEach(danyuan => {
                    danyuan.schoolCode = item.schoolCode;
                    danyuan.schoolName = item.schoolName;
                  });
                  return temp;
                });
                try {
                  this.$set(this, 'classTitle', [{text: '学校', keyword: 'schoolName'}, {
                    text: '班级',
                    keyword: 'classlName',
                    children: true
                  }]);
                  result[0].classTeachingProgressModels[0].teachingProgressModels.map((danyuan, index) => {
                    this.classTitle.push({
                      text: danyuan.unitName,
                      keyword: `grade${index}`,
                      children: true
                    })
                  })
                } catch (e) {
                  console.log(e);
                  console.log('后端提供教学进度->班级有问题,请及时沟通');
                }
              } else if (type == 4) {
                chartListData = result.map(item => {
                  let temp = item.teacherTeachingProgressModels.map((theclass, index) => {
                    let temp = {};
                    temp.teacherCode = theclass.teacherCode;
                    temp.teacherName = theclass.teacherName;
                    theclass.teachingProgressModels.map((danyuan, index) => {
                      temp[`grade${index}`] = danyuan.startTime ?  this.dateParse(danyuan.startTime) : '--';
                    })
                    return temp;
                  });
                  temp.forEach(danyuan => {
                    danyuan.schoolCode = item.schoolCode;
                    danyuan.schoolName = item.schoolName;
                  });
                  return temp;
                });
                try {
                  console.log(result);
                  this.$set(this, 'teacherTitle', [{text: '学校', keyword: 'schoolName'}, {
                    text: '老师',
                    keyword: 'teacherName',
                    children: true
                  }]);
                  result[0].teacherTeachingProgressModels[0].teachingProgressModels.map((danyuan, index) => {
                    this.teacherTitle.push({
                      text: danyuan.unitName,
                      keyword: `grade${index}`,
                      children: true
                    })
                  })
                  console.log(this.teacherTitle);
                } catch (e) {

                  console.log(e);
                  console.log('后端提供教学进度->老师有问题,请及时沟通');
                }
              }
              this.$set(this[typeName], 'chartListData', Array.isArray(chartListData) ? chartListData : [chartListData]);

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
