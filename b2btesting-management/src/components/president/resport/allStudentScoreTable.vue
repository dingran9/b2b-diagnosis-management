<template>
  <div>
    <el-table
      :data="gradeScoreData"
      border
      style="width: 100%">
      <el-table-column
        prop="classname"
        label="班级"
        width="180">
      </el-table-column>
      <el-table-column
        prop="totalcount"
        label="人数"
        width="180">
      </el-table-column>
      <el-table-column
        prop="max"
        label="最高分">
      </el-table-column>
      <el-table-column
        prop="min"
        label="最低分">
      </el-table-column>
      <el-table-column
        prop="ave"
        label="平均分">
      </el-table-column>
      <el-table-column
        prop="deviation"
        label="标准差">
      </el-table-column>
      <el-table-column
        :prop="scoreKeyList[index]"
        v-for="(item,index) in scoreList"
        :key="item"
        :label="item">
        <template scope="scope" >
          <div style="text-align: center;">
            <div>{{scope.row[scoreKeyList[index]]}}人</div>
            <div>{{scope.row[scoreRangeList[index]]}}%</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div id="container"></div>
  </div>
</template>
<style>
  #container {
    width: 80%;
    margin: 50px auto 0 auto;
  }

</style>
<script>

  export default{
    data(){
      return {
        totalScore: 750,
        gradeScoreData: [],
        scoreKeyList: ['firstcount', "secondcount", "thirdcount", "fourthcount", "fifthcount"],
        scoreRangeList: ['firstrange', "secondrange", "thirdrange", "fourthrange", "fifthrange"],
        rangeList: []
      }
    },
    components: {},
    mounted(){
      this.geData();
    },
    methods: {
      geData(){
        let url = this.rootUrl1 + "generalReport/getGradeTotalScoreByClassReport/33/943EC83F1EB44BB0AB272BC9C882B509?requestId=2";
        this.$http.get(url)
          .then(res => {
          if (res.body.code == "Success"
      )
        {
          let data = res.body.result;
          this.gradeScoreData = data;
          console.log(this.gradeScoreData)
          this.totalScore = data[0].tatalscore;
          //生成表格
          this.initChart();
        }
      },
        res =>
        {
          console.log(res);
        }
      )

      },
      initChart(){
        var data = this.gradeScoreData;
        let series = [];
        data.forEach(item => {
          series.push({
          name: item.classname,
          data: [item.firstrange, item.secondrange, item.thirdrange, item.fourthrange, item.fifthrange]

      })
      })
        Highcharts.chart('container', {
          chart: {
            type: 'column'
          },
          legend: {
            enabled: true
          },
          title: {
            text: '全年级学生总分成绩分布'
          },
          subtitle: {
//          text: '数据来源: WorldClimate.com'
          },
          xAxis: {
            categories: this.scoreList,
            crosshair: true
          },
          credits: {
            enabled: false //不显示LOGO
          },
          yAxis: {
            min: 0,
            title: {
              text: '百分比 (%)'
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            }
          },
          series: series
        });
      }
    },
    computed: {
      scoreList(){
        return [
          this.totalScore + '-' + this.totalScore * 0.9,
          this.totalScore * 0.8 + '-' + (this.totalScore * 0.9 - 1),
          this.totalScore * 0.7 + '-' + (this.totalScore * 0.8 - 1),
          this.totalScore * 0.6 + '-' + (this.totalScore * 0.7 - 1),
          (this.totalScore * 0.6 - 1) + '以下'
        ]
      }
    }
  }
</script>
