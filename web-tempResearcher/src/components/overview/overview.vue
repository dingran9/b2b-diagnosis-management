<template>
  <div>

    <div style="height:100%;padding:30px 20px;background-color: #fff;">
      <h2 class="title" style="text-align:left;padding:0 0 10px 0;border-bottom: 1px solid #c0ccda;margin-top: -10px;">
        教学进度
        <div class="ge-pull-right">
          <el-select v-model="nianji" placeholder="请选择">
            <el-option
              label="小学"
              :value="1">
            </el-option>
            <el-option
              label="初中"
              :value="2">
            </el-option>
            <el-option
              label="高中"
              :value="3">
            </el-option>
          </el-select>
        </div>
      </h2>

      <div style="padding:10px 0;" v-if="nianji == 1">
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
            prop="unit"
            label="教学进度"
          >
          </el-table-column>
          <el-table-column
            prop="score"
            label="教学完成度"
          >
          </el-table-column>

        </el-table>
        <div style="font-size: 15px;padding:5px 0; text-align: right;color: #c0ccda"> 注:教学完成度代表占总体教学进度的百分比</div>
        <chart></chart>
      </div>
      <div style="padding:10px 0;" v-if="nianji == 2">
        <el-table
          class="self-table"
          :data="tableData1"
          style="width: 100%">
          <el-table-column
            prop="schoolName"
            label="学校"
          >
          </el-table-column>
          <el-table-column
            prop="unit"
            label="教学进度"
          >
          </el-table-column>
          <el-table-column
            prop="score"
            label="教学完成度"
          >
          </el-table-column>

        </el-table>
        <div style="font-size: 15px;padding:5px 0; text-align: right;color: #c0ccda"> 注:教学完成度代表占总体教学进度的百分比</div>
        <chart1></chart1>
      </div>
      <div style="padding:10px 0;" v-if="nianji == 3">
        <el-table
          class="self-table"
          :data="tableData2"
          style="width: 100%">
          <el-table-column
            prop="schoolName"
            label="学校"
          >
          </el-table-column>
          <el-table-column
            prop="unit"
            label="教学进度"
          >
          </el-table-column>
          <el-table-column
            prop="score"
            label="教学完成度"
          >
          </el-table-column>

        </el-table>
        <div style="font-size: 15px;padding:5px 0; text-align: right;color: #c0ccda"> 注:教学完成度代表占总体教学进度的百分比</div>
        <chart2></chart2>
      </div>
    </div>
  </div>
</template>
<script>
  var tableData = [
    {
      schoolName: "北京市东城区东四九条小学",
      unit: '第三单元 ',
      score: "75%"
    }, {
      schoolName: "北京市东城区景泰小学",
      unit: '第三单元 ',
      score: "75%"
    }, {
      schoolName: "北京市东城区西中街小学",
      unit: '第二单元 ',
      score: "50%"
    }];
  var tableData1 = [
    {
      schoolName: "北京汇文中学",
      unit: '第三单元 ',
      score: "75%"
    }, {
      schoolName: "北京市东直门中学",
      unit: '第二单元 ',
      score: "50%"
    }, {
      schoolName: "北京第二十五中学",
      unit: '第二单元 ',
      score: "50%"
    }];
  var tableData2 = [
    {
      schoolName: "北京市广渠门中学",
      unit: '第四单元 ',
      score: "75%"
    }, {
      schoolName: "北京市第二十二中学",
      unit: '第三单元 ',
      score: "50%"
    }, {
      schoolName: "北京市第五十四中学",
      unit: '第三单元 ',
      score: "50%"
    }];
  import Chart from './chart.vue'
  import Chart1 from './chart2.vue'
  import Chart2 from './chart3.vue'

  export default {
    components: {Chart2,Chart1,Chart},
    data() {
      return {
        tableData,tableData1,tableData2,
        nianji: 2
      }
    },
    mounted() {
    },
    methods: {},
    computed: {},
    filters: {}

  }
</script>
<style lang="scss" scoped>
  @import '../../../static/css/contentRight';

  .content-right-title-wrap { //我的班级
    .body {
      overflow: hidden;
      vertical-align: middle;
      padding: 0 40px 10px;
      .classListTitle {
        float: left;
        width: 120px;
        text-align: center;
        display: inline-block;
        color: #5e5e5e;
        font-size: 18px;
        line-height: 38px;
        height: 38px;
        margin-right: -60px;
        margin-top: 20px;
        /*background:red;*/
      }
      .classListItem {
        float: left;
        width: 140px;
        font-size: 18px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        border-radius: 19px;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
        transition: all .3s;
        margin-left: 60px;
        background-color: #fff;
        color: #000;
        margin-top: 20px;
        &:hover {
          background-color: #d3f2e5;
          color: #000;
        }
        &.active {
          background-color: #1fd094;
          color: #fff;
        }
      }
    }
  }
</style>
<style lang="scss">
  @import "../../../static/css/commonVariable.scss";

  .self-table {
    @import "../../../static/css/modificationTable";
  }
</style>
