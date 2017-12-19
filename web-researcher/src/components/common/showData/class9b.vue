<template>
  <div >
    <div class="rp-div rp-xknl" style='overflow: auto;padding-bottom: 1rem' v-if="isEmptyObject(result)!=true&&result!=null">
      <div id="container0"   ></div> <!--v-bind:style="{width : width+'rem'}"-->
      <p style="color: #FF6666;font-size: 0.8rem">记忆能力</p>
      <div id="container1"   ></div> <!--v-bind:style="{width : width+'rem'}"-->
      <p style="color: #FF6666;">理解能力</p>
      <div id="container2"   ></div> <!--v-bind:style="{width : width+'rem'}"-->
      <p style="color: #FF6666;">应用能力</p>
      <div id="container3"   ></div> <!--v-bind:style="{width : width+'rem'}"-->
      <p style="color: #FF6666;">分析能力</p>
      <div id="container4"   ></div> <!--v-bind:style="{width : width+'rem'}"-->
      <p style="color: #FF6666;">综合能力</p>
    </div>
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
        result: {
          "0": {
            "2班": {
            },
            "3班": {
            }
          }
        },
        width: 0,
      }
    },
    mounted: function () {
      this.init()
    },
    methods:{
      init: function () {
        this.$ajax.getCommonGet('teacherReport/getClassSingleAbilityScore')
          .then((res) => {
            if(this.isEmptyObject(res.result)){
              return;
            }
            this.result=res.result
          for (let i = 0;i<5;i++){
            let getResult = getJsonLenth(res.result[i]);
//            var getResult = getJsonLenth(res.body.result);
            let str = window.getComputedStyle(document.documentElement)["fontSize"]
            if(getResult.num > 10){
              this.width = (str.substring(0,str.length-2)-0) * getResult.num * 1.5
              let container = document.getElementById('container');
              container.style.width =  this.width+'px';
            }
            Highcharts.chart('container'+i+'', {
              colors: ['#ff6666', '#7cd1a4', '#8ab9fe', '#DDDF00', '#24CBE5', '#64E572',
                '#FF9655', '#FFF263', '#6AF9C4'],
              chart: {
                type: 'line',
                panning: true
              },
              credits: {
                enabled: false //不显示LOGO
              },
              title: {
                text: ''
              },
              subtitle: {
                text: ''
              },
              xAxis: {
                min:0, //别忘了这里
//                max:getResult.num>10?10:getResult.num-1,
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
                  enableMouseTracking: false
                }
              },
              series: getResult.series,
              legend: {
                verticalAlign: 'top', //垂直方向位置
              },
            });
          }
        }, (res) => {
          console.log(res);
        });
        function getJsonLenth(jsonStr) {
          let f = {num:0,series:[],hzb: []}; //返回的数值
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


<style lang="scss" scoped>
  .rp-div{
    /*margin-top: 0.4rem;*/
    background:#fff;
    .nodata{
      height:100px;
      line-height:100px;
      font-size:20px;
      background:#fff;
      margin-top: 20px;
      margin-left:18px;
    }
    #container0{
      width:100%;
      margin-top:30px;
    }
    #container1,#container2,#container3,#container4{
      @extend #container0;
    }
  }
  /*下面是从h5复制的，有空来调*/
  .rp-xknl p{
    color: #FF6666;
    font-size: 0.7rem;
    text-align: center;
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
    margin-top:15px;
    /*line-height:20px;*/
    border-bottom: 1px dashed #9E9E9E;
  }
</style>
