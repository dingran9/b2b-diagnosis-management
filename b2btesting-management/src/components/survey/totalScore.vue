<template>
  <div style="padding:20px 0 0 0; float:right; width: 700px; margin-right:20px;">
    <span class="score">整体成绩分布：</span>
    <div :id="'scoreChart'+subStasto[2]" :style="{width: '700px', height: '380px'}"></div>
    <p class="subtitle">{{subStasto[0]}}学生{{subStasto[1]}}整体成绩分布情况</p>
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
        let myChart = this.$echarts.init(document.getElementById('scoreChart'+this.subStasto[2]))

        // 绘制图表
        myChart.setOption({
          title : {
            text: '',
            subtext: '',
            x:'center'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient : 'oriental',
            x : 'right',
            data:['90分以下','91-105分','106-120分','120分以上']
          },
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
              dataView : {show: false, readOnly: false},
              magicType : {
                show: true,
                type: ['pie', 'funnel'],
                option: {
                  funnel: {
                    x: '25%',
                    width: '50%',
                    funnelAlign: 'left',
                    max: 1548
                  }
                }
              },
              restore : {show: false},
              saveAsImage : {show: false}
            }
          },
          calculable : true,
          series : [
            {
              name:'占百分比',
              type:'pie',
              radius : '50%',
              center: ['50%', '60%'],
              data:[
                {value:15+Math.round(Math.random()*9+1), name:'90分以下',itemStyle:{normal:{color:'#fea72d'}}},
                {value:30-Math.round(Math.random()*9+1), name:'91-105分',itemStyle:{normal:{color:'#90d5e7'}}},
                {value:30-Math.round(Math.random()*9+1), name:'106-120分',itemStyle:{normal:{color:'#06b2be'}}},
                {value:20-Math.round(Math.random()*9+1), name:'120分以上',itemStyle:{normal:{color:'#c9e742'}}}
              ]
            }
          ]
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
