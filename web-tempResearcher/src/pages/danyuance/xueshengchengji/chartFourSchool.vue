<template>
  <div style="margin:auto" ref="chart" class="hchart"></div>
</template>
<script>
  let colors = ['#ff7878', '#ffb955', '#ffdf00', '#7d97ba', '#88c6d8', '#4dbebf', '#2fc2a5', '#86df4c', '#50d88f', '#44b773'];
  export default {
    components: {},
    props: {
      chartData: {
        default() {
          return []
        },
      },
      title: {}

    },
    creted() {
    },
    mounted() {
      this.init();
    },
    data() {
      return {chart: null}
    },
    methods: {
      init() {
        let {series, categories} = this.getData();
        this.chart = Highcharts.chart(this.$refs.chart, {
          chart: {
            type: 'column',
            plotBorderWidth: 2,
            plotBorderColor: 'rgba(127, 190, 208, 1)',
            width: 800,
            height: 400,
          },
          credits: {
            enabled: false
          },
          title: {
            text: this.title
          },
          legend: {enabled: false},
          xAxis: {
            categories,
            crosshair: true,
            title: {
              text: '分数区间百分比 (%)',
//              align: 'high'
            }
          },
          yAxis: {
            min: 0,
            max: 100,
            title: {
              text: '人数占比 (%)'
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="padding:0"><span>{series.name} : </span><b>{point.y:.1f} %</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            },
            series: {
              dataLabels: {
                enabled: true,
                format: ' {y} %',
              }
            }
          },
          series
        });
      },
      getData() {
        let series = this.chartData.series.map(item => {
          item.borderRadius = 30 / this.chartData.series.length;
          item.pointWidth = 50/this.chartData.series.length;
          return item;
        });
        let categories = this.chartData.categories;
        return {series, categories}
      }

    },
    computed: {},
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          let _temp = this.getData();
          this.chart.update({
            series: _temp.series,
            xAxis: {
              categories: _temp.categories
            }
          });
        }
      }
    },
    filters: {}
    ,
  }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
  .hchart {
    > div {
      margin: auto;
    }
  }
</style>
