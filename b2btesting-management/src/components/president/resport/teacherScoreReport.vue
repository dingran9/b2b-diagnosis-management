<template>
  <div>
    <!-- 教学成绩平均分对比 heighCharA-->
    <div class="report-item">
      <div class="report-header">
        教学成绩平均分对比
      </div>
      <div class="report-body">
        <div id="teachLevelAve"></div>
      </div>
    </div>
    <!-- 学科教学成绩贡献率 表格-->
    <div class="report-item">
      <div class="report-header">
        学科教学成绩贡献率
      </div>
      <div class="report-body">
        <div id="teachOffer">
          <table class="el-table" cellspacing="0" cellpadding="0" border="0">
            <thead>
            <tr>
              <td class="el-table_1_column_91 is-leaf">
                <div class="cell">教师</div>
              </td>
              <td class="el-table_1_column_91 is-leaf">
                <div class="cell">班级</div>
              </td>
              <td class="el-table_1_column_91 is-leaf">
                <div class="cell">学科作答率</div>
              </td>
              <td class="el-table_1_column_91 is-leaf">
                <div class="cell">实际贡献率</div>
              </td>
              <td class="el-table_1_column_91 is-leaf">
                <div class="cell">理论贡献率</div>
              </td>
              <td class="el-table_1_column_91 is-leaf">
                <div class="cell">学科贡献指数</div>
              </td>
              <td class="el-table_1_column_91 is-leaf">
                <div class="cell">教师教学成绩贡献指数</div>
              </td>
            </tr>
            </thead>
            <tbody>
            <template v-if="subjectScoreOfferData.length" v-for="(item,index) in subjectScoreOfferData">
              <tr v-for="(item2,index2) in item.classSubjectContributionDtos">
                <td :rowspan="item.classSubjectContributionDtos.length" v-if="index2 == 0"
                    class="el-table_1_column_91 is-leaf">
                  <div class="cell">{{item.teacherName}}</div>
                </td>
                <td class="el-table_1_column_91 is-leaf">
                  <div class="cell">{{item2.className}}</div>
                </td>
                <td class="el-table_1_column_91 is-leaf">
                  <div class="cell">{{item2.subjectAnswerRate |toPercent }}</div>
                </td>
                <td class="el-table_1_column_91 is-leaf">
                  <div class="cell">{{item2.practicalContribution |toPercent }}</div>
                </td>
                <td class="el-table_1_column_91 is-leaf">
                  <div class="cell">{{item2.theoreticalContribution |toPercent }}</div>
                </td>
                <td class="el-table_1_column_91 is-leaf">
                  <div class="cell">{{item2.subjectContribution}}</div>
                </td>
                <td :rowspan="item.classSubjectContributionDtos.length" v-if="index2 == 0"
                    class="el-table_1_column_91 is-leaf">
                  <div class="cell">{{item.contributionIndex}}</div>
                </td>
              </tr>
            </template>
            <template v-if="!subjectScoreOfferData.length">
              <tr>
                <td colspan="6" align="center">暂无数据</td>
              </tr>
            </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 各知识点教师教学情况 heighcharB-->
    <div class="report-item">
      <div class="report-header">
        各知识点教师教学情况
      </div>
      <div class="report-body">
        <div id="knowledgePoint"></div>
      </div>
    </div>
    <!-- 各项学科能力教师教学情况heighcharC -->
    <div class="report-item">
      <div class="report-header">
        各项学科能力教师教学情况

      </div>
      <div class="report-body">
        <div id="subjectAbility"></div>
      </div>
    </div>
    <!-- 教师教学成绩平均分变化情况heighcharD +表格-->
    <div class="report-item">
      <div class="report-header">
        教师教学成绩平均分变化情况
      </div>
      <div class="report-body">
        <div id="teachChangeChart"></div>
          <el-table :data="bTeacherHistoryAveScore.seriesData" style="width: 100%">
            <el-table-column prop="teacherName" label="姓名" width="180">
            </el-table-column>
            <el-table-column  :prop="item" :label="item" min-width="100" v-for="(item,index) in bTeacherHistoryAveScore.xAxisCategories" :key="index">
                <template scope="scope">
                  <p :class="{'text-red':bTeacherHistoryAveScore.seriesData[scope.$index][item]<0}">
                  {{bTeacherHistoryAveScore.seriesData[scope.$index][item]}}</p>
                </template>
            </el-table-column>
          </el-table>
      </div>
    </div>
    <!-- 学科贡献指数变化情况heighcharE -->
    <div class="report-item">
      <div class="report-header">
        学科贡献指数变化情况
      </div>
      <div class="report-body">
        <div id="subjectOfferChange"></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        test: [],
        subjectName: this.commonGrond[this.$route.query.gradeCode],
        tableTestHistoryScoreData: [],
        subjectScoreOfferData: [],
        colors:this.othersContent.colors,//来自main.js
      }
    },
    components: {},
    mounted(){
      this.getTeacherScoreData();
      this.getSubjectScoreOfferData();
      this.getknowledgeModuleData();
      this.getTeacherAbilityData();
      this.getTeacherSubjectHistoryChangeData();
      this.getOfferChangeData();
    },
    methods: {
      //生成发送的url
      creatUrl(str, flag){
        let tempStr = '';
        if (flag == 1) {
          tempStr = `/${this.$route.query.schoolCode}/${this.$route.query.gradeCode}`;
        }
        return `${this.rootUrl}principalSingleReport/${str}/${this.$route.query.releaseExamCode}/${this.$route.query.subjectCode}${tempStr}?requestId=1111`;
      },
      //教学成绩平均分比对  xiugai 完成
      getTeacherScoreData(){
        let url = this.creatUrl('getTeacherSubjectAveScore');
        this.$http.get(url)
          .then(res => {
            if (res.body.message == "Success") {
              let data = res.body.result;
              this.initTeachLevelAveChart(data);
            }
          }, res => {
            console.log(rs);
          })
      },
      //学科教学成绩贡献率  w完成
      getSubjectScoreOfferData(){
        let url = this.creatUrl('getTeacherSubjectContribution');
        this.$http.get(url)
          .then(res => {
            if (res.body.message == "Success") {
              let data = res.body.result;
              this.subjectScoreOfferData = data;
            }
          }, res => {
            console.log(rs);
          })

      },
      //获取各知识点教师教学情况  完成
      getknowledgeModuleData(){
        let url = this.creatUrl('getTeachingKnowledgeModule');
//        url = "http://211.157.179.220:8866/principalSingleReport/getTeachingKnowledgeModule/EEA3603424AF4C92B6059961AFF01343/2?requestId=1111";
        this.$http.get(url)
          .then(res => {
            if (res.body.message == "Success") {
              let data = res.body.result;
              this.initKnowledgePointChart(data);
            }
          }, res => {
            console.log(rs);
          })

      },
      //获取各项学科能力教师教学情况  完成
      getTeacherAbilityData(){
        let url = this.creatUrl('getTeachingAbility');
//        url = "http://211.157.179.220:8866/principalSingleReport/getTeachingAbility/EEA3603424AF4C92B6059961AFF01343/2?requestId=1111";
        this.$http.get(url)
          .then(res => {
            if (res.body.message == "Success") {
              let data = res.body.result;
              this.initSubjectAbilityChart(data);
            }
          }, res => {
            console.log(rs);
          })

      },
      //获取教师学科平均成绩历史变化  完成
      getTeacherSubjectHistoryChangeData(){
        let url = this.creatUrl('getTeacherHistoryAveScore', 1);
        this.$http.get(url)
          .then(res => {
            if (res.body.message == "Success") {
              let data = res.body.result;
              this.tableTestHistoryScoreData = data;
              //表格生成
              this.initTeachChangeChart(data);
            }
          }, res => {
            console.log(rs);
          })

      },
      //获取教师学科贡献指数变化情况
      getOfferChangeData(){
        let url = this.creatUrl('getTeacherSubjectContributionHistoryChange', 1);
        this.$http.get(url)
          .then(res => {
            if (res.body.message == "Success") {
              let data = res.body.result;
              this.initSubjectOfferChangeChart(data);
            }
          }, res => {
            console.log(rs);
          })

      },
       // <!-- 教学成绩平均分对比 heighCharA-->
      initTeachLevelAveChart(data){
//        console.dir(data)
        // let xAxisCategories = [], seriesData = [];
        let xAxisCategories = [], seriesData = [{data:[]}];
        if (data && data.teacherSubjectAveScoreDtos && data.teacherSubjectAveScoreDtos.length) {
          data.teacherSubjectAveScoreDtos.forEach(item => {
            xAxisCategories.push(item.teacherName);
            // seriesData.push({
            //   type: 'column',
            //   name: item.teacherName,
            //   data: [+item.aveScore]
            // })
            seriesData[0].data.push(item.aveScore)
          });
        }
        Highcharts.chart('teachLevelAve', {
          chart: {
            type: 'column',
            inverted: true
          },
          title: {
            text: '教师教学成绩平均分'
          },
          xAxis: {
            categories: xAxisCategories,
            min: 0,
          },
          yAxis: {
            min: 0,
            title: {
              text: '分数'
            },
            plotLines: [{
              color: 'red',            //线的颜色，定义为红色
              dashStyle: 'solid',//标示线的样式，默认是solid（实线），这里定义为长虚线
              value: data.gradeSubjectAveScore,                //定义在哪个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
              width: 2                 //标示线的宽度，2px
            }]
          },
          legend: {
            enabled: false
          },
/*          tooltip: {
                headerFormat: '<small>{point.key}</small><table>',
                pointFormat:"<b>{point.y}分</b><br/>"
          },*/
          tooltip: {
            enabled:false,
          },
          plotOptions: {
            column: {
              pointPadding: 0,
              borderWidth: 0,
              pointWidth: 20,
              dataLabels: {
                enabled: true,
                allowOverlap: true
              }
            }
          },
          series: seriesData
        })

      },
      // <!-- 各知识点教师教学情况 heighcharB-->
      initKnowledgePointChart(data){
        let xAxisCategories = [], seriesData = [];
        data.length && data.forEach((item, index) => {
          xAxisCategories.push(item.knowledgeModuleName);
          !index && item.teacherKnowledgeModuleDtoList.forEach((teacher,index) => {
            seriesData.push({
              color:this.colors[index%10],
              name: teacher.teacherName,
              data: []
            })
          });
          item.teacherKnowledgeModuleDtoList.length && item.teacherKnowledgeModuleDtoList.forEach((teacherInfo, index2) => {
            seriesData[index2].data.push(+(+teacherInfo.knowledgeModuleScore).toFixed(1));
          })
        });

        Highcharts.chart("knowledgePoint", {
          chart: {
            type: 'bar'
          },
          title: {
            text: '各知识点教师教学情况'
          },
          xAxis: {
            categories: xAxisCategories,
            title: {
              text: null
            }
          },
          yAxis: {
            min: 0,
            max: 100,
            title: {
              text: '百分比',
              align: 'high'
            },
            labels: {
              overflow: 'justify'
            }
          },
/*          tooltip: {
            valueSuffix: ' 分'
          },*/
          tooltip: {
            enabled:false,
          },
          plotOptions: {
            bar: {
              dataLabels: {
                enabled: true,
                allowOverlap: true
              }
            }
          },
          credits: {
            enabled: false
          },
          series: seriesData
        })
      },
      // <!-- 各项学科能力教师教学情况heighcharC -->
      initSubjectAbilityChart(data){
        let xAxisCategories = [], seriesData = [];
        data.length && data.forEach((item, index) => {
          xAxisCategories.push(item.abilityName);
          !index && item.teacherAbilityDtos.forEach((teacher,index) => {
            seriesData.push({
              color:this.colors[index%10],
              name: teacher.teacherName,
              data: []
            })
          });
          item.teacherAbilityDtos.length && item.teacherAbilityDtos.forEach((teacherInfo, index2) => {
            seriesData[index2].data.push(+teacherInfo.abilityScore);
          })
        });
        Highcharts.chart("subjectAbility", {
          chart: {
            type: 'bar'
          },
          title: {
            text: '学科能力教学情况'
          },
          xAxis: {
            categories: xAxisCategories,
            title: {
              text: null
            }
          },
          yAxis: {
            min: 0,
            max: 100,
            title: {
              text: '百分比(%)',
              align: 'high'
            },
            labels: {
              overflow: 'justify'
            }
          },
          // tooltip: {
          //   valueSuffix: ' 分'
          // },
          tooltip: {
            enabled:false,
          },
          plotOptions: {
            column: {
              pointPadding: 0,
              borderWidth: 0,
              pointWidth: 20,
              dataLabels: {
                enabled: true,
                allowOverlap: true
              }
            },
            bar: {
              dataLabels: {
                enabled: true,
                allowOverlap: true
              }
            }
          },
          credits: {
            enabled: false
          },
          series: seriesData
        })
      },
       // <!-- 教师教学成绩平均分变化情况heighcharD +表格-->
      initTeachChangeChart(data){
        let xAxisCategories = [], seriesData = [], setData = new Set();
        data.length && data.forEach((item, index) => {
          xAxisCategories.push(`第${index + 1}次测试`);
          item.teacherStandardChangeDtos.forEach(info => {
            setData.add(info.teacherName);
          });
        });
        let num=-1;
        for (let key of setData) {
          num++;
          seriesData.push({
            name: key,
            color:this.colors[num%10],
            data: (function () {
              let result = [];
              for (let n of xAxisCategories) {
                result.push(null)
              }
              return result;
            }())
          })
        }
        data.length && data.forEach((item, index) => {
          item.teacherStandardChangeDtos.forEach((teacherInfo) => {
            for (let serie of seriesData) {
              if (serie.name == teacherInfo.teacherName) {
                serie.data[index] = (+teacherInfo.standardScore.toFixed(2));
                // if(teacherInfo.standardScore<0){
                //   serie.color="red";
                // }
              }
            }
          })
        });
        Highcharts.chart("teachChangeChart", {
          chart: {
            type: 'column',
            panning:true,
          },
          title: {
            text: `${this.subjectName}教师教学成绩变化情况`
          },
          xAxis: {
            categories: xAxisCategories,
            max:xAxisCategories.length>9?9:xAxisCategories.length-1,
          },
          yAxis: {
            title: {
              text: '百分比'
            }
          },
          tooltip: {
            enabled:false,
          },
          plotOptions: {
            column: {
              pointPadding: 0,
              borderWidth: 0,
              pointWidth: 20,
              dataLabels: {
                enabled: true,
                allowOverlap: true
              }
            }
          },
          credits: {
            enabled: false
          },
          series: seriesData
        })
      },
      // <!-- 学科贡献指数变化情况heighcharE -->
      initSubjectOfferChangeChart(data){
        let xAxisCategories = [], seriesData = [{
          name: `${this.subjectName}学科平均贡献率`,
          data: []
        }], setData = new Set();
        data.length && data.forEach((item, index) => {
          xAxisCategories.push(`第${index + 1}次测试`);
          item.teacherContributionChangeDtos.forEach(info => {
            setData.add(info.teacherName);
          });
        });
        for (let key of setData) {
          seriesData.push({
            name: key,
            data: (function () {
              let result = [];
              for (let n of xAxisCategories) {
                result.push(null)
              }
              return result;
            }())
          })
        }
        data.length && data.forEach((item, index) => {
          seriesData[0].data.push(+item.subjectAveContribution);
          item.teacherContributionChangeDtos.forEach((teacherInfo) => {
            for (let serie of seriesData) {
              if (serie.name == teacherInfo.teacherName) {
                serie.data[index] = +teacherInfo.contribution;
              }
            }
          })
        });
        Highcharts.chart("subjectOfferChange", {
          chart:{
            panning:true,
          },
          title: {
            text: `${this.subjectName}学科贡献率变化情况`,

          },
          plotOptions: {
            line: {
              connectNulls: true,//该设置会连接空值点
              dataLabels: {
                enabled: true
              },

            }
          },
          xAxis: {
            categories: xAxisCategories,
            max:xAxisCategories.length>9?9:xAxisCategories.length-1,
          },
          yAxis: {
            title: {
              text: '变化率'
            },
            plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
            }]
          },
          // tooltip: {
          //   valueSuffix: ''
          // },
          tooltip: {
            enabled:false,
          },
          series: seriesData
        })
      }
    },
    watch: {},
    props: [],
    computed: {
      bTeacherHistoryAveScore(){//0622自己组合的数据结构，不存在数据对应问题，不影响别的heighchar加载。
        let xAxisCategories = [], seriesData = [], setData = new Set(), data = this.tableTestHistoryScoreData,setDataArr={};
        if(data.length){
          data.forEach((item,index)=>{
            //xAxisCategories,存储每次考试的序号，`第n次测试`
            xAxisCategories.push(`第${index + 1}次测试`);
            // setData,存储各个老师（需要分别取，去重）
            item.teacherStandardChangeDtos.forEach((item2,index1)=>{
              setData.add(item2.teacherName)
            })
          })
          /*初步数据成型，并填充teacherName*/
          let k=-1;
          for (let key of setData) {//遍历每个班级
            k++;
            seriesData.push({
              teacherName: key,
            })
          }
          /*丰满数据，填充每次考试*/
          data.forEach((item,index)=>{
            seriesData.forEach((item2,index2)=>{
              item2["第"+(index+1)+"次测试"]="未考";//先设置为未考
              item.teacherStandardChangeDtos.forEach((item3,index3)=>{//如若考试，设置具体分数
                if(item3.teacherName==item2.teacherName){
                  item2["第"+(index+1)+"次测试"]=item3.standardScore;
                }
              })
            })
          })
        }//if(data.length)结束
        setDataArr.seriesData=seriesData;
        setDataArr.xAxisCategories=xAxisCategories;
        return setDataArr;
      }
    },
    filters: {
      toPercent(val){
        return ((+val) * 100).toFixed(1) + '%';
      }
    }
  }
</script>
<style>
  .el-table td {
    border-right: 1px solid #dfe6ec;
  }

  #teachOffer > table > thead > tr {
    background: #eef1f6;
  }
  .text-red {
    color: red;
  }
  #subjectOfferChange,.teachChangeChart{
    cursor:pointer;
  }
</style>
