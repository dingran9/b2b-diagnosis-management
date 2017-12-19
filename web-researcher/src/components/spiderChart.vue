<template>
  <div style="margin:auto" ref="chart"></div>
</template>
<script>
  export default {
    components: {},
    props: {
      chartData: {
        default() {
          return [];
        }
      }
    },
    creted() {
    },
    mounted() {
      this.init();
    },
    data() {
      return {
        chart: '',
      }
    },
    methods: {
      init() {
        let {categories, data} = this.getData();
        this.chart = Highcharts.chart(this.$refs.chart, {
          //图表展示容器，与 div 的 id 保持一致
          chart: {
            polar: true,
            type: 'line',
            width:500,
            height:400,

          },
          credits: {
            enabled: false
          },
          title: {
            text: ' ',
          },
          pane: {
            size: '90%'
          },
          xAxis: {
            categories,
            tickmarkPlacement: 'on',
            lineWidth: 0,
            labels: {
              style: {
                color: '#609ffd',//颜色
                fontSize:'14px'  //字体
              }
            },
          },
          tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}%</b><br/>'
          },
          yAxis: {
            labels: {
              style: {
                color: '#609ffd',//颜色
                fontSize:'14px'  //字体
              }
            },
            minorGridLineColor: '#609ffd',
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
            max: 100,
            tickInterval: 10,
            minorTickInterval: 10,
            tickmarkPlacement: 'on',
            labels: {}
          },
          legend: {
            align: 'right',
            verticalAlign: 'top',
            y: 70,
            layout: 'vertical'
          },
          series: [{
            name: '能力',
            type: "area",
            data,
            pointPlacement: 'on',
            showInLegend: false
          }]
        });
      },
      getData() {
        let categories = [];
        let data = [];
        this.chartData.forEach(i => {
          categories.push(i.abilityName);
          data.push(i.score)
        })
        return {
          categories, data
        }
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          let _temp = this.getData();
          console.log(_temp.categories);
          this.chart.update({
            series: [{
              data: _temp.data,
            }],
            xAxis:{
              categories: _temp.categories
            }
          });
        }
      }
    },
    computed: {},
    filters: {},
  }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
.highcharts-container{
  margin:30px auto;
}
</style>
