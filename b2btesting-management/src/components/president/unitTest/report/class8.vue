<template>
  <div class="rp-div1">
    <p class="titlePc">班级学生平均能力分布</p>
    <div v-if="isEmptyObject(result)!=true&&result!=null">
      <div class="swiper-container">
<!--        <p class="title" >
      <span class="title-span" v-for="(item,index) in result">
      <span class="icon_title" :style="{background:colors[index]}"></span>{{item.name}}</span>
        </p>-->
        <div class="swiper-wrapper" >
          <div class="swiper-slide"
               :id="'container'+(index + 1)"
               v-for="(item,index) in result" style="height:330px;width:400px;">
          </div>
        </div>
        <div v-if='result.length>1' class="swiper-button-prev"></div>
        <div v-if='result.length>1' class="swiper-button-next"></div>
      </div>
      <div id="container"></div>
    </div>
    <div v-else class="nodata">
      暂无数据
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
//  import { Swipe, SwipeItem } from 'mint-ui';
  export default {
    data() {
      return {
        result:null,
        colors:['#93bcf2', '#b8e4be', '#fbc05e', '#f5aaaa', '#fbe083', '#d9a1eb',
          '#fc898f', '#949dd4', '#bdaddb','88dbf3'],
      }
    },
    mounted: function () {
      this.getSourceDate();
    },
    methods:{
      getSourceDate () {

        var rootThis = this;

        let url = this.getrequestInterface("teacherReport/getClassAbilityScore")

        this.$http.get(url)
          .then(res => {

            if (res.body.message == "Success") {

              if(this.isEmptyObject(res.body.result)){
                return;
              }
              this.result=res.body.result
              let series = [];
              let result = res.body.result;
              let i=0;
              for (let n in result) {
                i++;
                var data = []
                for (let m in result[n]) {
                  data.push(result[n][m])
                }
                series.push({
                  name: n,
                  data: data,
                  color:this.colors[i-1],
                  pointPlacement: 'on'
                })
              }
              this.result =  series
              this.initgetWzt(series)

            }

          }, res => {

            console.log(res)

          });



      },
      initgetWzt(data){
        for (let i = 1; i <= data.length; i++) {

          let tempData=[];
          tempData.push(data[i-1]);
          this.$nextTick(() => {
            Highcharts.chart('container'+i, {
              chart: {
                polar: true,
                type: 'area',
                margin:[12, 12, 12, 12]
              },
              colors: ['#93bcf2', '#b8e4be', '#fbc05e', '#f5aaaa', '#fbe083', '#d9a1eb',
                '#fc898f', '#949dd4', '#bdaddb','88dbf3'],
              title: {
                text:  `<p style="color:${this.colors[i-1]}">${tempData[0].name}</p>`,
                y: 310
              },
              credits: {
                enabled: false //不显示LOGO
              },
              pane: {
                size: '70%'
              },
              xAxis: {
                categories: ['记忆能力', '分析能力', '应用能力',
                  '理解能力','综合能力', ],
                tickmarkPlacement: 'on',
                lineWidth: 0,
                x:0,
                y:0,
                labels: {
                  style:{
                    "color": this.colors[i-1],
                    fontSize:"16px",
                  }
                },
              },
              plotOptions: {
                series: {
                  events: {
                    legendItemClick: function(e) {
                      return false; // 直接 return false 即可禁用图例点击事件
                    }
                  }
                }
              },
              yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0,
                max: 100,
                gridLineColor: this.colors[i-1],
                ceiling: 100,tickAmount:6,
                color:'#f00'
              },
              tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
              },

              legend: {
                type:'line',
                verticalAlign:'top',
                align: 'center',
                itemStyle: {
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  color:this.colors[i-1],
                },
                enabled:false,//不显示图例
              },
              series: tempData,
            });
          })
        }
      },
    }
  }
</script>


<style lang="scss" scoped>
  .rp-div1{
    /*margin-top: 0.4rem;*/
    background:#fff;
    .titlePc{
      font-size:20px;
      text-align: left;
      border-bottom:1px solid #e1e5ec;
      padding:10px 40px;
    }
    .nodata{
      height:100px;
      line-height:100px;
      font-size:20px;
      background:#fff;
      margin-top: 20px;
      margin-left:18px;
    }
  }
  /*下面是从h5复制的，有空来调*/
  .swiper-button-prev{
    background:url(../../../../../static/img/arrow_left.png) no-repeat;
    background-size:70% 70%;
  }
  .swiper-button-next{
    background:url(../../../../../static/img/arrow_right.png) no-repeat;
    background-size:70% 70%;
  }
/*  .rp-div1 {
    margin-top: 0.4rem;
    padding: 0 0.5rem;
    padding-top: 0.5rem;
    background: #fff;
  }*/
  .title{
    font-size:16px;
    text-align: center;
  }
  .title-span{
    /*margin:0 .6rem;*/
  }
  .icon_title{
    margin-right:.2rem;
    width: .4rem;
    height:.4rem;
    display: inline-block;
    border-radius: .2rem;
  }
  .swiper-slide{
    display: inline-block;
    /*width:300px;*/
    margin-left:50px;
  }
</style>
