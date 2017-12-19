<template>
  <div class="report-item">
    <div class="report-item-title ge-text-dian">
      {{dataParse(report.endTime)}}截止
      <span
        v-if="rightText"
        class="report-item-title-top"
      :class="{type2:type == 2}">
      {{rightText}}
      </span>
    </div>
    <div class="report-item-body">
      <div class="report-item-body-name ge-text-dian">
        {{report.diagnosisName}}
      </div>
      <div
        class="report-item-body-btn"
        :class="{disable:(type == 0 && reportStatus == 5)
                            || (type == 1 && reportStatus == 0)
                            ||((type == 2) && reportStatus == 4 )}"
        @click="beginAnswer">
        {{btnText}}
      </div>
    </div>
  </div>
</template>
<script>

  export default {
    components: {},
    data(){
      return {
        btnText: '',
        reportStatus: 0,
        rightText: ''
      }
    },
    mounted(){
      let diagnosisStatus = this.report.diagnosisStatus,
        isExpired = this.report.isExpired;
      if (this.type == 0) {
        if (isExpired == 1 && diagnosisStatus == 0) {
          diagnosisStatus = 5;
        }
        let data = {
          '0': '开始答题',
          '1': '已提交',
          '2': '已出报告',
          '3': '获取报告',
          '5': '已截止',
        }
        this.reportStatus = diagnosisStatus;
        this.btnText = data[diagnosisStatus];
      } else if (this.type == 1) {
        let data = {
          '0': '未开始',
          '1': '已开始',
          '2': '已结束',
        }
        // 0单元测试 1期中 2期末 3模拟考 4会考
        let data2 = ['单元检测', '期中', '期末', '模拟考', '会考']
        this.rightText = data2[this.report.examType || 0];
        //全科考试的考试状态 0未开始 1已开始 2已结束
        this.reportStatus = this.report.examStatus;
        this.btnText = data[this.reportStatus];
      } else if (this.type == 2) {
        let data = {
          '0': '开始测评',
          '1': '已开始',
          '2': '查看报告',
          '4': '未答题'
        }
        this.rightText = this.commonSubject[this.report.subjectCode || 0];
        this.reportStatus = this.report.diagnosisStatus;
        this.btnText = data[this.reportStatus];

      }
    },
    props: {
      report: {},
      type: {
        default: 0,
        //默认 0   0:同步辅导  1.学科测评  2.学科测评下一级
      }
    },
    methods: {
      beginAnswer(){
//        if ((this.type == 0 && this.reportStatus == 5)
//          || (this.type == 1 && this.reportStatus == 0)
//          || ((this.type == 2) && this.reportStatus == 4 ))return;
        this.$emit('click-btn', this.report);
      }
    },
    computed: {},
    filters: {}

  }
</script>
<style lang="scss" scoped>
  .report-item {
    width: 360px;
    height: 220px;
    margin: 10px;
    $padding: 40px;
    text-align: left;
    float: left;
    background-color: #fff;
    box-shadow: 1px 1px 10px #ccc,
    -1px 1px 10px #ccc,
    1px -1px 10px #ccc,
    -1px -1px 10px #ccc;

    &-title {
      position: relative;
      font-size: 18px;
      $h: 60px;
      height: $h;
      font-weight: 500;
      line-height: $h;
      padding: 0 $padding;
      border-bottom: 1px solid #e1e5ec;
      &-top {
        position: absolute;
        right: 0;
        top: 0;
        background-image: url(../../../static/img/report_jiao_bg.png);
        background-size: 100% 100%;
        font-size: 16px;
        color: #fff;
        width: 80px;
        height: 40px;
        line-height: 35px;
        text-align: center;
        padding-left: 20px;
        display: inline-block;
        &.type2{
          background-image: url(../../../static/img/right_top_bg2.png);
        }
      }
    }
    &-body {
      padding: 0 $padding;
      font-size: 18px;
      &-name {
        padding: 30px 0;
        color: #505050;
      }
      &-btn {
        $h: 40px;
        cursor: pointer;
        width: 140px;
        margin: auto;
        height: $h;
        line-height: $h;
        border-radius: $h/2;
        background-color: #60ccff;
        color: #fff;
        text-align: center;
        &:active {
          background-color: hsl(199, 100%, 53%);
        }
        &.disable {
          background-color: #d3d3d3;
        }
      }
    }
  }
</style>
