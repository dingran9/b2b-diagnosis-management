<template>
  <div>

    <!-- 原始分数分布情况 表格-->
    <div class="report-item a">
      <div class="report-header">
        原始分数分布情况
      </div>
      <div class="report-body" style>
        <el-table border
          :data="gradeScoreData"
          style="width: 100%">
          <el-table-column
            label="班级">
            <template scope="scope">
              总计
            </template>
          </el-table-column>
          <el-table-column
            prop="peoples"
            label="人数">
          </el-table-column>
          <el-table-column
            prop="maxScore"
            label="最高分">
          </el-table-column>
          <el-table-column
            prop="minScore"
            label="最低分">
          </el-table-column>
          <el-table-column
            prop="avgScore"
            label="平均分">
          </el-table-column>
          <el-table-column
            prop="standardDeviation"
            label="标准差">
          </el-table-column>
          <template
            v-if="gradeScoreData.length"
          >
            <el-table-column
              :prop="item.scoreInterval"
              :key="gradeScoreData[0].peopleScoreDtos[index].scoreInterval"
              v-for="(item,index) in gradeScoreData[0].peopleScoreDtos"
              :label="gradeScoreData[0].peopleScoreDtos[index].scoreInterval">
              <template scope="scope">
                <div style="text-align: center;">
                  <div>{{item.studentCount}}人</div>
                  <div>{{item.proportion | toPercent}}</div>
                </div>
              </template>
            </el-table-column>
          </template>

        </el-table>
      </div>
    </div>

    <div>
      <!-- 成绩总体分布 柱形图 heighcharA-->
      <div class="report-item b" style="width: 49%; padding-right:1%;float: left;">
        <div class="report-header">
          {{gradeName + subjectName}}成绩分布
        </div>
        <div class="report-body">
          <div id="scoreTotalSpread">

          </div>
        </div>
      </div>

      <!-- 成绩变化情况 折线图 heighcharB-->
      <div class="report-item c" style="width: 49%; padding-left:1%;float: left;">
        <div class="report-header">
          {{gradeName + subjectName}}成绩历史变化
        </div>
        <div class="report-body">
          <div id="scoreChangeBox">

          </div>
        </div>
      </div>
      <div style="clear:both;"></div>

    </div>

    <!-- 各班学生数学成绩分布情况 表格-->
    <div class="report-item d">
      <div class="report-header">
        各班学生{{subjectName}}成绩分布情况
      </div>
      <div class="report-body">
        <el-table
          :data="allClassSubjectScore"
          border
          style="width: 100%">
          <el-table-column
            prop="className"
            label="班级"
            width="180">
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="peoples"-->
          <!--label="人数"-->
          <!--width="180">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
          <!--prop="maxScore"-->
          <!--label="最高分">-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
          <!--prop="minScore"-->
          <!--label="最低分">-->
          <!--</el-table-column>-->
          <el-table-column
            prop="avgScore"
            label="平均分">
          </el-table-column>
          <el-table-column
            prop="standardDeviation"
            label="标准差">
          </el-table-column>
          <el-table-column
            label="及格率"
            width="180">
            <template scope="scope">{{ (scope.row.qualified/1*100).toFixed(2)}}%</template>
          </el-table-column>
          <el-table-column
            label="优秀率">
            <template scope="scope">{{ (scope.row.excellent*100).toFixed(2)}}%</template>
          </el-table-column>
          <el-table-column
            label="分数分布"
          >
            <template v-if="allClassSubjectScore.length">
              <el-table-column
                :key="allClassSubjectScore[0].peopleScoreDtos[index].scoreInterval"
                v-for="(item,index) in allClassSubjectScore[0].peopleScoreDtos "
                :label="allClassSubjectScore[0].peopleScoreDtos[index].scoreInterval">
                <template scope="scope">
                  <div style="text-align: center;">
                    <div>{{allClassSubjectScore[scope.$index].peopleScoreDtos[index].studentCount}}人</div>
                    <div>{{allClassSubjectScore[scope.$index].peopleScoreDtos[index].proportion | toPercent}}</div>
                  </div>
                </template>
              </el-table-column>
            </template>


          </el-table-column>
        </el-table>

      </div>
    </div>
    <!-- 班级成绩分布图 柱形图 heighcharC-->
    <div class="report-item e">
      <div class="report-header">
        {{gradeName + subjectName}}成绩分布图
      </div>
      <div class="report-body">
        <div
          class=" tab-item"
          :class="{'router-link-active':allClassSubjectScoreIndex == index}"
          @click="allClassSubjectScoreIndex = index"
          v-for="(item,index) in allClassSubjectScore"
        >
          {{gradeName + item.className}}
        </div>
        <div
          :id="'classScoreChart'+(index + 1)"
          style="width: 1000px;margin: auto;"
          v-show="allClassSubjectScoreIndex == index"
          v-for="(item,index) in allClassSubjectScore"></div>
      </div>
    </div>
    <!-- 学科提分空间 -->
    <div class="report-item f" v-if="$route.query.gradeCode == 24 || $route.query.gradeCode == 33">
      <div class="report-header">
        学科提分空间
        <span class="report-header-sub">
          |{{gradeName + subjectName}}学科提分空间
        </span>
      </div>
      <div class="report-body">
        <div
          class="tab-item"
          :class="{'router-link-active':classsSubjectMentionScoreIndex == index}"
          @click="classsSubjectMentionScoreIndex = index"
          v-for="(item,index) in classsSubjectMentionScore"
        >
          {{gradeName + item.className}}
        </div>
        <div
          style="width: 1000px;margin: auto;"
          :id="'classScoreUp'+(index + 1)"
          v-show="classsSubjectMentionScoreIndex == index"
          v-for="(item,index) in classsSubjectMentionScore">
        </div>
      </div>
    </div>
    <!-- 各班学科能力水平概览 蜘蛛图 heighcharD-->
    <div class="report-item g">
      <div class="report-header">
        {{gradeName + subjectName}}学生学科能力水平

      </div>
      <div class="report-body">
        <div
          class="tab-item"
          :class="{'router-link-active':classSubjectAbilityDtosIndex == index}"
          @click="classSubjectAbilityDtosIndex = index"
          v-for="(item,index) in classSubjectAbilityDtos"
          :key="item.className"
        >
          {{gradeName + item.className}}
        </div>
        <div
          style="width: 600px;margin: auto;"
          :id="'subjectLevel'+(index + 1)"
          v-show="classSubjectAbilityDtosIndex == index"
          v-for="(item,index) in classSubjectAbilityDtos">
        </div>
      </div>
    </div>
    <!-- /*各班学科能力水平概览 同时显示文理科（0和1）或者只显示不分科（2）*/ -->
    <!-- 各班学科能力水平概览 v-if=(文科班/理科班) -->
    <div v-if="!isBranchSubject">
      <!-- （文科班） heighchar+表格-->
      <div class="report-item h">
        <div class="report-header">
          {{gradeName }}年级文科班成绩变化情况
        </div>
        <div class="report-body">
          <div id="subjectChangeChart0"></div>
          <el-table
            :data="artLevelTableData"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="班级"
            >
            </el-table-column>
            <template v-if="artLevelTableData.length">
              <template
                v-for="(item,index) in artLevelTableData[0].data"
              >
                <el-table-column
                  :label="'第'+(index+1)+'次测试'"
                >
                  <template scope="scope">
                    {{artLevelTableData[scope.$index].data[index]}}
                  </template>
                </el-table-column>
              </template>
            </template>

          </el-table>
        </div>

      </div>
      <!-- （理科班） heighchar+表格-->
      <div class="report-item i">
        <div class="report-header">

          {{gradeName }}年级理科班成绩变化情况

        </div>
        <div class="report-body">
          <div id="subjectChangeChart1"></div>

          <el-table
            :data="scienceLevelTableData"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="班级"
            >
            </el-table-column>
            <template v-if="scienceLevelTableData.length">
              <template
                v-for="(item,index) in scienceLevelTableData[0].data"
              >
                <el-table-column
                  :label="'第'+(index+1)+'次测试'"
                >
                  <template scope="scope">
                    <div :class="{'text-red':scienceLevelTableData[scope.$index].data[index]<0}">
                      {{scienceLevelTableData[scope.$index].data[index]}}
                    </div>
                  </template>
                </el-table-column>
              </template>
            </template>

          </el-table>
        </div>
      </div>
    </div>
    <!-- 各班学科能力水平概览 v-else=(不分科) 柱形图可平移+表格-->
    <div v-else class="report-item j">
      <div class="report-header">
        {{gradeName }}{{subjectName}}成绩变化情况
      </div>
      <div class="report-body">
        <div id="subjectChangeChart2"></div>
       <el-table
            :data="noBranchTableData"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="班级"
            >
            </el-table-column>
            <template v-if="noBranchTableData.length">
              <template
                v-for="(item,index) in noBranchTableData[0].data"
              >
                <el-table-column
                  :label="'第'+(index+1)+'次测试'" min-width="120"
                >
                  <template scope="scope">
                    <div :class="{'text-red':noBranchTableData[scope.$index].data[index]<0}">
                      {{noBranchTableData[scope.$index].data[index]}}
                    </div>
                  </template>
                </el-table-column>
              </template>
            </template>

          </el-table>
      </div>

    </div>

    <!-- 各班**学科能力水平历史变化情况概览 折线图heighcharF-->
    <div class="report-item k">
      <div class="report-header">
        {{gradeName + subjectName}}学生学科能力水平变化

      </div>
      <div class="report-body">
        <div
          class="tab-item"
          :class="{'router-link-active':classAbilistyHistoryChangeIndex == index}"
          @click="classAbilistyHistoryChangeIndex = index"
          v-for="(item,index) in classAbilistyHistoryChange"
        >
          {{gradeName + item.className}}
        </div>
        <div
          style="width: 1100px;margin: auto;"
          :id="'subjectScoreHistoryChart'+(index + 1)"
          v-show="classAbilistyHistoryChangeIndex == index"
          v-for="(item,index) in classAbilistyHistoryChange">
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        subjectName: this.commonSubject[this.$route.query.subjectCode],
        gradeName: this.commonGrond[this.$route.query.gradeCode],
        requireParameter: this.$route.query,
        gradeScoreData: [],
        totalScore: 750,
        allClassSubjectScore: [],//各班学生数学成绩分布数据
        allClassSubjectScoreIndex: 0,
        rangeList: [],
        levelTableData: [],
        classSubjectAbilityDtos: [],//科能力水平概览   网状图数据
        classSubjectAbilityDtosIndex: 0,
        classSubjectAbilityDtosCompare: 0,
        classSubjectAbilityDtosCompareIndex: 0,
        classsSubjectMentionScore: [],//学科提分空间   两色图
        classsSubjectMentionScoreIndex: 0,
        classAbilistyHistoryChange: [],//学科能力水平历史变化情况概览   最后的折线图
        classAbilistyHistoryChangeIndex: 0,
        colors:this.othersContent.colors,//来自main.js
      }
    },
    components: {},

    mounted(){
      Highcharts.setOptions({
        lang: {
          noData: '暂无数据'
        }
      });
      this.getOriginalData();
      this.getHistoryStoreData();
      this.getAllClassSubjectScore();
      if (this.$route.query.gradeCode == 33 || this.$route.query.gradeCode == 22)
        this.getClassScoreUpData();
      this.getAllClassSubjectLevelData();
      this.getSubjectHistoryChangeData();
      this.getSubjectLevelChangeData();

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
      //原始分数分布情况  修改
      getOriginalData(){
        let url = this.creatUrl('getDistributionOfSubjectScores');
        this.$http.get(url)
          .then(res => {
            if (res.body.message == "Success") {
              let data = res.body.result;
              this.initChartScoreTotalSpread(data);
              if (data) {
                this.gradeScoreData.push(data);
              }
            }
          }, res => {
            console.log(res);
          })
      },
      //历史记录  修改
      getHistoryStoreData(){
        let url = this.creatUrl('getSubjectHistoryAverage', 1);
        this.$http.get(url)
          .then(res => {
            if (res.body.message == "Success") {
              let data = res.body.result;
              this.initChartScoreChangeBox(data);
            }
          }, res => {
            console.log(rs);
          })

      },
      // huoqu 各班学生数学成绩分布情况 修改
      getAllClassSubjectScore(){
        let url = this.creatUrl('getClassStudentSubjectResults');
        this.$http.get(url)
          .then(res => {
            if (res.body.message == "Success") {
              let data = res.body.result;
              this.allClassSubjectScore = data;
              this.initChartClassScoreCharts(data);
            }
          }, res => {
            console.log(rs);
          })


      },
      //各班级学科提分空间（注：只有中考与高考显示  gradeCode为  24 与 33） 修改
      getClassScoreUpData(){
        let url = this.creatUrl('getClasssSubjectMentionScore');
        this.$http.get(url)
          .then(res => {
            if (res.body.message == "Success") {
              let data = res.body.result;
              this.classsSubjectMentionScore = data;
              this.initChartClassScoreUp(data);
            }
          }, res => {
            console.log(rs);
          })

      },
      //各班级学科能力水平概览 修改
      getAllClassSubjectLevelData(){
        let url = this.creatUrl('getClassSubjectAbility');
        this.$http.get(url)
          .then(res => {
            if (res.body.message == "Success") {
              let data = res.body.result;
              // console.log(data)
              this.classSubjectAbilityDtos = data.classSubjectAbilityDtos;
              this.initChartSubjectLevel(data.classSubjectAbilityDtos, data.gradeAveAbilityDtos);
            }
          }, res => {
            console.log(rs);
          })
      },
      //学科成绩变动信息
      /*各班学科能力水平概览 同时显示文理科（0和1）或者只显示不分科（2）*/
      getSubjectLevelChangeData(){
        let url = this.creatUrl('getClassSubjectScoreChange', 1);
        this.$http.get(url)
          .then(res => {
            if (res.body.message == "Success") {
              let data = res.body.result;
              // console.log(data,"各班学科能力水平概览 同时显示文理科（0和1）或者只显示不分科（2)")
              this.levelTableData = data;
              this.$nextTick(() => {
                if (!this.isBranchSubject) {
                  this.initSubjectChangeChart(data, 0);
                  this.initSubjectChangeChart(data, 1);
                } else {
                  this.initSubjectChangeChart(data, 2);
                }
              })
            }
          }, res => {
            console.log(rs);
          })

      },
      //各班学科能力水平历史变化情况概览
      getSubjectHistoryChangeData(){
        let url = this.creatUrl('getClassAbilistyHistoryChange', 1);
        this.$http.get(url)
          .then(res => {
            if (res.body.message == "Success") {
              let data = res.body.result;
              this.classAbilistyHistoryChange = data;
              this.initSubjectScoreHistoreChart(data);
            }
          }, res => {
            console.log(rs);
          })


      },
      //<!-- 成绩总体分布 柱形图 heighcharA-->
      initChartScoreTotalSpread(data){
        let xAxisCategories = [], seriesData = [];
        data && data.peopleScoreDtos && data.peopleScoreDtos.forEach(item => {
          xAxisCategories.push(item.scoreInterval);
          seriesData.push(+((+item.proportion) * 100).toFixed(1))
        });
        seriesData = seriesData.reverse();
        xAxisCategories = xAxisCategories.reverse();
        Highcharts.chart('scoreTotalSpread', {
          chart: {
            type: 'column'
          },
          legend: {
            enabled: false
          },
          title: {
            text: `${this.gradeName + this.subjectName}学生成绩分布图`
          },
          xAxis: {
            categories: xAxisCategories,
            crosshair: true
          },
          credits: {
            enabled: false //不显示LOGO
          },
          yAxis: {
            min: 0,
            max: 100,
            title: {
              text: '人数比例(%)'
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0"> </td>' +
            '<td style="padding:0"><b>人数比例{point.y}%</b></td></tr>',
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
          series: [{
            name: '成绩',
            data: seriesData
          }]
        });
      },
      // <!-- 成绩变化情况 折线图 heighcharB-->
      initChartScoreChangeBox(data){//成绩厉害变化
        let xAxisCategories = [], seriesData = [];
        data.forEach((item, index) => {
          xAxisCategories.push(`第${index + 1}次测试`)
          seriesData.push(item.averageScore)
        })

        Highcharts.chart('scoreChangeBox', {
          chart: {
//            type: 'column'
          },
          legend: {
            enabled: false
          },
          title: {
            text: `${this.gradeName}${this.subjectName}成绩历史变化情况`
          },
          xAxis: {
            categories: xAxisCategories,
//            crosshair: true
          },
          credits: {
            enabled: false //不显示LOGO
          },
          yAxis: {
            min: 0,
            title: {
              text: '分数'
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0"> </td>' +
            '<td style="padding:0"><b>{point.y:.1f} 分</b></td></tr>',
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
          series: [{
            name: '平均分',
            data: seriesData
          }]
        });
      },
      // <!-- 班级成绩分布图 柱形图 heighcharC-->
      initChartClassScoreCharts(data){
        for (let i = 1; i <= data.length; i++) {
          let tempData = data[i - 1], xAxisCategories = [], seriesData = [];
          if (tempData) {
            tempData.peopleScoreDtos && tempData.peopleScoreDtos.forEach(item => {
              xAxisCategories.push(item.scoreInterval);
              seriesData.push(+((+(item.proportion) * 100).toFixed(1)))
            });
          } else {
            tempData = {className: `${i}班`};
          }
          xAxisCategories = xAxisCategories.reverse();
          seriesData = seriesData.reverse();
          this.$nextTick(() => {
            Highcharts.chart('classScoreChart' + i, {
              chart: {
                type: 'column'
              },
              legend: {
                enabled: false
              },
              title: {
                text: `${this.gradeName + tempData.className + this.subjectName}成绩分布图`
              },
              subtitle: {
//          text: '数据来源: WorldClimate.com'
              },
              xAxis: {
                categories: xAxisCategories,
                crosshair: true
              },
              credits: {
                enabled: false //不显示LOGO
              },
              yAxis: {
                min: 0,
                max: 100,
                title: {
                  text: '人数比例(%)'
                }
              },
              tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0"> </td>' +
                '<td style="padding:0"><b>人数比例{point.y} %</b></td></tr>',
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
              series: [{
                name: '成绩',
                data: seriesData
              }]
            });
          })
        }
      },
      initChartClassScoreUp(data){
        for (let i = 1; i <= data.length; i++) {
          let tempData = data[i - 1], xAxisCategories = [], seriesData = [
            {
              name: '较易提升部分',
              data: []
            }, {
              name: '较难提升部分',
              data: []
            }];
          if (tempData) {
            tempData.threeColorDtos.forEach((item) => {
              xAxisCategories.push(item.moduleName);
              seriesData[0].data.push(item.grayScore || 0) //灰色
              seriesData[1].data.push(item.orangeScore || 0) //橙色
            });
          } else {
            //下面用到了tempData对象  写好for以后没有这个bug
            tempData = {};
            tempData.className = `${i}班`;
          }
          this.$nextTick(() => {
            Highcharts.chart('classScoreUp' + i, {
              chart: {
                type: 'bar'
              },
              title: {
                text: `${this.gradeName + tempData.className + this.subjectName}学科提分空间`
              },
              xAxis: {
                categories: xAxisCategories
              },
              yAxis: {
                min: 0,
                title: {
                  text: ''
                }
              },
              legend: {
                reversed: true
              },
              plotOptions: {
                series: {
                  stacking: 'normal'
                }
              },
              series: seriesData
            });

          })
        }
      },

      // <!-- 各班学科能力水平概览 蜘蛛图 heighcharD-->
      initChartSubjectLevel(data, gradeAveAbilityDtos){
        for (let i = 1; i <= data.length; i++) {
          let tempData = data[i - 1],
            xAxisCategories = [],
            seriesData = [{
              name: '能力得分',
              type: "area",
              data: []
            }, {
              name: '平均得分',
              type: "area",
              data: []
            }];
          if (tempData) {
            tempData.abilityDtos && tempData.abilityDtos.forEach((item, index) => {
              xAxisCategories[item.code] = item.name;
              seriesData[0].data[item.code] = (item.score);
              let temp = gradeAveAbilityDtos[index];
              seriesData[1].data[temp.code] = (+(temp.score).toFixed(1));
            })
          } else {
            tempData = {className: i + '班'}
          }
          this.$nextTick(() => {
            Highcharts.chart('subjectLevel' + i, {
              chart: {
                polar: true,
                type: 'line'
              },
              colors: ['#93bcf2', '#b8e4be', '#fbc05e', '#f5aaaa', '#fbe083', '#d9a1eb',
                '#fc898f', '#949dd4', '#bdaddb', '88dbf3'],
              title: {
                text: `${this.gradeName + tempData.className}学生学科能力水平`,
                x: -80
              },
              pane: {
                size: '80%'
              },
              xAxis: {
                categories: xAxisCategories,
                tickmarkPlacement: 'on',
                lineWidth: 0
              },
              yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0,
                max: 100
              },
              tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
              },
              // legend: {
              //   align: 'right',
              //   enabled: 0,
              //   verticalAlign: 'top',
              //   y: 70,
              //   layout: 'vertical'
              // },
              plotOptions: {
                line: {
                  dataLabels: {
                    enabled: true          // 开启数据标签
                  },
//                  enableMouseTracking: false // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                }
              },
              series: seriesData
            });
          })
        }
      },
      /*各班学科能力水平概览 同时显示文理科（0和1）或者只显示不分科（2）*/
      initSubjectChangeChart(data, branch){
        let xAxisCategories = [], seriesData = [], title = ['文科', '理科', ''], setData = new Set();
        if (data.length) {
          data.forEach((item, index) => {
            xAxisCategories.push(`第${index + 1}次测试`);
            item.artTypeDtos.forEach(info => {
              if (info.artType == branch) {
                info.classSubjectScoreChangeDtos && info.classSubjectScoreChangeDtos.map((subjectClass) => {
                  setData.add(subjectClass.className);
                })
              }
            });
          });
          if(setData._c.size==0){
            return;
          }
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
          ;
          data.forEach((item, index) => {
            item.artTypeDtos.forEach((info) => {
              if (info.artType == branch) {
                info.classSubjectScoreChangeDtos && info.classSubjectScoreChangeDtos.map((subjectClass) => {
                  for (let serie of seriesData) {
                    if (serie.name == subjectClass.className) {
                      serie.data[index] = +subjectClass.score.toFixed(4);
                      // if(subjectClass.score<0){
                      //   serie.color="red";
                      // }
                    }
                  }
                })

              }
            })
          });
        }
        let length = seriesData[0].data.length;
        Highcharts.chart('subjectChangeChart' + branch, {
          chart: {
            type: 'column',
            panning: length > 3,
          },
          title: {
            text: `${this.gradeName}年级${title[branch]}班成绩变化情况`
          },
          xAxis: {
            categories: xAxisCategories,
            max: length > 3 ? 3 : length - 1
          },
          yAxis: {
            title: {
              text: ''
            }
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
        });
      },
      // <!-- 各班**学科能力水平历史变化情况概览 折线图heighcharF-->
      initSubjectScoreHistoreChart(data){
        for (let i = 1; i <= data.length; i++) {
          let tempData = data[i - 1], xAxisCategories = [], series = [{
            name: '记忆能力',
            data: []
          }, {
            name: '理解能力',
            data: []
          }, {
            name: '应用能力',
            data: []
          }, {
            name: '分析能力',
            data: []
          }, {
            name: '综合能力',
            data: []
          }];
          tempData.historyAbilityChangeDto.length && tempData.historyAbilityChangeDto.forEach((item, index) => {
            let time = new Date(+item.releaseExamCreateTime);
            xAxisCategories.push(`第${index + 1}次测试`);
            item.abilityDtos.forEach(dto => {
              series[dto.code].data.push(dto.score)
            })
          });
          this.$nextTick(() => {
            new Highcharts.Chart('subjectScoreHistoryChart' + i, {
              chart:{
                panning:true,
              },
              title: {
                text: `${this.gradeName + tempData.className + this.subjectName}能力水平变化`,
              },

              xAxis: {
                categories: xAxisCategories,
                max:xAxisCategories.length>9?9:xAxisCategories.length-1,
              },
              yAxis: {
                min: 0,
                max: 100,
                title: {
                  text: '百分比(%)'
                },
                plotLines: [{
                  value: 0,
                  width: 1,
                  color: '#808080'
                }]
              },
              tooltip: {
                valueSuffix: ''
              },
              legend: {
//              layout: 'vertical',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
              },
              series: series
            });
          })
        }
      }
    }
    ,
    watch: {}
    ,
    props: [],
    computed: {
      //文科
      artLevelTableData(){
        let branch = 0, xAxisCategories = [], seriesData = [], setData = new Set(), data = this.levelTableData;
        if (data.length) {
          data.forEach((item, index) => {
            xAxisCategories.push(`第${index + 1}次测试`);
            item.artTypeDtos.forEach(info => {
              if (info.artType == branch) {
                info.classSubjectScoreChangeDtos && info.classSubjectScoreChangeDtos.map((subjectClass) => {
                  setData.add(subjectClass.className);
                })
              }
            });
          });
          for (let key of setData) {
            seriesData.push({
              name: key,
              data: (function () {
                let result = [];
                for (let n of xAxisCategories) {
                  result.push('未考')
                }
                return result;
              }())
            })
          }
          ;
          data.forEach((item, index) => {
            item.artTypeDtos.forEach((info) => {
              if (info.artType == branch) {
                info.classSubjectScoreChangeDtos && info.classSubjectScoreChangeDtos.map((subjectClass) => {
                  for (let serie of seriesData) {
                    if (serie.name == subjectClass.className) {
                      serie.data[index] = +subjectClass.score.toFixed(4);
                    }
                  }
                })

              }
            })
          });
        }
        return seriesData;
      },

      // <!-- 理科 各班学科能力水平概览（理科班） 表格A-->
      scienceLevelTableData(){
        let branch = 1, xAxisCategories = [], seriesData = [], setData = new Set(), data = this.levelTableData;
        if (data.length) {
          data.forEach((item, index) => {
            xAxisCategories.push(`第${index + 1}次测试`);
            item.artTypeDtos.forEach(info => {
              if (info.artType == branch) {
                info.classSubjectScoreChangeDtos && info.classSubjectScoreChangeDtos.map((subjectClass) => {
                  setData.add(subjectClass.className);
                })
              }
            });
          });
          for (let key of setData) {
            seriesData.push({
              name: key,
              data: (function () {
                let result = [];
                for (let n of xAxisCategories) {
                  result.push('未考')
                }
                return result;
              }())
            })
          }
          ;
          data.forEach((item, index) => {
            item.artTypeDtos.forEach((info) => {
              if (info.artType == branch) {
                info.classSubjectScoreChangeDtos && info.classSubjectScoreChangeDtos.map((subjectClass) => {
                  for (let serie of seriesData) {
                    if (serie.name == subjectClass.className) {
                      serie.data[index] = +subjectClass.score.toFixed(2);
                    }
                  }
                })

              }
            })
          });
        }
        return seriesData;
      },
      //无科
      noBranchTableData(){
        let branch = 2, xAxisCategories = [], seriesData = [], setData = new Set(), data = this.levelTableData;
        if (data.length) {
          data.forEach((item, index) => {
            //xAxisCategories,存储每次考试的序号，`第n次测试`
            xAxisCategories.push(`第${index + 1}次测试`);
            // setData,存储每次考试参加的班级（需要分别取，去重），当时是不分科的
            item.artTypeDtos.forEach(info => {
              if (info.artType == branch) {
                info.classSubjectScoreChangeDtos && info.classSubjectScoreChangeDtos.map((subjectClass) => {
                  setData.add(subjectClass.className);
                })
              }
            });
          });
          //seriesData,假定每个班级都参加了每场考试
          for (let key of setData) {//每个班级
            seriesData.push({
              name: key,
              data: (function () {
                let result = [];
                for (let n of xAxisCategories) {//每次考试
                  result.push('未考')
                }
                return result;
              }())
            })
          }
          data.forEach((item, index) => {
            item.artTypeDtos.forEach((info) => {
              if (info.artType == branch) {
                info.classSubjectScoreChangeDtos && info.classSubjectScoreChangeDtos.map((subjectClass) => {
                  for (let serie of seriesData) {
                    if (serie.name == subjectClass.className) {
                      serie.data[index] = +subjectClass.score.toFixed(2);
                    }
                  }
                })

              }
            })
          });
        }
        return seriesData;
      },

      //是否分科
      isBranchSubject(){
        return this.noBranchTableData.length;

      }
    }
    ,
    filters: {
      toPercent(val){
        return ((+val) * 100).toFixed(1) + '%';
      }
    }
  }

</script>
<style>
  .subject-level-tab-controll {
    width: 200px;
    text-align: center;
    border: 1px solid #5a5a5a;
    line-height: 40px;
    display: inline-block;
    margin: 0 20px 10px 0;
    cursor: pointer;
    border-radius: 6px;

  }

  .subject-level-tab-controll.act {
    background: #3cc0fe;
  }

  .text-red {
    color: red;
  }
  #subjectChangeChart0,#subjectChangeChart1,#subjectChangeChart2{
    cursor:pointer;
  }
  .el-table .cell{
    text-align: center;
  }
  .k .highcharts-root{cursor:pointer;}
</style>
