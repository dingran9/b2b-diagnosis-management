<template>
  <div>
    <el-table
      :data="gradeScoreData"
      border
      style="width: 100%">
      <el-table-column
        prop="title"
        label="班级"
        width="180">
      </el-table-column>
      <el-table-column
        :prop="'subject_code'+item.subject_code"
        v-for="(item,index) in subjectList"
        :key="commonSubject[item.subject_code]"
        :label="commonSubject[item.subject_code]">
        <!--<template scope="scope">-->
          <!--<div style="text-align: center;">-->
            <!--<div>{{scope.row}}人</div>-->
            <!--<div>{{scope.row}}%</div>-->
            <!--<div>{{item}}%</div>-->
          <!--</div>-->
        <!--</template>-->
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
        gradeScoreData: [{
          title: '年级优秀率'
        }, {
          title: '年级及格率'
        }],
        scoreKeyList: ['firstcount', "secondcount", "thirdcount", "fourthcount", "fifthcount"],
        rangeList: [],
        subjectList: [],
      }
    },
    components: {},
    mounted(){
      let data = [
        {
          "excellent_rate": "50.0%",//优秀率
          "passing_rate": "100.0%",//及格率
          "subject_code": "2"//学科code
        },
        {
          "excellent_rate": "20.0%",
          "passing_rate": "10.0%",
          "subject_code": "3"
        }
      ];

      this.subjectList = data;
      let tempData = [{
        title: '年级优秀率'
      }, {
        title: '年级及格率'
      }]
      data.map((item, index) => {
        let key = 'subject_code' + item.subject_code;
        tempData[0][key] = item.excellent_rate;
        tempData[1][key] = item.passing_rate;

      })
      this.gradeScoreData = tempData;
      //生成表格
      this.initChart();
      return;
      this.geData();
    },
    methods: {
      geData(){
        let url = this.rootUrl1 + "generalReport/getPassingResults/33/943EC83F1EB44BB0AB272BC9C882B509?requestId=2";
        this.$http.get(url)
          .then(res => {
              if (res.body.code == "Success") {
                let data = res.body.result;
                console.log(data)
                data = [
                  {
                    "excellent_rate": "0.0%",//优秀率
                    "passing_rate": "0.0%",//及格率
                    "subject_code": "2"//学科code
                  },
                  {
                    "excellent_rate": "0.0%",
                    "passing_rate": "0.0%",
                    "subject_code": "3"
                  }
                ];
                this.subjectList = data;

                console.log(data);
                return
                this.gradeScoreData = data;
                console.log(this.gradeScoreData)
                this.totalScore = data[0].tatalscore;
                //生成表格
                this.initChart();
              }
            },
            res => {
              console.log(res);
            }
          )

      },
      initChart(){
        let series = [];
          series.push({
            name: '年级优秀率',
            data:[]
          },{
            name: '年级合格率',
            data:[]
          });

        let categoriesX =  [];
        this.subjectList.forEach( item =>{
          series[0].data.push(this.percentToFloat(item.excellent_rate));
          series[1].data.push(this.percentToFloat(item.passing_rate));
          categoriesX.push(this.commonSubject[item.subject_code]);
        });
        console.log(series)
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
            categories:categoriesX ,
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
      },
      percentToFloat(str){
          return +str.replace('%','');
      }
    },
    computed: {

    }
  }
</script>
