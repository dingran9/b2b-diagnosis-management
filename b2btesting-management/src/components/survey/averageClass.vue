<template>
  <div style="padding:20px 0 0 20px; float:left; width: 720px;">
      <span class="score">班级平均分：</span>
      <div :id="'averChart'+subStasto[2]" class="chart" :style="{width: '720px', height: '380px'}"></div>
      <p class="subtitle">{{subStasto[0]}}各班级{{subStasto[1]}}</p>
  </div>
</template>
<script>
  export default {
    props:["subStasto"],
    data() {
      return {
        subStasto:['高一','语文',0],
        charts:[]
      }
    },
    mounted() {
      this.drawLine()
    },
    updated(){
        this.drawLine()
    },
    methods: {
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('averChart'+this.subStasto[2]))

        // 绘制图表
       myChart.setOption({
         tooltip : {
           trigger: 'axis'
         },
         legend: {
           data:['10班(文)','2班(理)']
         },
         toolbox: {
           show : true,
           feature : {
//              mark : {show: true},
//              dataView : {show: true, readOnly: false},
//              magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
//              restore : {show: true},
//              saveAsImage : {show: true}
           }
         },
         calculable : true,
         xAxis : [
           {
             type : 'category',
             boundaryGap : false,
             data : ['0','第1次测试','第2次测试','第3次测试','第4次测试']
           }
         ],
         yAxis : [
           {
             type : 'value'
           }
         ],
         series : [
           {
             name:'10班(文)',
             type:'line',
             stack: '50',
             data:[74+Math.round(Math.random()*9+1), 88, 90-Math.round(Math.random()*9+1), 86, 96-Math.round(Math.random()*9+1), 142],
             itemStyle:{
               normal:{
                 color:'#eeb8a4'
               }
             }
           },
           {
             name:'2班(理)',
             type:'line',
             stack: '80',
             data:[60+Math.round(Math.random()*9+1), 90+Math.round(Math.random()*9+1), 96, 96+Math.round(Math.random()*9+1), 126+Math.round(Math.random()*9+1), 117],
             itemStyle:{
               normal:{
                 color:'#8ed492'
               }
             }
           }
           /*,
           {
             name:'3班',
             type:'line',
             stack: '50',
             data:[5, 27+Math.round(Math.random()*9+1), 20, 56, 60, 47, 55],
             itemStyle:{
               normal:{
                 color:'#badaee'
               }
             }
           },
           {
             name:'4班',
             type:'line',
             stack: '100',
             data:[25, 36, 50, 20, 70+Math.round(Math.random()*9+1), 47, 85],
             itemStyle:{
               normal:{
                 color:'#e9c0e6'
               }
             }
           }
           */
         ]
       })


      }
    }

  }



</script>
<style scoped>
  .score{
    padding-left:0;
    font-weight: bold;
  }
  .subtitle{
    width: 720px;
    text-align: center;
  }
</style>
