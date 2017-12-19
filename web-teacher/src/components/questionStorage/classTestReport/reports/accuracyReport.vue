<template>
  <div class="accuracyReport">
    <section class="top-section">
      <header>正确率报告</header>
      <div class="chart" v-if="finalData.length">
        <ul class="left-title">
          <li v-for="(item,index) in finalData">{{item.itemContent+' 第' + item.sout + '题'}}</li>
        </ul>
        <div class="right-chart">
          <div>
            <!--x坐标-->
            <ul class="x-axis">
              <li v-for="(item,index) in chartData.xAxis" :style="{left:chartData.xAxisLeft[index]}">{{`${item}`}}</li>
            </ul>
            <!--与y轴平行的线-->
            <ul class="y-line">
              <li v-for="(item,index) in chartData.xAxis" :style="{left:chartData.lineLeft[index]}"></li>
            </ul>
            <!--内容-->
            <ul class="content">
              <li v-for="(item,index) in finalData" >
                <p class="wai">
                  <el-tooltip class="item" effect="light" :content="item.rightRate" placement="top" popper-class="reports10">
                    <span class="right" :style="{width:item.rightRate}"></span>
                  </el-tooltip>
                </p>
              </li>
            </ul>
            <!--左上角圆点-->
            <div class="circle"></div>
            <!--左上角圆点-->
            <div class="text_">（正确率）</div>
            <!--legend-->
            <div class="legend" v-if="false">
              <ul class="">
                <li><i></i>正确</li>
                <li><i></i>错误</li>
                <li><i></i>未作答</li>
              </ul>
            </div>
          </div>

        </div>

      </div>
      <div class="nodata" v-else>
        暂无数据
      </div>
    </section>
    <section class="bottom-section">
      <header>正确率前十名</header>
      <table border="0" cellspacing="0" cellpadding="0" v-if="ranking.length">
        <tr>
          <th>名次</th>
          <th v-for="(item,index) in ranking">{{item.rank}}</th>
        </tr>
        <tr>
          <td>姓名</td>
          <td v-for="(item,index) in ranking">{{item.studentName}}</td>
        </tr>
      </table>
      <div class="nodata" v-if="!ranking.length">
        暂无数据
      </div>
    </section>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        overview: [],//题号对应正确率
        soutList: [],//题号
        ranking:[],//正确率前10名
        finalData: [],//聚合overview和soutList后的数据,
        resultFromDB: {},//后台返回数据
        chartData: {},
      }
    },
    components: {},
    mounted() {
      this.classTestClassReportOverviewFromDB(() => {
        if (this.$route.query.source == 2) {
          this.getResourcePaperFromDB(() => {
            this.useDataFromDB();
          })
        } else {
          this.useDataFromDB();
        }
      });
    },
    methods: {
      /*3报告相同,获取数据*/
      classTestClassReportOverviewFromDB(nextFn) {
        this.$ajax.classTestClassReportOverview({
          inClassTestCode: this.$route.query.inClassTestCode,
        })
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              if (!result||!result.overview) return;
              this.resultFromDB = result;
              nextFn();
            } else {
              this.$message("通讯异常")
            }
          })
          .catch((error) => {
            console.log(error);
          })
      },
      /*3报告区别,使用数据*/
      useDataFromDB() {
        this.overview = this.resultFromDB.overview;
        if (this.$route.query.source == 2) {

        } else {
          this.soutList = this.resultFromDB.soutList;
        }
        this.ranking = this.resultFromDB.ranking;
        /*数据处理*/
        {
          //聚合overview,soutList为finalData
          let arr = [];
          if (this.$route.query.source == 2) {
            arr = this.soutList;
            this.overview.forEach((item1,index1)=>{
              item1.rightRate=item1.rightCount*1/this.$route.query.studentCount*100+"%";
              arr.forEach((item2,index2)=>{
                if(item1.questionCode==item2.id){
                  item2.rightRate = item1.rightRate;
                }
              })
            })
          } else {
            this.soutList.forEach((item1, index1) => {
              arr.push({
                "logicType": "",
                "wrongCount": 0,
                "sout": item1,
                "rightCount": 0,
                itemContent:"",
              })
              this.overview.forEach((item2, index2) => {
                item2.itemContent="";
                if (item1 == item2.sout) {
                  arr[index1] = item2;
                }
              })
            })
            //计算正确率
            arr.forEach((item,index)=>{
              item.rightRate=(item.rightCount*100/this.$route.query.studentCount*1).toFixed(2)+'%';
            })
          }
          this.finalData = arr;
        }
        this.createdCharData();
      },
      /*3报告应该相同,图标参数准备*/
      createdCharData() {
        let width = []
        //聚合
        this.chartData = {
          xAxis: ['0%', '20%', '40%', '60%', '80%', '100%'],//横轴坐标
          lineLeft: ['0%', '20%', '40%', '60%', '80%', '100%'],//与Y平行的线偏移值
          xAxisLeft: ['-3%', '17%', '37%', '57%', '77%', '97%'],//横轴坐标偏移值
          width: width,//3色块百分比,改为行间计算了.见行间
        }
      },
      /*source为2的时候*/
      getResourcePaperFromDB(nextFn) {
        this.$ajax.getResourcePaper({
          paperCode: this.$route.query.paperCode,
        })
          .then(({httpCode, result}) => {
            if (httpCode == 200) {
              if (!result || !result.paperSystemQusetionType) return;
              {//数据处理
                let arr = [];
                result.paperSystemQusetionType.forEach((item, index) => {
                  if (item.type == 1) {
                    item.typeList.forEach((item2, index2) => {
                      item2.list.forEach((item3, index3) => {
                        arr.push({
                          logicType: item2.logicType,
                          sout: item3.sort,//两个接口一个是sout,一个是sort
                          itemContent:item2.itemContent,
                          id:item3.id,
                          "wrongCount": 0,
                          "rightCount": 0,
                          rightRate:'0%',
                        })
                      })
                    })
                  }
                })
                this.soutList = arr;
              }
              nextFn();
            } else {
              this.$message("通讯异常")
            }
          })
          .catch((error) => {
            console.log(error);
          })
      }
    },
    computed: {},
    filters: {}

  }
