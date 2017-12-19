<template>
  <div class="rp-div">
    <div id="container" v-if="isEmptyObject(result)!=true&&result!=null"></div>
    <div v-else class="nodata">
      暂无数据
    </div>
  </div>
</template>

<script>
//  import config from '../../config/config'
  export default {
    data() {
      return {
        result: {   // 测试数据
          "高二2班": {
            "1494937443000": 14.0,
            "1494922799000": 8.6,
            "1494843576000": 34.4,
            "1494841240000": 27.0,
            "1494841241000": 27.0,
            "1494841242000": 27.0,
            "1494841243000": 27.0,
            "1494841244000": 27.0,
            "1494820683000": 8.4
          },
          "高二1班": {
            "1494922799000": 29.4,
            "1494917065000": 10.2,
            "1494843576000": 25.0,

          }
        },
        width: null,
      }
    },
    mounted: function () {
      this.$nextTick(() =>{

      })
      this.init()
    },
    methods:{
      init: function () {
//          return
        this.$ajax.getCommonGet('teacherReport/getClassSubjectAverageScore')
          .then((res) => {
            if(this.isEmptyObject(res.result)){
              return;
            }
            this.result=res.result
          var getResult = getJsonLenth(res.result);
//          var getResult = getJsonLenth(this.result);
          let str = window.getComputedStyle(document.documentElement)["fontSize"]
          if(getResult.num > 10){
            this.width = (str.substring(0,str.length-2)-0) * getResult.num * 1.5
            let container = document.getElementById('container');
            container.style.width =  this.width+'px';
          }
          Highcharts.chart('container', {
            colors: ['#ff6666', '#7cd1a4', '#8ab9fe', '#DDDF00', '#24CBE5', '#64E572',
              '#FF9655', '#FFF263', '#6AF9C4'],
            chart: {
              type: 'line',
              panning: true,
//              margin: [0, 0, 0, 0] //距离上下左右的距离值
            },
            title: {
              text: ''
            },
            credits: {
              enabled: false //不显示LOGO
            },
            subtitle: {
              text: ''
            },
            xAxis: {
              min:0, //别忘了这里
              max:getResult.num>10?10:getResult.num-1,
              categories: getResult.hzb,
            },
            yAxis: {
              max:100, // 定义Y轴 最大值
              min:0, // 定义最小值
              title: {
                text: ''

              }
            },
            plotOptions: {
              line: {
                connectNulls:true,//该设置会连接空值点
                dataLabels: {
                  enabled: true
                },
                enableMouseTracking: true
              }
            },
            //设置滚动条
//            scrollbar: {
//              enabled: true
//            },
            series: getResult.series,
            legend: {
              verticalAlign: 'top', //垂直方向位置
            },
          });
        }, (res) => {
          console.log(res);
        });

        function getJsonLenth(jsonStr) {
          let f = {num:0,series:[],hzb: []}; // 返回的数值
          var g = []; //横坐标
          for (let a in jsonStr){
            for (let b in jsonStr[a]){
              g.push(b)
            }
          }
          g = [...new Set(g)].sort()
          let i= 0;
          f.hzb = g.map(function (e) {
            i++;
            return '第'+i+'次'
          })
          f.num = f.hzb.length
          for (let a in jsonStr){
            var e = [] //data
            g.forEach(function (x) {
              if(x in jsonStr[a]){
                e.push(jsonStr[a][x])
              }else {
                e.push(null)
              }
            })
            f.series.push({name: a,data:e});
          }
          return f
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .rp-div{
    margin-left:18px;
    /*margin-top: 0.4rem;*/
    background:#fff;
    text-align:center;
    .nodata{
      height:100px;
      line-height:100px;
      font-size:20px;
      background:#fff;
      margin-top: 20px;
      margin-left:18px;
    }
    #container{
        width:100%;
        margin-top:30px;
    }
  }
  /*下面是从h5复制的，有空来调*/
</style>
