<template>

  <div class="rp-div">
    <el-tabs type="border-card">
      <el-tab-pane label="区域">
        <div class="getab-body-item">
          <div class="tab-title">
            能力结构分析
          </div>
          <div class="select-wrap-4">
            选择年级 :
            <el-select v-model="area.cur" placeholder="请选择" @change="selectChange(1,$event)">
              <el-option
                v-for="_area in area.selectList"
                :key="_area.key"
                :label="_area.val"
                :value="_area.key">
              </el-option>
            </el-select>
          </div>
          <spider-chart :chart-data="area.chartData" v-if="area.chartData.length"></spider-chart>
          <div class="sub-title-sdf">区域能力结构分析</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="学校">
        <div class="getab-body-item">
          <div class="tab-title">
            能力结构分析
          </div>
          <div class="select-wrap-4">
            选择学校 :
            <el-select v-model="school.cur" placeholder="请选择" @change="selectChange(2,$event)">
              <el-option
                v-for="_school in school.selectList"
                :key="_school.key"
                :label="_school.val"
                :value="_school.key">
              </el-option>
            </el-select>
          </div>
          <spider-chart :chart-data="school.chartData" v-if="school.chartData.length"></spider-chart>
          <div class="sub-title-sdf">{{curSchoolName}}能力结构分析</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="班级">
        <div class="getab-body-item">
          <div class="tab-title">
            能力结构分析
          </div>
          <div class="select-wrap-4">
            选择班级 :
            <el-select v-model="theclass.cur" placeholder="请选择" @change="selectChange(3,$event)">
              <el-option
                v-for="_class in theclass.selectList"
                :key="_class.key"
                :label="_class.val"
                :value="_class.key">
              </el-option>
            </el-select>
          </div>
          <spider-chart :chart-data="theclass.chartData" v-if="theclass.chartData.length"></spider-chart>
          <div class="sub-title-sdf">{{curTheclassName}}能力结构分析</div>

        </div>
      </el-tab-pane>
      <el-tab-pane label="教师">
        <div class="getab-body-item">
          <div class="tab-title">
            能力结构分析
          </div>
          <div class="select-wrap-4">
            选择老师 :
            <el-select v-model="teacher.cur" placeholder="请选择" @change="selectChange(4,$event)">
              <el-option
                v-for="_teacher in teacher.selectList"
                :key="_teacher.key"
                :label="_teacher.val"
                :value="_teacher.key">
              </el-option>
            </el-select>
          </div>
          <spider-chart :chart-data="teacher.chartData" v-if="teacher.chartData.length"></spider-chart>
          <div class="sub-title-sdf">{{curTeacherName}}能力结构分析</div>

        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import SpiderChart from '../../spiderChart.vue'

  export default {
    data() {
      return {
        types: ['area', 'school', "theclass", "teacher"],
        teacher: {
          selectList: [],
          cur: '',
          chartListData: [],
          chartData: []
        }, area: {
          selectList: [],
          cur: '',
          chartListData: [],
          chartData: []
        }, school: {
          selectList: [],
          cur: '',
          chartListData: [],
          chartData: []
        }, theclass: {
          selectList: [],
          cur: '',
          chartListData: [],
          chartData: []
        },
      }
    },
    mounted() {
      this.$store.state.loading = true;
      for (var i = 1; i < 5; i++) {
        this.getStageAbility(i);
      }
    },
    methods: {
      getStageAbility(type = 1) {
        this.$ajax.getStageAbility(this.getContrastType(type))
          .then(({httpCode, result}) => {
            this.$store.state.loading = false;
            if (httpCode === '200') {
              let chartListData = this.filterListToObjList(result, 'ownerCode');
              let selectList = chartListData.map(item => {
                //排序
                item.val.sort((a, b) => a.abilityCode - b.abilityCode)
                return {
                  key: item.key,
                  val: item.val[0].ownerName
                }
              });
              let typeName = this.types[type - 1];
              this[typeName].selectList = selectList;
              this.$set(this[typeName], 'chartListData', chartListData);
              if (this[typeName].selectList.length)
                this.$nextTick(() => {
                  console.log(this.teacher);
                  this[typeName].cur = this[typeName].selectList[0].key;
                })
            } else {
              console.log('请求错误,偷偷地找后端沟通吧!');
            }
          })
      },
      selectChange(type = 1, code) {
        let typeName = this.types[type - 1];
        let data = this[typeName].chartListData.find(i => i.key == code);
        this.$set(this[typeName], 'chartData', data.val);
      },
    },
    computed:{
      curTheclassName(){
        try{
          return this.theclass.selectList.find(i => i.key == this.theclass.cur).val;
        }catch (e){
          return '';
        }
      },
      curSchoolName(){
        try{
          return this.school.selectList.find(i => i.key == this.school.cur).val;
        }catch (e){
          return '';
        }
      },
      curTeacherName(){
        try{
          return this.teacher.selectList.find(i => i.key == this.teacher.cur).val;
        }catch (e){
          return '';
        }
      }
    },
    components: {SpiderChart}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .rp-div {
    justify-content: center;
    .select-wrap-4 {
      text-align: left;
      padding: 30px 50px 0;
    }
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

  }
.sub-title-sdf{
  text-align: center;
  font-size:18px;
  padding:30px;
  color: #999;
}
</style>
<style lang="scss">
  .rp-div {
    @import "../../../../static/css/selfTab.scss";
  }
</style>