</script>


<style lang="scss" scoped>
  .accuracyReport {
    background: #f0f4fb;
    *{
      background: #fff;
    }
    min-height: 800px;
    header {
      height: 60px;
      line-height: 60-10px;
      padding: 10px 38px 0 38px;
      font-size: 18px;
      letter-spacing: 0.7px;
      color: #505050;
      border-bottom: 1px solid rgba(225, 229, 236, 1);
    }
    .top-section{
      .chart {
        width: 50%;
        min-width: 600px;
        /*padding: 0 20px;*/
        padding-bottom:100px;
        margin: 0 auto;
        margin-top: 140px;
        position: relative;
        $w: 120px;
        $h: 50px;
        .left-title {
          width: $w;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 2;
          text-align: right;
          padding-right:10px;
          li {
            height: $h;
            line-height: $h;
            font-size: 16px;
            color: #666;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          li:nth-of-type(1) {
            margin-top: 16px;
          }
          li:nth-last-of-type(1) {
            margin-bottom: 16px;
          }
        }
        .right-chart {
          width: 100%;
          padding-left: $w;
          position: relative;
          &>div{
            position: relative;
          }
          ul.x-axis {
            position: relative;
            border: solid 1px rgba(140, 216, 209, 1);
            li {
              position: absolute;
              top: -30px;
              left: auto; //见行间
              white-space: nowrap;
            }
          }
          ul.y-line { //高度稍后定
            position: absolute;
            width: 100%;
            height: 100%;
            /*background: red;*/
            li {
              width: 1px;
              background: #8cd8d1;
              position: absolute;
              z-index:2;
              left: auto; //见行间
              height: 100%;
            }
          }
          ul.content {
            border: solid 1px rgba(140, 216, 209, 1);
            border-left: solid 2px rgba(140, 216, 209, 1);
            position: relative;
            /*z-index:;*/
            li {
              height: $h;
              line-height: $h;
              color: #666;
              padding-top: 9px; //暂时用此居中
              .wai {
                position: relative;
                z-index:3;
                height: 31px;
                line-height: 31px;
                background: #f0f4fb;
                font-size: 0;
                border-radius: 15px;
                overflow: hidden;
                * {
                  font-size: 16px;
                  display: inline-block;
                  vertical-align: middle;
                }
                .right {
                  border-radius: 15px;
                  min-width: 0.5%;
                  height: 100%;
                  background-image: linear-gradient(0deg,
                    rgba(26, 193, 137, 1) 0%,
                    rgba(71, 243, 185, 1) 100%),
                  linear-gradient(
                      rgba(132, 215, 78, 1),
                      rgba(132, 215, 78, 1));

                }
                .wrong {
                  height: 100%;
                  background-image: linear-gradient(0deg,
                    rgba(255, 102, 102, 1) 0%,
                    rgba(255, 170, 170, 1) 100%),
                  linear-gradient(
                      rgba(132, 215, 78, 1),
                      rgba(132, 215, 78, 1));
                }
                .no {
                  height: 100%;
                  background-image: linear-gradient(0deg,
                    rgba(165, 187, 209, 1) 0%,
                    rgba(205, 226, 246, 1) 100%),
                  linear-gradient(
                      rgba(179, 205, 230, 1),
                      rgba(179, 205, 230, 1));
                }
              }

            }
            li:nth-of-type(1) {
              margin-top: 16px;
            }
            li:nth-last-of-type(1) {
              margin-bottom: 16px;
            }
          }
          .circle {
            width: 10px;
            height: 10px;
            background-color: rgba(174, 217, 212, 1);
            border-radius: 100%;
            position: absolute;
            top: -3px;
            left: -3px;
            z-index: 3;
          }
          .text_{
            font-size:16px;
            position: absolute;
            top: -30px;
            left: -100px;
            z-index: 3;
          }
          .legend {
            position: absolute;
            width: 100%;
            ul {
              font-size: 0;
              background: #fff;
              z-index: 4;
              width: 115*3px;
              margin: 0 auto;
              padding-top: 18px;
              /*height: 100px;*/
              /*background: #000;*/
              * {
                font-size: 16px;
                display: inline-block;
                vertical-align: middle;
              }
              li {
                width: 115px;
                /*display: inline-block;*/
                i {
                  width: 14px;
                  height: 14px;
                  border-radius: 50%;
                  /*display: inline-block;*/
                  margin-right: 8px;
                }
              }
              li:nth-of-type(1) i {
                background-color: rgba(31, 208, 148, 1);
              }
              li:nth-of-type(2) i {
                background-color: rgba(255, 102, 102, 1);
              }
              li:nth-of-type(3) i {
                background-color: rgba(174, 196, 217, 1);
              }
            }

          }
        }

      }
      .nodata{
        margin: 20px 16px;
        background-color: rgba(255, 255, 255, 1);
        text-align: center;
        padding: 100px;
        font-size: 20px;
      }
    }
    .bottom-section{
      margin-top:10px;
      padding-bottom:40px;
      table{
        min-width:718px;
        margin:0 auto;
        margin-top:10px;
        th,td{
          text-align: center;
          height: 39px;
          border:1px solid #fff;
        }
        th{
          background: #e1edf1;
        }
        td{
          background: #eff4f6;
        }
        th:nth-of-type(1){
          border-top-left-radius: 15px;
          background: #8bb6c4;
        }
        th:nth-last-of-type(1){
          border-top-right-radius: 15px;
        }
      }
      .nodata{
        margin: 20px 16px;
        background-color: rgba(255, 255, 255, 1);
        text-align: center;
        padding: 100px;
        font-size: 20px;
      }
    }
  }
</style>
<style lang="scss">
  .accuracyReport {

  }
</style>
