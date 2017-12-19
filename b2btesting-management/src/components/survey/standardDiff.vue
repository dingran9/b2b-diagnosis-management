<template>
  <div style="padding:20px 0 0px 0; float:right; width: 720px;">
    <span class="score">班级标准差：</span>
    <div :id="'stanChart'+subStasto[2]" :style="{width: '720px', height: '380px'}"></div>
    <p class="subtitle">{{subStasto[0]}}{{subStasto[1]}}各班标准差</p>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        subStasto:['一年级','语文',0]
      }
    },
    props:["subStasto"],
    mounted() {
      this.drawLine()
    },
    updated(){
      this.drawLine()
    },
    methods: {
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('stanChart'+this.subStasto[2]))


        var xAxisData = [];
        var data1 = [];
        var data2 = [];
        for (var i = 1; i <5; i++) {
          xAxisData.push('第' + i +'次测试');

          data1.push(((Math.sin(i / 2) * (i / 2) + i / (6-Math.round(Math.random()*2+1))) * 2)-2);
          data2.push(((Math.cos(i / (6-Math.round(Math.random()*2+1))) * (i / (7-3) -3) + i / 3) * 2)+3);
        }

        // 绘制图表
        myChart.setOption({
          title: {
            text: ''
          },
          legend: {
            data: ['bar', 'bar2'],
            align: 'left'
          },
          toolbox: {
            y: 'top',
            feature: {
//              magicType: {
//                type: ['stack', 'tiled']
//              },
//              dataView: {},
//              saveAsImage: {
//                pixelRatio: 2
//              }
            }
          },
          //tooltip: {},
          xAxis: {
            data: xAxisData,
            silent: false,
            splitLine: {
              show: false
            }
          },
          yAxis: {
            //data:['8','6','4','2','0','-2','-4','-6','-8'],
           // min:0,
           //inverse:true,
            //interval:4,
            //splitNumber:8
            //gridIndex:0
          },
          series: [{
            name: '10班(文)',
            type: 'bar',
            data: data1,
            animationDelay: function (idx) {
              return idx * 10;
            },
            itemStyle:{
              normal:{
                color:'#7ebfd1',
                barBorderRadius:12,
                label:{
                  show:true,
                  position: 'top',
                  formatter: '10班(文)',
                }
              }
            },
            barGap:'45%',
            barWidth:'20px'
          }, {
            name: '2班(理)',
            type: 'bar',
            data: data2,
            animationDelay: function (idx) {
              return idx * 10 + 100;
            },
            itemStyle:{
              normal:{
                color:'#f66',
                barBorderRadius:12,
                label:{
                  show:true,
                  position:'bottom',
                  formatter:'2班(理)'
                }
              }
            },
            barGap:'45%',
            barWidth:'20px'
          }],
          animationEasing: 'elasticOut',
          animationDelayUpdate: function (idx) {
            return idx * 5;

          }
        });

      }
    }
  }
</script>
<style scoped>
  .score{
    padding-left:20px;
    font-weight: bold;
  }
  .subtitle{
    width: 720px;
    text-align: center;
  }
</style>
